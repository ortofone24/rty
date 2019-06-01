using System.Threading.Tasks;

namespace Rekat.Email
{
    public interface IEmailSender
    {
        // Sends Email with the given information
        Task<SendEmailResponse> SendEmailAsync(string userEmail, string emailSubject, string message);
    }
}
