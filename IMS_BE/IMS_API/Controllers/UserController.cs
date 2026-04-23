using IMS.Application.DTOs.ManageUser;
using IMS.Application.Interfaces.Services;
using IMS.Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Ocsp;
using System.Security.Claims;

namespace IMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize(Roles ="Admin")]
        [HttpPost("interns")]
        public async Task<IActionResult> CreateInternAsync([FromBody] CreateInternRequest request, CancellationToken cancellationToken)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var result = await _userService.CreateInternAsync(request, baseUrl, cancellationToken);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);

        }

        [Authorize(Roles ="Admin")]
        [HttpPost("mentors")]
        public async Task<IActionResult> CreateMentorAsync([FromBody] CreateMentorRequest request)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var result = await _userService.CreateMentorAsync(request, baseUrl);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);

        }

        [Authorize(Roles ="Admin")]
        [HttpGet("mentors")]
        public async Task<IActionResult> GetAllMentorsAsync()
        {
            var mentors = await _userService.GetAllMentorsAsync();
            return Ok(mentors);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{internId}")]
        public async Task<IActionResult> DeactivateInternAsync(
            string internId, 
            CancellationToken cancellationToken)
        {
            var result = await _userService.DeactivateInternAsync(internId, cancellationToken);
            if (!result.Success)
                return NotFound(result.Message);

            return Ok(result);
        }
    }
}
