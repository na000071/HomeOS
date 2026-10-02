using System.ComponentModel.DataAnnotations;

namespace HomeOS.Api.DTOs;

public class DocumentDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public DateTime DateAdded { get; set; }
    public string? Description { get; set; }
    public Guid? ApplianceId { get; set; }
    public Guid? ExpenseId { get; set; }
    public string? Notes { get; set; }
}

public class CreateDocumentDto
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string FileType { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string FileName { get; set; } = string.Empty;

    public DateTime DateAdded { get; set; }
    public string? Description { get; set; }
    public Guid? ApplianceId { get; set; }
    public Guid? ExpenseId { get; set; }
    public string? Notes { get; set; }
}

public class UpdateDocumentDto : CreateDocumentDto
{
    [Required]
    public Guid Id { get; set; }
}