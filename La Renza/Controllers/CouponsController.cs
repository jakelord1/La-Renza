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
            var coupons = await _couponService.GetCoupons();
            return Ok(coupons);
        }

        // GET: api/Coupons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CouponDTO>> GetCoupon(int id)
        {
            CouponDTO coupon = await _couponService.GetCoupon((int)id);

            if (coupon == null)
            {
                return NotFound();
            }
            return new ObjectResult(coupon);
        }

        // PUT: api/Coupons
        [HttpPut]
        public async Task<IActionResult> PutCoupon(CouponDTO coupon)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _couponService.ExistsCoupon(coupon.Id))
            {
                return NotFound();
            }
            await _couponService.UpdateCoupon(coupon);
            return Ok(coupon);
        }

        // POST: api/Coupons
        [HttpPost]
        public async Task<ActionResult<CouponDTO>> PostCoupon(CouponDTO coupon)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _couponService.CreateCoupon(coupon);
            return Ok(coupon);
        }

        // DELETE: api/Coupons/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoupon(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            CouponDTO coupon = await _couponService.GetCoupon((int)id);

            if (coupon == null)
            {
                return NotFound();
            }

            await _couponService.DeleteCoupon(id);

            return Ok(coupon);
        }

    }

}
