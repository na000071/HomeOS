using System.ComponentModel.DataAnnotations;

namespace HomeOS.Api.DTOs;

public class ReminderDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public Guid? ApplianceId { get; set; }
    public Guid? MaintenanceTaskId { get; set; }
    public Guid? WarrantyId { get; set; }
    public Guid? ExpenseId { get; set; }
}

public class CreateReminderDto
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    [StringLength(50)]
    public string Type { get; set; } = string.Empty;

    public DateTime DueDate { get; set; }

    [Required]
    [StringLength(50)]
    public string Priority { get; set; } = string.Empty;

    public Guid? ApplianceId { get; set; }
    public Guid? MaintenanceTaskId { get; set; }
    public Guid? WarrantyId { get; set; }
    public Guid? ExpenseId { get; set; }
}

public class UpdateReminderDto : CreateReminderDto
{
    [Required]
    public Guid Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Status { get; set; } = string.Empty;
}