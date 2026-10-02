using System.ComponentModel.DataAnnotations;

namespace HomeOS.Api.Models;

public class Reminder
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    [MaxLength(50)]
    public string Type { get; set; } = string.Empty;

    public DateTime DueDate { get; set; }

    [Required]
    [MaxLength(50)]
    public string Priority { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    public Guid? ApplianceId { get; set; }

    public Appliance? Appliance { get; set; }

    public Guid? MaintenanceTaskId { get; set; }

    public MaintenanceTask? MaintenanceTask { get; set; }

    public Guid? WarrantyId { get; set; }

    public Warranty? Warranty { get; set; }

    public Guid? ExpenseId { get; set; }

    public Expense? Expense { get; set; }
}