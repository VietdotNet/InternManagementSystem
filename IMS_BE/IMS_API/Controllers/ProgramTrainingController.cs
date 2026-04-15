using IMS.Application.DTOs.ProgramTraning;
using IMS.Application.Interfaces.Services;
using IMS.Infrastructure;
using IMS.Infrastructure.Services;
using IMS_API;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgramTrainingController : ControllerBase
    {
        private readonly IProgramTrainingService _programTrainingService;
        private readonly IUserService _userService;
        private readonly UserManager<AppUser> _userManager;

        public ProgramTrainingController(
            IProgramTrainingService programTrainingService,
            IUserService userService,
            UserManager<AppUser> userManager)
        {
            _programTrainingService = programTrainingService;
            _userService = userService;
            _userManager = userManager;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var program = await _programTrainingService.GetByIdAsync(id);
            if (program == null) 
                return NotFound();

            return Ok(program);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllProgramsAsync()
        {
            var programs = await _programTrainingService.GetAllProgramAsync();
            return Ok(programs);
        }

        [Authorize(Roles = "Mentor")]
        [HttpGet("by-mentor")]
        public async Task<IActionResult> GetProgramsByMentorAsync()
        {
            var mentorId =  _userManager.GetUserId(User);
            if(mentorId == null)
                return Unauthorized();

            var programs = await _programTrainingService.GetProgramsByMentorIdAsync(mentorId);

            return Ok(programs);
        }

        [Authorize(Roles = "Mentor")]
        [HttpGet("details/{id}")]
        public async Task<IActionResult> DetailAsync(int id)
        {
            var result = await _programTrainingService.GetProgramDetailAsync(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateProgramTrainingAsync(
            CreateProgramTrainingRequest request, 
            CancellationToken cancellationToken)
        {
             await _programTrainingService.CreateAsync(request, cancellationToken);

            return NoContent();
        }

        [HttpGet("{programId}/tracks")]
        public async Task<IActionResult> GetTracksByProgramAsync(int programId)
        {
            var tracks = await _programTrainingService.GetTracksByProgramAsync(programId);

            return Ok(tracks);
        }

        [Authorize(Roles ="Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> CloseProgramAsync(int id)
        {
            try
            {
                await _programTrainingService.CloseProgramAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
