using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.DAL.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingCartsController : ControllerBase
    {
        private readonly IShopingCartService _shopingCartService;
        public ShoppingCartsController(IShopingCartService shopingCartService)
        {
            _shopingCartService = shopingCartService;
        }
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

        [HttpGet("CurrentUser")]
        public async Task<ActionResult<IEnumerable<ShopingCartDTO>>> GetCurrentUserShopingCart()
        {
            int id = int.Parse(HttpContext.Session.GetString("UserId"));
            ShopingCartDTO shopingCart = await _shopingCartService.GetShopingCart((int)id);

            if (shopingCart == null)
            {
                return NotFound();
            }
            return new ObjectResult(shopingCart);
        }
        // PUT: api/ShopingCart/5
        [HttpPut]
        public async Task<IActionResult> PutShopingCart(ShopingCartDTO cart)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _shopingCartService.ExistsShopingCart(cart.Id))
            {
                return NotFound();
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
    }
}
