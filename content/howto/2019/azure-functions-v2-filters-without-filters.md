---
title: 'Azure Functions V2 - Filters (without Filters)'
metaTitle: 'Azure Functions V2 - Filters (without Filters)'
metaDesc: 'How to use pages in Next.js exploring the options'
socialImage: images/22-09-2021.jpg
date: '2021-09-22'
tags:
  - azure
  - c#
---

# Azure Functions V2 - Filters (without Filters)

Recently, I was tasked with building a fairly simple API using Azure Functions. Using VS2019, this is a trivial task because VS2019 comes with an Azure Function V2 project type. The addition of DI in V2 functions is also a major boon, because it finally gets rid of the code sprawl and duplication that previous lambda function competitors (I'm looking at you AWS) suffered from.

I quickly realized that as nice as it is to have DI in Azure Functions, there is a huge gaping hole where asp.net middleware is supposed to live. Azure functions technically have Filter support, the problem is that the current implementation cannot alter the response of the function. Because of this limitation, a global error response handler isn't feasible, at least right now. There is currently an open issue on Github around the issue, and it looks like we might get the functionality most people are asking for by the end of 2019.

But since you are reading this, you need a filter right now! If that's the case, read on!

## Dependencies

All the examples here assume you are using Azure Functions V2, and Azure Functions DI. The examples are written as though you are using Entity Framework, but they are applicable to any DB/ORM implementation.

## Standard Error Handler

Anyone who has written an asp.net API will be familiar with the error handler middleware. This lets us catch any unhandled exceptions that may have bubbled up from the depths of our app, and apply a standard error response. Normally this includes an HTTP status of 500, and some form of ambiguous error message. In ASP.net, you can leverage middleware and be done with it. If you attempt to implement the same thing in Azure Functions, without filters or middleware, your first attempt will likely be to wrap all of your functions in try/catch blocks.

```csharp
[FunctionName("GetWidget")]
public async Task<IActionResult> GetWidget([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "/widgets/{id}")] HttpRequest req, int id, ILogger log)
{
log.LogInformation($"getting widget: ${id}");
try
{
var selectedItem = await _dbContext.Widgets.FindAsync(id);
return new ObjectResult(selectedItem);
}
catch (Exception e)
{
return new CustomObjectResult(e.Message, StatusCodes.Status500InternalServerError);
}
}
class CustomObjectResult : ObjectResult
{
public CustomObjectResult(object data, int statusCode) : base(data)
{
this.StatusCode = statusCode;
}
}
```

So the above works okay for a few endpoints. We get a 500 back if we failed to catch any errors, as well as the error message. Once our API grows to 10+ endpoints, you'll be doing quite a bit of copy/pasting for such a simple operation. The odds of fat fingering part of the code grows with each endpoint, and let's not talk about if we decide to change the response type. Let's see how we can consolidate this error handling logic by creating a new class.

```csharp
public class FunctionWrapper
{
private readonly ILogger _log;
public FunctionWrapper(ILogger<FunctionWrapper> log)
{
_log = log;
}
public async Task<IActionResult> Execute(Func<Task<IActionResult>> azureFunction)
{
try
{
return await azureFunction();
}
catch (Exception e)
{
_log.LogError(e, "Unhandled exception occured in FunctionWrapper");
return new CustomObjectResult(e.Message, StatusCodes.Status500InternalServerError);
}
}
}
```

The class itself is very simple. The Execute function takes one argument, a function with a return type of IActionResult. It just so happens that your original function logic returned an IActionResult, so we can utilize an inline lambda function in our function method. Now that we have our new function wrapper, let's implement it in to our API. The first step is injecting our wrapper in to the service collection.

```csharp
builder.Services.AddTransient<FunctionWrapper>();
```

Now we can utilize our wrapper in our Function code. You could also make use of a static class instead of using a DI container, but testing static classes is difficult and it doesn't really buy us anything in this scenario anyway.

```csharp
public class Widgets
{
private readonly DbContext _DbContext;
private readonly FunctionWrapper _functionWrapper;
public Widgets(DbContext DbContext, FunctionWrapper functionWrapper)
{
_DbContext = DbContext;
_functionWrapper = functionWrapper;
}
[FunctionName("GetWidget")]
public async Task<IActionResult> GetWidget([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "/widgets/{id}")] HttpRequest req, int id, ILogger log)
{
return await _functionWrapper.Execute(async () =>
{
log.LogInformation($"getting widget: ${id}");
var selectedItem = await _DbContext.Widgets.FindAsync(id);
return new CustomObjectResult(selectedItem, StatusCodes.Status200OK);
});
}
}
```

That's it! By injecting the FunctionWrapper class in to your Azure function classes, you can now reuse this simple wrapper in all of your functions. The nice thing about using an inline lambda is that while our business logic is wrapped in an error handler, we still have access to the variables outside of our wrapper scope. So we have consolidated our error handling without obscuring the intent of the original code.

## Conclusion

With a bit of C# knowledge, you can see how we took a potential maintenance nightmare and made a nice, concise error handler.

This same idea could also be applied to many other ASP.net niceties we take for granted:

- Model Validation
- Injecting User Context
- Sending all requests to a message bus

By pulling standard actions out we can expose the core functionality
