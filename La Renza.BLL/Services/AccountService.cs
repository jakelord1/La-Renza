using La_Renza.BLL.DTO;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.BLL.Infrastructure;
using La_Renza.BLL.Interfaces;
using AutoMapper;
using System.Runtime.InteropServices;
using La_Renza.DAL.Repositories;

namespace La_Renza.BLL.Services
{
    public class AccountService : IAccountService
    {
        IUnitOfWork Database { get; set; }
        private readonly IMapper _mapper;
        public AccountService(IUnitOfWork uow, PasswordHasher hash, IMapper mapper)
        {
            Database = uow;
            _mapper = mapper;
        }

        public async Task<(bool Success, string? ErrorMessage)> AddCouponToUser(string userEmail, int couponId)
        {
            var user = await Database.Users.Get(userEmail);
            if (user == null)
                return (false, "User not found.");

            var coupon = await Database.Coupons.Get(couponId);
            if (coupon == null)
                return (false, "Coupon not found.");

            if (user.LaRenzaPoints < coupon.Price)
                return (false, "Недостаточно баллов.");


            if (!user.Cupon.Any(c => c.Id == couponId))
            {
                user.Cupon.Add(coupon);
                user.LaRenzaPoints -= coupon.Price;

                Database.Users.Update(user);
                await Database.Save();
            }

            return (true, null);
        }
        public async Task<(bool Success, string? ErrorMessage)> AddFavoriteProductToUser(string userEmail, int productId)
        {
            var user = await Database.Users.Get(userEmail);
            if (user == null)
                return (false, "User not found.");

            if (user.Product.Any(p => p.Id == productId))
                return (false, "Product already in favorites.");

            var product = await Database.Products.Get(productId);
            if (product == null)
                return (false, "Product  not found.");

            user.Product.Add(product);
            Database.Users.Update(user);
            await Database.Save();
           

            return (true, null);
        }

        public async Task<(bool Success, string? ErrorMessage)> AddFavoriteProductsByModelIdToUser(string userEmail, int modelId)
        {
            var user = await Database.Users.Get(userEmail);
            if (user == null)
                return (false, "User not found.");

            var newFavorites = (await Database.Products
              .GetUnfavoritedProductsByModelId(modelId, user.Id))
              .ToList();

            if (!newFavorites.Any())
                return (false, "All products of this model are already in favorites.");

            foreach (var product in newFavorites)
            {
                user.Product.Add(product);
            }

            Database.Users.Update(user);
            await Database.Save();

            return (true, null);
        }

        public async Task<(bool Success, string? ErrorMessage)> AddOrderToUser(string userEmail, OrderDTO orderDto)
        {
            var user = await Database.Users.Get(userEmail);
            if (user == null)
                return (false, "User not found.");

            var order = _mapper.Map<Order>(orderDto);
            order.UserId = user.Id;
            order.User = user;

            await Database.Orders.Create(order);
            await Database.Save();

            return (true, null);
        }
        public async Task<(bool Success, string? ErrorMessage)> RemoveFavoriteProductsByModelId(string userEmail, int modelId)
        {
            var user = await Database.Users.Get(userEmail);
            if (user == null)
                return (false, "User not found.");

            var productsToRemove = (await Database.Products.GetFavoritesByModelId(modelId, user.Id)).ToList();

            if (!productsToRemove.Any())
                return (false, "No products from this model found in favorites.");

            foreach (var product in productsToRemove)
            {
                user.Product.Remove(product);
            }

            Database.Users.Update(user);
            await Database.Save();

            return (true, null);
        }


        public async Task<(bool Success, string? ErrorMessage)> RemoveFavoriteProductFromUser(string userEmail, int productId)
        {
            var user = await Database.Users.Get(userEmail);
            if (user == null)
                return (false, "User not found.");

            var product = user.Product.FirstOrDefault(p => p.Id == productId);
            if (product == null)
                return (false, "Product not found in user's favorites.");

            user.Product.Remove(product);
            Database.Users.Update(user);
            await Database.Save();

            return (true, null);
        }
        public async Task<(bool Success, string? ErrorMessage)> AddProductToCartByColorAndSize(string userEmail, int colorId, int sizeId, int quantity)
        {
            var user = await Database.Users.Get(userEmail);
            if (user == null)
                return (false, "User not found.");

            var product = await Database.Products.GetByColorAndSize(colorId, sizeId);
            if (product == null)
                return (false, "Product not found with the selected model and size.");

            var cartItem = new ShoppingCart
            {
                ProductId = product.Id,
                Quantity = quantity,
                UserId = user.Id
            };

            await Database.ShopingCarts.Create(cartItem);
            await Database.Save();

            return (true, null);
        }

        public async Task<(bool Success, string? ErrorMessage)> RemoveFromCartByUserAndProduct(int userId, int productId)
        {
            var carts = await Database.ShopingCarts.GetAll();
            var cartItem = carts.FirstOrDefault(c => c.UserId == userId && c.ProductId == productId);
            if (cartItem == null)
                return (false, "Cart item not found.");

            await Database.ShopingCarts.Delete(cartItem.Id);
            await Database.Save();

            return (true, null);
        }

    }
}
