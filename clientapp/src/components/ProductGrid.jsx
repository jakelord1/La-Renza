
import React, { useEffect, useState } from 'react';


import ProductCard from './ProductCard';

const API_URL = 'https://localhost:7071/api/Products';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження моделей');
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      {alert.show && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}
      {loading ? (
        <div className="text-center my-4">Завантаження...</div>
      ) : (
        <div className="row g-3 g-md-4">
          {products.length === 0 ? (
            <div className="col-12 text-center">Немає доступних товарів.</div>
          ) : (
            products.map(product => (
              <div className="col-6 col-md-4 col-lg-3" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

};

export default ProductGrid;
