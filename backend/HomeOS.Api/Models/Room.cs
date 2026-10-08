using System.ComponentModel.DataAnnotations;

namespace HomeOS.Api.Models;

public class Room
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // Nullable for legacy rows created before ownership was introduced.
    public string? UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    [MaxLength(100)]
    public string Type { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Icon { get; set; }

    public ICollection<Appliance> Appliances { get; set; } = new List<Appliance>();
}