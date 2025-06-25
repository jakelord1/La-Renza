import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../ProductCard';

const API_URL = 'https://localhost:7071/api/Account';


const BADGE_COLORS = {
  'IsNew': 'bg-primary text-white',
  'ЦІНИ ВАУ!': 'bg-pink text-white',
  'ХІТ ПРОДАЖУ': 'bg-warning text-dark',
};


const AccountWishlist = () => {
  const navigate = useNavigate();
 const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/accountModels`, {
      credentials: 'include' 
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTPS error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
          console.log('Fetched data:', data); 
         setWishlist(data);
      })
      .catch(error => {
        console.error('Failed to fetch wishlist:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleBack = () => {
    navigate('/');
  };

if (loading) {
    return <div className="text-center py-5">Завантаження...</div>;
  }
  return (
    <div className="account-content">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold mb-0" style={{fontSize: '2.1rem'}}>Мій список бажань</h2>
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted" style={{fontSize: '1.1rem'}}>
            {wishlist.length} товарів
          </span>
          <button 
            className="btn btn-outline-purple rounded-3 d-flex align-items-center gap-2"
            style={{
              borderColor: 'var(--purple)',
              color: 'var(--purple)',
              fontWeight: 600,
              padding: '8px 16px',
              transition: 'all 0.2s ease-in-out'
            }}
            onClick={handleBack}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--purple)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--purple)';
            }}
          >
            <i className="bi bi-arrow-left"></i>
            Повернутися
          </button>
        </div>
      </div>

      <div className="d-flex flex-wrap" style={{margin: '0 -10px'}}>
        {wishlist.map((item) => (
          <div key={item.id} className="catalog-grid-item position-relative" style={{margin:'0 10px 18px 10px'}}>
            <ProductCard
              model={item}
              sizes={item.sizes || item.size || item.Sizes || []}
              isAuthenticated={true}
              isFavorite={true}
              onFavoriteChange={() => window.dispatchEvent(new Event('favorites-updated'))}
              onCardClick={() => window.location.href = `/product/${item.id}`}
            />
          </div>
        ))}
      </div>

      {wishlist.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-heart" style={{fontSize: '4rem', color: 'var(--purple)'}}></i>
          </div>
          <h3 className="fw-bold mb-3">Ваш список бажань порожній</h3>
          <p className="text-muted mb-4">Додайте товари до списку бажань, щоб зберегти їх на потім</p>
          <button 
            className="btn btn-purple btn-lg rounded-3 px-4"
            style={{
              background: 'var(--purple)',
              border: 'none',
              fontWeight: 600
            }}
            onClick={handleBack}
          >
            Перейти до каталогу
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountWishlist; 