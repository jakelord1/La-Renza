using La_Renza.DAL.Entities;

namespace La_Renza.BLL.Interfaces
{
    /// <summary>
    /// Сервіс для роботи з конфігурацією (CRUD)
    /// </summary>
    public interface IConfiguratorService
    {
        Task<IEnumerable<ConfiguratorItem>> GetAll();
        Task<ConfiguratorItem?> Get(int id);
        Task Create(ConfiguratorItem item);
        Task Update(ConfiguratorItem item);
        Task Delete(int id);
    }
}
