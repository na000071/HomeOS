using System.ComponentModel.DataAnnotations;

namespace HomeOS.Api.DTOs;

public class MaintenanceTaskDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? ApplianceId { get; set; }
    public string Room { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public string Frequency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? LastCompletedDate { get; set; }
    public DateTime NextDueDate { get; set; }
    public string Priority { get; set; } = string.Empty;
}

public class CreateMaintenanceTaskDto
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }
    public Guid? ApplianceId { get; set; }

    [Required]
    [StringLength(100)]
    public string Room { get; set; } = string.Empty;

    public DateTime DueDate { get; set; }

    [Required]
    [StringLength(50)]
    public string Frequency { get; set; } = string.Empty;

    public DateTime? LastCompletedDate { get; set; }
    public DateTime NextDueDate { get; set; }

    [Required]
    [StringLength(50)]
    public string Priority { get; set; } = string.Empty;
}

public class UpdateMaintenanceTaskDto : CreateMaintenanceTaskDto
{
    [Required]
    public Guid Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Status { get; set; } = string.Empty;
}