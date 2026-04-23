using IMS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Infrastructure.Services
{
    public class SeedHostedService : IHostedService
    {
        private readonly IServiceProvider _sp;

        public SeedHostedService(IServiceProvider sp)
        {
            _sp = sp;
        }

        public async Task StartAsync(CancellationToken ct)
        {
            using var scope = _sp.CreateScope();

            try
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

                await SeedData.SeedRoles(roleManager);
                await SeedData.SeedAdmin(userManager);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Seed failed: " + ex);
            }
        }

        public Task StopAsync(CancellationToken ct) => Task.CompletedTask;
    }
}
