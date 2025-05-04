import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  } catch {
    return [];
  }
};

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
    const update = () => setFavorites(getFavorites());
    window.addEventListener('favorites-updated', update);
    return () => window.removeEventListener('favorites-updated', update);
  }, []);

  return (
    <section className="favorites-page bg-light py-5">
      <div className="container">
        <h2 className="text-center mb-4 text-purple fw-bold">Обране</h2>
        {favorites.length === 0 ? (
          <div className="card bg-white rounded-4 p-4 shadow-sm text-center mx-auto" style={{ maxWidth: '400px' }}>
            <p className="mb-0 text-secondary fs-5">У вас немає обраних товарів.</p>
          </div>
        ) : (
          <div className="catalog-grid">
            {favorites.map(product => (
              <div key={product.id} className="catalog-grid-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Favorites;
