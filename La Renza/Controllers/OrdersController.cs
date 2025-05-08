using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;
using La_Renza.DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using Mysqlx.Crud;
using Org.BouncyCastle.Asn1.X509;

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
            _shopingCartService = shopingCartService;
            _deliveryMethodService = deliveryMethodService;
            _orderItemService = orderItemService;
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
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, OrderDTO order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
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
        /////////////////////////////////////////////////////////////////////////////////////
        // GET: api/ShopingCart
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShopingCartDTO>>> GetShopingCarts()
        {
            var shopingCarts = await _shopingCartService.GetShopingCarts();
            return Ok(shopingCarts);
        }

        // GET: api/ShopingCart/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShopingCartDTO>> GetShopingCart(int id)
        {
            ShopingCartDTO shopingCart = await _shopingCartService.GetShopingCart((int)id);

            if (shopingCart == null)
            {
                return NotFound();
            }
            return new ObjectResult(shopingCart);
        }

        // PUT: api/ShopingCart/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShopingCart(int id, ShopingCartDTO cart)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _shopingCartService.UpdateShopingCart(cart);
            return Ok(cart);
        }

        // POST: api/ShopingCart
        [HttpPost]
        public async Task<ActionResult<ShopingCartDTO>> PostShopingCart(ShopingCartDTO cart)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _shopingCartService.CreateShopingCart(cart);
            return Ok(cart);
        }

        // DELETE: api/ShopingCart/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShopingCart(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ShopingCartDTO cart = await _shopingCartService.GetShopingCart((int)id);

            if (cart == null)
            {
                return NotFound();
            }

            await _shopingCartService.DeleteShopingCart(id);

            return Ok(cart);
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////
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
        ////////////////////////////////////////////////////////////////////////////////////////
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
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderItem(int id, OrderItemDTO item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
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
