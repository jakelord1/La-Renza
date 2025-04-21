using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.EF;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.Entities;


namespace La_Renza.DAL.Repositories
{
    public class CouponRepository : IRepository<Coupon>
    {
        private LaRenzaContext db;

        public CouponRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<Coupon>> GetAll()
        {
            return await db.Coupons.ToListAsync();
        }

        public async Task<Coupon> Get(int id)
        {
            Coupon? coupon = await db.Coupons.FindAsync(id);
            return coupon!;
        }

        public async Task<Coupon> Get(string name)
        {
            var coupons = await db.Coupons.Where(a => a.Name == name).ToListAsync();
            Coupon? coupon = coupons?.FirstOrDefault();
            return coupon!;
        }

        public async Task Create(Coupon coupon)
        {
            await db.Coupons.AddAsync(coupon);
        }

        public void Update(Coupon coupon)
        {
            db.Entry(coupon).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Coupon? coupon = await db.Coupons.FindAsync(id);
            if (coupon != null)
                db.Coupons.Remove(coupon);
        }
    }
}
