using La_Renza.BLL.DTO;

namespace La_Renza.BLL.Interfaces
{
    public interface IUserService 
    {
        Task CreateUser(UserDTO userDto);
        Task UpdateUser(UserDTO userDto);
        Task DeleteUser(int id);
        Task<UserDTO> GetUser(int id);
        Task<IEnumerable<UserDTO>> GetUsers();
        Task<bool> ExistsUser(int id);
        Task<UserDTO> GetUserByLogin(string login);
        Task<bool> AnyUsers();
        Task<(bool Success, string? ErrorMessage)> AddCouponToUser(string userEmail, int couponId);


    }
}
