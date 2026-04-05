using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Domain.Entities
{
    public class ProgramTraining
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public bool IsClosed { get; set; } = false;
        public ICollection<ProgramTrack> ProgramTracks { get; set; } = new List<ProgramTrack>();
        public ICollection<ProgramMentor> ProgramMentors { get; set; } = new List<ProgramMentor>();
    }
}
