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


    }
}
