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
            CreateMap<Comment, CommentDTO>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image))
                .ReverseMap();
            CreateMap<Category, CategoryDTO>()
                .ForMember(dest => dest.ParentCategoryId, opt => opt.MapFrom(src => src.CategoryId))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.CategoryImage))
                .ForMember(dest => dest.Sizes, opt => opt.MapFrom(src => src.SizeOptions))
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
                .ReverseMap();
            CreateMap<Image, ImageDTO>()
                .ReverseMap();
            CreateMap<Model, ModelDTO>()
                 .ForMember(dest => dest.Photos, opt => opt.MapFrom(src => src.Photos))
                .ForMember(dest => dest.Colors, opt => opt.MapFrom(src => src.Colors))
                .ReverseMap();
            CreateMap<ShoppingCart, ShopingCartDTO>()
                .ForMember(dest => dest.Product, opt => opt.MapFrom(c => c.Product))
                .ReverseMap();
            CreateMap<User, UserDTO>()
                .ForMember(dest => dest.Addresses, opt => opt.MapFrom(c => c.Addresses.ToList()))
                .ForMember(dest => dest.Invoices, opt => opt.MapFrom(c => c.Invoices.ToList()))
                .ReverseMap();
            CreateMap<Address, AddressDTO>()
                .ReverseMap();
            CreateMap<Model, ModelBase>()
               .ReverseMap();
            CreateMap<Size, SizeBase>()
               .ReverseMap();
            CreateMap<InvoiceInfo, InvoiceInfoDTO>()
                .ReverseMap();
        }
    }
}
