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
                .ForMember(dest => dest.ImageId, opt => opt.MapFrom(src => src.Image.Id))
                .ReverseMap();
            CreateMap<Category, CategoryDTO>()
                .ReverseMap();
            CreateMap<Size, SizeDTO>()
                .ReverseMap();
            CreateMap<Model, ModelDTO>()
                .ReverseMap();
            CreateMap<Color, ColorDTO>()
                .ForMember(dest => dest.Photos, opt => opt.MapFrom(src => src.Photos))
                .ReverseMap();
            CreateMap<Product, ProductDTO>()
                .ReverseMap();
            CreateMap<Image, ImageDTO>()
                .ReverseMap();
        }
    }
}
