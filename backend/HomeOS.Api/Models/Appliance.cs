using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace HomeOS.Api.Models;

public class Appliance
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Brand { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Model { get; set; }

    public Guid? RoomId { get; set; }

    public Room? Room { get; set; }

    [Required]
    [MaxLength(50)]
    public string Warranty { get; set; } = string.Empty;

    public DateTime PurchaseDate { get; set; }

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? SerialNumber { get; set; }

    [Precision(18, 2)]
    public decimal PurchasePrice { get; set; }

    public string? Notes { get; set; }

    public ICollection<MaintenanceTask> MaintenanceTasks { get; set; } = new List<MaintenanceTask>();

    public ICollection<Warranty> Warranties { get; set; } = new List<Warranty>();

    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();

    public ICollection<Document> Documents { get; set; } = new List<Document>();

    public ICollection<Reminder> Reminders { get; set; } = new List<Reminder>();
}