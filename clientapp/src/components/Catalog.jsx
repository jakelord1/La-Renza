import React, { useState, useMemo, useEffect } from 'react';

// Створення дерева категорій з flat-списку
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

const catalogProducts = [
  {
    id: 1,
    name: 'Basic T-Shirt',
    price: '12.99',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Soft cotton basic t-shirt',
    category: 'clothes',
    colors: ['white', 'black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    brand: 'brand1',
  },
  {
    id: 2,
    name: 'Mom Fit Jeans',
    price: '29.99',
    originalPrice: '39.99',
    sale: true,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'High-waisted mom fit jeans',
    category: 'clothes',
    colors: ['blue', 'black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    brand: 'brand2',
  },
  {
    id: 3,
    name: 'Floral Dress',
    price: '24.99',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Light floral print dress',
    category: 'clothes',
    colors: ['pink', 'white'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    brand: 'brand3',
  },
  {
    id: 4,
    name: 'Oversized Hoodie',
    price: '34.99',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Comfortable oversized hoodie',
    category: 'clothes',
    colors: ['black', 'gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    brand: 'brand1',
  },
  {
    id: 5,
    name: 'Basic Crop Top',
    price: '9.99',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Cotton basic crop top',
    category: 'clothes',
    colors: ['white', 'black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    brand: 'brand2',
  },
  {
    id: 6,
    name: 'Mini Skirt',
    price: '19.99',
    originalPrice: '24.99',
    sale: true,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'A-line mini skirt',
    category: 'clothes',
    colors: ['pink', 'white'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    brand: 'brand3',
  },
  {
    id: 7,
    name: 'Oversized Shirt',
    price: '27.99',
    image: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Loose fit shirt',
    category: 'clothes',
    colors: ['black', 'gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    brand: 'brand1',
  },
  {
    id: 8,
    name: 'Track Pants',
    price: '22.99',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Comfortable track pants',
    category: 'clothes',
    colors: ['black', 'gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    brand: 'brand2',
  },
];

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
  const [categoryTree, setCategoryTree] = React.useState([]);
  const [filters, setFilters] = React.useState(initialFilters);
  const [sort, setSort] = React.useState('newest');
  const [view, setView] = React.useState('grid');
  const [page, setPage] = React.useState(1);
  const [sizes, setSizes] = React.useState([]);
  const [colors, setColors] = React.useState([]);
  const perPage = 12;

  React.useEffect(() => {
    fetch(SIZES_API_URL)
      .then(res => res.json())
      .then(data => setSizes(data.map(s => ({ value: s.name, label: s.name }))))
      .catch(() => setSizes([]));
  }, []);

  React.useEffect(() => {
    fetch(COLORS_API_URL)
      .then(res => res.json())
      .then(data => setColors(data.map(c => ({ value: c.name, label: c.name, hex: c.hex || '#eee' }))))
      .catch(() => setColors([]));
  }, []);

  React.useEffect(() => {
    fetch('/api/Categories')
      .then(res => res.json())
      .then(data => {
        setCategoryTree(buildCategoryTree(data));
      })
      .catch(() => setCategoryTree([]));
  }, []);

  // Breadcrumbs example
  const breadcrumbs = [
    { label: 'Головна', href: '/' },
    { label: 'Каталог', href: '/catalog' },
  ];

  // Filtering
  const filteredProducts = React.useMemo(() => {
    let arr = catalogProducts;
    // Category filter
    if (filters.categories.length) arr = arr.filter(p => filters.categories.includes(p.category));
    // Price filter
    if (filters.priceMin) arr = arr.filter(p => Number(p.price) >= Number(filters.priceMin));
    if (filters.priceMax) arr = arr.filter(p => Number(p.price) <= Number(filters.priceMax));
    // Color filter
    if (filters.colors.length) arr = arr.filter(p => p.colors && p.colors.some(c => filters.colors.includes(c)));
    // Size filter
    if (filters.sizes.length) arr = arr.filter(p => p.sizes && p.sizes.some(s => filters.sizes.includes(s)));
    // Brand filter
    if (filters.brands.length) arr = arr.filter(p => p.brand && filters.brands.includes(p.brand));
    return arr;
  }, [filters]);

  // Sorting
  const sortedProducts = React.useMemo(() => {
    let arr = [...filteredProducts];
    switch (sort) {
      case 'newest':
        return arr.sort((a, b) => b.id - a.id);
      case 'oldest':
        return arr.sort((a, b) => a.id - b.id);
      case 'price_low':
        return arr.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price_high':
        return arr.sort((a, b) => Number(b.price) - Number(a.price));
      default:
        return arr;
    }
  }, [filteredProducts, sort]);

  // Pagination
  const total = sortedProducts.length;
  const paginatedProducts = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return sortedProducts.slice(start, start + perPage);
  }, [sortedProducts, page, perPage]);

  // Reset filters
  const handleResetFilters = () => setFilters(initialFilters);
  React.useEffect(() => { setPage(1); }, [filters, sort, perPage]);

  return (
    <div className="catalog-page container-fluid py-4">
      <div className="row gx-4">
        <div className="col-12 col-md-4 col-lg-3 mb-4 mb-md-0" style={{minWidth:240, maxWidth:320}}>
          <CatalogSidebar
            filters={filters}
            setFilters={setFilters}
            categories={categoryTree}
            sizes={sizes}
            colors={colors}
            brands={BRAND_OPTIONS}
            onReset={handleResetFilters}
          />
        </div>

        <div className="col-12 col-md-8 col-lg-9">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="h4 fw-bold mb-3">Каталог</h1>


          <div className={view === 'grid' ? 'row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3' : 'd-flex flex-column gap-3'}>
            {paginatedProducts.length === 0 ? (
              <div style={{minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <span className="text-muted text-center" style={{fontSize: '1.24rem'}}>Немає товарів за вибраними фільтрами</span>
              </div>
            ) : (
              paginatedProducts.map(product => (
                <div key={product.id} className={view === 'grid' ? 'col' : ''}>
                  <ProductCard product={product} view={view} />
                </div>
              ))
            )}
          </div>

          {total > perPage && (
            <nav className="d-flex justify-content-center mt-4" aria-label="Пагінація каталогу">
              <ul className="pagination">
                <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1} aria-label="Попередня сторінка">
                    Попередня
                  </button>
                </li>
                {Array.from({ length: Math.ceil(total / perPage) }, (_, idx) => idx + 1).map(num => (
                  <li key={num} className={`page-item${page === num ? ' active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(num)}>{num}</button>
                  </li>
                ))}
                <li className={`page-item${page === Math.ceil(total / perPage) ? ' disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === Math.ceil(total / perPage)} aria-label="Наступна сторінка">
                    Наступна
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;