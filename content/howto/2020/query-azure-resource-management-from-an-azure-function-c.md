---
title: Query Azure Resource Management from an Azure Function (C#)
metaDesc: This explains how to use the Azure Resource Management library for C# to query resources
legacyUrl: https://blog.bruceleeharrison.com/2020/11/04/query-azure-resource-management-from-an-azure-function-c/
headerImage: /images/azure_synapse.jpg
date: '2020-05-05'
tags:
  - azure
  - c#
---

# Query Azure Resource Management from an Azure Function (C#)

I had a recent requirement to write a small program that monitors an Azure DataLake, and writes entries in to an Azure Synapse database when certain changes occur. It was a simple enough requirement, but the most difficult part turned out to be checking if the Synapse database was actually online. Synapse can be paused, which is not good when I am supposed to be writing in to it. The SDK currently doesn’t expose this value directly, so we had to find a way to get it ourselves.

An Additional wrinkle was an Azure Function would be running the code, and I wanted to avoid any unnecessary environment variable magic on my local machine. So platform independence was a hard requirement I set for myself.

The Azure SDK ecosystem for C# is generally a train-wreck, with multiple packages deprecated and they all share very similar namespaces. After much Googling and reading, I found the current set of SDKs to use to do this. (As of 11/4/2020). The ResourceManagementClient used here is currently still in beta, but it seems clear that Microsoft is moving in this direction.

Example
I am using the DI package for Azure Functions, so if you are not using it(why not?) you will need to slightly adapt this to get it working in your project. The example is also intentionally verbose to make it clear what we are doing.

```c#
using Azure.Identity;
using Azure.ResourceManager.Resources;
using MyFunctionProject.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MyFunctionProject.Services
{
    public interface IAzureResourceManagementApiService
    {
        Task<bool> IsSynapseOnlineAsync(CancellationToken cancellationToken);
    }

    public class AzureResources : IAzureResourceManagementApiService
    {
        private readonly IOptions<AzureConfig> _azureConfig;
        private readonly ISqlConnectionService _connectionService;
        private readonly ILogger<AzureResources> _logger;

        public AzureResources(IOptions<AzureConfig> azureConfig, ISqlConnectionService connectionService, ILogger<AzureResources> logger)
        {
            _azureConfig = azureConfig;
            _connectionService = connectionService;
            _logger = logger;
        }

        public async Task<bool> IsSynapseOnlineAsync(CancellationToken cancellationToken)
        {
            var resourceClient = new ResourcesManagementClient(_azureConfig.Value.SubscriptionId, new DefaultAzureCredential());
            var resp = await resourceClient.Resources.GetAsync(_azureConfig.Value.ResourceGroup, $"Microsoft.Sql/servers", _connectionService.DatabaseServerName, "databases", _connectionService.DatabaseName, "2020-08-01-preview", cancellationToken);
            var props = (Dictionary<string, object>)resp.Value.Properties;

            if (!props.ContainsKey("status"))
                throw new Exception($"Querying Azure Resource Management for '{_connectionService.DatabaseServerName}/{_connectionService.DatabaseName}' did not return the expected response. 'status' key not found in resource properties.");

            var status = (string)props["status"];

            switch (status.ToLower())
            {
                case "online":
                    return true;
                default:
                    {
                        _logger.LogWarning($"Synapse database '{_connectionService.DatabaseServerName}/{_connectionService.DatabaseName}' is not online, it is '{status}'");
                        return false;
                    }
            }
        }
    }
}
```

It is a fairly simple little class, and can almost be copy pasted right in to another project. In my case I have an ISqlConnection class that you won’t have, but as long as you can pass in the DatabaseName and DatabaseServerName through some other means, it should work just fine. You will also need to pass in a SubscriptionID as well as a resource group. I made a small class (AzureConfig) to hold these values and I pass them in as IOptions.

## Additional Info

This uses the new ResourceManagementClient paired with Azure.Identity. The Identity package exposes the DefaultAzureCredential() method. This method will use your local Azure credentials when developing, and use the Managed Identity of the Azure service you deploy it to. So there is no extra work needed to ensure what runs locally will run once deployed(ignoring any IAM permissions that need to be set on the Azure side).

My biggest complaint with the ResourceManagementClient is that it requires the SubscriptionID, as well as a ResourceGroup in order to even initialize. This requires feeding them in to the application, since there isn’t a good way through the SDK to retrieve these values.

You could easily adapt this to query any Azure resources, so long as you have the necessary resource IDs/names to pass in to the ResourceManagementClient. It’s also worth pointing out that resourceClient.Resources.GetAsync() is simply building up an Azure Resource Manager REST Url, so you can use the Azure Portal and browser inspection tools to quickly figure out what these values need to be.

## References

- [Azure Credentials Examples](https://docs.microsoft.com/en-us/dotnet/api/overview/azure/identity-readme#examples)
- [ResourceManagement Nuget Package](https://www.nuget.org/packages/Microsoft.Azure.Management.ResourceManager)
- [Azure.Identity Nuget Package](https://www.nuget.org/packages/Azure.Identity)
