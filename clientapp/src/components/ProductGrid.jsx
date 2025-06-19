
import React, { useEffect, useState } from 'react';


import ProductCard from './ProductCard';

const API_URL = 'https://localhost:7071/api/Products';

const ProductGrid = ({ activeCategory = 'Усі' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження моделей');
      const data = await res.json();
      const mapApiProduct = (apiProduct) => ({
        id: apiProduct.id,
        name: apiProduct.color?.name || 'Без назви',
        image: apiProduct.color?.image || '',
        sizes: apiProduct.size?.name || '',
        quantity: apiProduct.quantity,
        usersLikesId: apiProduct.usersLikesId,
        color: apiProduct.color,
        size: apiProduct.size,
        price: apiProduct.price || 0,
        categoryId: apiProduct.size?.categoryId ?? null,
      });
      setProducts(data.map(mapApiProduct));
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
          {(products.filter(product => activeCategory === 'Усі' || product.categoryId === Number(activeCategory)).length === 0) ? (
            <div className="col-12 text-center">Немає доступних товарів.</div>
          ) : (
            products
              .filter(product => activeCategory === 'Усі' || product.categoryId === Number(activeCategory))
              .map(product => (
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
