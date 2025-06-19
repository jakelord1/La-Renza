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
        private readonly IMapper _mapper;
        public CouponService(IUnitOfWork uow, IMapper mapper)
        {
            Database = uow;
            _mapper = mapper;
        }

        public async Task CreateCoupon(CouponDTO couponDto)
        {
            var coupon = new Coupon
            {
                Id = couponDto.Id,
                Name = couponDto.Name,
                Description = couponDto.Description,
                Price = couponDto.Price,
                User = _mapper.Map<ICollection<User>>(couponDto.Users)
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
                Price = couponDto.Price,
                User = couponDto.Users.Count == 0 ? _mapper.Map<ICollection<User>>(new List<User>()) : _mapper.Map<ICollection<User>>(couponDto.Users)
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
        
        public async Task<IEnumerable<CouponDTO>> GetCouponsByUserId(int userId)
        {
            var user = await Database.Users.Get(userId);

            var coupons = user?.Cupon;

         
            return _mapper.Map<IEnumerable<CouponDTO>>(coupons);
        }

        public async Task<IEnumerable<CouponDTO>> GetCoupons()
        {
            var coupons = await Database.Coupons.GetAll();
            return _mapper.Map<IEnumerable<Coupon>, IEnumerable<CouponDTO>>(coupons);

        }

        public async Task<bool> ExistsCoupon(int id)
        {
            return await Database.Coupons.Exists(id);
        }

    }
}
