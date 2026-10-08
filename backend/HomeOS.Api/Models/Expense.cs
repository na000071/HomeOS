using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace HomeOS.Api.Models;

public class Expense
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // Nullable for legacy rows created before ownership was introduced.
    public string? UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Description { get; set; } = string.Empty;

    [Precision(18, 2)]
    public decimal Amount { get; set; }

    public DateTime Date { get; set; }

    public Guid? ApplianceId { get; set; }

    public Appliance? Appliance { get; set; }

    public Guid? MaintenanceTaskId { get; set; }

    public MaintenanceTask? MaintenanceTask { get; set; }

    public string? Notes { get; set; }

    public ICollection<Document> Documents { get; set; } = new List<Document>();

    public ICollection<Reminder> Reminders { get; set; } = new List<Reminder>();
}