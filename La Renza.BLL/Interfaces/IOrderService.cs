﻿using La_Renza.BLL.DTO;

namespace La_Renza.BLL.Interfaces
{
    public interface IOrderService 
    {
        Task CreateOrder(OrderDTO orderDto);
        Task UpdateOrder(OrderDTO orderDto);
        Task DeleteOrder(int id);
        Task<OrderDTO> GetOrder(int id);
        Task<IEnumerable<OrderDTO>> GetOrders();
        Task<IEnumerable<OrderDTO>> GetOrdersByUserId(int userId);
        Task<bool> ExistsOrder(int id);
    }
}

