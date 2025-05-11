using La_Renza.DAL.EF;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.DAL
{
    public static class DALServiceCollectionExtensions
    {
        public static void AddLaRenzaDAL(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<LaRenzaContext>(options =>
                options.UseSqlServer(connectionString));
        }
    }
}
