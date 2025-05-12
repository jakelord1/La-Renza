using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeliveryMethodsController : ControllerBase
    {
        private readonly IDeliveryMethodService _deliveryMethodService;
        public DeliveryMethodsController(IDeliveryMethodService deliveryMethodService)
        {
            _deliveryMethodService = deliveryMethodService;
        }
        // GET: api/DeliveryMethod
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeliveryMethodDTO>>> GetDeliveryMethods()
        {
            var methods = await _deliveryMethodService.GetDeliveryMethods();
            return Ok(methods);
        }

        // GET: api/DeliveryMethod/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DeliveryMethodDTO>> GetDeliveryMethod(int id)
        {
            DeliveryMethodDTO method = await _deliveryMethodService.GetDeliveryMethod(id);
            if (method == null)
            {
                return NotFound();
            }
            return Ok(method);
        }

        // PUT: api/DeliveryMethod/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeliveryMethod(int id, DeliveryMethodDTO method)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _deliveryMethodService.UpdateDeliveryMethod(method);
            return Ok(method);
        }

        // POST: api/DeliveryMethod
        [HttpPost]
        public async Task<ActionResult<DeliveryMethodDTO>> PostDeliveryMethod(DeliveryMethodDTO method)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _deliveryMethodService.CreateDeliveryMethod(method);
            return Ok(method);
        }

        // DELETE: api/DeliveryMethod/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeliveryMethod(int id)
        {
            DeliveryMethodDTO method = await _deliveryMethodService.GetDeliveryMethod(id);
            if (method == null)
            {
                return NotFound();
            }
            await _deliveryMethodService.DeleteDeliveryMethod(id);
            return Ok(method);
        }
    }
}
