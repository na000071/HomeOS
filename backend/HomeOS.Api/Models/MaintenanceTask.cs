using System.ComponentModel.DataAnnotations;

namespace HomeOS.Api.Models;

public class MaintenanceTask
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public Guid? ApplianceId { get; set; }

    public Appliance? Appliance { get; set; }

    [Required]
    [MaxLength(100)]
    public string Room { get; set; } = string.Empty;

    public DateTime DueDate { get; set; }

    [Required]
    [MaxLength(50)]
    public string Frequency { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    public DateTime? LastCompletedDate { get; set; }

    public DateTime NextDueDate { get; set; }

    [Required]
    [MaxLength(50)]
    public string Priority { get; set; } = string.Empty;

    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();

    public ICollection<Reminder> Reminders { get; set; } = new List<Reminder>();
}