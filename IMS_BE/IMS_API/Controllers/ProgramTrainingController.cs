using IMS.Application.DTOs.ProgramTraning;
using IMS.Application.Interfaces.Services;
using IMS.Infrastructure.Services;
using IMS_API;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgramTrainingController : ControllerBase
    {
        private readonly IProgramTrainingService _programTrainingService;
        private readonly IUserService _userService;

        public ProgramTrainingController(
            IProgramTrainingService programTrainingService,
            IUserService userService)
        {
            _programTrainingService = programTrainingService;
            _userService = userService;
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
