using AutoMapper;
using La_Renza.DAL.Entities;
using La_Renza.BLL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace La_Renza.BLL.Infrastructure
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        { 
            CreateMap<Comment, CommentDTO>()
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
                .ForMember(dest => dest.ImagePath, opt => opt.MapFrom(src => src.Image.Path))
                .ReverseMap();
            CreateMap<Category, CategoryDTO>()
                .ForMember(dest => dest.Children, opt => opt.MapFrom(src => src.Children))
                .ForMember(dest => dest.SizeOptions, opt => opt.MapFrom(src => src.SizeOptions))
                .ForMember(dest => dest.CategoryImage, opt => opt.MapFrom(src => src.CategoryImage.Path))
                .ReverseMap();
            CreateMap<Size, SizeDTO>()
                .ReverseMap();
            CreateMap<Model, ModelDTO>()
                .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.Categories))
                .ReverseMap();
            CreateMap<Color, ColorDTO>()
                .ForMember(dest => dest.Model, opt => opt.MapFrom(src => src.Model))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image.Path))
                .ForMember(dest => dest.Photos, opt => opt.MapFrom(src => src.Photos.Select(p => p.Path)))
                .ReverseMap();
            CreateMap<Product, ProductDTO>()
                .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.Color))
                .ForMember(dest => dest.Size, opt => opt.MapFrom(src => src.Size))
                .ForMember(dest => dest.Comments, opt=> opt.MapFrom(src => src.Comments))
                .ReverseMap();
        }
    }
}
