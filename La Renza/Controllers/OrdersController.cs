using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;
using La_Renza.DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using Mysqlx.Crud;
using Org.BouncyCastle.Asn1.X509;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders()
        {
            var orders = await _orderService.GetOrders();
            return Ok(orders);
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id)
        {
            OrderDTO order = await _orderService.GetOrder((int)id);

            if (order == null)
            {
                return NotFound();
            }
            return new ObjectResult(order);
        }

        // PUT: api/Orders
        [HttpPut]
        public async Task<IActionResult> PutOrder( OrderDTO order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _orderService.ExistsOrder(order.Id))
            {
                return NotFound();
            }
            await _orderService.UpdateOrder(order);
            return Ok(order);
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<ActionResult<OrderDTO>> PostOrder(OrderDTO order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _orderService.CreateOrder(order);
            return Ok(order);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            OrderDTO order = await _orderService.GetOrder((int)id);

            if (order == null)
            {
                return NotFound();
            }

            await _orderService.DeleteOrder(id);

            return Ok(order);
        }
    }
}
