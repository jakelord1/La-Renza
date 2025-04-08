using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
//using La_Renza.DAL.Entities;

namespace La_Renza.DAL.EF
{   
    public class LaRenzaContext : DbContext
    { 
        public LaRenzaContext(DbContextOptions<LaRenzaContext> options)
                   : base(options)
        {
            //Database.EnsureCreated();
        }
    }

    //add-migration CreateDb
    //update-database
    public class SampleContextFactory : IDesignTimeDbContextFactory<LaRenzaContext>
    {
        public LaRenzaContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<LaRenzaContext>();


            ConfigurationBuilder builder = new ConfigurationBuilder();
            builder.SetBasePath(Directory.GetCurrentDirectory());
            builder.AddJsonFile("appsettings.json");
            IConfigurationRoot config = builder.Build();


            string connectionString = config.GetConnectionString("DefaultConnection");
            optionsBuilder.UseMySQL(connectionString);
            return new LaRenzaContext(optionsBuilder.Options);
        }
    }
}
