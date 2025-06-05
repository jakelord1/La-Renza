using La_Renza.BLL.DTO;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.BLL.Infrastructure;
using La_Renza.BLL.Interfaces;
using AutoMapper;
using System.Numerics;

namespace La_Renza.BLL.Services
{
    public class OrderItemService : IOrderItemService
    {
        IUnitOfWork Database { get; set; }
        private readonly IMapper _mapper;

        public OrderItemService(IUnitOfWork uow, IMapper mapper)
        {
            Database = uow;
            _mapper = mapper;
        }

        public async Task CreateOrderItem(OrderItemDTO orderItemDto)
        {
            var orderItem = new OrderItem
            {
                Id = orderItemDto.Id,
                OrderId = orderItemDto.OrderId,
                ProductId = orderItemDto.ProductId,
                Quantity = orderItemDto.Quantity,
                Price = orderItemDto.Price

            };
            await Database.OrderItems.Create(orderItem);
            await Database.Save();
        }

        public async Task UpdateOrderItem(OrderItemDTO orderItemDto)
        {
            var orderItem = new OrderItem
            {
                Id = orderItemDto.Id,
                OrderId = orderItemDto.OrderId,
                ProductId = orderItemDto.ProductId,
                Quantity = orderItemDto.Quantity,
                Price = orderItemDto.Price

            };
            Database.OrderItems.Update(orderItem);
            await Database.Save();
        }

        public async Task DeleteOrderItem(int id)
        {
            await Database.OrderItems.Delete(id);
            await Database.Save();
        }

        public async Task<OrderItemDTO> GetOrderItem(int id)
        {
            var orderItem = await Database.OrderItems.Get(id);
            if (orderItem == null)
                throw new ValidationException("Wrong order item!", "");
            return new OrderItemDTO
            {
                Id = orderItem.Id,
                OrderId = orderItem.OrderId,
                ProductId = orderItem.ProductId,
                Quantity = orderItem.Quantity,
                Price = orderItem.Price
            };
        }

   
        public async Task<IEnumerable<OrderItemDTO>> GetOrderItems()
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<OrderItem, OrderItemDTO>()
            .ForMember("Product", opt => opt.MapFrom(c => c.Product.Id)));
            var mapper = new Mapper(config);
            return mapper.Map<IEnumerable<OrderItem>, IEnumerable<OrderItemDTO>>(await Database.OrderItems.GetAll());
        }

        public async Task<bool> ExistsOrderItem(int id)
        {
            return await Database.OrderItems.Exists(id);
        }
    }
}
