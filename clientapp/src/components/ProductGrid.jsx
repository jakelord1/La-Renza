import React, { useEffect, useState, useMemo } from 'react';


import ProductCard from './ProductCard';
import UnifiedCartModal from './UnifiedCartModal';
import { Link } from 'react-router-dom';
import Loader from './common/Loader';

const MODELS_API_URL = '/api/Models';
const PRODUCTS_API_URL = '/api/Products';

function getAllDescendantIds(categoryIds, allCategories) {
  const categoryMap = new Map();
  allCategories.forEach(c => categoryMap.set(c.id, { ...c, children: [] }));

  allCategories.forEach(c => {
    if (c.parentCategoryId && categoryMap.has(c.parentCategoryId)) {
      categoryMap.get(c.parentCategoryId).children.push(categoryMap.get(c.id));
    }
  });

  const allIds = new Set(categoryIds);

  function findDescendants(catId) {
    const category = categoryMap.get(catId);
    if (category && category.children) {
      for (const child of category.children) {
        allIds.add(child.id);
        findDescendants(child.id);
      }
    }
  }

  for (const catId of categoryIds) {
    findDescendants(catId);
  }

  return Array.from(allIds);
}

const ProductGrid = ({ activeCategory = 'Усі' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    fetch('/api/Account/accountProfile', { credentials: 'include' })
      .then(res => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }
    fetch('/api/Account/accountModels', { credentials: 'include' })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setFavorites(Array.isArray(data) ? data.map(m => m.id) : []);
      })
      .catch(() => setFavorites([]));
    const update = () => {
      fetch('/api/Account/accountModels', { credentials: 'include' })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          setFavorites(Array.isArray(data) ? data.map(m => m.id) : []);
        })
        .catch(() => setFavorites([]));
    };
    window.addEventListener('favorites-updated', update);
    return () => window.removeEventListener('favorites-updated', update);
  }, [isAuthenticated]);
  const [models, setModels] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const modelsRes = await fetch(MODELS_API_URL);
        if (!modelsRes.ok) throw new Error('Помилка завантаження моделей');
        const modelsData = await modelsRes.json();
        const productsRes = await fetch(PRODUCTS_API_URL);
        if (!productsRes.ok) throw new Error('Помилка завантаження продуктів');
        const productsData = await productsRes.json();

        const categoriesRes = await fetch('/api/Categories');
        if (!categoriesRes.ok) throw new Error('Помилка завантаження категорій');
        const categoriesData = await categoriesRes.json();

        const enrichedProducts = productsData.map(p => ({
          ...p,
          categoryId: p.color?.model?.categoryId ?? null
        }));

        setModels(modelsData);
        setProducts(enrichedProducts);
        setCategories(categoriesData);
      } catch (e) {
        setAlert({ show: true, type: 'danger', message: e.message });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const modelsWithProducts = models.map(model => {
    const modelProducts = products.filter(
      product => product.color && product.color.model && product.color.model.id === model.id
    ).map(product => ({
      ...product,
      price: product.color && product.color.model && product.color.model.price != null ? product.color.model.price : product.price
    }));
    return { ...model, products: modelProducts };
  });

  const filteredModels = useMemo(() => {
    if (activeCategory === 'Усі') {
      return modelsWithProducts.filter(model => model.products.length > 0);
    }
    const activeCategoryId = Number(activeCategory);
    const categoryIdsToFilter = getAllDescendantIds([activeCategoryId], categories);

    return modelsWithProducts.filter(model =>
      categoryIdsToFilter.includes(model.categoryId) && model.products.length > 0
    );
  }, [modelsWithProducts, activeCategory, categories]);

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setShowCartModal(true);
  };
  const handleCloseCartModal = () => {
    setShowCartModal(false);
    setSelectedProduct(null);
  };
  const handleCheckout = () => {
    setShowCartModal(false);
    setSelectedProduct(null);
    window.location.href = '/cart';
  };

  return (
    <div className="container">
      {alert.show && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}
      {loading ? (
        <Loader />
      ) : (
        <div className="row g-3 g-md-4">
          {(filteredModels.length === 0) ? (
            <div className="col-12 text-center">Немає доступних товарів.</div>
          ) : (
            filteredModels.map(model => (
              <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2" key={model.id}>
                <ProductCard 
  model={model} 
  products={model.products} 
  onAddToCart={handleAddToCart} 
  onCardClick={() => window.location.href = `/product/${model.id}`}
  isAuthenticated={isAuthenticated}
  isFavorite={favorites.includes(model.id)}
  onFavoriteChange={() => window.dispatchEvent(new Event('favorites-updated'))}
/>
              </div>
            ))
          )}
        </div>
      )}
      <UnifiedCartModal
        show={showCartModal}
        product={selectedProduct}
        onClose={handleCloseCartModal}
        onCheckout={handleCheckout}
      />
    </div>
  );

};

export default ProductGrid;