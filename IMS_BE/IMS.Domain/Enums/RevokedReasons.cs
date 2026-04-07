using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Domain.Enums
{
    public static class RevokedReasons
    {
        public const string Logout = "User logged out";
        public const string Replaced = "Replaced by new token";
        public const string Security = "Suspicious activity";
    }
}
