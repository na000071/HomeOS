using HomeOS.Api.Data;
using HomeOS.Api.DTOs;
using HomeOS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeOS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public RoomsController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoomDto>>> GetAll(CancellationToken cancellationToken)
    {
        var rooms = await _dbContext.Rooms
            .AsNoTracking()
            .Select(room => ToDto(room))
            .ToListAsync(cancellationToken);

        return Ok(rooms);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RoomDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var room = await _dbContext.Rooms
            .AsNoTracking()
            .SingleOrDefaultAsync(currentRoom => currentRoom.Id == id, cancellationToken);

        return room is null ? NotFound() : Ok(ToDto(room));
    }

    [HttpPost]
    public async Task<ActionResult<RoomDto>> Create(
        CreateRoomDto roomDto,
        CancellationToken cancellationToken)
    {
        var room = new Room
        {
            Id = Guid.NewGuid(),
            Name = roomDto.Name,
            Description = roomDto.Description,
            Type = roomDto.Type,
            Icon = roomDto.Icon,
        };

        _dbContext.Rooms.Add(room);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = room.Id }, ToDto(room));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateRoomDto roomDto,
        CancellationToken cancellationToken)
    {
        if (id != roomDto.Id)
        {
            return BadRequest("The route ID must match the room ID.");
        }

        var room = await _dbContext.Rooms
            .SingleOrDefaultAsync(currentRoom => currentRoom.Id == id, cancellationToken);

        if (room is null)
        {
            return NotFound();
        }

        room.Name = roomDto.Name;
        room.Description = roomDto.Description;
        room.Type = roomDto.Type;
        room.Icon = roomDto.Icon;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var room = await _dbContext.Rooms
            .SingleOrDefaultAsync(currentRoom => currentRoom.Id == id, cancellationToken);

        if (room is null)
        {
            return NotFound();
        }

        _dbContext.Rooms.Remove(room);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private static RoomDto ToDto(Room room) => new()
    {
        Id = room.Id,
        Name = room.Name,
        Description = room.Description,
        Type = room.Type,
        Icon = room.Icon,
    };
}