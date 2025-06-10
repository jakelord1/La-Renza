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
    public class UserService: IUserService
    {
        IUnitOfWork Database { get; set; }
        private readonly IMapper _mapper;
        public UserService(IUnitOfWork uow, PasswordHasher hash, IMapper mapper)
        {
            Database = uow;
            _mapper = mapper;
        }

        public async Task CreateUser(UserDTO userDto)
        {
            var user = new User
            {
                Id = userDto.Id,
                Email = userDto.Email,
                PhoneNumber = userDto.PhoneNumber,
                FullName = userDto.FullName,
                SurName = userDto.SurName,
                BirthDate = userDto.BirthDate,
                Gender = userDto.Gender,
                Password = userDto.Password,
                NewsOn = userDto.NewsOn,
                LaRenzaPoints = userDto.LaRenzaPoints,
                Addresses = new List<Address>(),
                Invoices = new List<InvoiceInfo>(),
                Cupon = new List<Coupon>(),
                Product = new List<Product>()
    };
            await Database.Users.Create(user);
            await Database.Save();
        }

        public async Task UpdateUser(UserDTO userDto)
        {
            var user = await Database.Users.Get(userDto.Id);
            if (user == null)
                throw new Exception("User not found");
            user.Id = userDto.Id;
            user.Email = userDto.Email;
            user.PhoneNumber = userDto.PhoneNumber;
            user.FullName = userDto.FullName;
            user.SurName = userDto.SurName;
            user.BirthDate = userDto.BirthDate;
            user.Gender = userDto.Gender;
            user.Password = userDto.Password;
            user.NewsOn = userDto.NewsOn;
            user.LaRenzaPoints = userDto.LaRenzaPoints;
            if (userDto.Addresses != null)
                user.Addresses = _mapper.Map<ICollection<Address>>(userDto.Addresses);

            if (userDto.Invoices != null)
                user.Invoices = _mapper.Map<ICollection<InvoiceInfo>>(userDto.Invoices);

            if (userDto.Cupons != null)
                user.Cupon = _mapper.Map<ICollection<Coupon>>(userDto.Cupons);

            if (userDto.FavoriteProducts != null)
                user.Product = _mapper.Map<ICollection<Product>>(userDto.FavoriteProducts);
            //var user = new User
            //{
            //    Id = userDto.Id,
            //    Email = userDto.Email,
            //    PhoneNumber = userDto.PhoneNumber,
            //    FullName = userDto.FullName,
            //    SurName = userDto.SurName,
            //    BirthDate = userDto.BirthDate,
            //    Gender = userDto.Gender,
            //    Password = Hasher.HashPassword(userDto.Password),
            //    NewsOn = userDto.NewsOn,
            //    Addresses = _mapper.Map<ICollection<Address>>(userDto.Addresses),
            //    Invoices = _mapper.Map<ICollection<InvoiceInfo>>(userDto.Invoices)
            //};
            //Database.Users.Update(user);
            await Database.Save();
        }

        public async Task DeleteUser(int id)
        {
            await Database.Users.Delete(id);
            await Database.Save();
        }

        public async Task<UserDTO> GetUser(int id)
        {
            var user = await Database.Users.Get(id);
            if (user == null)
                throw new ValidationException("Wrong user!", "");

            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                SurName = user.SurName,
                BirthDate = user.BirthDate,
                Gender = user.Gender,
                Password = user.Password,
                NewsOn = user.NewsOn,
                LaRenzaPoints = user.LaRenzaPoints,
                Addresses = _mapper.Map<List<AddressDTO>>(user.Addresses),
                Invoices = _mapper.Map<List<InvoiceInfoDTO>>(user.Invoices),
                Cupons = _mapper.Map<List<CouponDTO>>(user.Cupon),
                FavoriteProducts = _mapper.Map<List<ProductDTO>>(user.Product)
            };
        }

        public async Task<IEnumerable<UserDTO>> GetUsers()
        {
            return _mapper.Map<IEnumerable<User>, IEnumerable<UserDTO>>(await Database.Users.GetAll());
        }

        public async Task<bool> ExistsUser(int id)
        {
            return await Database.Users.Exists(id);
        }

        public async Task<UserDTO> GetUserByLogin(string login)
        {
            var user = await Database.Users.Get(login);
            if (user == null)
                throw new ValidationException("Wrong user!", "");

            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                SurName = user.SurName,
                BirthDate = user.BirthDate,
                Gender = user.Gender,
                Password = user.Password,
                NewsOn = user.NewsOn,
                LaRenzaPoints = user.LaRenzaPoints,
                Addresses = _mapper.Map<List<AddressDTO>>(user.Addresses),
                Invoices = _mapper.Map<List<InvoiceInfoDTO>>(user.Invoices),
                Cupons = _mapper.Map<List<CouponDTO>>(user.Cupon),
                FavoriteProducts = _mapper.Map<List<ProductDTO>>(user.Product)
            };
        }

        public async Task<bool> AnyUsers()
        {
            return await Database.Users.Any();
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
