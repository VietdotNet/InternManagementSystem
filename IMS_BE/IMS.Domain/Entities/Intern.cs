using IMS.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Domain.Entities
{
    public class Intern
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public int ProgramTrackId { get; set; }
        public InternStatus Status { get; set; }
        public DateTime JoinDate { get; set; }
        public ProgramTrack ProgramTrack { get; set; } = null!;
    }
}
