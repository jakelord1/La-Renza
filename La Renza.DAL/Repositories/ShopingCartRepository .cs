using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.EF;

namespace La_Renza.DAL.Repositories
{
    public class ShopingCartRepository : IRepository<ShopingCart>
    {
        private LaRenzaContext db;

        public ShopingCartRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<ShopingCart>> GetAll()
        {
            return await db.ShopingCarts
                .Include(sc => sc.User)   
                .Include(sc => sc.Product) 
                .ToListAsync();
        }

        public async Task<ShopingCart> Get(int id)
        {
            var shoppingCartItems = await db.ShopingCarts
                .Include(sc => sc.User)
                .Include(sc => sc.Product)
                .Where(sc => sc.Id == id).ToListAsync();

            ShopingCart? shopingCart = shoppingCartItems?.FirstOrDefault();
            return shopingCart!;
        }

        public async Task<ShopingCart> Get(string email)
        {
            var shoppingCartItems = await db.ShopingCarts
           .Include(sc => sc.User)
           .Include(sc => sc.Product)
           .Where(sc => sc.User.Email == email).ToListAsync();

            ShopingCart? shopingCart = shoppingCartItems?.FirstOrDefault();
            return shopingCart!;
        }

     
        public async Task Create(ShopingCart shopingCart)
        {
            await db.ShopingCarts.AddAsync(shopingCart);
        }

        public void Update(ShopingCart shopingCart)
        {
            db.Entry(shopingCart).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            ShopingCart? shopingCart = await db.ShopingCarts.FindAsync(id);
            if (shopingCart != null)
                db.ShopingCarts.Remove(shopingCart);
        }

        public async Task<bool> Exists(int id)
        {
            return await db.ShopingCarts.AnyAsync(shopingCart => shopingCart.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.ShopingCarts.AnyAsync();
        }
    }
}
