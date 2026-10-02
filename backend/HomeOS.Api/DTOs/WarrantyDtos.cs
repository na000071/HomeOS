using System.ComponentModel.DataAnnotations;

namespace HomeOS.Api.DTOs;

public class WarrantyDto
{
    public Guid Id { get; set; }
    public Guid? ApplianceId { get; set; }
    public string Provider { get; set; } = string.Empty;
    public string WarrantyType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Coverage { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class CreateWarrantyDto
{
    public Guid? ApplianceId { get; set; }

    [Required]
    [StringLength(150)]
    public string Provider { get; set; } = string.Empty;

    [Required]
    [StringLength(150)]
    public string WarrantyType { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    [Required]
    public string Coverage { get; set; } = string.Empty;

    public string? Notes { get; set; }
}

public class UpdateWarrantyDto : CreateWarrantyDto
{
    [Required]
    public Guid Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Status { get; set; } = string.Empty;
}