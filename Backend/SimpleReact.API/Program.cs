using System;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using SimpleReact.API.Data;
using SimpleReact.API.Repositories;
using SimpleReact.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure repositories and services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<AuthService>();

// Configure JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
        
        Console.WriteLine("CORS policy configured to allow any origin, header, and method");
    });
});

// Configure OpenTelemetry
builder.Services.AddOpenTelemetry()
    .WithTracing(tracerProviderBuilder =>
    {
        tracerProviderBuilder
            .AddSource("SimpleReact.API")
            .SetResourceBuilder(ResourceBuilder.CreateDefault()
                .AddService("SimpleReact.API"))
            .AddAspNetCoreInstrumentation()
            .AddJaegerExporter(options =>
            {
                options.AgentHost = builder.Configuration["Jaeger:AgentHost"] ?? "localhost";
                options.AgentPort = int.Parse(builder.Configuration["Jaeger:AgentPort"] ?? "6831");
            });
    });

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure health checks
builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

// Create database and seed initial admin user if it doesn't exist
using (var scope = app.Services.CreateScope())
{
    try
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<ApplicationDbContext>();
        var userRepository = services.GetRequiredService<IUserRepository>();
        var authService = services.GetRequiredService<AuthService>();
        
        // Ensure database is created with schema
        Console.WriteLine("Ensuring database is created...");
        context.Database.EnsureDeleted(); // Delete existing database to ensure clean state
        context.Database.EnsureCreated();
        Console.WriteLine("Database created successfully.");
        
        // Verify database connection and schema
        try
        {
            var userCount = context.Users.Count();
            Console.WriteLine($"Found {userCount} users in the database.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error verifying database schema: {ex.Message}");
            throw;
        }
        
        // Seed admin user if no users exist
        if (!context.Users.Any())
        {
            Console.WriteLine("No users found. Seeding admin user...");
            var adminUser = new SimpleReact.API.Models.User
            {
                Username = "admin",
                Email = "admin@example.com",
                FirstName = "Admin",
                LastName = "User",
                IsActive = true,
                Roles = new List<string> { "Admin" }
            };
            
            var result = authService.RegisterUserAsync(adminUser, "Admin123!").Result;
            if (result != null)
            {
                Console.WriteLine("Admin user seeded successfully.");
            }
            else
            {
                Console.WriteLine("Failed to seed admin user.");
            }
        }
        else
        {
            Console.WriteLine("Admin user already exists.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error initializing database: {ex.Message}");
        Console.WriteLine(ex.StackTrace);
        throw;
    }
}

app.Run();
