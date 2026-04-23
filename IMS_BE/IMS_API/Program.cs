
using DotNetEnv;
using IMS.Infrastructure;
using IMS.Infrastructure.DependencyInjection;
using IMS.Infrastructure.Persistence;
using IMS.Infrastructure.Services;
using IMS.Infrastructure.Settings;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;

namespace IMS_API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            if (File.Exists(".env"))
            {
                Env.Load();
            }

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddInfrastructure(builder.Configuration);

            builder.Configuration.AddEnvironmentVariables();
            builder.Services.Configure<MailSetting>(builder.Configuration.GetSection("MailSettings"));

            builder.Services.AddControllers();

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("MainMentor", policy => policy.RequireRole("Mentor")
                .RequireClaim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name", "Lê Thị Khánh Linh", "Nguyễn Thị Hà")); 
            });

            builder.Services.AddHostedService<SeedHostedService>();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders =
                    ForwardedHeaders.XForwardedProto |
                    ForwardedHeaders.XForwardedFor
            });


            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();


            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseRouting();

            app.MapGet("/health", () => Results.Ok("Healthy")).AllowAnonymous();
            app.MapGet("/", () => Results.Ok("IMS API Running")).AllowAnonymous();

            app.UseCors("CorsPolicy");

            //app.UseStaticFiles();

            app.UseAuthentication();
            app.UseAuthorization();

            app.Map("/error", () => Results.Problem());


            app.MapControllers();

            app.Run();
        }
    }
}
