using La_Renza.BLL.EF;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL
{
    public static class ContextExtensions
    {
        public static void AddLaRenzaContext(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<LaRenzaContext>(options =>
                options.UseMySQL(connectionString));
        }
    }
}
