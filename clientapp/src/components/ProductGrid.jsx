
import React, { useEffect, useState } from 'react';


import ProductCard from './ProductCard';
const API_URL = 'https://localhost:7071/api/Account/allModels';

const MODELS_API_URL = '/api/Models';
const PRODUCTS_API_URL = '/api/Products';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження моделей');
      const data = await res.json();
      const mapApiModel  = (model) => ({
        id: model.id,
        name: model.name,
        image: model.imageUrl || '',
        sizes: model.sizes && model.sizes.length > 0 ? model.sizes.join(', ') : 'Розміри відсутні',
        price: model.price || 0,
        categoryId: model.categoryId,
        badges: model.bages || [],
        description: model.description,
        materialInfo: model.materialInfo,
        rate: model.rate,
      });
      setProducts(data.map(mapApiModel));
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

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
    );
    return { ...model, products: modelProducts };
  });

  const filteredModels = modelsWithProducts.filter(model =>
    (activeCategory === 'Усі' || model.categoryId === Number(activeCategory)) && model.products.length > 0
  );

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