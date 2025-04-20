using La_Renza.DAL.EF;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.Entities;

namespace La_Renza.DAL.Repositories
{
 
    public class EFUnitOfWork : IUnitOfWork
    {
        private LaRenzaContext db;


        public EFUnitOfWork(LaRenzaContext context)
        {
            db = context;
        }

        public async Task Save()
        {
            await db.SaveChangesAsync();
        }
       
    }
}