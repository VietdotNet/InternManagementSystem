using Microsoft.AspNetCore.Identity;

namespace IMS.Infrastructure
{
    public class AppUser : IdentityUser
    {
        public string FullName { get; set; }
    }
}
