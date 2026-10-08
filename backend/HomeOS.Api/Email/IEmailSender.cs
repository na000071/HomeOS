namespace HomeOS.Api.Email;

public interface IEmailSender
{
    Task SendPasswordResetAsync(
        string recipientEmail,
        string resetLink,
        CancellationToken cancellationToken);
}
