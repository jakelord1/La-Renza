using La_Renza.BLL.Infrastructure;
using La_Renza.DAL.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using La_Renza.DAL.Repositories;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Services;
using La_Renza.DAL.Entities;

namespace La_Renza.BLL
{
    public static class DependencyInjection
    {
        public static void AddLaRenzaBLL(this IServiceCollection services)
        {
            services.AddScoped<IAddressService, AddressService>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IColorService, ColorService>();
            services.AddScoped<ICommentService, CommentService>();
            services.AddScoped<ICouponService, CouponService>();
            services.AddScoped<IDeliveryMethodService, DeliveryMethodService>();
            services.AddScoped<IImageService, ImageService>();
            services.AddScoped<IInvoiceInfoService, InvoiceInfoService>();
            services.AddScoped<IModelService, ModelService>();
            services.AddScoped<IOrderItemService, OrderItemService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IShopingCartService, ShopingCartService>();
            services.AddScoped<ISizeService, SizeService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IConfiguratorService>(provider =>
                new ConfiguratorService("configurator.json"));
            services.AddScoped<PasswordHasher>();
            services.AddScoped<IDbInitService, DbInitService>();
            services.AddScoped<IUnitOfWork, EFUnitOfWork>();


            services.AddAutoMapper(typeof(MapperProfile));


        }
    }
}
