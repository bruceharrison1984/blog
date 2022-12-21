---
title: Exporting Prometheus Metrics from ECS Fargate in to AMP
metaDesc: Getting AWS Prometheus and ECS Fargate communicating for metric gathering of containerized processes
legacyUrl: https://blog.bruceleeharrison.com/2021/08/19/exporting-prometheus-metrics-from-ecs-fargate-in-to-amp/
headerImage: /images/azure_synapse.jpg
date: 2021/08/19
tags:
  - aws
  - prometheus
  - ecs
---

# Exporting Prometheus Metrics from ECS Fargate in to AMP

My latest project had us deploying a large number of containerized workloads in to Amazon ECS Fargate. These applications are built on a RabbitMQ service bus architecture, so monitoring of the workloads that are pulling from queues was extremely important. We decided to go with Prometheus as our instrumentation/metrics layer due to it’s current popularity, as well as it’s general simplicity.

Amazon also just released their Amazon Managed Prometheus(AMP) in to public beta, so we figured why not give that a shot as well. It’s always good news when you can get someone else to take care of the application box right?

The first half of this post will an explanation of the problem and solution, with the technical explanation at the second half. If you just want to know how to make it work, skip ahead to the second half.

## The Requirements

The problem itself was pretty straight-forward:

- (n) number of containerized workloads
- These will dynamically scale up and down based on certain metric thresholds
- All containers hosted out of ECS Fargate in a single cluster
- Containers are in private subnets
- Prometheus endpoints will be expected to be available on all containers
- Prometheus metrics should be stored in AMP

## Existing Information

The following two posts were what I initially found when I started looking for solutions to this problem:

- https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
- https://tomgregory.com/prometheus-service-discovery-for-aws-ecs/

Both contain similar approaches, as well as a wealth of good information. The downside to them, however, is they both apply to ECS on EC2, and not Fargate. Both of these solutions rely on 3 containers to scrape Prometheus metrics from ECS and send them to a Prometheus server. Their overall strategy was solid, but it needed a bit more magic dust to bring it together in Fargate. Merging both solutions together, you can come up with the following process flow:

- One container is used to scan the ECS cluster and look for tasks with particular Docker labels. This container then generates a Prometheus scrape configuration. The generated scrape configuration is written to a shared Docker volume
- A Prometheus container reads the generated scrape configuration from the shared Docker volume, and goes and scrapes those targets.
- The Prometheus container is setup to use remote_write, which sends logs to the third container, which signs the requests with AWS SigV4 signature, and passes them to AMP.

## The Solution

While the existing information I found was invaluable to solving my problem, I took a slightly different angle which I think yielded an overall simpler solution. I’ll split these up in to smaller sections.

### Prometheus Container

I ended up rolling a custom Prometheus container that could fetch its configuration data from an S3 bucket upon startup. I found similar containers but they all fetched from public endpoints, which is a little smelly to me. I made some simple changes to tkgregory/prometheus-with-remote-configuration, updated the Prometheus version and altered it fetch config from S3. My version of this container can be found at bruceharrison1984/docker-prometheus-s3. The container itself can be pulled and used from GitHub as well. The rest of this post assumes you are using my container(or at least one higher than 2.26.0).

The bigger part was updating the container to be based on a version of Prometheus after 2.26.0, which has AWS SigV4 support built-in. This allows us to completely remove the SigV4 container from the process.

### ECS Scanning

The ECS Scanning method used by both posts is perfectly valid, and it works perfectly. I saw no reason to mess with success, and I used exactly the same method they used to generate a scrape config for Prometheus. I used the tkgregory/prometheus-ecs-discovery container.

### AWS Sigv4 Container

In a great stroke of luck, Prometheus now has native support for AWS SigV4 request signing. This means a side-car container is no longer needed, and you can directly forward Prometheus metrics to AMP by using remote_write. This functionality was added in Prometheus 2.26.0.

So in the end, our solution will have a single ECS Fargate Task, that is running two containers, and forwarding metrics directly in to AMP.

That about sums about the thought process I went through when coming up with a way to do this. The rest of the post will specifically be the technical aspects of how to do this.

## Technical Explanation

If you made it this far, you’re looking for how to make this actually work, and not the theory behind it. The following will be configuration values with brief explanations. I presume you already know what to do with these items, and how to modify them to fit your environment. These configuration values are in no way intended to be copy/pasted since they all have fields that must be set according to your own AWS environment.

You may notice that the ECS Execution policy is missing. In most cases it only contains the CloudWatchAgentServerPolicy and that is all. If you are using a custom Prometheus image in a private registry, your policy will also require access to AWS Secret Manager in order to retrieve credentials to your private registry. (Private Registry Documentation)

I also presume you already have setup Security Groups that will allow one task to query the Prometheus endpoint of another task, and your networking configuration allow this. If your scrapes are failing, check that you have network connectivity between tasks.

### ECS Task Definitions

This task definition will create two containers, with a volume shared between them. The first container is in charge of scanning ECS and finding containers with the PROMETHEUS_EXPORTER_PORT Docker label. The ECS scanning container will then write /output/ecs_file_sd.yml to the shared volume, which is then accessed by the second Prometheus container.

The second container is a custom Prometheus container. It fetches it’s configuration from an S3 bucket, and then proceeds to scrape any ECS containers container within the /output/ecs_file_sd.yml. These metrics are then forwarded to AMP.

My S3 Prometheus container is used in this example, and it is publicly available if you choose to use it.

Things such as log groups, regions, and the s3 bucket will need to be setup according to your own environment.

```json
{
  "executionRoleArn": "<execution-role-arn>",
  "containerDefinitions": [
    {
      "image": "tkgregory/prometheus-ecs-discovery:latest",
      "name": "prometheus-ecs-discovery-alpha",
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/alpha/ecs-prometheus",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "prometheus-ecs-discovery"
        }
      },
      "command": [
        "-config.cluster=<cluster-name>",
        "-config.write-to=/output/ecs_file_sd.yml"
      ],
      "mountPoints": [
        {
          "containerPath": "/output",
          "sourceVolume": "ecs-discovery"
        }
      ]
    },
    {
      "image": "ghcr.io/bruceharrison1984/ecomm-prometheus:v2.29.1",
      "name": "prometheus-alpha",
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/alpha/ecs-prometheus",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "prometheus"
        }
      },
      "environment": [
        {
          "name": "S3_CONFIG_LOCATION",
          "value": "s3://<s3-bucket>/prometheus.yml"
        }
      ],
      "mountPoints": [
        {
          "containerPath": "/output",
          "sourceVolume": "ecs-discovery"
        }
      ]
    }
  ],
  "memory": "2048",
  "taskRoleArn": "<task-role-arn>",
  "compatibilities": ["EC2", "FARGATE"],
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "cpu": "1024",
  "status": "ACTIVE",
  "volumes": [
    {
      "name": "ecs-discovery"
    }
  ]
}
```

### ECS Task IAM Policy

The following policy should be applied to the ECS Task Role that is running the containers. It grants the follow permissions to the containers. I’ve paired the containers with the permissions that they will be using:

- ECS Scanner container
  - Ability to scan ECS clusters and Tasks in order to generate the config file
- Prometheus Container
  - Ability to read from an S3 bucket to fetch it’s configuration
  - Ability to write to AMP

```json
{
  "Statement": [
    {
      "Action": ["ecs:List*", "ecs:Describe*"],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:ecs:<region>:<account-id>:cluster/<ecs-cluster-name>",
        "arn:aws:ecs:<region>:<account-id>:task/<ecs-cluster-name>/*"
      ]
    },
    {
      "Action": ["ecs:ListTasks", "ecs:DescribeTaskDefinition"],
      "Effect": "Allow",
      "Resource": "*"
    },
    {
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::<s3-bucket-name>",
        "arn:aws:s3:::<s3-bucket-name>/*"
      ]
    },
    {
      "Action": ["aps:RemoteWrite"],
      "Effect": "Allow",
      "Resource": "<AMP-resource-arn>"
    }
  ],
  "Version": "2012-10-17"
}
```

### Prometheus Config

This configuration file tells Prometheus where to find it’s list of scrape targets(the shared volume), as well as the remote endpoint it should write to. SigV4 is the magic part that allows us to totally skip the side-car container. This file should be placed in to an S3 bucket, and the path placed in to the Task Role IAM policy in the correct location.

```yaml
global:
  evaluation_interval: 1m
  scrape_interval: 30s
  scrape_timeout: 10s
remote_write:
  – url: <amp-endpoint>api/v1/remote_write
    sigv4:
      region: <aws-region>
scrape_configs:
  – job_name: ecs
    file_sd_configs:
      – files:
          – /output/ecs_file_sd.yml
        refresh_interval: 1m
```

## Summary

Using the above methodology, I was able to implement a fairly simple solution for getting Prometheus metrics out of ECS Fargate, and into AMP. The ability to use Docker labels to add/remove scanned tasks means maintenance shouldn’t be a large issue going forward, because it’s simple to add new tasks as they are created. This also applies to auto-scaling containers as well, so we can be sure we won’t lose valuable metrics as ephemeral containers pop in and out of existence.

It wouldn’t be a stretch to use the same task instance to query multiple ECS clusters either. As long as you have sufficient IAM permissions and network connectivity, the very same task could be used to forward metrics in multiple ECS clusters. Beware CPU/memory constraints on the Prometheus task though!
