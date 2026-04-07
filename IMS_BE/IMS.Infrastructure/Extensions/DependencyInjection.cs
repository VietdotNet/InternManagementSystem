using IMS.Application.Interfaces.Persistence;
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
                    .AddJwtAuthentication(configuration);


            // repositories
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>(); 

            // services
            services.AddScoped<IAuthService, AuthService>();

            return services;
        }
    }
}
