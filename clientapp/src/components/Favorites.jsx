import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import FavoritesCount from './FavoritesCount';

const API_URL = import.meta.env.VITE_BACKEND_API_LINK;

const recommended = [
  { id: 1, name: 'Трикотажний комплект', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=400&q=80', price: 219, sizes: '98 - 140' },
  { id: 2, name: 'Світшот', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&q=80', price: 239, sizes: '110 - 146' },
  { id: 3, name: 'Футболка basic', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=facearea&w=400&q=80', price: 219, sizes: '98 - 140' },
  { id: 4, name: 'Бавовняна сорочка з коміром', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=400&q=80', price: 189, sizes: 'S - XL' },
  { id: 5, name: 'Топ', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&q=80', price: 169, sizes: 'XS - L' },
  { id: 6, name: 'Сорочка з акуратною вставкою', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=facearea&w=400&q=80', price: 289, sizes: 'S - XL' },
  { id: 7, name: 'Футболка з принтом', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=400&q=80', price: 119, sizes: '98 - 140' },
  { id: 8, name: 'В\'язані шорти', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&q=80', price: 169, sizes: 'XS - L' },
];

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Проверка авторизации и загрузка избранного
  const fetchFavorites = async () => {
    setLoading(true);
    // Проверить авторизацию
    const authRes = await fetch('/api/Account/accountProfile', { credentials: 'include' });
    setIsAuthenticated(authRes.ok);
    if (!authRes.ok) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    // Загрузить избранные модели
    const res = await fetch(`${API_URL}/api/Account/accountModels`, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setFavorites(Array.isArray(data) ? data : []);
    } else {
      setFavorites([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
    const update = () => fetchFavorites();
    window.addEventListener('favorites-updated', update);
    return () => window.removeEventListener('favorites-updated', update);
  }, []);

  // Удаление из избранного через API
  const handleRemoveFavorite = async (modelId) => {
    const res = await fetch(`${API_URL}/api/Account/accountModels/${modelId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      window.dispatchEvent(new Event('favorites-updated'));
    }
  };

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
                {recommended.map(product => (
                  <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : favorites.length === 0 ? (
          <div className="text-center py-5">У вас немає обраних товарів.</div>
        ) : (
          <div className="catalog-grid">
            {favorites.map(model => (
              <div key={model.id} className="catalog-grid-item position-relative">
                <ProductCard
                  model={model}
                  sizes={model.sizes || model.size || model.Sizes || []}
                  isAuthenticated={isAuthenticated}
                  isFavorite={true}
                  onFavoriteChange={() => window.dispatchEvent(new Event('favorites-updated'))}
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
