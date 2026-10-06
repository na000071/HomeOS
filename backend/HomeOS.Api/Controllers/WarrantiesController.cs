using HomeOS.Api.Data;
using HomeOS.Api.DTOs;
using HomeOS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeOS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WarrantiesController : ControllerBase
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
        var warranties = await _dbContext.Warranties
            .AsNoTracking()
            .Select(warranty => ToDto(warranty))
            .ToListAsync(cancellationToken);

        return Ok(warranties);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<WarrantyDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var warranty = await _dbContext.Warranties
            .AsNoTracking()
            .SingleOrDefaultAsync(currentWarranty => currentWarranty.Id == id, cancellationToken);

        return warranty is null ? NotFound() : Ok(ToDto(warranty));
    }

    [HttpPost]
    public async Task<ActionResult<WarrantyDto>> Create(
        CreateWarrantyDto warrantyDto,
        CancellationToken cancellationToken)
    {
        if (warrantyDto.ApplianceId.HasValue &&
            !await ApplianceExists(warrantyDto.ApplianceId.Value, cancellationToken))
        {
            return BadRequest("The specified appliance does not exist.");
        }

        var warranty = new Warranty
        {
            Id = Guid.NewGuid(),
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
        if (id != warrantyDto.Id)
        {
            return BadRequest("The route ID must match the warranty ID.");
        }

        var warranty = await _dbContext.Warranties
            .SingleOrDefaultAsync(currentWarranty => currentWarranty.Id == id, cancellationToken);

        if (warranty is null)
        {
            return NotFound();
        }

        if (warrantyDto.ApplianceId.HasValue &&
            !await ApplianceExists(warrantyDto.ApplianceId.Value, cancellationToken))
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
        var warranty = await _dbContext.Warranties
            .SingleOrDefaultAsync(currentWarranty => currentWarranty.Id == id, cancellationToken);

        if (warranty is null)
        {
            return NotFound();
        }

        _dbContext.Warranties.Remove(warranty);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private async Task<bool> ApplianceExists(Guid applianceId, CancellationToken cancellationToken)
    {
        return await _dbContext.Appliances
            .AnyAsync(appliance => appliance.Id == applianceId, cancellationToken);
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