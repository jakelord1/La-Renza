import React from 'react';
import AddToCartModal from './AddToCartModal';
import SelectSizeModal from './SelectSizeModal';
import UnifiedCartModal from './UnifiedCartModal';
import LoginToFavoriteModal from './LoginToFavoriteModal';

const BADGE_COLORS = {
  'НОВИНКА': 'bg-primary text-white',
  'ЦІНИ ВАУ!': 'bg-pink text-white',
  'ХІТ ПРОДАЖУ': 'bg-warning text-dark',
};

const API_URL = 'https://localhost:7071/api/Users/Model';

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch (error) { 
  }
  return [];
};

const isInCart = (product) => getCart().some((item) => item.id === product.id);

const ProductCard = ({ model, products, onAddToCart, onCardClick }) => {
  if (!model) return null;
  const mainPhoto = (model.photos && model.photos.length > 0 && model.photos[0].path) ? `/images/${model.photos[0].path}` : '';

  const badges = model.badges || [model.isNew && 'НОВИНКА'].filter(Boolean);

  const sizes = Array.from(new Set(products.map(p => p.size?.name).filter(Boolean)));

  const minPrice = products.length ? Math.min(...products.map(p => p.price || 0)) : (model.price || 0);

  const [activeColorId, setActiveColorId] = React.useState((model.colors && model.colors[0]?.id) || null);
  const colorProduct = React.useMemo(() => (
    products.find(p => p.color && p.color.id === activeColorId) || products[0] || {}
  ), [products, activeColorId]);

  const [liked, setLiked] = React.useState(false);
  const [showFavoriteModal, setShowFavoriteModal] = React.useState(false);
  const [inCart, setInCart] = React.useState(isInCart(colorProduct));

  React.useEffect(() => {
    const updateCart = () => setInCart(isInCart(colorProduct));
    window.addEventListener('cart-updated', updateCart);
    return () => window.removeEventListener('cart-updated', updateCart);
  }, [colorProduct]);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setLiked(true);
    setShowFavoriteModal(true);
  };

  const handleCloseFavoriteModal = () => {
    setShowFavoriteModal(false);
    setLiked(false);
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleRegister = () => {
    window.location.href = '/register';
  };

  const handleCloseModal = () => setShowModal(false);
  const handleCheckout = () => {
    setShowModal(false);
    window.location.href = '/cart';
  };

  return (
    <div 
      className="product-card position-relative d-flex flex-column p-0" 
      style={{background:'#fff', borderRadius: '10px', minWidth: 260, maxWidth: 260, width: 260, height: 420, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: 'none', overflow:'hidden', margin:'0 10px 18px 10px'}}
      role="button"
      tabIndex={0}
      onClick={onCardClick}
    >
      <div className="position-relative w-100" style={{flex:'1 1 auto', minHeight:200, height:200, width:'100%'}}>
        <img src={mainPhoto} alt={model.name} className="w-100 h-100 object-fit-cover" style={{display:'block', borderRadius: '0', background:'#f6f6f6', height:'100%', objectFit:'cover'}} />
        <button className="btn p-0 position-absolute top-0 end-0 m-2 shadow-sm" style={{background:'rgba(255,255,255,0.97)', borderRadius:'50%', width:36, height:36, display:'flex',alignItems:'center',justifyContent:'center', boxShadow:'0 2px 6px rgba(0,0,0,0.08)'}} onClick={e => { e.stopPropagation(); handleLikeClick(e); }}>
          <svg width="22" height="22" fill={liked ? 'var(--purple)' : 'none'} stroke={liked ? 'var(--purple)' : '#222'} strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>

      <div className="px-3 pt-3 pb-2 d-flex flex-column gap-1 flex-grow-1 w-100" style={{fontSize:'0.98rem', background:'#fff'}}>
        <div className="text-secondary small lh-1 mb-1" style={{minHeight:18}}>{sizes.length ? sizes.join(', ') : 'Без розміру'}</div>
        <div className="fw-normal text-truncate mb-1" title={model.name} style={{fontSize:'1rem',lineHeight:'1.2'}}>{model.name}</div>
        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
          <span className="fw-bold" style={{fontSize:'1.08rem',color:'var(--purple)'}}>{minPrice} UAH</span>
        </div>
        <div className="d-flex gap-1 flex-wrap mt-1">
          {badges.map((b,i) => b && (
            <span key={b} className={`badge px-2 py-1 small fw-semibold ${BADGE_COLORS[b]||'bg-light text-dark'}`} style={{fontSize:'0.72rem',borderRadius:3,letterSpacing:0.2}}>{b}</span>
          ))}
        </div>
        <div className="d-flex gap-2 mt-2 flex-wrap align-items-center">
          {(model.colors || []).map(color => {
            let colorImg = color.image?.path || '';
            if (colorImg.startsWith('/public/')) colorImg = colorImg.replace(/^\/public/, '');
            colorImg = colorImg ? `/images/${colorImg.replace(/^\, '')}` : null;
            const isActive = color.id === activeColorId;
            return (
              <span
                key={color.id}
                title={color.name}
                onClick={e => { e.stopPropagation(); setActiveColorId(color.id); }}
                style={{
                  display: 'inline-block',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: isActive ? '2px solid #333' : '2px solid #eee',
                  overflow: 'hidden',
                  background: isActive ? '#eaeaea' : '#f4f4f4',
                  boxShadow: isActive ? '0 2px 8px #0002' : '0 1px 3px #0001',
                  cursor: 'pointer',
                  outline: isActive ? '2px solid #555' : 'none',
                  transition: 'border 0.15s, box-shadow 0.15s, background 0.15s'
                }}
              >
                {colorImg ? (
                  <img src={colorImg} alt={color.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <span style={{width:'100%',height:'100%',display:'block',background:'#ccc'}}></span>
                )}
              </span>
            );
          })}
        </div>
      </div>
      <button className="btn p-0 position-absolute bottom-0 end-0 m-2 shadow-sm" style={{background:'rgba(255,255,255,0.97)', borderRadius:'50%', width:36, height:36, display:'flex',alignItems:'center',justifyContent:'center', boxShadow:'0 2px 6px rgba(0,0,0,0.08)'}} onClick={e => { e.stopPropagation(); onAddToCart({
        ...colorProduct,
        name: model.name,
        price: colorProduct.price,
        color: (colorProduct.color && colorProduct.color.name) || (model.colors && model.colors.find(c => c.id === activeColorId)?.name) || '',
        image: (colorProduct.color && colorProduct.color.image && colorProduct.color.image.path)
          ? `/images/${colorProduct.color.image.path.replace(/^\/public/, '').replace(/^\, '')}`
          : (model.photos && model.photos[0]?.path ? `/images/${model.photos[0].path}` : ''),
        sizes: Array.from(new Set(products.map(p => p.size?.name).filter(Boolean)))
      }); }}>
        <svg width="22" height="22" fill={inCart ? 'var(--purple)' : 'none'} stroke={inCart ? 'var(--purple)' : '#222'} strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      </button>
      <LoginToFavoriteModal
        show={showFavoriteModal}
        onClose={handleCloseFavoriteModal}
        productImage={mainPhoto}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default ProductCard;