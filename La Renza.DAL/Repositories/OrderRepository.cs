using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.EF;

namespace La_Renza.DAL.Repositories
{
    public class OrderRepository : IRepository<Order>
    {
        private LaRenzaContext db;

        public OrderRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<Order>> GetAll()
        {
            return await db.Order
                .Include(o => o.User)
                .Include(o => o.Address)
                .Include(o => o.Coupon)
                .ToListAsync();
        }

        public async Task<Order> Get(int id)
        {
            var orders = await db.Order
                .Include(o => o.User)
                .Include(o => o.Address)
                .Include(o => o.Coupon)
                .Where(a => a.Id == id)
                .ToListAsync();
            Order? order = orders?.FirstOrDefault();
            return order!;
        }

        public async Task<Order> Get(string orderName)
        {
            var orders = await db.Order
                .Include(o => o.User)
                .Include(o => o.Address)
                .Include(o => o.Coupon)
                .Where(a => a.OrderName == orderName)
                .ToListAsync();
            Order? order = orders?.FirstOrDefault();
            return order!;
        }

        public async Task Create(Order order)
        {
            await db.Order.AddAsync(order);
        }

        public void Update(Order order)
        {
            db.Entry(order).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Order? order = await db.Order.FindAsync(id);
            if (order != null)
                db.Order.Remove(order);
        }


        public async Task<bool> Exists(int id)
        {
            return await db.Order.AnyAsync(order => order.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.Order.AnyAsync();
        }
    }
}
