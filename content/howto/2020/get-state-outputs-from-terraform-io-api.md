---
title: Get State Outputs from Terraform.io API
metaDesc: Ever wished you could easily access Terraform Cloud outputs within a CI/CD context? This is a simple way to do so.
legacyUrl: https://blog.bruceleeharrison.com/2020/07/17/get-state-outputs-from-terraform-io-api/
headerImage: /images/azure_synapse.jpg
date: 2020/07/17
tags:
  - terraform
  - powershell
---

# Get State Outputs from Terraform.io API

Terraform.io has been online for awhile now, and I’ve been enjoying having a cloud agnostic place to store my state files. What many people may not know is that Terraform.io has an API that provides all the same functionality as the web UI. This is a simple example of how to leverage the Terraform.io API to aid your deployment by retrieving Terraform outputs.

One issue that always bugged me was needing to repeatedly get my current set of Terraform outputs during a multi-stage deployment. Usually these outputs are passed upstream for configuration or linking of services that Terraform cannot control. It used to be the only way to get these outputs was either run “terraform output -format json” on your build server and then parse the results, or manually download the remote state file and parse that. Both of these require tooling and engineering time to work through. It always felt like an over-engineered solution for what could be simple.

Well complain no longer, the Terraform.io API makes this a snap. The following PowerShell script takes 3 arguments:

- WorkspaceName
- Organization Name
- Terraform.IO Team/User token (org tokens don’t work on the state-versions endpoint)

Pass those three items in to the script and you’ll get back a dictionary of the outputs for the specified environment. The only prerequisite is that your are using Terraform.io to hold your state files.

```
param(
  [string]$workspaceName = $(throw "Please specify a workspace name"),
  [string]$organizationName = $(throw "Please specify an organization name"),
  [string]$terraformIoToken = $(throw "Please specify a terraform Io Token")
)

$ErrorActionPreference = "Stop"

$baseUri = "https://app.terraform.io/"
$authHeader = @{ Authorization = "Bearer $terraformIoToken" }
$contentType = "application/vnd.api+json; charset=utf-8"

Write-Host "Getting state information for $organizationName – $workspaceName"

$workspaceResp = Invoke-RestMethod –Uri "$baseUri/api/v2/organizations/$organizationName/workspaces/$workspaceName" –Headers $authHeader –ContentType $contentType
$currentStateVersionLink = $workspaceResp.data.relationships.'current-state-version'.links.related

Write-Host "Current state link: $currentStateVersionLink"

$uri = $baseUri + $currentStateVersionLink + "?include=outputs"
$outputResp = Invoke-RestMethod –Uri $uri –Headers $authHeader –ContentType $contentType

$outputs = @{};
$outputResp.included | % attributes | % { $outputs."$($_.Name)" = $_.Value }
$outputs = $outputs.GetEnumerator() | sort –Property Name

$outputs
```

From here, you’ve got a PowerShell hashmap of Terraform outputs that you can integrate back into your build pipeline. No download/install of Terraform and no manual parsing of JSON. The example is in PowerShell, but it could easily be adapted to any other language with minimal fuss. I should say that all outputs will be printed in the console, so alter the script to hide these if necessary. I intentionally left them visible for the sake of keeping this simple.

The full docs for the Terraform.io API are [here](https://www.terraform.io/docs/cloud/api/index.html).

## GitHub Action – 3/18/2021

I’ve created a simple GitHub action that wraps this up in a single step, so if you’re using Actions you may consider just using it instead.

https://github.com/bruceharrison1984/terraform-io-github-action
