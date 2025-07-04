﻿using System.Collections.Generic;
using System;
using La_Renza.BLL.Entities;

namespace La_Renza.BLL.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<IEnumerable<Product>> GetByUserId(int userId);
        Task<IEnumerable<Model>> GetModelsByUserId(int userId);
        Task<IEnumerable<Model>> GetModelsByUserAndColor(int userId, int colorId);
        Task<Model?> GetModelWithSpecificColor(int colorId);
        Task<IEnumerable<Product>> GetFavoritesByModelId(int modelId, int userId);
        Task<IEnumerable<Product>> GetByModelId(int modelId);
        Task<IEnumerable<Product>> GetUnfavoritedProductsByModelId(int modelId, int userId);
        Task<Product?> GetByColorAndSize(int modelId, int sizeId);
        Task<IEnumerable<Model>> GetAllModels();
    }
}
