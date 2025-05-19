using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.EF;

namespace La_Renza.DAL.Repositories
{
    public class AddressRepository : IRepository<Address>
    {
        private LaRenzaContext db;

        public AddressRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<Address>> GetAll()
        {
            return await db.Address.ToListAsync();
        }

        public async Task<Address> Get(int id)
        {
            Address? address = await db.Address.FindAsync(id);
            return address!;
        }

        public async Task<Address> Get(string fullName)
        {
            var addresses = await db.Address.Where(a => a.FullName == fullName).ToListAsync();
            Address? address = addresses?.FirstOrDefault();
            return address!;
        }

        public async Task Create(Address address)
        {
            await db.Address.AddAsync(address);
        }

        public void Update(Address address)
        {
            db.Entry(address).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            Address? address = await db.Address.FindAsync(id);
            if (address != null)
                db.Address.Remove(address);
        }


        public async Task<bool> Exists(int id)
        {
            return await db.Address.AnyAsync(address => address.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.Address.AnyAsync();
        }
    }
}
