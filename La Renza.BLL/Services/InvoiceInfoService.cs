using La_Renza.BLL.DTO;
using La_Renza.BLL.Entities;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Infrastructure;
using La_Renza.BLL.Interfaces;
using AutoMapper;

namespace La_Renza.BLL.Services
{
    public class InvoiceInfoService : IInvoiceInfoService
    {
        IUnitOfWork Database { get; set; }
        private readonly IMapper _mapper;

        public InvoiceInfoService(IUnitOfWork uow, IMapper mapper)
        {
            Database = uow;
            _mapper = mapper;
        }

        public async Task CreateInvoiceInfo(InvoiceInfoDTO invoiceInfoDto)
        {
            var invoiceInfo = new InvoiceInfo
            {
                Id = invoiceInfoDto.Id,
                UserId = invoiceInfoDto.UserId,
                FullName = invoiceInfoDto.FullName,
                SecondName = invoiceInfoDto.SecondName,
                City = invoiceInfoDto.City,
                PostIndex = invoiceInfoDto.PostIndex,
                Street = invoiceInfoDto.Street,
                HouseNumber = invoiceInfoDto.HouseNumber,
                IsDigital = invoiceInfoDto.IsDigital
            };
            await Database.Invoices.Create(invoiceInfo);
            await Database.Save();
        }

        public async Task UpdateInvoiceInfo(InvoiceInfoDTO invoiceInfoDto)
        {
            var invoiceInfo = new InvoiceInfo
            {
                Id = invoiceInfoDto.Id,
                UserId = invoiceInfoDto.UserId,
                FullName = invoiceInfoDto.FullName,
                SecondName = invoiceInfoDto.SecondName,
                City = invoiceInfoDto.City,
                PostIndex = invoiceInfoDto.PostIndex,
                Street = invoiceInfoDto.Street,
                HouseNumber = invoiceInfoDto.HouseNumber,
                IsDigital = invoiceInfoDto.IsDigital
            };
            Database.Invoices.Update(invoiceInfo);
            await Database.Save();
        }

        public async Task DeleteInvoiceInfo(int id)
        {
            await Database.Invoices.Delete(id);
            await Database.Save();
        }

        public async Task<InvoiceInfoDTO> GetInvoiceInfo(int id)
        {
            var invoiceInfo = await Database.Invoices.Get(id);
            if (invoiceInfo == null)
                throw new ValidationException("Wrong invoices!", "");
            return new InvoiceInfoDTO
            {
                Id = invoiceInfo.Id,
                UserId = invoiceInfo.UserId,
                FullName = invoiceInfo.FullName,
                SecondName = invoiceInfo.SecondName,
                City = invoiceInfo.City,
                PostIndex = invoiceInfo.PostIndex,
                Street = invoiceInfo.Street,
                HouseNumber = invoiceInfo.HouseNumber,
                IsDigital = invoiceInfo.IsDigital,
                User = invoiceInfo.User.Email
            };
        }


        public async Task<IEnumerable<InvoiceInfoDTO>> GetInvoiceInfos()
        {
            return _mapper.Map<IEnumerable<InvoiceInfo>, IEnumerable<InvoiceInfoDTO>>(await Database.Invoices.GetAll());
        }

        public async Task<bool> ExistsInvoiceInfo(int id)
        {
            return await Database.Invoices.Exists(id);
        }

    }
}
