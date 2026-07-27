using BlueWave_BP.API.Data;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using BlueWave_BP.API.Services.Interfaces;
using BlueWave_BP.API.Services.Implementation;

var aspNetEnvironment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
var isDevelopmentEnvironment = string.Equals(
    aspNetEnvironment,
    Environments.Development,
    StringComparison.OrdinalIgnoreCase);

if (!isDevelopmentEnvironment)
{
    // Render (and other hosts) should set env vars directly; .env is a local fallback for non-development runs.
    var envPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
    if (File.Exists(envPath))
    {
        Env.Load(envPath);
    }
}

var builder = WebApplication.CreateBuilder(args);

var renderPort = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(renderPort))
{
    builder.WebHost.UseUrls($"http://*:{renderPort}");
}

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Connection string 'DefaultConnection' is not configured. Use appsettings.Development.json locally or set ConnectionStrings__DefaultConnection in environment variables/.env.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});
builder.Services.AddScoped<IBuyerService, BuyerService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IBuyerProductPriceService, BuyerProductPriceService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();

var configuredCorsOrigins = builder.Configuration["Cors:AllowedOrigins"];
var fallbackCorsOrigins = "http://localhost:5173";
var parsedOrigins = (configuredCorsOrigins ?? fallbackCorsOrigins)
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
var isDevelopment = builder.Environment.IsDevelopment();
var allowVercelPreviewOrigins = builder.Configuration.GetValue<bool>("Cors:AllowVercelPreviewOrigins");

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy",
        policy =>
        {
            policy.SetIsOriginAllowed(origin =>
                  {
                      if (string.IsNullOrWhiteSpace(origin))
                      {
                          return false;
                      }

                      var normalizedOrigin = origin.TrimEnd('/');
                      var normalizedConfiguredOrigins = parsedOrigins
                          .Select(value => value.TrimEnd('/'));

                      if (normalizedConfiguredOrigins.Contains(normalizedOrigin, StringComparer.OrdinalIgnoreCase))
                      {
                          return true;
                      }

                      if (isDevelopment && Uri.TryCreate(origin, UriKind.Absolute, out var uri))
                      {
                          return string.Equals(uri.Host, "localhost", StringComparison.OrdinalIgnoreCase);
                      }

                      if (allowVercelPreviewOrigins && Uri.TryCreate(origin, UriKind.Absolute, out var previewUri))
                      {
                          return previewUri.Host.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase);
                      }

                      return false;
                  })
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

var shouldReseedSanitaryData = args.Any(arg =>
    string.Equals(arg, "--reseed-sanitary-data", StringComparison.OrdinalIgnoreCase));

if (shouldReseedSanitaryData)
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
    var logger = loggerFactory.CreateLogger("SanitaryDataSeeder");

    await SanitaryDataSeeder.ReseedAsync(dbContext, logger);
    return;
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("ReactPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
