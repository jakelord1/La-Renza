using Microsoft.EntityFrameworkCore;
using La_Renza.BLL.Entities;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.EF;

namespace La_Renza.BLL.Repositories
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
            return await db.InvoiceInfo
                .Include(i => i.User) 
                .ToListAsync();
        }

        public async Task<InvoiceInfo> Get(int id)
        {
            var invoiceInfos = await db.InvoiceInfo
                .Include(i => i.User) 
                .Where(i => i.Id == id)
                .ToListAsync();
            InvoiceInfo? invoiceInfo = invoiceInfos?.FirstOrDefault();
            return invoiceInfo!;
        }

        public async Task<InvoiceInfo> Get(string fullName)
        {
            var invoiceInfos = await db.InvoiceInfo
                .Where(i => i.FullName == fullName)
                .ToListAsync();
            InvoiceInfo? invoiceInfo = invoiceInfos?.FirstOrDefault();
            return invoiceInfo!;
        }

        public async Task Create(InvoiceInfo invoiceInfo)
        {
            await db.InvoiceInfo.AddAsync(invoiceInfo);
        }

        public void Update(InvoiceInfo invoiceInfo)
        {
            db.Entry(invoiceInfo).State = EntityState.Modified;
        }

        public async Task Delete(int id)
        {
            InvoiceInfo? invoiceInfo = await db.InvoiceInfo.FindAsync(id);
            if (invoiceInfo != null)
                db.InvoiceInfo.Remove(invoiceInfo);
        }

        public async Task<bool> Exists(int id)
        {
            return await db.InvoiceInfo.AnyAsync(invoiceInfo => invoiceInfo.Id == id);
        }

        public async Task<bool> Any()
        {
            return await db.InvoiceInfo.AnyAsync();
        }
    }
}
