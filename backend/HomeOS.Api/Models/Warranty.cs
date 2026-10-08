using System.ComponentModel.DataAnnotations;

namespace HomeOS.Api.Models;

public class Warranty
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // Nullable for legacy rows created before ownership was introduced.
    public string? UserId { get; set; }

    public Guid? ApplianceId { get; set; }

    public Appliance? Appliance { get; set; }

    [Required]
    [MaxLength(150)]
    public string Provider { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string WarrantyType { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    [Required]
    public string Coverage { get; set; } = string.Empty;

    public string? Notes { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    public ICollection<Reminder> Reminders { get; set; } = new List<Reminder>();
}