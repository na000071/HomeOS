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
public class DocumentsController : UserOwnedControllerBase
{
    private const long MaximumFileSize = 10 * 1024 * 1024;
    private static readonly IReadOnlyDictionary<string, string> AllowedContentTypes =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            [".pdf"] = "application/pdf",
            [".doc"] = "application/msword",
            [".docx"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            [".jpg"] = "image/jpeg",
            [".jpeg"] = "image/jpeg",
            [".png"] = "image/png",
        };

    private readonly ApplicationDbContext _dbContext;
    private readonly IWebHostEnvironment _environment;

    public DocumentsController(ApplicationDbContext dbContext, IWebHostEnvironment environment)
    {
        _dbContext = dbContext;
        _environment = environment;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DocumentDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId)) return Unauthorized();

        var documents = await _dbContext.Documents
            .AsNoTracking()
            .Where(document => document.UserId == userId)
            .Select(document => ToDto(document))
            .ToListAsync(cancellationToken);

        return Ok(documents);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DocumentDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId)) return Unauthorized();

        var document = await _dbContext.Documents
            .AsNoTracking()
            .SingleOrDefaultAsync(currentDocument => currentDocument.Id == id && currentDocument.UserId == userId, cancellationToken);

        return document is null ? NotFound() : Ok(ToDto(document));
    }

    [HttpPost]
    public async Task<ActionResult<DocumentDto>> Create(
        CreateDocumentDto documentDto,
        CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId)) return Unauthorized();

        var referenceError = await ValidateReferences(documentDto, userId, cancellationToken);
        if (referenceError is not null)
        {
            return BadRequest(referenceError);
        }

        var document = new Document
        {
            Id = Guid.NewGuid(),
            UserId = userId,
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

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<DocumentDto>> Upload(
        [FromForm] UploadDocumentDto documentDto,
        CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId)) return Unauthorized();
        if (documentDto.File is null || documentDto.File.Length == 0)
        {
            return BadRequest("A file is required.");
        }
        if (documentDto.File.Length > MaximumFileSize)
        {
            return BadRequest("Files must be 10 MB or smaller.");
        }

        var extension = Path.GetExtension(documentDto.File.FileName);
        if (!AllowedContentTypes.TryGetValue(extension, out var expectedContentType) ||
            !string.Equals(documentDto.File.ContentType, expectedContentType, StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("This file type is not supported.");
        }

        var signatureError = await ValidateFileSignature(documentDto.File, extension, cancellationToken);
        if (signatureError is not null) return BadRequest(signatureError);

        var referenceError = await ValidateReferences(documentDto.ApplianceId, documentDto.ExpenseId, userId, cancellationToken);
        if (referenceError is not null) return BadRequest(referenceError);

        var uploadDirectory = GetUploadDirectory();
        Directory.CreateDirectory(uploadDirectory);

        var storedFileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var storedPath = Path.GetFullPath(Path.Combine(uploadDirectory, storedFileName));
        if (!storedPath.StartsWith(uploadDirectory + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("The file path is invalid.");
        }

        await using (var stream = System.IO.File.Create(storedPath))
        {
            await documentDto.File.CopyToAsync(stream, cancellationToken);
        }

        var now = DateTime.UtcNow;
        var document = new Document
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = documentDto.Name,
            Category = documentDto.Category,
            FileType = extension.TrimStart('.').ToUpperInvariant(),
            FileName = Path.GetFileName(documentDto.File.FileName),
            DateAdded = now,
            CreatedAt = now,
            Description = documentDto.Description,
            ApplianceId = documentDto.ApplianceId,
            ExpenseId = documentDto.ExpenseId,
            Notes = documentDto.Notes,
            StoredFileName = storedFileName,
            ContentType = expectedContentType,
            FileSize = documentDto.File.Length,
            StoragePath = "uploads/documents",
        };

        try
        {
            _dbContext.Documents.Add(document);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch
        {
            System.IO.File.Delete(storedPath);
            throw;
        }

        return CreatedAtAction(nameof(GetById), new { id = document.Id }, ToDto(document));
    }

    [HttpGet("{id:guid}/download")]
    public async Task<IActionResult> Download(Guid id, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId)) return Unauthorized();

        var document = await _dbContext.Documents
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.Id == id && item.UserId == userId, cancellationToken);
        if (document is null) return NotFound();
        if (string.IsNullOrWhiteSpace(document.StoredFileName)) return NotFound("No file attached.");

        var uploadDirectory = GetUploadDirectory();
        var storedPath = Path.GetFullPath(Path.Combine(uploadDirectory, Path.GetFileName(document.StoredFileName)));
        if (!storedPath.StartsWith(uploadDirectory + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase) ||
            !System.IO.File.Exists(storedPath))
        {
            return NotFound("The uploaded file is no longer available.");
        }

        return PhysicalFile(storedPath, document.ContentType ?? "application/octet-stream", document.FileName, enableRangeProcessing: true);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateDocumentDto documentDto,
        CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId)) return Unauthorized();

        if (id != documentDto.Id)
        {
            return BadRequest("The route ID must match the document ID.");
        }

        var document = await _dbContext.Documents
            .SingleOrDefaultAsync(currentDocument => currentDocument.Id == id && currentDocument.UserId == userId, cancellationToken);

        if (document is null)
        {
            return NotFound();
        }

        var referenceError = await ValidateReferences(documentDto, userId, cancellationToken);
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
        if (!TryGetCurrentUserId(out var userId)) return Unauthorized();

        var document = await _dbContext.Documents
            .SingleOrDefaultAsync(currentDocument => currentDocument.Id == id && currentDocument.UserId == userId, cancellationToken);

        if (document is null)
        {
            return NotFound();
        }

        _dbContext.Documents.Remove(document);
        await _dbContext.SaveChangesAsync(cancellationToken);

        DeleteStoredFile(document);

        return NoContent();
    }

    private async Task<string?> ValidateReferences(
        Guid? applianceId,
        Guid? expenseId,
        string userId,
        CancellationToken cancellationToken)
    {
        if (applianceId.HasValue && !await _dbContext.Appliances.AnyAsync(
                appliance => appliance.Id == applianceId.Value && appliance.UserId == userId,
                cancellationToken))
        {
            return "The specified appliance does not exist.";
        }

        if (expenseId.HasValue && !await _dbContext.Expenses.AnyAsync(
                expense => expense.Id == expenseId.Value && expense.UserId == userId,
                cancellationToken))
        {
            return "The specified expense does not exist.";
        }

        return null;
    }

    private async Task<string?> ValidateReferences(
        CreateDocumentDto documentDto,
        string userId,
        CancellationToken cancellationToken)
    {
        return await ValidateReferences(documentDto.ApplianceId, documentDto.ExpenseId, userId, cancellationToken);
    }

    private static async Task<string?> ValidateFileSignature(
        IFormFile file,
        string extension,
        CancellationToken cancellationToken)
    {
        await using var stream = file.OpenReadStream();
        var header = new byte[8];
        var bytesRead = await stream.ReadAsync(header.AsMemory(0, header.Length), cancellationToken);

        if (extension.Equals(".pdf", StringComparison.OrdinalIgnoreCase) &&
            (bytesRead < 4 || System.Text.Encoding.ASCII.GetString(header, 0, 4) != "%PDF"))
            return "The file content does not match PDF format.";
        if ((extension.Equals(".jpg", StringComparison.OrdinalIgnoreCase) || extension.Equals(".jpeg", StringComparison.OrdinalIgnoreCase)) &&
            (bytesRead < 2 || header[0] != 0xFF || header[1] != 0xD8))
            return "The file content does not match JPEG format.";
        if (extension.Equals(".png", StringComparison.OrdinalIgnoreCase) &&
            (bytesRead < 8 || !header.SequenceEqual(new byte[] { 137, 80, 78, 71, 13, 10, 26, 10 })))
            return "The file content does not match PNG format.";
        if (extension.Equals(".doc", StringComparison.OrdinalIgnoreCase) &&
            (bytesRead < 4 || !header.AsSpan(0, 4).SequenceEqual(new byte[] { 0xD0, 0xCF, 0x11, 0xE0 })))
            return "The file content does not match DOC format.";
        if (extension.Equals(".docx", StringComparison.OrdinalIgnoreCase) &&
            (bytesRead < 2 || header[0] != 0x50 || header[1] != 0x4B))
            return "The file content does not match DOCX format.";

        return null;
    }

    private string GetUploadDirectory()
    {
        return Path.GetFullPath(Path.Combine(_environment.ContentRootPath, "uploads", "documents"));
    }

    private void DeleteStoredFile(Document document)
    {
        if (string.IsNullOrWhiteSpace(document.StoredFileName)) return;

        var uploadDirectory = GetUploadDirectory();
        var storedPath = Path.GetFullPath(Path.Combine(uploadDirectory, Path.GetFileName(document.StoredFileName)));
        if (storedPath.StartsWith(uploadDirectory + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase) &&
            System.IO.File.Exists(storedPath))
        {
            System.IO.File.Delete(storedPath);
        }
    }

    private static DocumentDto ToDto(Document document) => new()
    {
        Id = document.Id,
        Name = document.Name,
        Category = document.Category,
        FileType = document.FileType,
        FileName = document.FileName,
        ContentType = document.ContentType,
        FileSize = document.FileSize,
        HasFile = !string.IsNullOrWhiteSpace(document.StoredFileName),
        DateAdded = document.DateAdded,
        Description = document.Description,
        ApplianceId = document.ApplianceId,
        ExpenseId = document.ExpenseId,
        Notes = document.Notes,
    };
}