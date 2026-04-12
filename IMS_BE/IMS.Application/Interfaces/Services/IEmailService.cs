using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Application.Interfaces.Services
{
    public interface IEmailService
    {
        Task<string> SendMailAsync(string to, string subject, string body);
    }
}
