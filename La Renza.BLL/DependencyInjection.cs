using La_Renza.BLL.Infrastructure;
using La_Renza.DAL.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using La_Renza.DAL.Repositories;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;

namespace La_Renza.BLL
{
    public static class DependencyInjection
    {
        public static void AddLaRenzaBLL(this IServiceCollection services)
        {
            services.AddScoped<IDbInitService, DbInitService>();
            services.AddScoped<IUnitOfWork, EFUnitOfWork>();

            services.AddAutoMapper(typeof(MapperProfile));
        }
    }
}
