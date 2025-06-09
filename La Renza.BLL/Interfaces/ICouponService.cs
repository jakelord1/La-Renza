using La_Renza.BLL.DTO;

namespace La_Renza.BLL.Interfaces
{
    public interface ICouponService 
    {
        Task CreateCoupon(CouponDTO couponDto);
        Task UpdateCoupon(CouponDTO couponDto);
        Task DeleteCoupon(int id);
        Task<CouponDTO> GetCoupon(int id);
        Task<IEnumerable<CouponDTO>> GetCouponsByUserId(int userId);
        Task<IEnumerable<CouponDTO>> GetCoupons();
        Task<bool> ExistsCoupon(int id);
    }
}
