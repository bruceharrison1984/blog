---
title: Get an Azure Service Principal Token With (Almost) One-Line in PowerShell
metaDesc: A short and sweet way to retrieve an Azure SP token
legacyUrl: https://blog.bruceleeharrison.com/2020/05/05/get-an-azure-service-principal-token-with-almost-one-line-in-powershell/
headerImage: /images/azure_synapse.jpg
date: '2020-05-05'
tags:
  - azure
  - powershell
---

# Get an Azure Service Principal Token With (Almost) One-Line in PowerShell

I had a recent issue where I needed to run a DACPAC against an Azure Synapse Warehouse. The problem I ran in to was that our DACPAC needed to insert AAD users in to the SQL Server users pool, but in order to do that via DACPAC you must authenticate in to the Warehouse using an AAD account instead of SQL Credentials. We already had a service principal that was in charge of our Terraform deployments, so we decided to co-opt it into running the DACPAC as well.

I ran across many different ways to get an Access Token for an Azure Service Principal, but nearly all of them were outdated or flat-out wrong. The ones that did work were over engineered PS scripts that did far more than was necessary to retrieve an access token.

So after reading through a bunch of blog posts and comparing scripts, I am happy to present to you the simplest way to retrieve an Access Token for an Azure Service Principal (in PowerShell):

```
$Fields = @{
  grant_type    = "client_credentials"
  client_id     = "<service-principal-id>"
  resource      = "<resource-id-to-auth-for-or-url>"
  client_secret = "<service-principal-secret>"
};
$response = Invoke-RestMethod `
    –Uri "https://login.microsoftonline.com/<azure-tenant-id>/oauth2/token" `
    –ContentType "application/x-www-form-urlencoded" `
    –Method POST `
    –Body $Fields;

Write-Output $tokenResponse.access_token
```

This almost one-liner will authenticate the Service Principal against the target resource, and return the Access Token back to you for use in other processes. The Service Principal must be able to authenticate with the target resource, so make sure to add it directly, or put it in a group that grants access to the target resource. The resource can either be a resource GUID, or a service url like https://database.windows.net. Your use case will determine how you need to set it.

The access_token can then be checked with something like JWT.io to verify the payload:

IMAGE GOES HERE

That’s it, just pass the token in to whatever process needs it and you’re good to go.
