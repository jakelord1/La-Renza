import React from 'react';
import ProductCard from './ProductCard';

const catalogProducts = [
  {
    id: 1,
    name: 'Basic T-Shirt',
    price: '12.99',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Soft cotton basic t-shirt'
  },
  {
    id: 2,
    name: 'Mom Fit Jeans',
    price: '29.99',
    originalPrice: '39.99',
    sale: true,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'High-waisted mom fit jeans'
  },
  {
    id: 3,
    name: 'Floral Dress',
    price: '24.99',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Light floral print dress'
  },
  {
    id: 4,
    name: 'Oversized Hoodie',
    price: '34.99',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Comfortable oversized hoodie'
  },
  {
    id: 5,
    name: 'Basic Crop Top',
    price: '9.99',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Cotton basic crop top'
  },
  {
    id: 6,
    name: 'Mini Skirt',
    price: '19.99',
    originalPrice: '24.99',
    sale: true,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'A-line mini skirt'
  },
  {
    id: 7,
    name: 'Oversized Shirt',
    price: '27.99',
    image: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Loose fit shirt'
  },
  {
    id: 8,
    name: 'Track Pants',
    price: '22.99',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Comfortable track pants'
  }
];

const Catalog = () => {
  return (
    <div className="catalog-page">
      <div className="catalog-header py-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h1 className="h4 mb-3 mb-md-0">Catalog</h1>
            <div className="catalog-filters d-flex gap-2 align-items-center">
              <div className="dropdown">
                <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  <i className="bi bi-funnel me-2"></i>Filter
                </button>
                <ul className="dropdown-menu">
                  <li><h6 className="dropdown-header">Category</h6></li>
                  <li><a className="dropdown-item" href="#">All</a></li>
                  <li><a className="dropdown-item" href="#">Tops</a></li>
                  <li><a className="dropdown-item" href="#">Bottoms</a></li>
                  <li><a className="dropdown-item" href="#">Dresses</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><h6 className="dropdown-header">Size</h6></li>
                  <li><a className="dropdown-item" href="#">XS</a></li>
                  <li><a className="dropdown-item" href="#">S</a></li>
                  <li><a className="dropdown-item" href="#">M</a></li>
                  <li><a className="dropdown-item" href="#">L</a></li>
                  <li><a className="dropdown-item" href="#">XL</a></li>
                </ul>
              </div>
              <select className="form-select form-select-sm" style={{ width: 'auto' }}>
                <option>Sort by</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
                <option>Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-4">
        <div className="catalog-grid">
          {catalogProducts.map((product) => (
            <div key={product.id} className="catalog-grid-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog; 