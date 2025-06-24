
import React, { useEffect, useState } from 'react';


import ProductCard from './ProductCard';
import UnifiedCartModal from './UnifiedCartModal';
import { Link } from 'react-router-dom';

const MODELS_API_URL = '/api/Models';
const PRODUCTS_API_URL = '/api/Products';

const ProductGrid = ({ activeCategory = 'Усі' }) => {
  const [models, setModels] = useState([]);
  const [products, setProducts] = useState([]);
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

        setModels(modelsData);
        setProducts(productsData);
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

  const filteredModels = modelsWithProducts.filter(model =>
    (activeCategory === 'Усі' || model.categoryId === Number(activeCategory)) && model.products.length > 0
  );

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
  onAddToCart={handleAddToCart} 
  onCardClick={() => window.location.href = `/product/${model.id}`}
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
