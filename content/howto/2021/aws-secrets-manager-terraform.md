---
title: AWS Secrets Manager & Terraform
metaDesc: How to use the AWS Terraform provider to store secrets in AWS Secret Manager
legacyUrl: https://blog.bruceleeharrison.com/2021/03/02/aws-secrets-manager-terraform
headerImage: /images/azure_synapse.jpg
date: '2021/03/02'
tags:
  - azure
  - powershell
---

# AWS Secrets Manager & Terraform

I addition of AWS Secrets Manager has been a great help with Terraform deployments in to AWS. Previously, SSM Parameter Store could be used, but it lacked any security features. Secrets Manager rectifies this, and it has first-class Terraform support.

There are countless patterns you can use within Terraform to put values in to AWS Secrets Manager, but I have found the following module to be convenient and easy was to do it. It centralizes all the secret management, and makes it easy to name them all consistently. The output also makes it easy for other Terraform templates that utilize remote-state to access the same secrets.

```terraform
variable "base_name" {
  description = "The prefix on created resources"
}

variable "secret_map" {
  description = "A Key/Value map of secrets that will be added to AWS Secrets"
  type        = map(string)
}

variable "default_tags" {
  description = "Tags to be applied to resources"
}

variable "secret_retention_days" {
  default     = 0
  description = "Number of days before secret is actually deleted. Increasing this above 0 will result in Terraform errors if you redeploy to the same workspace."
}

resource "aws_secretsmanager_secret" "map_secret" {
  for_each = var.secret_map

  name                    = "/${terraform.workspace}/${each.key}"
  recovery_window_in_days = var.secret_retention_days

  tags = merge(var.default_tags, {
    Name = "${var.base_name}–${each.key}"
  })
}

resource "aws_secretsmanager_secret_version" "map_secret" {
  for_each = aws_secretsmanager_secret.map_secret

  secret_id     = aws_secretsmanager_secret.map_secret[each.key].id
  secret_string = var.secret_map[each.key]
}

output "secret_arns" {
  value = zipmap(keys(aws_secretsmanager_secret_version.map_secret), values(aws_secretsmanager_secret_version.map_secret)[*].arn)
}

```

Usage is extremely straight-forward:

```terraform
module "secrets" {
  source       = "./secrets"
  base_name    = local.base_name
  default_tags = local.default_tags

  secret_map = {
    "shared/bastion/ssh/public_pem"         = tls_private_key.bastion.public_key_openssh
    "shared/bastion/ssh/private_pem"        = tls_private_key.bastion.private_key_pem
    "shared/bastion/ssh/username"           = random_pet.bastion_username.id
  }
}
```

The output of the module is a map of secret-name/secret-arn, which can be easily passed to other processes so they can securely retrieve the values, without exposing them.

IMAGE GOES HERE

A more complete example can be found in this repository:
https://github.com/bruceharrison1984/aws-fargate-bastion-cluster/tree/dev/secrets
