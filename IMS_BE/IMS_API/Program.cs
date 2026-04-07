
using DotNetEnv;
using IMS.Infrastructure;
using IMS.Infrastructure.DependencyInjection;
using IMS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;

namespace IMS_API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            Env.Load();

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddInfrastructure(builder.Configuration);

            builder.Configuration.AddEnvironmentVariables();

            builder.Services.AddControllers();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;

                await SeedData.SeedRoles(
                    services.GetRequiredService<RoleManager<IdentityRole>>());

                await SeedData.SeedAdmin(
                    services.GetRequiredService<UserManager<AppUser>>());
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
