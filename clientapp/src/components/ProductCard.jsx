import React from 'react';
import AddToCartModal from './AddToCartModal';
import SelectSizeModal from './SelectSizeModal';
import UnifiedCartModal from './UnifiedCartModal';

const BADGE_COLORS = {
  'НОВИНКА': 'bg-primary text-white',
  'ЦІНИ ВАУ!': 'bg-pink text-white',
  'ХІТ ПРОДАЖУ': 'bg-warning text-dark',
};

const isFavorite = (product) => {
  try {
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    return favs.some((item) => item.id === product.id);
  } catch (error) { /* ignore parse error */ }
  return false;
};

const toggleFavorite = (product) => {
  let favs = [];
  try {
    favs = JSON.parse(localStorage.getItem('favorites')) || [];
  } catch (error) { /* ignore parse error */ }
  if (favs.some((item) => item.id === product.id)) {
    favs = favs.filter((item) => item.id !== product.id);
  } else {
    favs.push(product);
  }
  localStorage.setItem('favorites', JSON.stringify(favs));
  window.dispatchEvent(new Event('favorites-updated'));
};

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch (error) { /* ignore parse error */ }
  return [];
};
const isInCart = (product) => getCart().some((item) => item.id === product.id);

const ProductCard = ({ product }) => {

  const badges = product.badges || [product.isNew && 'НОВИНКА', product.isWow && 'ЦІНИ ВАУ!', product.isBestseller && 'ХІТ ПРОДАЖУ'].filter(Boolean);
  const sizes = product.sizes || '98 - 140';

  const [favorite, setFavorite] = React.useState(isFavorite(product));
  const [inCart, setInCart] = React.useState(isInCart(product));
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    const update = () => setFavorite(isFavorite(product));
    window.addEventListener('favorites-updated', update);
    return () => window.removeEventListener('favorites-updated', update);
  }, [product]);

  React.useEffect(() => {
    const updateCart = () => setInCart(isInCart(product));
    window.addEventListener('cart-updated', updateCart);
    return () => window.removeEventListener('cart-updated', updateCart);
  }, [product]);

  const handleCartClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);
  const handleCheckout = () => {
    setShowModal(false);
    window.location.href = '/cart';
  };

  return (
    <div className="product-card position-relative d-flex flex-column p-0" style={{background:'#fff', borderRadius: '10px', minWidth: 260, maxWidth: 260, width: 260, height: 420, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: 'none', overflow:'hidden', margin:'0 10px 18px 10px'}}>

      <div className="position-relative w-100" style={{flex:'1 1 auto', minHeight:200, height:200, width:'100%'}}>
        <img src={product.image} alt={product.name} className="w-100 h-100 object-fit-cover" style={{display:'block', borderRadius: '0', background:'#f6f6f6', height:'100%', objectFit:'cover'}} />
        <button className="btn p-0 position-absolute top-0 end-0 m-2 shadow-sm" style={{background:'rgba(255,255,255,0.96)', borderRadius:'50%', width:36, height:36, display:'flex',alignItems:'center',justifyContent:'center', boxShadow:'0 2px 6px rgba(0,0,0,0.08)'}} onClick={() => toggleFavorite(product)}>
          <svg width="22" height="22" fill={favorite ? 'red' : 'none'} stroke={favorite ? 'red' : '#222'} strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0l-.54.54-.54-.54a5.5 5.5 0 0 0-7.78 7.78l.54.54L12 21.35l7.78-8.42.54-.54a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="px-3 pt-3 pb-2 d-flex flex-column gap-1 flex-grow-1 w-100" style={{fontSize:'0.98rem', background:'#fff'}}>
        <div className="text-secondary small lh-1 mb-1" style={{minHeight:18}}>{sizes}</div>
        <div className="fw-normal text-truncate mb-1" title={product.name} style={{fontSize:'1rem',lineHeight:'1.2'}}>{product.name}</div>
        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
          <span className="fw-bold" style={{fontSize:'1.08rem',color:'var(--purple)'}}>{product.price} UAH</span>
          {product.originalPrice && <span className="text-muted text-decoration-line-through small">{product.originalPrice} UAH</span>}
        </div>

        <div className="d-flex gap-1 flex-wrap mt-1">
          {badges.map((b,i) => b && (
            <span key={i} className={`badge px-2 py-1 small fw-semibold ${BADGE_COLORS[b]||'bg-light text-dark'}`} style={{fontSize:'0.72rem',borderRadius:3,letterSpacing:0.2}}>{b}</span>
          ))}
        </div>
      </div>

      <button className="btn p-0 position-absolute bottom-0 end-0 m-2 shadow-sm" style={{background:'rgba(255,255,255,0.97)', borderRadius:'50%', width:36, height:36, display:'flex',alignItems:'center',justifyContent:'center', boxShadow:'0 2px 6px rgba(0,0,0,0.08)'}} onClick={handleCartClick}>
        <svg width="22" height="22" fill={inCart ? 'var(--purple)' : 'none'} stroke={inCart ? 'var(--purple)' : '#222'} strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      </button>
      <UnifiedCartModal
        show={showModal}
        product={product}
        onClose={handleCloseModal}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default ProductCard;