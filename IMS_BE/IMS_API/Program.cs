
using DotNetEnv;
using IMS.Infrastructure;
using IMS.Infrastructure.DependencyInjection;
using IMS.Infrastructure.Persistence;
using IMS.Infrastructure.Settings;
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
            builder.Services.Configure<MailSetting>(builder.Configuration.GetSection("MailSettings"));

            builder.Services.AddControllers();

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("MainMentor", policy => policy.RequireRole("Mentor")
                .RequireClaim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name", "Lê Thị Khánh Linh", "Nguyễn Thị Hà")); 
            });

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

            app.UseCors("CorsPolicy");
            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
