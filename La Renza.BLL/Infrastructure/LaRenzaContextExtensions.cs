using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.EF;


namespace La_Renza.BLL.Infrastructure
{
    public static class LaRenzaContextExtensions
    {
        public static void AddLaRenzaContext(this IServiceCollection services, string connection)
        {
            services.AddDbContext<LaRenzaContext>(options => options.UseMySQL(connection));
        }
    }
}
