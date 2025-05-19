using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.EF;

namespace La_Renza.DAL.Repositories
{
    public class ShopingCartRepository : IRepository<ShoppingCart>
    {
        private LaRenzaContext db;

        public ShopingCartRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<ShoppingCart>> GetAll()
        {
            return await db.ShoppingCart
                .Include(sc => sc.User)   
                .Include(sc => sc.Product) 
                .ToListAsync();
        }

        public async Task<ShoppingCart> Get(int id)
        {
            var shoppingCartItems = await db.ShoppingCart
                .Include(sc => sc.User)
                .Include(sc => sc.Product)
                .Where(sc => sc.Id == id).ToListAsync();

            ShoppingCart? shopingCart = shoppingCartItems?.FirstOrDefault();
            return shopingCart!;
        }

        public async Task<ShoppingCart> Get(string email)
        {
            var shoppingCartItems = await db.ShoppingCart
           .Include(sc => sc.User)
           .Include(sc => sc.Product)
           .Where(sc => sc.User.Email == email).ToListAsync();

            ShoppingCart? shopingCart = shoppingCartItems?.FirstOrDefault();
            return shopingCart!;
        }

     
        public async Task Create(ShoppingCart shopingCart)
        {
            await db.ShoppingCart.AddAsync(shopingCart);
        }

        public void Update(ShoppingCart shopingCart)
        {
            db.Entry(shopingCart).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            ShoppingCart? shopingCart = await db.ShoppingCart.FindAsync(id);
            if (shopingCart != null)
                db.ShoppingCart.Remove(shopingCart);
        }

        public async Task<bool> Exists(int id)
        {
            return await db.ShoppingCart.AnyAsync(shopcarts => shopcarts.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.ShoppingCart.AnyAsync();
        }
    }
}
