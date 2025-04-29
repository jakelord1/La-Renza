using La_Renza.BLL.DTO;

namespace La_Renza.BLL.Interfaces
{
    public interface IInvoiceInfoService
    {
        Task CreateInvoiceInfo(InvoiceInfoDTO invoiceInfoDto);
        Task UpdateInvoiceInfo(InvoiceInfoDTO invoiceInfoDto);
        Task DeleteInvoiceInfo(int id);
        Task<InvoiceInfoDTO> GetInvoiceInfo(int id);
        Task<IEnumerable<InvoiceInfoDTO>> GetInvoiceInfos();
    }
}

