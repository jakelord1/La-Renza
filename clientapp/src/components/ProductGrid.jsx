import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const API_URL = 'https://localhost:7071/api/Products';


const ProductGrid = () => {
    const [mockProducts, setMockProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });



const fetchModels = async () => {
    setLoading(true);
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Помилка завантаження моделей');
        const data = await res.json();
        setMockProducts(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
}, []);
  <div className="container">
    <div className="row g-3 g-md-4">
      {mockProducts.map(product => (
        <div className="col-6 col-md-4 col-lg-3" key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  </div>
};

export default ProductGrid;
