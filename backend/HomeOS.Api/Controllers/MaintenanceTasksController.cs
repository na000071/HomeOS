using HomeOS.Api.Data;
using HomeOS.Api.DTOs;
using HomeOS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeOS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaintenanceTasksController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public MaintenanceTasksController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MaintenanceTaskDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        var maintenanceTasks = await _dbContext.MaintenanceTasks
            .AsNoTracking()
            .Select(task => ToDto(task))
            .ToListAsync(cancellationToken);

        return Ok(maintenanceTasks);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<MaintenanceTaskDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var maintenanceTask = await _dbContext.MaintenanceTasks
            .AsNoTracking()
            .SingleOrDefaultAsync(task => task.Id == id, cancellationToken);

        return maintenanceTask is null ? NotFound() : Ok(ToDto(maintenanceTask));
    }

    [HttpPost]
    public async Task<ActionResult<MaintenanceTaskDto>> Create(
        CreateMaintenanceTaskDto maintenanceTaskDto,
        CancellationToken cancellationToken)
    {
        if (maintenanceTaskDto.ApplianceId.HasValue &&
            !await ApplianceExists(maintenanceTaskDto.ApplianceId.Value, cancellationToken))
        {
            return BadRequest("The specified appliance does not exist.");
        }

        var maintenanceTask = new MaintenanceTask
        {
            Id = Guid.NewGuid(),
            Title = maintenanceTaskDto.Title,
            Description = maintenanceTaskDto.Description,
            ApplianceId = maintenanceTaskDto.ApplianceId,
            Room = maintenanceTaskDto.Room,
            DueDate = maintenanceTaskDto.DueDate,
            Frequency = maintenanceTaskDto.Frequency,
            Status = "Upcoming",
            LastCompletedDate = maintenanceTaskDto.LastCompletedDate,
            NextDueDate = maintenanceTaskDto.NextDueDate,
            Priority = maintenanceTaskDto.Priority,
        };

        _dbContext.MaintenanceTasks.Add(maintenanceTask);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = maintenanceTask.Id },
            ToDto(maintenanceTask));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateMaintenanceTaskDto maintenanceTaskDto,
        CancellationToken cancellationToken)
    {
        if (id != maintenanceTaskDto.Id)
        {
            return BadRequest("The route ID must match the maintenance task ID.");
        }

        var maintenanceTask = await _dbContext.MaintenanceTasks
            .SingleOrDefaultAsync(task => task.Id == id, cancellationToken);

        if (maintenanceTask is null)
        {
            return NotFound();
        }

        if (maintenanceTaskDto.ApplianceId.HasValue &&
            !await ApplianceExists(maintenanceTaskDto.ApplianceId.Value, cancellationToken))
        {
            return BadRequest("The specified appliance does not exist.");
        }

        maintenanceTask.Title = maintenanceTaskDto.Title;
        maintenanceTask.Description = maintenanceTaskDto.Description;
        maintenanceTask.ApplianceId = maintenanceTaskDto.ApplianceId;
        maintenanceTask.Room = maintenanceTaskDto.Room;
        maintenanceTask.DueDate = maintenanceTaskDto.DueDate;
        maintenanceTask.Frequency = maintenanceTaskDto.Frequency;
        maintenanceTask.Status = maintenanceTaskDto.Status;
        maintenanceTask.LastCompletedDate = maintenanceTaskDto.LastCompletedDate;
        maintenanceTask.NextDueDate = maintenanceTaskDto.NextDueDate;
        maintenanceTask.Priority = maintenanceTaskDto.Priority;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var maintenanceTask = await _dbContext.MaintenanceTasks
            .SingleOrDefaultAsync(task => task.Id == id, cancellationToken);

        if (maintenanceTask is null)
        {
            return NotFound();
        }

        _dbContext.MaintenanceTasks.Remove(maintenanceTask);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private async Task<bool> ApplianceExists(Guid applianceId, CancellationToken cancellationToken)
    {
        return await _dbContext.Appliances
            .AnyAsync(appliance => appliance.Id == applianceId, cancellationToken);
    }

    private static MaintenanceTaskDto ToDto(MaintenanceTask maintenanceTask) => new()
    {
        Id = maintenanceTask.Id,
        Title = maintenanceTask.Title,
        Description = maintenanceTask.Description,
        ApplianceId = maintenanceTask.ApplianceId,
        Room = maintenanceTask.Room,
        DueDate = maintenanceTask.DueDate,
        Frequency = maintenanceTask.Frequency,
        Status = maintenanceTask.Status,
        LastCompletedDate = maintenanceTask.LastCompletedDate,
        NextDueDate = maintenanceTask.NextDueDate,
        Priority = maintenanceTask.Priority,
    };
}