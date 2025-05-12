using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;
using La_Renza.DAL.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColorsController : ControllerBase
    {
        private readonly IColorService _colorService;
        public ColorsController(IColorService colorService)
        {
            _colorService = colorService;
        }
        // GET: api/Colors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ColorDTO>>> GetColors()
        {
            var colors = await _colorService.GetColors();
            return Ok(colors);
        }

        // GET: api/Colors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ColorDTO>> GetColor(int id)
        {
            ColorDTO color = await _colorService.GetColor((int)id);

            if (color == null)
            {
                return NotFound();
            }
            return new ObjectResult(color);
        }

        // PUT: api/Colors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutColor(int id, ColorDTO color)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (await _colorService.GetColor(color.Id) == null)
            {
                return NotFound();
            }

            await _colorService.UpdateColor(color);
            return Ok(color);
        }

        // POST: api/Colors
        [HttpPost]
        public async Task<ActionResult<ColorDTO>> PostColor(ColorDTO color)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _colorService.CreateColor(color);
            return Ok(color);
        }

        // DELETE: api/Colors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColor(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ColorDTO color = await _colorService.GetColor((int)id);

            if (color == null)
            {
                return NotFound();
            }

            await _colorService.DeleteColor(id);

            return Ok(color);
        }
    }
}
