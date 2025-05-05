using La_Renza.BLL.DTO;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace La_Renza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponsController : ControllerBase
    {
        private readonly ICouponService _couponService;
     
        public CouponsController(ICouponService couponService)
        {
            _couponService=couponService;
        }
        // GET: api/Coupons
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CouponDTO>>> GetCoupons()
        {
            return Ok();
        }

        // GET: api/Coupons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CouponDTO>> GetCoupon(int id)
        {
            return Ok();
        }

        // PUT: api/Coupons
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCoupon(int id, CouponDTO coupon)
        {
            return Ok();
        }

        // POST: api/Coupons
        [HttpPost]
        public async Task<ActionResult<CouponDTO>> PostCoupon(CouponDTO coupon)
        {
            return Ok();
        }

        // DELETE: api/Coupons/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoupon(int id)
        {
            return Ok();
        }

    }

}
