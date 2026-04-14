using IMS.Application.Interfaces.Persistence;
using IMS.Application.Interfaces.Repositories;
using IMS.Application.Interfaces.Services;
using IMS.Infrastructure.Extensions;
using IMS.Infrastructure.Repositories;
using IMS.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IMS.Infrastructure.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddIdentityConfiguration(configuration)
                    .AddJwtAuthentication(configuration)
                    .AddCorsPolicy(configuration);


            // repositories
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>(); 
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IProgramTrainingRepository, ProgramTrainingRepository>();

            // services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IProgramTrainingService, ProgramTrainingService>();

            services.AddTransient<IEmailService, EmailService>();

            return services;
        }
    }
}
