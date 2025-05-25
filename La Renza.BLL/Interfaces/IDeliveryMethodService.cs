using La_Renza.BLL.DTO;

namespace La_Renza.BLL.Interfaces
{
    public interface IDeliveryMethodService
    {
        Task CreateDeliveryMethod(DeliveryMethodDTO deliveryMethodDto);
        Task UpdateDeliveryMethod(DeliveryMethodDTO deliveryMethodDto);
        Task DeleteDeliveryMethod(int id);
        Task<DeliveryMethodDTO> GetDeliveryMethod(int id);
        Task<IEnumerable<DeliveryMethodDTO>> GetDeliveryMethods();
        Task<bool> ExistsDeliveryMethod(int id);
    }
}

