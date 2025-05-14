using La_Renza.BLL.DTO;

namespace La_Renza.BLL.Interfaces
{
    public interface IShopingCartService
    {
        Task CreateShopingCart(ShopingCartDTO shopingCartDto);
        Task UpdateShopingCart(ShopingCartDTO shopingCartDto);
        Task DeleteShopingCart(int id);
        Task<ShopingCartDTO> GetShopingCart(int id);
        Task<IEnumerable<ShopingCartDTO>> GetShopingCarts();
    }
}

