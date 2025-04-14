using Microsoft.Extensions.DependencyInjection;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.Repositories;

namespace La_Renza.BLL.Infrastructure
{
    public static class UnitOfWorkServiceExtensions
    {
        public static void AddUnitOfWorkService(this IServiceCollection services)
        {
            services.AddScoped<IUnitOfWork, EFUnitOfWork>();
        }
    }
}
