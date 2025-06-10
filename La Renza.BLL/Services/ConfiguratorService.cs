using La_Renza.BLL.Interfaces;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Repositories;

namespace La_Renza.BLL.Services
{
    /// <summary>
    /// Реалізація сервісу для роботи з конфігурацією (CRUD, универсальные структуры через JsonElement)
    /// </summary>
    public class ConfiguratorService : IConfiguratorService
    {
        private readonly ConfiguratorRepository _repo;
        public ConfiguratorService(string jsonPath)
        {
            _repo = new ConfiguratorRepository(jsonPath);
        }
        public Task<IEnumerable<ConfiguratorItem>> GetAll() => _repo.GetAll();
        public Task<ConfiguratorItem?> Get(int id) => _repo.Get(id);
        public Task Create(ConfiguratorItem item) => _repo.Create(item);
        public Task Update(ConfiguratorItem item) => _repo.Update(item);
        public Task Delete(int id) => _repo.Delete(id);
    }
}
