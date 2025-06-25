using La_Renza.BLL.DTO;

namespace La_Renza.BLL.Interfaces
{
    public interface IAccountService
    {
        Task<(bool Success, string? ErrorMessage)> AddCouponToUser(string userEmail, int couponId);
        Task<(bool Success, string? ErrorMessage)> AddFavoriteProductToUser(string email, int productId);
        Task<(bool Success, string? ErrorMessage)> AddFavoriteProductsByModelIdToUser(string userEmail, int modelId);
        Task<(bool Success, string? ErrorMessage)> RemoveFavoriteProductFromUser(string email, int productId);
        Task<(bool Success, string? ErrorMessage)> RemoveFavoriteProductsByModelId(string userEmail, int modelId);
        Task<(bool Success, string? ErrorMessage)> AddOrderToUser(string userEmail, OrderDTO orderDto);
        Task<(bool Success, string? ErrorMessage)> AddProductToCartByColorAndSize(string userEmail, int colorid, int sizeId, int quantity);
        Task<(bool Success, string? ErrorMessage)> RemoveFromCartByUserAndProduct(int userId, int productId);
    }
}
