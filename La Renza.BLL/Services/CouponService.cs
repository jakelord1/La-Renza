using La_Renza.BLL.DTO;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.BLL.Infrastructure;
using La_Renza.BLL.Interfaces;
using AutoMapper;

namespace La_Renza.BLL.Services
{
    public class CouponService : ICouponService
    {
        IUnitOfWork Database { get; set; }

        public CouponService(IUnitOfWork uow)
        {
            Database = uow;
        }

        public async Task CreateCoupon(CouponDTO couponDto)
        {
            var coupon = new Coupon
            {
                Id = couponDto.Id,
                Name = couponDto.Name,
                Description = couponDto.Description,
                Price = couponDto.Price

            };
            await Database.Coupons.Create(coupon);
            await Database.Save();
        }

        public async Task UpdateCoupon(CouponDTO couponDto)
        {
            var coupon = new Coupon
            {
                Id = couponDto.Id,
                Name = couponDto.Name,
                Description = couponDto.Description,
                Price = couponDto.Price
            };
            Database.Coupons.Update(coupon);
            await Database.Save();
        }

        public async Task DeleteCoupon(int id)
        {
            await Database.Coupons.Delete(id);
            await Database.Save();
        }

        public async Task<CouponDTO> GetCoupon(int id)
        {
            var coupon = await Database.Coupons.Get(id);
            if (coupon == null)
                throw new ValidationException("Wrong coupon!", "");
            return new CouponDTO
            {
                Id = coupon.Id,
                Name = coupon.Name,
                Description = coupon.Description,
                Price = coupon.Price
            };
        }

        public async Task<IEnumerable<CouponDTO>> GetCoupons()
        {
            var mapper = new MapperConfiguration(cfg => cfg.CreateMap<Coupon, CouponDTO>()).CreateMapper();
            return mapper.Map<IEnumerable<Coupon>, IEnumerable<CouponDTO>>(await Database.Coupons.GetAll());
        }

        public async Task<bool> ExistsCoupon(int id)
        {
            return await Database.Coupons.Exists(id);
        }

    }
}
