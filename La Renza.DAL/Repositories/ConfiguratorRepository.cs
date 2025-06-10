using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using La_Renza.DAL.Entities;

namespace La_Renza.DAL.Repositories
{
    public class ConfiguratorRepository
    {
        private readonly string _filePath;
        public ConfiguratorRepository(string filePath)
        {
            _filePath = filePath;
        }

        public async Task<IEnumerable<ConfiguratorItem>> GetAll()
        {
            if (!File.Exists(_filePath))
                return new List<ConfiguratorItem>();
            using var stream = File.OpenRead(_filePath);
            return await JsonSerializer.DeserializeAsync<List<ConfiguratorItem>>(stream) ?? new List<ConfiguratorItem>();
        }

        public async Task<ConfiguratorItem?> Get(int id)
        {
            var items = await GetAll();
            return items.FirstOrDefault(x => x.Id == id);
        }

        public async Task Create(ConfiguratorItem item)
        {
            var items = (await GetAll()).ToList();
            item.Id = items.Count > 0 ? items.Max(x => x.Id) + 1 : 1;
            items.Add(item);
            await SaveAll(items);
        }

        public async Task Update(ConfiguratorItem item)
        {
            var items = (await GetAll()).ToList();
            var idx = items.FindIndex(x => x.Id == item.Id);
            if (idx == -1) return;
            items[idx] = item;
            await SaveAll(items);
        }

        public async Task Delete(int id)
        {
            var items = (await GetAll()).ToList();
            var idx = items.FindIndex(x => x.Id == id);
            if (idx == -1) return;
            items.RemoveAt(idx);
            await SaveAll(items);
        }

        private async Task SaveAll(List<ConfiguratorItem> items)
        {
            using var stream = File.Create(_filePath);
            await JsonSerializer.SerializeAsync(stream, items, new JsonSerializerOptions { WriteIndented = true });
        }
    }
}
