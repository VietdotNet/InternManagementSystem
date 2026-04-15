using IMS.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.DTOs.ManageUser
{
    public class InternItemResponse
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime? JoinDate { get; set; }
        public InternStatus? Status { get; set; }
    }
}
