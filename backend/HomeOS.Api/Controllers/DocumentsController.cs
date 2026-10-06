using HomeOS.Api.Data;
using HomeOS.Api.DTOs;
using HomeOS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeOS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public DocumentsController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DocumentDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        var documents = await _dbContext.Documents
            .AsNoTracking()
            .Select(document => ToDto(document))
            .ToListAsync(cancellationToken);

        return Ok(documents);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DocumentDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var document = await _dbContext.Documents
            .AsNoTracking()
            .SingleOrDefaultAsync(currentDocument => currentDocument.Id == id, cancellationToken);

        return document is null ? NotFound() : Ok(ToDto(document));
    }

    [HttpPost]
    public async Task<ActionResult<DocumentDto>> Create(
        CreateDocumentDto documentDto,
        CancellationToken cancellationToken)
    {
        var referenceError = await ValidateReferences(documentDto, cancellationToken);
        if (referenceError is not null)
        {
            return BadRequest(referenceError);
        }

        var document = new Document
        {
            Id = Guid.NewGuid(),
            Name = documentDto.Name,
            Category = documentDto.Category,
            FileType = documentDto.FileType,
            FileName = documentDto.FileName,
            DateAdded = documentDto.DateAdded,
            Description = documentDto.Description,
            ApplianceId = documentDto.ApplianceId,
            ExpenseId = documentDto.ExpenseId,
            Notes = documentDto.Notes,
        };

        _dbContext.Documents.Add(document);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = document.Id },
            ToDto(document));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateDocumentDto documentDto,
        CancellationToken cancellationToken)
    {
        if (id != documentDto.Id)
        {
            return BadRequest("The route ID must match the document ID.");
        }

        var document = await _dbContext.Documents
            .SingleOrDefaultAsync(currentDocument => currentDocument.Id == id, cancellationToken);

        if (document is null)
        {
            return NotFound();
        }

        var referenceError = await ValidateReferences(documentDto, cancellationToken);
        if (referenceError is not null)
        {
            return BadRequest(referenceError);
        }

        document.Name = documentDto.Name;
        document.Category = documentDto.Category;
        document.FileType = documentDto.FileType;
        document.FileName = documentDto.FileName;
        document.DateAdded = documentDto.DateAdded;
        document.Description = documentDto.Description;
        document.ApplianceId = documentDto.ApplianceId;
        document.ExpenseId = documentDto.ExpenseId;
        document.Notes = documentDto.Notes;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var document = await _dbContext.Documents
            .SingleOrDefaultAsync(currentDocument => currentDocument.Id == id, cancellationToken);

        if (document is null)
        {
            return NotFound();
        }

        _dbContext.Documents.Remove(document);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private async Task<string?> ValidateReferences(
        CreateDocumentDto documentDto,
        CancellationToken cancellationToken)
    {
        if (documentDto.ApplianceId.HasValue &&
            !await _dbContext.Appliances.AnyAsync(
                appliance => appliance.Id == documentDto.ApplianceId.Value,
                cancellationToken))
        {
            return "The specified appliance does not exist.";
        }

        if (documentDto.ExpenseId.HasValue &&
            !await _dbContext.Expenses.AnyAsync(
                expense => expense.Id == documentDto.ExpenseId.Value,
                cancellationToken))
        {
            return "The specified expense does not exist.";
        }

        return null;
    }

    private static DocumentDto ToDto(Document document) => new()
    {
        Id = document.Id,
        Name = document.Name,
        Category = document.Category,
        FileType = document.FileType,
        FileName = document.FileName,
        DateAdded = document.DateAdded,
        Description = document.Description,
        ApplianceId = document.ApplianceId,
        ExpenseId = document.ExpenseId,
        Notes = document.Notes,
    };
}