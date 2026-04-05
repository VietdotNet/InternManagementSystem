using IMS.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace IMS.Infrastructure
{
    public class AppUser : IdentityUser
    {
        public string FullName { get; set; } = null!;
        public Intern Intern { get; set; } = null!;
        public ICollection<ProgramMentor> ProgramMentors { get; set; } = new List<ProgramMentor>();
    }
}
