using Microsoft.EntityFrameworkCore;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.DAL.EF;

namespace La_Renza.DAL.Repositories
{
    public class InvoiceInfoRepository : IRepository<InvoiceInfo>
    {
        private LaRenzaContext db;

        public InvoiceInfoRepository(LaRenzaContext context)
        {
            this.db = context;
        }

        public async Task<IEnumerable<InvoiceInfo>> GetAll()
        {
            return await db.Invoices
                .Include(i => i.User) 
                .ToListAsync();
        }

        public async Task<InvoiceInfo> Get(int id)
        {
            var invoiceInfos = await db.Invoices
                .Include(i => i.User) 
                .Where(i => i.Id == id)
                .ToListAsync();
            InvoiceInfo? invoiceInfo = invoiceInfos?.FirstOrDefault();
            return invoiceInfo!;
        }

        public async Task<InvoiceInfo> Get(string fullName)
        {
            var invoiceInfos = await db.Invoices
                .Where(i => i.FullName == fullName)
                .ToListAsync();
            InvoiceInfo? invoiceInfo = invoiceInfos?.FirstOrDefault();
            return invoiceInfo!;
        }

        public async Task Create(InvoiceInfo invoiceInfo)
        {
            await db.Invoices.AddAsync(invoiceInfo);
        }

        public void Update(InvoiceInfo invoiceInfo)
        {
            db.Entry(invoiceInfo).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            InvoiceInfo? invoiceInfo = await db.Invoices.FindAsync(id);
            if (invoiceInfo != null)
                db.Invoices.Remove(invoiceInfo);
        }
    }
}
