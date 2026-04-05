using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Domain.Enums
{
    public enum ReviewStatus
    {
        NotStarted = 0,
        Pending = 1,
        Passed = 2,
        NotPassed = 3,
        Cancelled = 4
    }
}
