using Microsoft.Extensions.Options;
using Rekat.Email;
using Rekat.Helpers;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;

namespace Rekat.Services
{
    public class SendGridEmailSender : IEmailSender
    {
        private readonly AppSettings _appSettings;

        public SendGridEmailSender(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        public async Task<SendEmailResponse> SendEmailAsync(string userEmail, string emailSubject, string message)
        {
            var apiKey = _appSettings.SendGridKey;
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("biuro@rekat.pl", "rekat");
            var subject = emailSubject;
            var to = new EmailAddress(userEmail, "Test");
            var plainTextContent = message;
            var htmlContent = message;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);

            return new SendEmailResponse();
        }
    }
}
