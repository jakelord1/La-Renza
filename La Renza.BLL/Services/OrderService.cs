﻿using La_Renza.BLL.DTO;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.BLL.Infrastructure;
using La_Renza.BLL.Interfaces;
using AutoMapper;
using Mysqlx.Crud;
using La_Renza.DAL.Entities;

namespace La_Renza.BLL.Services
{
    public class OrderService : IOrderService
    {
        IUnitOfWork Database { get; set; }
        private readonly IMapper _mapper;

        public OrderService(IUnitOfWork uow, IMapper mapper)
        {
            Database = uow;
            _mapper = mapper;
        }

        public async Task CreateOrder(OrderDTO orderDto)
        {
            var order = new DAL.Entities.Order
            {
                Id = orderDto.Id,
                UserId = orderDto.UserId,
                Status = orderDto.Status,
                DeliveryId = orderDto.DeliveryId,
                CuponsId = orderDto.CuponsId,
                OrderName = orderDto.OrderName,
                CreatedAt = orderDto.CreatedAt,
                CompletedAt = orderDto.CompletedAt,
                PaymentMethod = orderDto.PaymentMethod,
                DeliveryMethodId = orderDto.DeliveryMethodId,
                Phonenumber = orderDto.Phonenumber
            };
            await Database.Orders.Create(order);
            await Database.Save();
        }

        public async Task UpdateOrder(OrderDTO orderDto)
        {
            var order = new DAL.Entities.Order
            {
                Id = orderDto.Id,
                UserId = orderDto.UserId,
                Status = orderDto.Status,
                DeliveryId = orderDto.DeliveryId,
                CuponsId = orderDto.CuponsId,
                OrderName = orderDto.OrderName,
                CreatedAt = orderDto.CreatedAt,
                CompletedAt = orderDto.CompletedAt,
                PaymentMethod = orderDto.PaymentMethod,
                DeliveryMethodId = orderDto.DeliveryMethodId,
                Phonenumber = orderDto.Phonenumber

            };
            Database.Orders.Update(order);
            await Database.Save();
        }

        public async Task DeleteOrder(int id)
        {
            await Database.Orders.Delete(id);
            await Database.Save();
        }

        public async Task<OrderDTO> GetOrder(int id)
        {
            var order = await Database.Orders.Get(id);
            if (order == null)
                throw new ValidationException("Wrong order!", "");
            return new OrderDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                Status = order.Status,
                DeliveryId = order.DeliveryId,
                CuponsId = order.CuponsId,
                OrderName = order.OrderName,
                CreatedAt = order.CreatedAt,
                CompletedAt = order.CompletedAt,
                PaymentMethod = order.PaymentMethod,
                DeliveryMethodId = order.DeliveryMethodId,
                Phonenumber = order.Phonenumber
            };
        }

        public async Task<IEnumerable<OrderDTO>> GetOrdersByUserId(int userId)
        {
            var orders = await Database.Orders.GetAll();
            var userOrders = orders.Where(o => o.UserId == userId);


            return _mapper.Map<IEnumerable<DAL.Entities.Order>, IEnumerable<OrderDTO>>(userOrders);
        }

        public async Task<IEnumerable<OrderDTO>> GetOrders()
        {
            return _mapper.Map<IEnumerable<DAL.Entities.Order>, IEnumerable<OrderDTO>>(await Database.Orders.GetAll());

        }


        public async Task<bool> ExistsOrder(int id)
        {
            return await Database.Orders.Exists(id);
        }
    }
}