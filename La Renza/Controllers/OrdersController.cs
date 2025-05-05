using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;
using Microsoft.AspNetCore.Mvc;

namespace La_Renza.Controllers
{
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IShopingCartService _shopingCartService;
        private readonly IDeliveryMethodService _deliveryMethodService;
        private readonly IOrderItemService _orderItemService;


        public OrdersController(IOrderService orderService, IShopingCartService shopingCartService,IDeliveryMethodService deliveryMethodService,IOrderItemService orderItemService)
        {
            _orderService = orderService;
            _orderService = orderService;
            _shopingCartService = shopingCartService;
            _deliveryMethodService = deliveryMethodService;
            _orderItemService = orderItemService;
        }
        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders()
        {
            return Ok();
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id)
        {
            return Ok();
        }

        // PUT: api/Orders
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, OrderDTO order)
        {
            return Ok();
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<ActionResult<OrderDTO>> PostOrder(OrderDTO order)
        {
            return Ok();
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            return Ok();
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // GET: api/ShopingCart
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShopingCartDTO>>> GetShopingCarts()
        {
            return Ok(); 
        }

        // GET: api/ShopingCart/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShopingCartDTO>> GetShopingCart(int id)
        {
            return Ok();
        }

        // PUT: api/ShopingCart/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShopingCart(int id, ShopingCartDTO cart)
        {
            return Ok();
        }

        // POST: api/ShopingCart
        [HttpPost]
        public async Task<ActionResult<ShopingCartDTO>> PostShopingCart(ShopingCartDTO cart)
        {
            return Ok(); 
        }

        // DELETE: api/ShopingCart/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShopingCart(int id)
        {
            return Ok(); 
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////
        // GET: api/DeliveryMethod
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeliveryMethodDTO>>> GetDeliveryMethods()
        {
            return Ok();
        }

        // GET: api/DeliveryMethod/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DeliveryMethodDTO>> GetDeliveryMethod(int id)
        {
            return Ok();
        }

        // PUT: api/DeliveryMethod/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeliveryMethod(int id, DeliveryMethodDTO method)
        {
            return Ok(); 
        }

        // POST: api/DeliveryMethod
        [HttpPost]
        public async Task<ActionResult<DeliveryMethodDTO>> PostDeliveryMethod(DeliveryMethodDTO method)
        {
            return Ok(); 
        }

        // DELETE: api/DeliveryMethod/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeliveryMethod(int id)
        {
            return Ok(); 
        }
        ////////////////////////////////////////////////////////////////////////////////////////
        // GET: api/OrderItem
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderItemDTO>>> GetOrderItems()
        {
            return Ok(); 
        }

        // GET: api/OrderItem/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItemDTO>> GetOrderItem(int id)
        {
            return Ok(); 
        }

        // PUT: api/OrderItem/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderItem(int id, OrderItemDTO item)
        {
            return Ok(); 
        }

        // POST: api/OrderItem
        [HttpPost]
        public async Task<ActionResult<OrderItemDTO>> PostOrderItem(OrderItemDTO item)
        {
            return Ok();
        }

        // DELETE: api/OrderItem/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderItem(int id)
        {
            return Ok(); 
        }
    }
}
