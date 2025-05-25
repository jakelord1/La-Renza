using La_Renza.BLL.DTO;

namespace La_Renza.BLL.Interfaces
{
    public interface IOrderItemService 
    {
        Task CreateOrderItem(OrderItemDTO orderItemDto);
        Task UpdateOrderItem(OrderItemDTO orderItemDto);
        Task DeleteOrderItem(int id);
        Task<OrderItemDTO> GetOrderItem(int id);
        Task<IEnumerable<OrderItemDTO>> GetOrderItems();
        Task<bool> ExistsOrderItem(int id);
    }
}

