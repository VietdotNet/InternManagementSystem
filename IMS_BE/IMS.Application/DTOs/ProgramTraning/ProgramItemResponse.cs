using IMS.Application.DTOs.ManageUser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.DTOs.ProgramTraning
{
    public class ProgramItemResponse
    {
        public int ProgramId { get; set; }
        public string ProgramName { get; set; } = null!;
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public bool IsClosed { get; set; }
        public int InternCount { get; set; }
        public int MentorCount { get; set; }
        public List<string> Tracks { get; set; } = null!;
        public List<MentorResponse> Mentors { get; set; }
    }
}
