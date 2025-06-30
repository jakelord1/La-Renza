using Microsoft.EntityFrameworkCore;
using La_Renza.BLL.EF;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Entities;


namespace La_Renza.BLL.Repositories
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
            return await db.Coupon
                .Include(c => c.User)
                .Include(c => c.Orders)
                .ToListAsync();
        }

        public async Task<Coupon> Get(int id)
        {
            Coupon? coupon = await db.Coupon.FindAsync(id);
            return coupon!;
        }

        public async Task<Coupon> Get(string name)
        {
            var coupons = await db.Coupon
                .Include(c => c.User)
                .Include(c => c.Orders).Where(a => a.Name == name).ToListAsync();
            Coupon? coupon = coupons?.FirstOrDefault();
            return coupon!;
        }

        public async Task Create(Coupon coupon)
        {
            await db.Coupon.AddAsync(coupon);
        }

        public void Update(Coupon coupon)
        {
            db.Entry(coupon).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Coupon? coupon = await db.Coupon.FindAsync(id);
            if (coupon != null)
                db.Coupon.Remove(coupon);
        }
        public async Task<bool> Exists(int id)
        {
            return await db.Coupon.AnyAsync(coupon => coupon.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.Coupon.AnyAsync();
        }
    }
}
