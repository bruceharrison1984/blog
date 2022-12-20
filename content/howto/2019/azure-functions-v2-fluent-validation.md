---
title: 'Azure V2 Functions - FluentValidation'
metaTitle: 'Azure V2 Functions - FluentValidation'
metaDesc: 'How to use Fluent Validation within Azure V2 Functions'
legacyUrl: https://blog.bruceleeharrison.com/2019/08/29/azure-function-filters/
socialImage: images/22-09-2021.jpg
date: '2021-09-22'
tags:
  - azure
  - c#
---

# Azure V2 Functions with FluentValidation

_This walkthrough makes extensive use of inheritance and generics, so read up on those if anything here doesn't make sense to you._

The Azure Function V2 addition of being able to accept a typed model as a function parameter makes it easy and type-safe to interact with incoming JSON payloads.

The downside to this approach is that you only get basic pass/fail model validation from the Azure Function. Fine grained error messages based on the content of the object aren't possible with the OOTB model validation. Worse still, due to the absence of Filter/Middleware, there isn't any good place we can hook in to the default model validation. To get the level of control we desire, we are going to use the FluentValidation Nuget package. This package has been around for nearly 10 years, is wildly popular, and is a snap to use.

```c#
public async Task<IActionResult> PostWidget(
[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "widgets")] Models.Widget item, ILogger log)
{
log.LogInformation($"posting widget: ${item.Id}");
var newItem = await _dbContext.Widgets.AddAsync(item);
await _dbContext.SaveChangesAsync();
return new OkObjectResult(newItem.Entity);
}
```

## Data Envelope

_This isn't required, but it is good practice. I recommend reading up on the data envelope response type for REST APIs._

Before we go any further, we are going to create a DataEnvelope response type. I prefer this type of response because it is future proof, and returns a consistent response to the client for success and failure. The best part is it allows us to return any HTTP status code with a payload. OOTB response types do not allow for this. The rest of this tutorial assumes you are using this response type.

```c#
using System.Net;
using Microsoft.AspNetCore.Mvc;
namespace WidgetApi.Models
{
internal class ResponseEnvelopeResult<T> : ObjectResult where T : class
{
/// <summary>
/// Data envelope for wrapping responses
/// </summary>
/// <param name="statusCode">http status code to return</param>
/// <param name="data">raw response data</param>
/// <param name="error">friendly error string</param>
public ResponseEnvelopeResult(HttpStatusCode statusCode = HttpStatusCode.OK, T data = null, object error = null) : base(new ResponseEnvelope<T>(data, error))
{
this.StatusCode = (int)statusCode;
}
}
internal class ResponseEnvelope<T> where T : class
{
public T Data { get; }
public object Error { get; }
public ResponseEnvelope(T data, object error)
{
Data = data;
Error = error;
}
}
}
```

This class also allows us to return typed responses, which is very useful if you end up using Swagger/Swashbuckle to create an OpenAPI spec for your application. OkObjectResult doesn't expose the underlying response object type, so Swagger will not be able to assert the typed model that is to be returned.

## Dependencies

All the examples here assume you are using Azure Functions V2, and Azure Functions DI. The examples are written as though you are using Entity Framework, but they are applicable to any DB/ORM implementation.

## Data Models - Inheritance

To start out, we are going to declare a few data objects that inherit from a common abstract base class called ModelBase. The reason I am doing this is because I have audit properties that I want to appear on every data object, but I don't want to re-type it for every object. We can also leverage this base class to perform standard validation against these fields.

```c#
using System;
namespace WidgetApi.Models
{
public abstract class ModelBase
{
public int Id { get; set; }
public int CreatedBy { get; set; }
public DateTime CreatedOn { get; set; }
public int? UpdatedBy { get; set; }
public DateTime? UpdatedOn { get; set; }
}
public class User : ModelBase
{
public string GivenName { get; set; }
public string JobTitle {get; set; }
public string Mail {get; set; }
public string Surname { get; set; }
}
public class Widget : ModelBase
{
public string Title { get; set; }
public string Description { get; set; }
}
}
```

So now we have two objects, User and Widget that exist in our code and in our imaginary database. Our goal is to make sure that when the user interacts with our REST API, they cannot perform actions that would violate our database rules.

## Validation Rules

The next step is to use FluentValidation to create a set of rules that can be used to validate our models when they are received.

```c#
using System.Net.Http;
using FluentValidation;
using WidgetApi.Models;
namespace WidgetApi.FunctionHelpers
{
public class BaseValidator<T> : AbstractValidator<T> where T : ModelBase
{
public BaseValidator()
{
RuleSet(HttpMethod.Post.Method, () =>
{
RuleFor(x => x.Id).Empty()
.WithMessage($"Id field cannot be specified when POSTing a new item '{typeof(T).Name}'");
});
RuleSet(HttpMethod.Patch.Method, () =>
{
RuleFor(x => x.Id).NotEmpty();
});
RuleSet("audit", () =>
{
RuleFor(x => x.CreatedBy).Empty();
RuleFor(x => x.CreatedOn).Empty();
RuleFor(x => x.UpdatedBy).Empty();
RuleFor(x => x.UpdatedOn).Empty();
});
}
}
public class WidgetValidator : BaseValidator<Widget>
{
public WidgetValidator()
{
RuleSet(HttpMethod.Post.Method, () =>
{
RuleFor(x => x.Title).NotEmpty();
RuleFor(x => x.Description).NotEmpty();
});
}
}
public class UserValidator : BaseValidator<User> { }
}
```

There is a fair bit going on in this class, so let's go over some of the important pieces. We have a few different sets of rules, some of which are only applied if a particular HttpRequest.Method is used. This allows us to do things such as force an Id to be present during an update, or enforce not having an Id on a create.

In Line 7, we are declaring a new class that accepts a type T as long as the type inherits from our BaseModel class. This gives us a universal validator for every model that inherits from BaseModel. Without this, we would need to redeclare the same rules for every model that has these same properties.

In Lines 11-30, we are creating a rule sets that will be used when we pass in a string that matches the HttpMethod.Post.Method, HttpMethod.Patch.Method, or audit. We do this so we can create a single rule object for all scenarios, instead of creating independent rule objects for each scenario. See the FluentValidation docs for more information on RuleSets. This will make more sense once you see the validation function.

Lines 32-43 are setting up rules that will only be evaluated for Widget objects. We inherit WidgetValidator from the BaseValidator so we get the rules we already defined for free, but additionally we are remaining consistent across objects. This is extremely important for clients who will be interacting with our API. An inconsistent API is frustrating to work with, and confusing to clients.

On Line 44, we creating a rules object for the User object, but don't define any additional rules for that type. If we add some later, we have a nice spot already carved out for us. We also require this empty definition in order for us to fully leverage the validator code that will be shown next.

## Validator Function

In order to maximize reusability, we are going to write a function that can validate any of our models that inherit from ModelBase.

```c#
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
using WidgetApi.Models;
namespace WidgetApi.FunctionHelpers
{
public class FunctionWrapper<T> where T : ModelBase
{
private readonly BaseValidator<T> _validator;
private readonly ILogger _log;
public FunctionWrapper(BaseValidator<T> validator, ILogger<FunctionWrapper<T>> log)
{
_validator = validator;
_log = log;
}
public async Task<IActionResult> Execute(T model, HttpRequest req, Func<Task<IActionResult>> azureFunction)
{
var results = await _validator.ValidateAsync(model, ruleSet: $"default,audit,{req.Method}");
if (!results.IsValid)
{
var errors = results.Errors.Select(x => x.ErrorMessage).ToList();
_log.LogWarning($"Model validation failed for type '{typeof(T).Name}'. Validation errors: [{errors.Join()}] ");
return new ResponseEnvelopeResult<T>(HttpStatusCode.BadRequest, null, errors);
}
try
{
return await azureFunction();
}
catch (Exception e)
{
_log.LogError(e, "Unhandled exception occured in FunctionWrapper");
return new ResponseEnvelopeResult<T>(HttpStatusCode.InternalServerError, null, new[] { e.Message });
}
}
}
}
```

There doesn't appear to be a ton going on in this class, but that's because we have leveraged generics to do our heavy lifting. We are going to focus on the Execute method.

First, we call our validator which we created earlier and will be provided to us through DI. If validation fails, we aggregate the error messages into an array and return a BadRequest with the error array in the 'errors' property of the response.

> Notice how we pass in a comma delimited string to the ruleSets argument in to the ValidateAsync method. The values in the array determine which RuleSets will be validated against. "default" will run all rules not in a RuleSet. "Audit" will run the rules in the "audit" RuleSet. The final argument passes the HttpRequest.Method used for the request in to validator, ensuring that we can run context specific rules against the model based on the request type.

If validation succeeds, we will call our callback function(our original Azure function), and return those results in a data envelope. The icing on the cake is we have wrapped our callback in a try/catch block so we get consistent(again!) error responses in the case of unhandled exceptions. I focused on this particular aspect in another blog post.

## Wrap it all up

All that is left now is to alter our original function to make use of the validator, and inject the new classes in to our DI services.

```c#
public class KeyResults
{
private readonly WidgetDbContext _dbContext;
private readonly FunctionWrapper<Widget> _functionWrapper;
public Widgets(WidgetDbContext dbContext, FunctionWrapper<Widget> functionWrapper)
{
_dbContext = dbContext;
_functionWrapper = functionWrapper;
}
[FunctionName("PostWidget")]
public async Task<IActionResult> PostWidget(
[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "widgets")] Widget item, HttpRequest req, ILogger log)
{
return await _functionWrapper.Execute(req, item, async () =>
{
log.LogInformation($"posting widget: ${item.Id}");
var newItem = await dbContext.Widgets.AddAsync(item);
await dbContext.SaveChangesAsync();
return new ResponseEnvelopeResult<Widget>(HttpStatusCode.Created, newItem.Entity);
});
}
}
```

To update our function, we just need to inject our function wrapper in to our Function class, add the HttpRequest parameter to our function, and wrap the original function in our Execute method. The last thing is to update our startup.cs file to inject our classes.

```c#
public override void Configure(IFunctionsHostBuilder builder)
{
...
builder.Services.AddLogging();
//workaround azure functions not handling nested arrays by default
builder.Services.AddTransient<IConfigureOptions<MvcOptions>, MvcJsonMvcOptionsSetup>();
builder.Services.AddTransient<BaseValidator<Widget>, WidgetValidator>(o => new WidgetValidator());
builder.Services.AddTransient<BaseValidator<User>, UserValidator>(o => new UserValidator());
builder.Services.AddTransient<FunctionWrapper<Widget>>();
builder.Services.AddTransient<FunctionWrapper<User>>();
...
}
```

We registered our ModelValidators and our FunctionWrapper, so everything should be good to go now. Pay attention to how we registered BaseValidators<T> as service types, but used a strongly typed implementation. This is because DI needs a little help in order to find the proper validator. If you try to do this by using the named implementation, DI will fail when it attempts to find the validator in the FunctionWrapper constructor. This points it in the right direction, and lets us use a single FunctionWrapper class to create N number of FunctionWrappers. Any objects we create from now on can utilize the FunctionWrapper as long as it inherits from BaseModel!

## Conclusion

This post turned more in to a crash course on generics, inheritance, and DI container helpers instead of validation. But by using these, we can create a model validation system for Azure Functions that is extensible, easy to maintain, and consistent(last one I promise).

This concept could be expanded even further by automatically creating and injecting FunctionWrappers for any classes that implement ModelBase.

In closing, the following is a summary of program flow when a request hits this function.

- Request hits function
- FunctionWrapper.Execute is called
  - User request object, original HttpRequest, and callback are passed in
- Validation runs
  - BaseValidator rules are run
    - Some rules are run based on HttpRequest.Method
  - Specific type T validation is run
    - Some rules are run based on HttpRequest.Method
  - If validation fails, all errors are aggregated and returned in the response
- The original function code is run and a success response is returned.
