﻿using La_Renza.BLL.EF;
using La_Renza.BLL.Interfaces;
using La_Renza.BLL.Entities;
using System.Numerics;
using Microsoft.EntityFrameworkCore;

namespace La_Renza.BLL.Repositories
{
    public class EFUnitOfWork : IUnitOfWork
    {
        private LaRenzaContext db;

        private AddressRepository addressRepository;
        private AdminRepository adminRepository;
        private CategoryRepository categoryRepository;
        private CommentRepository commentRepository;
        private ColorRepository colorRepository;
        private CouponRepository couponRepository;
        private ImageRepository imageRepository;
        private InvoiceInfoRepository invoiceInfoRepository;
        private ModelRepository modelRepository;
        private OrderRepository orderRepository;
        private OrderItemRepository orderItemRepository;
        private ProductRepository productRepository;
        private SizeRepository sizeOptionRepository;
        private UserRepository userRepository;
        private ShopingCartRepository shoppingCartRepository;
        private DeliveryMethodRepository deliveryMethodRepository;
        

        public EFUnitOfWork(LaRenzaContext context)
        {
            db = context;
        }

        public IRepository<Address> Addresses
        {
            get
            {
                if (addressRepository == null)
                    addressRepository = new AddressRepository(db);
                return addressRepository;
            }
        }

        public IRepository<Admin> Admins
        {
            get
            {
                if (adminRepository == null)
                    adminRepository = new AdminRepository(db);
                return adminRepository;
            }
        }

        public IRepository<Category> Categories
        {
            get
            {
                if (categoryRepository == null)
                    categoryRepository = new CategoryRepository(db);
                return categoryRepository;
            }
        }

        public IRepository<Color> Colors
        {
            get
            {
                if (colorRepository == null)
                    colorRepository = new ColorRepository(db);
                return colorRepository;
            }
        }

        public IRepository<Comment> Comments
        {
            get
            {
                if (commentRepository == null)
                    commentRepository = new CommentRepository(db);
                return commentRepository;
            }
        }

        public IRepository<Coupon> Coupons
        {
            get
            {
                if (couponRepository == null)
                    couponRepository = new CouponRepository(db);
                return couponRepository;
            }
        }

        public IRepository<Image> Images
        {
            get
            {
                if (imageRepository == null)
                    imageRepository = new ImageRepository(db);
                return imageRepository;
            }
        }

        public IRepository<InvoiceInfo> Invoices
        {
            get
            {
                if (invoiceInfoRepository == null)
                    invoiceInfoRepository = new InvoiceInfoRepository(db);
                return invoiceInfoRepository;
            }
        }

        public IRepository<Model> Models
        {
            get
            {
                if (modelRepository == null)
                    modelRepository = new ModelRepository(db);
                return modelRepository;
            }
        }

        public IRepository<Order> Orders
        {
            get
            {
                if (orderRepository == null)
                    orderRepository = new OrderRepository(db);
                return orderRepository;
            }
        }

        public IRepository<OrderItem> OrderItems
        {
            get
            {
                if (orderItemRepository == null)
                    orderItemRepository = new OrderItemRepository(db);
                return orderItemRepository;
            }
        }

        //public IRepository<Product> Products
        //{
        //    get
        //    {
        //        if (productRepository == null)
        //            productRepository = new ProductRepository(db);
        //        return productRepository;
        //    }
        //}
        public IProductRepository Products
        {
            get
            {
                if (productRepository == null)
                    productRepository = new ProductRepository(db);
                return productRepository;
            }
        }

        public IRepository<Size> Sizes
        {
            get
            {
                if (sizeOptionRepository == null)
                    sizeOptionRepository = new SizeRepository(db);
                return sizeOptionRepository;
            }
        }

        public IRepository<User> Users
        {
            get
            {
                if (userRepository == null)
                    userRepository = new UserRepository(db);
                return userRepository;
            }
        }

        public IRepository<ShoppingCart> ShopingCarts
        {
            get
            {
                if (shoppingCartRepository == null)
                    shoppingCartRepository = new ShopingCartRepository(db);
                return shoppingCartRepository;
            }
        }

        public IRepository<DeliveryMethod> DeliveryMethods
        {
            get
            {
                if (deliveryMethodRepository == null)
                    deliveryMethodRepository = new DeliveryMethodRepository(db);
                return deliveryMethodRepository;
            }
        }

        public async Task Save()
        {
            await db.SaveChangesAsync();
        }
    }
}

