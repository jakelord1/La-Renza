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
    public class ImageController : ControllerBase
    {
        private readonly IImageService _imageService;
        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }
        // GET: api/Images
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ImageDTO>>> GetImages()
        {
            var invoiceInfos = await _imageService.GetImages();
            return Ok(invoiceInfos);
        }

        // GET: api/Images/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ImageDTO>> GetImage(int id)
        {
            ImageDTO image = await _imageService.GetImage((int)id);

            if (image == null)
            {
                return NotFound();
            }
            return new ObjectResult(image);
        }

        // PUT: api/Images
        [HttpPut("{id}")]
        public async Task<IActionResult> PutImage(int id, ImageDTO image)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (await _imageService.GetImage(image.Id) == null)
            {
                return NotFound();
            }

            await _imageService.UpdateImage(image);
            return Ok(image);
        }

        // POST: api/Images
        [HttpPost]
        public async Task<ActionResult<ImageDTO>> PostImage(ImageDTO image)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _imageService.CreateImage(image);
            return Ok(image);
        }

        // DELETE: api/Images/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImage(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ImageDTO iamge = await _imageService.GetImage((int)id);

            if (iamge == null)
            {
                return NotFound();
            }

            await _imageService.DeleteImage(id);

            return Ok(iamge);
        }
    }
}
