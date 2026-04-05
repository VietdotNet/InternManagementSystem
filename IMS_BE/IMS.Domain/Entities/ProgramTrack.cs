using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Domain.Entities
{
    public class ProgramTrack
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ProgramId { get; set; }
        public ProgramTraining ProgramTraining { get; set; } = null!;
        public ICollection<Intern> Interns { get; set; } = new List<Intern>();
        public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
        public ICollection<ReviewRequest> ReviewRequests { get; set; } = new List<ReviewRequest>();
    }
}
