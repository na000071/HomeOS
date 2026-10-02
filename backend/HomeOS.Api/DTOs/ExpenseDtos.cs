using System.ComponentModel.DataAnnotations;

namespace HomeOS.Api.DTOs;

public class ExpenseDto
{
    public Guid Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public Guid? ApplianceId { get; set; }
    public Guid? MaintenanceTaskId { get; set; }
    public string? Notes { get; set; }
}

public class CreateExpenseDto
{
    [Required]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Description { get; set; } = string.Empty;

    [Range(typeof(decimal), "0.01", "1000000000")]
    public decimal Amount { get; set; }

    public DateTime Date { get; set; }
    public Guid? ApplianceId { get; set; }
    public Guid? MaintenanceTaskId { get; set; }
    public string? Notes { get; set; }
}

public class UpdateExpenseDto : CreateExpenseDto
{
    [Required]
    public Guid Id { get; set; }
}