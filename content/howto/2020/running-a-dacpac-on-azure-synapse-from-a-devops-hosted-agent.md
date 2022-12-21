---
title: Running a DACPAC On Azure Synapse From a DevOps-Hosted Agent
metaDesc: We recently needed to run a DACPAC against a Synapse Warehouse. Locally running the DACPAC against Synapse worked fine, but broke as soon as we tried to use our DevOps CI/CD pipeline.
legacyUrl: https://blog.bruceleeharrison.com/2020/05/05/running-a-dacpac-on-azure-synapse-from-a-devops-hosted-agent/
headerImage: /bruceharrison1984/images/azure_synapse.jpg
date: '2020-05-05'
tags:
  - azure
  - powershell
  - synapse
---

# Running a DACPAC On Azure Synapse From a DevOps-Hosted Agent

We recently needed to run a DACPAC against a Synapse Warehouse. Locally running the DACPAC against Synapse worked fine, but broke as soon as we tried to use our DevOps CI/CD pipeline.

We got the following error from the DACPAC release task:

```sh
2020-05-01T19:06:05.0948538Z ##[error]Publishing to database '****' on server '***.database.windows.net,1433'.
Initializing deployment (Start)
Initializing deployment (Failed)
Time elapsed 00:00:06.91
*** An error occurred during deployment plan generation. Deployment cannot continue. The Element class SqlColumnStoreIndex does not contain the Relationship class OrderedColumns.
```

A quick Google search showed that the column types used in Synapse aren’t supported by SqlPackage.exe until v19. All of the DevOps Release tasks that use SqlPackage.exe rely on v18.5, which causes the deployment to fail due to missing types. Visual Studio 2019 ships with v19, so that’s why it worked locally. In an odd twist, there currently are not any links to download SqlPackage.exe v19, so your only source is VS2019. I’m sure this will be updated eventually.

After a bit of sniffing around on the DevOps agent, I found that v19 of SqlPackage.exe is present, you just have to call it manually using Powershell(or whatever shell task you prefer).

```
$connectionString = "Server=*****.database.windows.net,1433;Database=*****;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;"

& "C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\Common7\IDE\Extensions\Microsoft\SQLDB\DAC\150\sqlpackage.exe" /Action:Publish /SourceFile:"./deployment.dacpac" /TargetConnectionString:"$connectionString" /AccessToken:"<service-principal-access-token>" /Diagnostics:True
```

Once we switched to using this version of SqlPackage.exe, our DACPAC deployment was able to proceed successfully.

In this example we invoke SqlPackage with an Azure Service Principal, but you can also use username/password credentials. If using username/password, you can remove the AccessToken argument from the SqlPackage call, and change your connection string to resemble the following:

```
$connectionString = "Server=*****.database.windows.net,1433;Database=*****;Persist Security Info=False;User ID=<username@domain.com>;Password=<password>;Pooling=False;MultipleActiveResultSets=False;Connect Timeout=60;Encrypt=True;TrustServerCertificate=False;Authentication='Active Directory Password'"
```

I would imagine in time the DACPAC tasks will be updated to use v19+ of SqlPackage.exe, but as of today(5/5/2020) this is the only way to get it to work without resorting to deploying your own DevOps agent.
