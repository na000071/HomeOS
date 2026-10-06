using HomeOS.Api.Data;
using HomeOS.Api.DTOs;
using HomeOS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeOS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RemindersController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public RemindersController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReminderDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        var reminders = await _dbContext.Reminders
            .AsNoTracking()
            .Select(reminder => ToDto(reminder))
            .ToListAsync(cancellationToken);

        return Ok(reminders);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ReminderDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var reminder = await _dbContext.Reminders
            .AsNoTracking()
            .SingleOrDefaultAsync(currentReminder => currentReminder.Id == id, cancellationToken);

        return reminder is null ? NotFound() : Ok(ToDto(reminder));
    }

    [HttpPost]
    public async Task<ActionResult<ReminderDto>> Create(
        CreateReminderDto reminderDto,
        CancellationToken cancellationToken)
    {
        var referenceError = await ValidateReferences(reminderDto, cancellationToken);
        if (referenceError is not null)
        {
            return BadRequest(referenceError);
        }

        var reminder = new Reminder
        {
            Id = Guid.NewGuid(),
            Title = reminderDto.Title,
            Description = reminderDto.Description,
            Type = reminderDto.Type,
            DueDate = reminderDto.DueDate,
            Priority = reminderDto.Priority,
            Status = "Upcoming",
            ApplianceId = reminderDto.ApplianceId,
            MaintenanceTaskId = reminderDto.MaintenanceTaskId,
            WarrantyId = reminderDto.WarrantyId,
            ExpenseId = reminderDto.ExpenseId,
        };

        _dbContext.Reminders.Add(reminder);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = reminder.Id },
            ToDto(reminder));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateReminderDto reminderDto,
        CancellationToken cancellationToken)
    {
        if (id != reminderDto.Id)
        {
            return BadRequest("The route ID must match the reminder ID.");
        }

        var reminder = await _dbContext.Reminders
            .SingleOrDefaultAsync(currentReminder => currentReminder.Id == id, cancellationToken);

        if (reminder is null)
        {
            return NotFound();
        }

        var referenceError = await ValidateReferences(reminderDto, cancellationToken);
        if (referenceError is not null)
        {
            return BadRequest(referenceError);
        }

        reminder.Title = reminderDto.Title;
        reminder.Description = reminderDto.Description;
        reminder.Type = reminderDto.Type;
        reminder.DueDate = reminderDto.DueDate;
        reminder.Priority = reminderDto.Priority;
        reminder.Status = reminderDto.Status;
        reminder.ApplianceId = reminderDto.ApplianceId;
        reminder.MaintenanceTaskId = reminderDto.MaintenanceTaskId;
        reminder.WarrantyId = reminderDto.WarrantyId;
        reminder.ExpenseId = reminderDto.ExpenseId;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var reminder = await _dbContext.Reminders
            .SingleOrDefaultAsync(currentReminder => currentReminder.Id == id, cancellationToken);

        if (reminder is null)
        {
            return NotFound();
        }

        _dbContext.Reminders.Remove(reminder);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private async Task<string?> ValidateReferences(
        CreateReminderDto reminderDto,
        CancellationToken cancellationToken)
    {
        if (reminderDto.ApplianceId.HasValue &&
            !await _dbContext.Appliances.AnyAsync(
                appliance => appliance.Id == reminderDto.ApplianceId.Value,
                cancellationToken))
        {
            return "The specified appliance does not exist.";
        }

        if (reminderDto.MaintenanceTaskId.HasValue &&
            !await _dbContext.MaintenanceTasks.AnyAsync(
                task => task.Id == reminderDto.MaintenanceTaskId.Value,
                cancellationToken))
        {
            return "The specified maintenance task does not exist.";
        }

        if (reminderDto.WarrantyId.HasValue &&
            !await _dbContext.Warranties.AnyAsync(
                warranty => warranty.Id == reminderDto.WarrantyId.Value,
                cancellationToken))
        {
            return "The specified warranty does not exist.";
        }

        if (reminderDto.ExpenseId.HasValue &&
            !await _dbContext.Expenses.AnyAsync(
                expense => expense.Id == reminderDto.ExpenseId.Value,
                cancellationToken))
        {
            return "The specified expense does not exist.";
        }

        return null;
    }

    private static ReminderDto ToDto(Reminder reminder) => new()
    {
        Id = reminder.Id,
        Title = reminder.Title,
        Description = reminder.Description,
        Type = reminder.Type,
        DueDate = reminder.DueDate,
        Priority = reminder.Priority,
        Status = reminder.Status,
        ApplianceId = reminder.ApplianceId,
        MaintenanceTaskId = reminder.MaintenanceTaskId,
        WarrantyId = reminder.WarrantyId,
        ExpenseId = reminder.ExpenseId,
    };
}