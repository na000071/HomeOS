using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace HomeOS.Api.Controllers;

public abstract class UserOwnedControllerBase : ControllerBase
{
    protected bool TryGetCurrentUserId(out string userId)
    {
        userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? string.Empty;

        return userId.Length > 0;
    }
}