import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import FavoritesCount from './FavoritesCount';

const API_URL = import.meta.env.VITE_BACKEND_API_LINK;

const MODELS_API_URL = '/api/Models';

function getRandomItems(arr, n, excludeIds = []) {
  const filtered = arr.filter(item => !excludeIds.includes(item.id));
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const Favorites = () => {
  const [favorites, setFavorites] = useState([]); 
  const [favoriteModels, setFavoriteModels] = useState([]); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allModels, setAllModels] = useState([]);
  const [allProducts, setAllProducts] = useState([]);


  useEffect(() => {
    fetch(MODELS_API_URL)
      .then(res => res.ok ? res.json() : [])
      .then(data => setAllModels(Array.isArray(data) ? data : []))
      .catch(() => setAllModels([]));
    fetch('/api/Products')
      .then(res => res.ok ? res.json() : [])
      .then(data => setAllProducts(Array.isArray(data) ? data : []))
      .catch(() => setAllProducts([]));
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    const authRes = await fetch('/api/Account/accountProfile', { credentials: 'include' });
    setIsAuthenticated(authRes.ok);
    if (!authRes.ok) {
      setFavorites([]);
      setFavoriteModels([]);
      setLoading(false);
      return;
    }
    const res = await fetch(`${API_URL}/api/Account/accountModels`, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      const ids = Array.isArray(data) ? data.map(m => m.id) : [];
      setFavorites(ids);
      
      let models = allModels;
      let products = allProducts;
      if (!allModels.length || !allProducts.length) {
        const [modelsRes, productsRes] = await Promise.all([
          fetch(MODELS_API_URL),
          fetch('/api/Products')
        ]);
        models = (modelsRes.ok ? await modelsRes.json() : []);
        products = (productsRes.ok ? await productsRes.json() : []);
        setAllModels(models);
        setAllProducts(products);
      }
      const favModels = models.filter(model => ids.includes(model.id));
      const favModelsWithProducts = favModels.map(model => {
        const modelProducts = products.filter(
          product => product.color && product.color.model && product.color.model.id === model.id
        ).map(product => ({
          ...product,
          price: product.color && product.color.model && product.color.model.price != null ? product.color.model.price : product.price
        }));
        return { ...model, products: modelProducts };
      });
      setFavoriteModels(favModelsWithProducts);
    } else {
      setFavorites([]);
      setFavoriteModels([]);
    }
    setLoading(false);
  };


  useEffect(() => {
    fetchFavorites();
    const update = () => fetchFavorites();
    window.addEventListener('favorites-updated', update);
    return () => window.removeEventListener('favorites-updated', update);
  }, []);


  return (
    <section className="favorites-page py-5">
      <div className="container">
        <div className="d-flex align-items-center mb-2" style={{marginTop: '10px'}}>
          <h2 className="fw-bold mb-0" style={{color: '#222', fontSize: '2.2rem', letterSpacing: '-1px'}}>Вибране</h2>
          <FavoritesCount />
          <span className="badge rounded-pill ms-3" style={{background: '#1976f7', color: '#fff', fontWeight: 500, fontSize: '1rem', padding: '8px 18px'}}>НОВИНКИ</span>
        </div>
        <hr style={{marginTop: 0, marginBottom: '40px', borderColor: '#eee'}} />
        <div style={{marginBottom: '50px'}}></div>
        {loading ? (
          <div className="text-center py-5">Завантаження...</div>
        ) : !isAuthenticated ? (
          <>
            <div className="row justify-content-center text-center my-5">
              <div className="col-md-4 mb-4">
                <i className="bi bi-heart text-primary" style={{fontSize: '64px'}}></i>
                <h5 className="fw-bold mt-3">Додати</h5>
                <div className="text-secondary">Швидко зберігайте товари на потім</div>
              </div>
              <div className="col-md-4 mb-4">
                <i className="bi bi-arrow-counterclockwise text-success" style={{fontSize: '64px'}}></i>
                <h5 className="fw-bold mt-3">Повернутися</h5>
                <div className="text-secondary">Повертайтеся до своїх вибраних товарів, коли захочете. Слідкуйте за їх наявністю!</div>
              </div>
              <div className="col-md-4 mb-4">
                <i className="bi bi-grid text-warning" style={{fontSize: '64px'}}></i>
                <h5 className="fw-bold mt-3">Відкрийте для себе</h5>
                <div className="text-secondary">Знайдіть схожі товари</div>
              </div>
            </div>
            <div style={{marginBottom: '70px'}}></div>
            <div className="mt-5 mb-5" style={{background: '#f6f7fa', borderRadius: '8px', padding: '40px 20px'}}>
              <div className="text-center mb-2" style={{fontWeight: 700, fontSize: '1.25rem'}}>Чи повинні тут бути якісь товари?</div>
              <div className="text-center text-secondary" style={{fontSize: '1.05rem'}}>
                Якщо ви вважаєте, що додавали товари раніше, <a href="/login" className="text-decoration-underline">Увійдіть до облікового запису</a>, щоб побачити їх.
              </div>
            </div>
            <div style={{marginBottom: '100px'}}></div>
            <div className="container px-0 mt-5 mb-5">
              <h2 className="fw-bold text-center mb-5" style={{fontSize: '2rem', letterSpacing: '-1px'}}>Інші клієнти замовили також</h2>
              <div className="row justify-content-center">
                {getRandomItems(allModels, 8, favorites.map(f => f.id)).map(model => {
  const modelProducts = allProducts.filter(
    product => product.color && product.color.model && product.color.model.id === model.id
  ).map(product => ({
    ...product,
    price: product.color && product.color.model && product.color.model.price != null ? product.color.model.price : product.price
  }));
  return (
    <div key={model.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4">
      <ProductCard model={model} products={modelProducts} isAuthenticated={isAuthenticated} />
    </div>
  );
})}
              </div>
            </div>
          </>
        ) : favorites.length === 0 ? (
          <>
            <div className="row justify-content-center text-center my-5">
              <div className="col-md-4 mb-4">
                <i className="bi bi-heart text-primary" style={{fontSize: '64px'}}></i>
                <h5 className="fw-bold mt-3">Додати</h5>
                <div className="text-secondary">Швидко зберігайте товари на потім</div>
              </div>
              <div className="col-md-4 mb-4">
                <i className="bi bi-arrow-counterclockwise text-success" style={{fontSize: '64px'}}></i>
                <h5 className="fw-bold mt-3">Повернутися</h5>
                <div className="text-secondary">Повертайтеся до своїх вибраних товарів, коли захочете. Слідкуйте за їх наявністю!</div>
              </div>
              <div className="col-md-4 mb-4">
                <i className="bi bi-grid text-warning" style={{fontSize: '64px'}}></i>
                <h5 className="fw-bold mt-3">Відкрийте для себе</h5>
                <div className="text-secondary">Знайдіть схожі товари</div>
              </div>
            </div>
            <div style={{marginBottom: '70px'}}></div>
            <div className="mt-5 mb-5" style={{background: '#f6f7fa', borderRadius: '8px', padding: '40px 20px'}}>
              <div className="text-center mb-2" style={{fontWeight: 700, fontSize: '1.25rem'}}>
                Чи повинні тут бути якісь товари?
              </div>
              <div className="text-center text-secondary" style={{fontSize: '1.05rem'}}>
                Якщо ви вважаєте, що додавали товари раніше, <a href="/login" className="text-decoration-underline">Увійдіть до облікового запису</a>, щоб побачити їх.
              </div>
            </div>
            <div style={{marginBottom: '100px'}}></div>
            <div className="container px-0 mt-5 mb-5">
              <h2 className="fw-bold text-center mb-5" style={{fontSize: '2rem', letterSpacing: '-1px'}}>
                Інші клієнти замовили також
              </h2>
              <div className="row justify-content-center">
                {getRandomItems(allModels, 8, favorites.map(f => f.id)).map(model => {
  const modelProducts = allProducts.filter(
    product => product.color && product.color.model && product.color.model.id === model.id
  ).map(product => ({
    ...product,
    price: product.color && product.color.model && product.color.model.price != null ? product.color.model.price : product.price
  }));
  return (
    <div key={model.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4">
      <ProductCard model={model} products={modelProducts} isAuthenticated={isAuthenticated} />
    </div>
  );
})}
              </div>
            </div>
          </>
        ) : (
          <div className="catalog-grid">
            {favoriteModels.map(model => (
              <div key={model.id} className="catalog-grid-item position-relative">
                <ProductCard
                  model={model}
                  products={model.products}
                  isAuthenticated={isAuthenticated}
                  isFavorite={true}
                  onFavoriteChange={() => window.dispatchEvent(new Event('favorites-updated'))}
                  onCardClick={() => window.location.href = `/product/${model.id}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Favorites;
