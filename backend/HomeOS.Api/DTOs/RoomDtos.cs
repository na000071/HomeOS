using System.ComponentModel.DataAnnotations;

namespace HomeOS.Api.DTOs;

public class RoomDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Icon { get; set; }
}

public class CreateRoomDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    [StringLength(100)]
    public string Type { get; set; } = string.Empty;

    [StringLength(100)]
    public string? Icon { get; set; }
}

public class UpdateRoomDto : CreateRoomDto
{
    [Required]
    public Guid Id { get; set; }
}