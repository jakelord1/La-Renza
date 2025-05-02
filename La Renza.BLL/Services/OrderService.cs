using La_Renza.BLL.DTO;
using La_Renza.DAL.Entities;
using La_Renza.DAL.Interfaces;
using La_Renza.BLL.Infrastructure;
using La_Renza.BLL.Interfaces;
using AutoMapper;

namespace La_Renza.BLL.Services
{
    public class OrderService : IOrderService
    {
        IUnitOfWork Database { get; set; }

        public OrderService(IUnitOfWork uow)
        {
            Database = uow;
        }

        public async Task CreateOrder(OrderDTO orderDto)
        {
            var order = new Order
            {
                Id = orderDto.Id,
                UserId = orderDto.UserId,
                Status = Enum.Parse<Status>(orderDto.Status),
                AddressId = orderDto.AddressId,
                CouponId = orderDto.CouponId,
                OrderName = orderDto.OrderName,
                CreatedAt = orderDto.CreatedAt,
                CompletedAt = orderDto.CompletedAt,
                PaymentMethod = orderDto.PaymentMethod,
                DeliveryMethodId = orderDto.DeliveryMethodId
            };
            await Database.Orders.Create(order);
            await Database.Save();
        }

        public async Task UpdateOrder(OrderDTO orderDto)
        {
            var order = new Order
            {
                Id = orderDto.Id,
                UserId = orderDto.UserId,
                Status = Enum.Parse<Status>(orderDto.Status),
                AddressId = orderDto.AddressId,
                CouponId = orderDto.CouponId,
                OrderName = orderDto.OrderName,
                CreatedAt = orderDto.CreatedAt,
                CompletedAt = orderDto.CompletedAt,
                PaymentMethod = orderDto.PaymentMethod,
                DeliveryMethodId = orderDto.DeliveryMethodId
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
                Status = order.Status.ToString(),
                AddressId = order.AddressId,
                CouponId = order.CouponId,
                OrderName = order.OrderName,
                CreatedAt = order.CreatedAt,
                CompletedAt = order.CompletedAt,
                PaymentMethod = order.PaymentMethod,
                DeliveryMethodId = order.DeliveryMethodId,
                User = order.User.Email,
                Address = order.Address.City,
                Coupon = order.Coupon.Name
            };
        }

   
        public async Task<IEnumerable<OrderDTO>> GetOrders()
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<Order, OrderDTO>()
            .ForMember("User", opt => opt.MapFrom(c => c.User.Email))
            .ForMember("Address", opt => opt.MapFrom(c => c.Address.City))
            .ForMember("Coupon", opt => opt.MapFrom(c => c.Coupon.Name)));
            var mapper = new Mapper(config);
            return mapper.Map<IEnumerable<Order>, IEnumerable<OrderDTO>>(await Database.Orders.GetAll());
        }

    }
}
