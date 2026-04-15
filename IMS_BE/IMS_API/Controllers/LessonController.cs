using IMS.Application.DTOs.ManageLesson;
using IMS.Application.Interfaces.Services;
using IMS.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonController : ControllerBase
    {
        private readonly ILessonService _lessonService;

        public LessonController (ILessonService lessonService)
        {
            _lessonService = lessonService;
        }


        [Authorize(Policy = "MainMentor")]
        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] CreateLessonRequest request, CancellationToken cancellationToken)
        {
            try
            {
                await _lessonService.AddAsync(request, cancellationToken);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("track/{trackId}")]
        public async Task<IActionResult> GetLessonsByTrackAsync(int trackId)
        {
            var lessons = await _lessonService.GetLessonsByTrackAsync(trackId);

            return Ok(lessons);
        }

        [Authorize(Policy = "MainMentor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(int id, 
            UpdateLessonRequest request,
            CancellationToken cancellationToken)
        {
            var result = await _lessonService.UpdateAsync(id, request, cancellationToken);
            if(!result.Success)
                return Conflict(result.Message);

            return Ok(result);
        }

        [Authorize(Policy = "MainMentor")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id, CancellationToken cancellationToken)
        {

            var result = await _lessonService.DeleteAsync(id, cancellationToken);
            if(!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }
    }
}
