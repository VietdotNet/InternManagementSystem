using IMS.Application.Interfaces.Services;
using IMS.Infrastructure.Settings;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly MailSetting _mailSettings;
        public EmailService(IOptions<MailSetting> mailSettings)
        {
            _mailSettings = mailSettings.Value;
        }

        public virtual async Task<string> SendMailAsync(string to, string subject, string body)
        {
            var email = new MimeMessage();
            email.Sender = new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail);
            email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail));

            email.To.Add(new MailboxAddress(to, to));
            email.Subject = subject;
            var builder = new BodyBuilder();
            builder.HtmlBody = body;
            email.Body = builder.ToMessageBody();

            using var smtp = new MailKit.Net.Smtp.SmtpClient();

            try
            {
                await smtp.ConnectAsync(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_mailSettings.Mail, _mailSettings.Password);
                await smtp.SendAsync(email);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return "LOI " + ex.Message;
            }


            await smtp.DisconnectAsync(true);
            return "Gui Thanh cong";
        }
    }
}
