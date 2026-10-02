using HomeOS.Api.Data;
using HomeOS.Api.DTOs;
using HomeOS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeOS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppliancesController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public AppliancesController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplianceDto>>> GetAll(CancellationToken cancellationToken)
    {
        var appliances = await _dbContext.Appliances
            .AsNoTracking()
            .Select(appliance => ToDto(appliance))
            .ToListAsync(cancellationToken);

        return Ok(appliances);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApplianceDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var appliance = await _dbContext.Appliances
            .AsNoTracking()
            .SingleOrDefaultAsync(currentAppliance => currentAppliance.Id == id, cancellationToken);

        return appliance is null ? NotFound() : Ok(ToDto(appliance));
    }

    [HttpPost]
    public async Task<ActionResult<ApplianceDto>> Create(
        CreateApplianceDto applianceDto,
        CancellationToken cancellationToken)
    {
        var appliance = new Appliance
        {
            Id = Guid.NewGuid(),
            Name = applianceDto.Name,
            Brand = applianceDto.Brand,
            Model = applianceDto.Model,
            RoomId = applianceDto.RoomId,
            Warranty = applianceDto.Warranty,
            PurchaseDate = applianceDto.PurchaseDate,
            Category = applianceDto.Category,
            SerialNumber = applianceDto.SerialNumber,
            PurchasePrice = applianceDto.PurchasePrice,
            Notes = applianceDto.Notes,
        };

        _dbContext.Appliances.Add(appliance);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = appliance.Id }, ToDto(appliance));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateApplianceDto applianceDto,
        CancellationToken cancellationToken)
    {
        if (id != applianceDto.Id)
        {
            return BadRequest("The route ID must match the appliance ID.");
        }

        var appliance = await _dbContext.Appliances
            .SingleOrDefaultAsync(currentAppliance => currentAppliance.Id == id, cancellationToken);

        if (appliance is null)
        {
            return NotFound();
        }

        appliance.Name = applianceDto.Name;
        appliance.Brand = applianceDto.Brand;
        appliance.Model = applianceDto.Model;
        appliance.RoomId = applianceDto.RoomId;
        appliance.Warranty = applianceDto.Warranty;
        appliance.PurchaseDate = applianceDto.PurchaseDate;
        appliance.Category = applianceDto.Category;
        appliance.SerialNumber = applianceDto.SerialNumber;
        appliance.PurchasePrice = applianceDto.PurchasePrice;
        appliance.Notes = applianceDto.Notes;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var appliance = await _dbContext.Appliances
            .SingleOrDefaultAsync(currentAppliance => currentAppliance.Id == id, cancellationToken);

        if (appliance is null)
        {
            return NotFound();
        }

        _dbContext.Appliances.Remove(appliance);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private static ApplianceDto ToDto(Appliance appliance) => new()
    {
        Id = appliance.Id,
        Name = appliance.Name,
        Brand = appliance.Brand,
        Model = appliance.Model,
        RoomId = appliance.RoomId,
        Warranty = appliance.Warranty,
        PurchaseDate = appliance.PurchaseDate,
        Category = appliance.Category,
        SerialNumber = appliance.SerialNumber,
        PurchasePrice = appliance.PurchasePrice,
        Notes = appliance.Notes,
    };
}