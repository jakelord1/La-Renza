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
        // GET: api/InvoiceInfos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceInfoDTO>>> GetInvoiceInfos()
        {
            var invoiceInfos = await _imageService.GetImages();
            return Ok(invoiceInfos);
        }

        // GET: api/InvoiceInfos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceInfoDTO>> GetInvoiceInfo(int id)
        {
            ImageDTO image = await _imageService.GetImage((int)id);

            if (image == null)
            {
                return NotFound();
            }
            return new ObjectResult(image);
        }

        // PUT: api/InvoiceInfos
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoiceInfo(int id, ImageDTO image)
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

        // POST: api/InvoiceInfos
        [HttpPost]
        public async Task<ActionResult<InvoiceInfoDTO>> PostInvoiceInfo(ImageDTO image)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _imageService.CreateImage(image);
            return Ok(image);
        }

        // DELETE: api/InvoiceInfos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoiceInfo(int id)
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
