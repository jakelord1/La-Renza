using AutoMapper;
using La_Renza.DAL.Entities;
using La_Renza.BLL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;

namespace La_Renza.BLL.Infrastructure
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Admin, AdminDTO>()
                .ReverseMap();
            CreateMap<Address, AddressDTO>()
                .ReverseMap();
            CreateMap<Comment, CommentDTO>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image))
                .ReverseMap();
            CreateMap<Category, CategoryDTO>()
                .ForMember(dest => dest.ParentCategoryId, opt => opt.MapFrom(src => src.CategoryId))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.CategoryImage))
                .ForMember(dest => dest.Sizes, opt => opt.MapFrom(src => src.SizeOptions))
                .ForMember(dest => dest.Models, opt => opt.MapFrom(src => src.Models))
                .ReverseMap();
            CreateMap<Size, SizeDTO>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
                .ReverseMap();
            CreateMap<Color, ColorDTO>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image))
                .ReverseMap();
            CreateMap<Product, ProductDTO>()
                .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.Color))
                .ForMember(dest => dest.Size, opt => opt.MapFrom(src => src.Size))
                .ForMember(dest => dest.UsersLikesId, opt => opt.MapFrom(src => src.User.Select(u => u.Id)))
                .ReverseMap();
            CreateMap<Image, ImageDTO>()
                .ReverseMap();
            CreateMap<Model, ModelDTO>()
                .ForMember(dest => dest.Photos, opt => opt.MapFrom(src => src.Image))
                .ForMember(dest => dest.Colors, opt => opt.MapFrom(src => src.Colors))
                 .ForMember(dest => dest.Sizes, opt => opt.MapFrom(src => src.Category.SizeOptions.Select(s => s.Name)))
                .ReverseMap();
            CreateMap<ShoppingCart, ShopingCartDTO>()
                //.ForMember(dest => dest.Product, opt => opt.MapFrom(c => c.Product))
                .ReverseMap();
            CreateMap<User, UserDTO>()
                .ForMember(dest => dest.Addresses, opt => opt.MapFrom(c => c.Addresses))
                .ForMember(dest => dest.Invoices, opt => opt.MapFrom(c => c.Invoices))
                .ForMember(dest => dest.Cupons, opt => opt.MapFrom(c => c.Cupon))
                .ForMember(dest => dest.ShoppingCarts, opt => opt.MapFrom(c => c.ShoppingCarts))
                .ReverseMap();
            CreateMap<Coupon, CouponDTO>()
                .ForMember(dest => dest.Users, opt => opt.MapFrom(src => src.User))
                .ReverseMap();
            CreateMap<Model, ModelBase>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Sizes, opt => opt.MapFrom(src => src.Category.SizeOptions.Select(s => s.Name)))

                .ReverseMap();
            CreateMap<Size, SizeBase>()
               .ReverseMap();
            CreateMap<InvoiceInfo, InvoiceInfoDTO>()
               .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User.Email));

            CreateMap<InvoiceInfoDTO, InvoiceInfo>()
                .ForMember(dest => dest.User, opt => opt.Ignore());

            CreateMap<User, UserBase>()
                .ReverseMap();
            CreateMap<Size, SizeBase>()
                .ReverseMap();
            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
                .ForMember(dest => dest.Delivery, opt => opt.MapFrom(src => src.Delivery))
                .ForMember(dest => dest.Cupons, opt => opt.MapFrom(src => src.Cupons))
                .ForMember(dest => dest.DM, opt => opt.MapFrom(src => src.DeliveryMethod))
                .ReverseMap();
            CreateMap<DeliveryMethod, DeliveryMethodDTO>()
                .ReverseMap();
            CreateMap<Color, ColorProductDTO>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image))
                .ReverseMap();
            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.orderItems, opt => opt.MapFrom(src => src.OrderItems))
                .ReverseMap();
            CreateMap<OrderItem, OrderItemDTO>()
                .ReverseMap();

        }
    }
}