using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.EF;

namespace La_Renza.DAL.Repositories
{
    public class OrderItemRepository : IRepository<OrderItem>
    {
        private LaRenzaContext db;

        public OrderItemRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<OrderItem>> GetAll()
        {
            return await db.OrderItem
                .Include(o => o.Product) 
                .Include(o => o.Order)    
                .ToListAsync();
        }

        public async Task<OrderItem> Get(int id)
        {
            var orderItems = await db.OrderItem
                .Include(o => o.Product)
                .Include(o => o.Order)
                .Where(a => a.Id == id)
                .ToListAsync();
            OrderItem? orderItem = orderItems?.FirstOrDefault();
            return orderItem!;
        }
        public async Task<OrderItem> Get(string name)
        {
            var orderItems = await db.OrderItem
                  .Include(o => o.Product)
                  .Include(o => o.Order)
                  .Where(o => o.Order.OrderName == name)
                  .ToListAsync();
            OrderItem? orderItem = orderItems?.FirstOrDefault();
            return orderItem!;
        }


        public async Task Create(OrderItem orderItem)
        {
            await db.OrderItem.AddAsync(orderItem);
        }

        public void Update(OrderItem orderItem)
        {
            db.Entry(orderItem).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            OrderItem? orderItem = await db.OrderItem.FindAsync(id);
            if (orderItem != null)
                db.OrderItem.Remove(orderItem);
        }
        public async Task<bool> Exists(int id)
        {
            return await db.OrderItem.AnyAsync(ordIt => ordIt.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.OrderItem.AnyAsync();
        }
    }
}


  