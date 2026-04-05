using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Domain.Entities
{
    public class ProgramMentor
    {
        public int ProgramTrainingId { get; set; }
        public string UserId { get; set; } = null!;
        public DateTime AssignedAt { get; set; }

        public ProgramTraining ProgramTraining { get; set; } = null!;
    }
}
