using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly IImageService _imageService;
        public ImagesController(IImageService imageService)
        {
            _imageService = imageService;
        }
        // GET: api/image
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ImageDTO>>> Getimages()
        {
            var s = await _imageService.GetImages();
            return Ok(s);
        }

        // GET: api/image/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ImageDTO>> Getimage(int id)
        {
            ImageDTO image = await _imageService.GetImage(id);
            if (image == null)
            {
                return NotFound();
            }
            return Ok();
        }

        // PUT: api/image/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Putimage(int id, ImageDTO image)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _imageService.UpdateImage(image);
            return Ok();
        }

        // POST: api/image
        [HttpPost]
        public async Task<ActionResult<ImageDTO>> Postimage(ImageDTO image)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _imageService.CreateImage(image);
            return Ok();
        }

        // DELETE: api/image/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deleteimage(int id)
        {
            ImageDTO image = await _imageService.GetImage(id);
            if (image == null)
            {
                return NotFound();
            }
            await _imageService.DeleteImage(id);
            return Ok();
        }
    }
}