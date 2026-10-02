using System.ComponentModel.DataAnnotations;

namespace HomeOS.Api.Models;

public class Document
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string FileType { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string FileName { get; set; } = string.Empty;

    public DateTime DateAdded { get; set; }

    public string? Description { get; set; }

    public Guid? ApplianceId { get; set; }

    public Appliance? Appliance { get; set; }

    public Guid? ExpenseId { get; set; }

    public Expense? Expense { get; set; }

    public string? Notes { get; set; }
}