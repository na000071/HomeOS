using HomeOS.Api.Data;
using HomeOS.Api.DTOs;
using HomeOS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeOS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public ExpensesController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        var expenses = await _dbContext.Expenses
            .AsNoTracking()
            .Select(expense => ToDto(expense))
            .ToListAsync(cancellationToken);

        return Ok(expenses);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExpenseDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var expense = await _dbContext.Expenses
            .AsNoTracking()
            .SingleOrDefaultAsync(currentExpense => currentExpense.Id == id, cancellationToken);

        return expense is null ? NotFound() : Ok(ToDto(expense));
    }

    [HttpPost]
    public async Task<ActionResult<ExpenseDto>> Create(
        CreateExpenseDto expenseDto,
        CancellationToken cancellationToken)
    {
        var referenceError = await ValidateReferences(expenseDto, cancellationToken);
        if (referenceError is not null)
        {
            return BadRequest(referenceError);
        }

        var expense = new Expense
        {
            Id = Guid.NewGuid(),
            Category = expenseDto.Category,
            Description = expenseDto.Description,
            Amount = expenseDto.Amount,
            Date = expenseDto.Date,
            ApplianceId = expenseDto.ApplianceId,
            MaintenanceTaskId = expenseDto.MaintenanceTaskId,
            Notes = expenseDto.Notes,
        };

        _dbContext.Expenses.Add(expense);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = expense.Id },
            ToDto(expense));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateExpenseDto expenseDto,
        CancellationToken cancellationToken)
    {
        if (id != expenseDto.Id)
        {
            return BadRequest("The route ID must match the expense ID.");
        }

        var expense = await _dbContext.Expenses
            .SingleOrDefaultAsync(currentExpense => currentExpense.Id == id, cancellationToken);

        if (expense is null)
        {
            return NotFound();
        }

        var referenceError = await ValidateReferences(expenseDto, cancellationToken);
        if (referenceError is not null)
        {
            return BadRequest(referenceError);
        }

        expense.Category = expenseDto.Category;
        expense.Description = expenseDto.Description;
        expense.Amount = expenseDto.Amount;
        expense.Date = expenseDto.Date;
        expense.ApplianceId = expenseDto.ApplianceId;
        expense.MaintenanceTaskId = expenseDto.MaintenanceTaskId;
        expense.Notes = expenseDto.Notes;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var expense = await _dbContext.Expenses
            .SingleOrDefaultAsync(currentExpense => currentExpense.Id == id, cancellationToken);

        if (expense is null)
        {
            return NotFound();
        }

        _dbContext.Expenses.Remove(expense);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private async Task<string?> ValidateReferences(
        CreateExpenseDto expenseDto,
        CancellationToken cancellationToken)
    {
        if (expenseDto.ApplianceId.HasValue &&
            !await _dbContext.Appliances.AnyAsync(
                appliance => appliance.Id == expenseDto.ApplianceId.Value,
                cancellationToken))
        {
            return "The specified appliance does not exist.";
        }

        if (expenseDto.MaintenanceTaskId.HasValue &&
            !await _dbContext.MaintenanceTasks.AnyAsync(
                task => task.Id == expenseDto.MaintenanceTaskId.Value,
                cancellationToken))
        {
            return "The specified maintenance task does not exist.";
        }

        return null;
    }

    private static ExpenseDto ToDto(Expense expense) => new()
    {
        Id = expense.Id,
        Category = expense.Category,
        Description = expense.Description,
        Amount = expense.Amount,
        Date = expense.Date,
        ApplianceId = expense.ApplianceId,
        MaintenanceTaskId = expense.MaintenanceTaskId,
        Notes = expense.Notes,
    };
}