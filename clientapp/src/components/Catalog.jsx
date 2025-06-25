import React, { useState, useMemo, useEffect } from 'react';

function buildCategoryTree(list) {
  const map = {};
  const roots = [];
  list.forEach(cat => {
    map[cat.id] = { ...cat, children: [] };
  });
  list.forEach(cat => {
    if (cat.parentCategoryId) {
      if (map[cat.parentCategoryId]) map[cat.parentCategoryId].children.push(map[cat.id]);
    } else {
      roots.push(map[cat.id]);
    }
  });
  return roots;
}

import Breadcrumbs from './Breadcrumbs';
import CatalogSidebar from './CatalogSidebar';
import CatalogControls from './CatalogControls';
import ProductCard from './ProductCard';

const PRODUCTS_API_URL = '/api/Products';



// Далі весь код працює тільки зі стейтом products, який завантажується з API

const SIZES_API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Sizes`;
const COLORS_API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Colors`;

const BRAND_OPTIONS = [
  { value: 'brand1', label: 'Brand1' },
  { value: 'brand2', label: 'Brand2' },
  { value: 'brand3', label: 'Brand3' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Новинки' },
  { value: 'oldest', label: 'Старі' },
  { value: 'price_low', label: 'Від дешевих до дорогих' },
  { value: 'price_high', label: 'Від дорогих до дешевих' },
];

const initialFilters = {
  categories: [],
  priceMin: '',
  priceMax: '',
  colors: [],
  sizes: [],
  brands: [],
};

const Catalog = () => {
  const [models, setModels] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [colors, setColors] = React.useState([]);
  const [sizes, setSizes] = React.useState([]);
  const [filters, setFilters] = React.useState(initialFilters);
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({ show: false, type: '', message: '' });


  const sidebarColors = colors.map(color => ({
    value: color.id,
    label: color.name,
    imagePath: color.image?.path || null
  }));
  const sidebarSizes = sizes.map(size => ({
    value: size.id,
    label: size.name
  }));

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        const modelsRes = await fetch('/api/Models');
        if (!modelsRes.ok) throw new Error('Помилка завантаження моделей');
        const modelsData = await modelsRes.json();

        const productsRes = await fetch('/api/Products');
        if (!productsRes.ok) throw new Error('Помилка завантаження продуктів');
        const productsData = await productsRes.json();

        const categoriesRes = await fetch('/api/Categories');
        if (!categoriesRes.ok) throw new Error('Помилка завантаження категорій');
        const categoriesData = await categoriesRes.json();

        const colorsRes = await fetch('/api/Colors');
        if (!colorsRes.ok) throw new Error('Помилка завантаження кольорів');
        const colorsData = await colorsRes.json();

        const sizesRes = await fetch('/api/Sizes');
        if (!sizesRes.ok) throw new Error('Помилка завантаження розмірів');
        const sizesData = await sizesRes.json();

        const enrichedProducts = productsData.map(p => ({
          ...p,
          categoryId: p.color?.model?.categoryId ?? null
        }));

        setModels(modelsData);
        setProducts(enrichedProducts);
        setCategories(categoriesData);
        setColors(colorsData);
        setSizes(sizesData);
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

  const filteredModels = modelsWithProducts.filter(model => model.products.length > 0);

  return (
    <div className="catalog-page container-fluid py-4">
      <div className="row gx-4">
 
        <div className="col-12 col-md-4 col-lg-3 mb-4 mb-md-0" style={{ minWidth: 240, maxWidth: 320 }}>
          <CatalogSidebar
            filters={filters}
            setFilters={setFilters}
            categories={buildCategoryTree(categories)}
            sizes={sidebarSizes}
            colors={sidebarColors}
            brands={[]}
            onReset={() => setFilters(initialFilters)}
          />
        </div>
        <div className="col-12 col-md-8 col-lg-9">
          <h1 className="h4 fw-bold mb-3">Каталог</h1>
          {alert.show && (
            <div className={`alert alert-${alert.type}`} role="alert">
              {alert.message}
            </div>
          )}
          {loading ? (
            <div className="text-center my-4">Завантаження...</div>
          ) : (
            <div className="row g-3 g-md-4">
              {filteredModels.length === 0 ? (
                <div className="col-12 text-center">Немає доступних товарів.</div>
              ) : (
                filteredModels.map(model => (
                  <div className="col-6 col-md-4 col-lg-3" key={model.id}>
                    <ProductCard 
                      model={model} 
                      products={model.products} 
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;