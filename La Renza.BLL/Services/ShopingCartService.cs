using La_Renza.BLL.DTO;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.BLL.Infrastructure;
using La_Renza.BLL.Interfaces;
using AutoMapper;

namespace La_Renza.BLL.Services
{
    public class ShopingCartService : IShopingCartService
    {
        IUnitOfWork Database { get; set; }
        private readonly IMapper _mapper;

        public ShopingCartService(IUnitOfWork uow, IMapper mapper)
        {
            Database = uow;
            _mapper = mapper;
        }

        public async Task CreateShopingCart(ShopingCartDTO shopingCartDto)
        {
            var shopingCart = new ShoppingCart
            {
                Id = shopingCartDto.Id,
                UserId = shopingCartDto.UserId,
                ProductId = shopingCartDto.ProductId,
                Quantity = shopingCartDto.Quantity

            };
            await Database.ShopingCarts.Create(shopingCart);
            await Database.Save();
        }

        public async Task UpdateShopingCart(ShopingCartDTO shopingCartDto)
        {
            var shopingCart = new ShoppingCart
            {
                Id = shopingCartDto.Id,
                UserId = shopingCartDto.UserId,
                ProductId = shopingCartDto.ProductId,
                Quantity = shopingCartDto.Quantity

            };
            Database.ShopingCarts.Update(shopingCart);
            await Database.Save();
        }

        public async Task DeleteShopingCart(int id)
        {
            await Database.ShopingCarts.Delete(id);
            await Database.Save();
        }

        public async Task<ShopingCartDTO> GetShopingCart(int id)
        {
            var shopingCart = await Database.ShopingCarts.Get(id);
            if (shopingCart == null)
                throw new ValidationException("Wrong shoping cart!", "");
            return new ShopingCartDTO
            {
                Id = shopingCart.Id,
                UserId = shopingCart.UserId,
                ProductId = shopingCart.ProductId,
                Quantity = shopingCart.Quantity
            };
        }

   
        public async Task<IEnumerable<ShopingCartDTO>> GetShopingCarts()
        {
            return _mapper.Map<IEnumerable<ShoppingCart>, IEnumerable<ShopingCartDTO>>(await Database.ShopingCarts.GetAll());
        }

        public async Task<bool> ExistsShopingCart(int id)
        {
            return await Database.ShopingCarts.Exists(id);
        }

    }
}
