using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.DTOs.ManageUser
{
    public class CreateInternRequest : CreateUserRequest
    {
        public int ProgramId { get; set; }
        public int PositionId { get; set; }
    }
}
