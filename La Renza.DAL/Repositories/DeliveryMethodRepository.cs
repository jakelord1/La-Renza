using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.EF;

namespace La_Renza.DAL.Repositories
{
    public class DeliveryMethodRepository : IRepository<DeliveryMethod>
    {
        private LaRenzaContext db;

        public DeliveryMethodRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<DeliveryMethod>> GetAll()
        {
            return await db.DeliveryMethods
                .Include(o => o.Order)
                .ToListAsync();
        }

        public async Task<DeliveryMethod> Get(int id)
        {
            var deliveryMethods = await db.DeliveryMethods
                .Include(o => o.Order)
                .Where(a => a.Id == id)
                .ToListAsync();
            DeliveryMethod? deliveryMethod = deliveryMethods?.FirstOrDefault();
            return deliveryMethod!;
        }

        public async Task<DeliveryMethod> Get(string deliveryMethodName)
        {
            var deliveryMethods = await db.DeliveryMethods
                .Include(o => o.Order)
                .Where(a => a.Name == deliveryMethodName)
                .ToListAsync();
            DeliveryMethod? deliveryMethod = deliveryMethods?.FirstOrDefault();
            return deliveryMethod!;
        }

        public async Task Create(DeliveryMethod deliveryMethod)
        {
            await db.DeliveryMethods.AddAsync(deliveryMethod);
        }

        public void Update(DeliveryMethod deliveryMethod)
        {
            db.Entry(deliveryMethod).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            DeliveryMethod? deliveryMethod = await db.DeliveryMethods.FindAsync(id);
            if (deliveryMethod != null)
                db.DeliveryMethods.Remove(deliveryMethod);
        }


        public async Task<bool> Exists(int id)
        {
            return await db.DeliveryMethods.AnyAsync(deliveryMethod => deliveryMethod.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.DeliveryMethods.AnyAsync();
        }
    }
}
