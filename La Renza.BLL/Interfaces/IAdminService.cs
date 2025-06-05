using La_Renza.BLL.DTO;

namespace La_Renza.BLL.Interfaces
{
    public interface IAdminService
    {
        Task CreateAdmin(AdminDTO adminDto);
        Task UpdateAdmin(AdminDTO adminDto);
        Task DeleteAdmin(int id);
        Task<AdminDTO> GetAdmin(int id);
        Task<IEnumerable<AdminDTO>> GetAdmins();
        Task<AdminDTO> GetAdminByLogin(string login);
        Task<bool> ExistsAdmin(int id);
        Task<bool> AnyAdmins();
    }
}
