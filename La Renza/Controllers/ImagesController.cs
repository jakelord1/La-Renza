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
            var images = await _imageService.GetImages();
            return Ok(images);
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
            return Ok(image);
        }

        [HttpPost]
        public async Task<ActionResult<ImageDTO>> PostImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Файл не загружен.");
            }

            var filePath = Path.Combine("public", file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imageDto = new ImageDTO
            {
                Path = file.FileName
            };

            await _imageService.CreateImage(imageDto);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutImage(int id, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Файл не загружен.");
            }

            if (!await _imageService.ExistsImage(id))
            {
                return NotFound();
            }
            var filePath = Path.Combine("public", file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imageDto = new ImageDTO
            {
                Id = id,
                Path = file.FileName
            };

            await _imageService.UpdateImage(imageDto);
            return Ok();
        }

        // DELETE: api/image/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deleteimage(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ImageDTO image = await _imageService.GetImage((int)id);

            if (image == null)
            {
                return NotFound();
            }
            await _imageService.DeleteImage(id);
            return Ok();
        }
        [NonAction]
        public async Task<byte[]> ConvertToByteArray(IFormFile formFile)
        {
            using (var memoryStream = new MemoryStream())
            {
                await formFile.CopyToAsync(memoryStream);
                return memoryStream.ToArray();
            }
        }

    }
}

