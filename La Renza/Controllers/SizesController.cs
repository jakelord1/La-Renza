using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SizesController : ControllerBase
    {
        private readonly ISizeService _sizeService;

        public SizesController(ISizeService sizeService)
        {
            _sizeService = sizeService;

        }
        // GET: api/Sizes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SizeDTO>>> GetSizes()
        {
            var sizes = await _sizeService.GetSizes();
            return Ok(sizes);
        }

        // GET: api/Sizes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SizeDTO>> GetSize(int id)
        {
            SizeDTO size = await _sizeService.GetSize((int)id);

            if (size == null)
            {
                return NotFound();
            }
            return new ObjectResult(size);
        }

        // PUT: api/Sizes/5
        [HttpPut]
        public async Task<IActionResult> PutSize(SizeDTO size)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _sizeService.ExistsSize(size.Id))
            {
                return NotFound();
            }
            await _sizeService.UpdateSize(size);
            return Ok(size);
        }

        // POST: api/Sizes
        [HttpPost]
        public async Task<ActionResult<SizeDTO>> PostSize(SizeDTO size)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _sizeService.CreateSize(size);
            return Ok(size);
        }

        // DELETE: api/Sizes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSize(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            SizeDTO size = await _sizeService.GetSize((int)id);

            if (size == null)
            {
                return NotFound();
            }

            await _sizeService.DeleteSize(id);

            return Ok(size);
        }
    }
}
