using Microsoft.Extensions.Options;

namespace HomeOS.Api.Email;

public class DevelopmentFileEmailSender : IEmailSender
{
    private readonly IWebHostEnvironment _environment;
    private readonly EmailOptions _options;

    public DevelopmentFileEmailSender(
        IWebHostEnvironment environment,
        IOptions<EmailOptions> options)
    {
        _environment = environment;
        _options = options.Value;
    }

    public async Task SendPasswordResetAsync(
        string recipientEmail,
        string resetLink,
        CancellationToken cancellationToken)
    {
        var directory = Path.GetFullPath(Path.Combine(_environment.ContentRootPath, _options.StoragePath));
        Directory.CreateDirectory(directory);

        var fileName = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}-{Guid.NewGuid():N}.eml";
        var path = Path.Combine(directory, fileName);
        var content = $"To: {recipientEmail}{Environment.NewLine}Subject: Reset your HomeOS password{Environment.NewLine}{Environment.NewLine}Use this link to reset your password:{Environment.NewLine}{resetLink}{Environment.NewLine}";

        await File.WriteAllTextAsync(path, content, cancellationToken);
    }
}
