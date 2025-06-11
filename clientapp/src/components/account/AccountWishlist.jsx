import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://localhost:7071/api/Account/accountFavoriteProducts';


const BADGE_COLORS = {
  'НОВИНКА': 'bg-primary text-white',
  'ЦІНИ ВАУ!': 'bg-pink text-white',
  'ХІТ ПРОДАЖУ': 'bg-warning text-dark',
};

const AccountWishlist = () => {
  const navigate = useNavigate();
 const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(API_URL, {
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
          <div key={item.id} className="product-card position-relative d-flex flex-column p-0" 
            style={{
              background:'#fff', 
              borderRadius: '10px', 
              minWidth: 260, 
              maxWidth: 260, 
              width: 260, 
              height: 420, 
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
              border: 'none', 
              overflow:'hidden', 
              margin:'0 10px 18px 10px'
            }}
          >
            <div className="position-relative w-100" style={{flex:'1 1 auto', minHeight:200, height:200, width:'100%'}}>
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-100 h-100 object-fit-cover" 
                style={{
                  display:'block', 
                  borderRadius: '0', 
                  background:'#f6f6f6', 
                  height:'100%', 
                  objectFit:'cover'
                }} 
              />
              <button 
                className="btn p-0 position-absolute top-0 end-0 m-2 shadow-sm" 
                style={{
                  background:'rgba(255,255,255,0.96)', 
                  borderRadius:'50%', 
                  width:36, 
                  height:36, 
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center', 
                  boxShadow:'0 2px 6px rgba(0,0,0,0.08)'
                }}
              >
                <svg width="22" height="22" fill="red" stroke="red" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0l-.54.54-.54-.54a5.5 5.5 0 0 0-7.78 7.78l.54.54L12 21.35l7.78-8.42.54-.54a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            <div className="px-3 pt-3 pb-2 d-flex flex-column gap-1 flex-grow-1 w-100" style={{fontSize:'0.98rem', background:'#fff'}}>
              <div className="text-secondary small lh-1 mb-1" style={{minHeight:18}}>{item.sizes}</div>
              <div className="fw-normal text-truncate mb-1" title={item.name} style={{fontSize:'1rem',lineHeight:'1.2'}}>{item.name}</div>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <span className="fw-bold" style={{fontSize:'1.08rem',color:'var(--purple)'}}>{item.price} UAH</span>
              </div>

              <div className="d-flex gap-1 flex-wrap mt-1">
             {(Array.isArray(item.badges) ? item.badges : []).map((b, i) => b && (
             <span key={i} className={`badge px-2 py-1 small fw-semibold ${BADGE_COLORS[b]||'bg-light text-dark'}`} style={{fontSize:'0.72rem',borderRadius:3,letterSpacing:0.2}}>{b}</span>
              ))}

              </div>
            </div>

            <button 
              className="btn p-0 position-absolute bottom-0 end-0 m-2 shadow-sm" 
              style={{
                background:'rgba(255,255,255,0.97)', 
                borderRadius:'50%', 
                width:36, 
                height:36, 
                display:'flex',
                alignItems:'center',
                justifyContent:'center', 
                boxShadow:'0 2px 6px rgba(0,0,0,0.08)'
              }}
            >
              <svg width="22" height="22" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
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