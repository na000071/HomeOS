using HomeOS.Api.Data;
using HomeOS.Api.DTOs;
using HomeOS.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeOS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WarrantiesController : UserOwnedControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public WarrantiesController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WarrantyDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId)) return Unauthorized();

        var warranties = await _dbContext.Warranties
            .AsNoTracking()
            .Where(warranty => warranty.UserId == userId)
            .Select(warranty => ToDto(warranty))
            .ToListAsync(cancellationToken);

        return Ok(warranties);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<WarrantyDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId)) return Unauthorized();

        var warranty = await _dbContext.Warranties
            .AsNoTracking()
            .SingleOrDefaultAsync(currentWarranty => currentWarranty.Id == id && currentWarranty.UserId == userId, cancellationToken);

        return warranty is null ? NotFound() : Ok(ToDto(warranty));
    }

    [HttpPost]
    public async Task<ActionResult<WarrantyDto>> Create(
        CreateWarrantyDto warrantyDto,
        CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId)) return Unauthorized();

        if (warrantyDto.ApplianceId.HasValue &&
            !await ApplianceExists(warrantyDto.ApplianceId.Value, userId, cancellationToken))
        {
            return BadRequest("The specified appliance does not exist.");
        }

        var warranty = new Warranty
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ApplianceId = warrantyDto.ApplianceId,
            Provider = warrantyDto.Provider,
            WarrantyType = warrantyDto.WarrantyType,
            StartDate = warrantyDto.StartDate,
            EndDate = warrantyDto.EndDate,
            Coverage = warrantyDto.Coverage,
            Notes = warrantyDto.Notes,
            Status = "Active",
        };

        _dbContext.Warranties.Add(warranty);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = warranty.Id },
            ToDto(warranty));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateWarrantyDto warrantyDto,
        CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId)) return Unauthorized();

        if (id != warrantyDto.Id)
        {
            return BadRequest("The route ID must match the warranty ID.");
        }

        var warranty = await _dbContext.Warranties
            .SingleOrDefaultAsync(currentWarranty => currentWarranty.Id == id && currentWarranty.UserId == userId, cancellationToken);

        if (warranty is null)
        {
            return NotFound();
        }

        if (warrantyDto.ApplianceId.HasValue &&
            !await ApplianceExists(warrantyDto.ApplianceId.Value, userId, cancellationToken))
        {
            return BadRequest("The specified appliance does not exist.");
        }

        warranty.ApplianceId = warrantyDto.ApplianceId;
        warranty.Provider = warrantyDto.Provider;
        warranty.WarrantyType = warrantyDto.WarrantyType;
        warranty.StartDate = warrantyDto.StartDate;
        warranty.EndDate = warrantyDto.EndDate;
        warranty.Coverage = warrantyDto.Coverage;
        warranty.Notes = warrantyDto.Notes;
        warranty.Status = warrantyDto.Status;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId)) return Unauthorized();

        var warranty = await _dbContext.Warranties
            .SingleOrDefaultAsync(currentWarranty => currentWarranty.Id == id && currentWarranty.UserId == userId, cancellationToken);

        if (warranty is null)
        {
            return NotFound();
        }

        _dbContext.Warranties.Remove(warranty);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private async Task<bool> ApplianceExists(Guid applianceId, string userId, CancellationToken cancellationToken)
    {
        return await _dbContext.Appliances
            .AnyAsync(appliance => appliance.Id == applianceId && appliance.UserId == userId, cancellationToken);
    }

    private static WarrantyDto ToDto(Warranty warranty) => new()
    {
        Id = warranty.Id,
        ApplianceId = warranty.ApplianceId,
        Provider = warranty.Provider,
        WarrantyType = warranty.WarrantyType,
        StartDate = warranty.StartDate,
        EndDate = warranty.EndDate,
        Coverage = warranty.Coverage,
        Notes = warranty.Notes,
        Status = warranty.Status,
    };
}