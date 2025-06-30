using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemsController : ControllerBase
    {
        private readonly IOrderItemService _orderItemService;
        public OrderItemsController (IOrderItemService orderItemService)
        {
            _orderItemService = orderItemService;
        }
        // GET: api/OrderItem
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderItemDTO>>> GetOrderItems()
        {
            var items = await _orderItemService.GetOrderItems();
            return Ok(items);
        }

        // GET: api/OrderItem/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItemDTO>> GetOrderItem(int id)
        {
            OrderItemDTO item = await _orderItemService.GetOrderItem(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        // PUT: api/OrderItem/5
        [HttpPut]
        public async Task<IActionResult> PutOrderItem(OrderItemDTO item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _orderItemService.ExistsOrderItem(item.Id))
            {
                return NotFound();
            }
            await _orderItemService.UpdateOrderItem(item);
            return Ok(item);
        }

        // POST: api/OrderItem
        [HttpPost]
        public async Task<ActionResult<OrderItemDTO>> PostOrderItem(OrderItemDTO item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _orderItemService.CreateOrderItem(item);
            return Ok(item);
        }

        // DELETE: api/OrderItem/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderItem(int id)
        {
            OrderItemDTO item = await _orderItemService.GetOrderItem(id);
            if (item == null)
            {
                return NotFound();
            }
            await _orderItemService.DeleteOrderItem(id);
            return Ok(item);
        }
    }
}
