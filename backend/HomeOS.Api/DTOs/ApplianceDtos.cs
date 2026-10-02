using System.ComponentModel.DataAnnotations;

namespace HomeOS.Api.DTOs;

public class ApplianceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string? Model { get; set; }
    public Guid? RoomId { get; set; }
    public string Warranty { get; set; } = string.Empty;
    public DateTime PurchaseDate { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? SerialNumber { get; set; }
    public decimal PurchasePrice { get; set; }
    public string? Notes { get; set; }
}

public class CreateApplianceDto
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Brand { get; set; } = string.Empty;

    [StringLength(100)]
    public string? Model { get; set; }

    public Guid? RoomId { get; set; }

    [Required]
    [StringLength(50)]
    public string Warranty { get; set; } = string.Empty;

    public DateTime PurchaseDate { get; set; }

    [Required]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty;

    [StringLength(100)]
    public string? SerialNumber { get; set; }

    [Range(typeof(decimal), "0", "1000000000")]
    public decimal PurchasePrice { get; set; }

    public string? Notes { get; set; }
}

public class UpdateApplianceDto : CreateApplianceDto
{
    [Required]
    public Guid Id { get; set; }
}