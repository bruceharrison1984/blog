---
title: Monitor Headless Worker Services in .Net Core 5.0
metaDesc: Use health-checks on headless services without needing the entire MVC ecosystem
date: !!timestamp '2021-06-24'
tags:
  - c#
---

# Monitor Headless Worker Services in .Net Core 5.0

While on a project, we were working with RabbitMQ and a series of consumers. These consumers all ran headlessly(ie no web server), but we wanted an easy was to check the health of them. We are also running in AWS ECS, which supports the notion of health-checks within the ECS cluster itself, and replacing containers that are failing health-checks.

.Net Core 2.0 introduced us to the idea of a **first class service worker**. This meant a single process running independently of the main process. This was a great addition because .Net Core finally had a cross-platform solution to the Windows Services of the past. This meant you could now build out business processes to run in a lights out fashion, and potentially run more than one in a single process. If the hosted process exits, you can have the entire process come down with it.

While the OOTB processes around Hosted Services are fantastic, we wanted something a bit more pro-active other than the process failing completely, and ECS spinning up a new one. MVC style health-checks were what the team decided on, but the first implementation was less than perfect.

## The Problem

The first attempt simply used the VS2019 MVC project template instead of the more specialized Worker Service project template. This made implementing health-checks a breeze, but our highly specialized queue worker was now pulling double-duty as a full on MVC application. Less than ideal due to system requirements, and now any enterprising developer who knows MVC can easily circumvent our RabbitMQ queues and abuse MVC to get work “done”. Additionally, the MVC process is the main process and the Hosted Service is now a side process. There is nothing stopping the queue consumer from failing, while the MVC application keeps on serving up Status 200 from the health check endpoint.

How do you utilize the Worker Service project type and expose usable HTTP endpoints without dragging in MVC framework?

## TinyHealthCheck

The solution I ultimately came up with was a very small Nuget package called [TinyHealthCheck](https://github.com/bruceharrison1984/TinyHealthCheck). TinyHealthCheck spins up a single endpoint that serves a simple JSON payload to verify your container is indeed running. This health check process runs as an additional IHostedService next to your intended application. The included health-checks are similar to MVC health-checks in that they don’t pay any attention to the hosted service, but they suffice for most simple scenarios. The upside is your surface are for MVC is now effectively zero, because TinyHealthCheck doesn’t require any MVC packages. In fact, it only has 2 dependencies related to IOptions and Dependency injection. Web requests are processed in the Global ThreadPool, so your primary process isn’t constrained by the health-checks. They are also processed in a fire-and-forget manner, so your primary service won’t be disrupted by failures sending or receiving HTTP requests.

## Simple Example

The following example produces a single endpoint that returns a 200 with a small JSON payload.

```c#
public static IHostBuilder CreateHostBuilder(string[] args)
{
    var processStartTime = DateTimeOffset.Now;
    return Host.CreateDefaultBuilder(args)
        .ConfigureServices((hostContext, services) =>
        {
            services.AddHostedService<Worker>();
            services.AddBasicTinyHealthCheckWithUptime(config =>
            {
                config.Port = 8081;
                config.UrlPath = "/healthz";
                return config;
            });
        });
}
```

The health-check is stateful in that it keeps track of how long the application has been up and running(outside of app-pool restarts).

```json
{
  "Status": "Healthy!",
  "Uptime": "<ever increasing timespan>"
}
```

## Monitoring the primary process

[The complete form of this example is available in the repository.](https://github.com/bruceharrison1984/TinyHealthCheck/tree/main/DummyServiceWorker)

The real value in using TinyHealthCheck comes from monitoring your primary IHostedService, and representing it’s current state in the health check. Creating a custom IHealthCheck allows you to implement whatever sort of response you’d like based on the underlying conditions within the application. The following example shows how utilizing a Singleton to hold the state information of your primary IHostedService, you can easily get run-time information into your health-checks.

```c#
public static IHostBuilder CreateHostBuilder(string[] args)
{
    var processStartTime = DateTimeOffset.Now;
    return Host.CreateDefaultBuilder(args)
        .ConfigureServices((hostContext, services) =>
        {
            services.AddSingleton<WorkerStateService>();
            services.AddHostedService<Worker>();
            services.AddCustomTinyHealthCheck<CustomHealthCheck>(config =>
            {
                config.Port = 8082;
                config.UrlPath = "/healthz";
                return config;
            });
        });
}

 public class CustomHealthCheck : IHealthCheck
{
    private readonly ILogger<CustomHealthCheck> _logger;
    private readonly WorkerStateService _workerStateService;
    //IHostedServices cannot be reliably retrieved from the DI collection
    //A secondary stateful service is required in order to get state information out of it

    public CustomHealthCheck(ILogger<CustomHealthCheck> logger, WorkerStateService workerStateService)
    {
        _logger = logger;
        _workerStateService = workerStateService;
    }

    public async Task<HealthCheckResult> Execute(CancellationToken cancellationToken)
    {
        _logger.LogInformation("This is an example of accessing the DI containers for logging. You can access any service that is registered");

        return new HealthCheckResult
        {
            Body = JsonSerializer.Serialize(new
            {
                Status = _workerStateService.IsRunning ? "Healthy!" : "Unhealthy!",
                Iteration = _workerStateService.Iteration,
                IsServiceRunning = _workerStateService.IsRunning,
                ErrorMessage = _workerStateService.IsRunning ? null : "We went over 10 iterations, so the service worker quit!"
            }),
            StatusCode = _workerStateService.IsRunning ? System.Net.HttpStatusCode.OK : System.Net.HttpStatusCode.InternalServerError
        };
    }
}
```

It can also be noted that technically you don’t need to use the Singleton to get state information out of another IHostedService. **You can register a single IHostedService as both an IHostedService, as well as a Singleton.** That will allow you to directly access it via DI, but that smells really bad to me. I like the separation of concerns by requiring the IHostedService to post updates to the singleton, and then TinyHealthCheck retrieves values from there. Just my opinion, do what you like.

## Conclusion

[TinyHealthCheck](https://github.com/bruceharrison1984/TinyHealthCheck) allowed us to implement full featured health-check endpoints, while getting rid of the overhead and dependencies of the larger MVC ecosystem. Don’t get me wrong, I love me some MVC, but I don’t want to double the size of my executable just for a health-check endpoint.
