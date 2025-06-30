using La_Renza.BLL.DTO;
using La_Renza.BLL.Entities;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Infrastructure;
using La_Renza.BLL.Interfaces;
using AutoMapper;
using ZstdSharp.Unsafe;

namespace La_Renza.BLL.Services
{
    public class DeliveryMethodService : IDeliveryMethodService
    {
        IUnitOfWork Database { get; set; }
        private readonly IMapper _mapper;

        public DeliveryMethodService(IUnitOfWork uow, IMapper mapper)
        {
            Database = uow;
            _mapper = mapper;
        }

        public async Task CreateDeliveryMethod(DeliveryMethodDTO deliveryMethodDto)
        {
            var deliveryMethod = new DeliveryMethod
            {
                Name = deliveryMethodDto.Name,
                DeliveryPrice = deliveryMethodDto.DeliveryPrice

            };
            await Database.DeliveryMethods.Create(deliveryMethod);
            await Database.Save();
        }

        public async Task UpdateDeliveryMethod(DeliveryMethodDTO deliveryMethodDto)
        {
            var deliveryMethod = new DeliveryMethod
            {
                Id = deliveryMethodDto.Id,
                Name = deliveryMethodDto.Name,
                DeliveryPrice = deliveryMethodDto.DeliveryPrice

            };
            Database.DeliveryMethods.Update(deliveryMethod);
            await Database.Save();
        }

        public async Task DeleteDeliveryMethod(int id)
        {
            await Database.DeliveryMethods.Delete(id);
            await Database.Save();
        }

        public async Task<DeliveryMethodDTO> GetDeliveryMethod(int id)
        {
            var deliveryMethod = await Database.DeliveryMethods.Get(id);
            if (deliveryMethod == null)
                throw new ValidationException("Wrong delivery method!", "");
            return new DeliveryMethodDTO
            {
                Id = deliveryMethod.Id,
                Name = deliveryMethod.Name,
                DeliveryPrice = deliveryMethod.DeliveryPrice
            };
        }


        public async Task<IEnumerable<DeliveryMethodDTO>> GetDeliveryMethods()
        {
            return _mapper.Map<IEnumerable<DeliveryMethod>, IEnumerable<DeliveryMethodDTO>>(await Database.DeliveryMethods.GetAll());
        }
        public async Task<bool> ExistsDeliveryMethod(int id)
        {
            return await Database.DeliveryMethods.Exists(id);
        }
    }
}
