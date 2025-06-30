using Microsoft.EntityFrameworkCore;
using La_Renza.BLL.Entities;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.EF;

namespace La_Renza.BLL.Repositories
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
                .Include(o => o.Delivery)
                .Include(o => o.Cupons)
                .Include(o => o.OrderItems)
                .ToListAsync();
        }

        public async Task<Order> Get(int id)
        {
            var orders = await db.Order
                .Include(o => o.User)
                .Include(o => o.Delivery)
                .Include(o => o.Cupons)
                .Include(o => o.OrderItems)
                .Where(a => a.Id == id)
                .ToListAsync();
            Order? order = orders?.FirstOrDefault();
            return order!;
        }

        public async Task<Order> Get(string orderName)
        {
            var orders = await db.Order
                .Include(o => o.User)
                .Include(o => o.Delivery)
                .Include(o => o.Cupons)
                .Include(o => o.OrderItems)
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
