using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;
using Microsoft.Extensions.DependencyInjection;
using System.IO;

namespace La_Renza.BLL
{
    public static class BLLServiceCollectionExtensions
    {
        public static IServiceCollection AddLaRenzaBLL(this IServiceCollection services)
        {
            var configPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "La Renza.DAL", "Data", "configurator.json");
            services.AddSingleton<IConfiguratorService>(provider => new ConfiguratorService(configPath));
            return services;
        }
    }
}
