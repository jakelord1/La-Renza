using La_Renza.BLL.DTO;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.BLL.Infrastructure;
using La_Renza.BLL.Interfaces;
using AutoMapper;

namespace La_Renza.BLL.Services
{
    public class DeliveryMethodService : IDeliveryMethodService
    {
        IUnitOfWork Database { get; set; }

        public DeliveryMethodService(IUnitOfWork uow)
        {
            Database = uow;
        }

        public async Task CreateDeliveryMethod(DeliveryMethodDTO deliveryMethodDto)
        {
            var deliveryMethod = new DeliveryMethod
            {
                Id = deliveryMethodDto.Id,
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
            var config = new MapperConfiguration(cfg => cfg.CreateMap<DeliveryMethod, DeliveryMethodDTO>());
            var mapper = new Mapper(config);
            return mapper.Map<IEnumerable<DeliveryMethod>, IEnumerable<DeliveryMethodDTO>>(await Database.DeliveryMethods.GetAll());
        }
        public async Task<bool> ExistsDeliveryMethod(int id)
        {
            return await Database.DeliveryMethods.Exists(id);
        }
    }
}
