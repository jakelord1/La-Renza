import React from 'react';
import ReactDOM from 'react-dom';

const UnifiedCartModal = ({ show, product, onClose, onCheckout }) => {
  const getProductImage = (product) => {
    if (!product) return '/images/no-image.jpg';
    if (product.image && typeof product.image === 'string' && product.image.trim()) {
      return product.image;
    }
    if (Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === 'string' && product.images[0].trim()) {
      return product.images[0];
    }
    return '/images/no-image.jpg';
  };

  const [step, setStep] = React.useState('select'); // 'select' | 'added'
  const [selectedSize, setSelectedSize] = React.useState(null);
  const [isAdding, setIsAdding] = React.useState(false);

  const addToCart = async (modelId, sizeName, quantity) => {
    try {
      const response = await fetch('https://localhost:7071/api/Account/addToCartByModel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ modelId, sizeName, quantity }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  React.useEffect(() => {
    if (show) {
      setStep('select');
      setSelectedSize(null);
      setIsAdding(false);
    }
  }, [show, product]);

  if (!product) return null;
  const sizes = product.sizes && Array.isArray(product.sizes)
    ? product.sizes
    : (typeof product.sizes === 'string' ? product.sizes.split(',').map(s => s.trim()) : ['ОДИН РОЗМІР']);

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.18)',
    zIndex: 2000,
    display: show ? 'flex' : 'none',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    pointerEvents: show ? 'auto' : 'none',
    transition: 'opacity 0.25s',
    opacity: show ? 1 : 0,
  };

  const modalStyle = {
    flex: '0 0 100%',
    maxWidth: 560,
    width: '100%',
    height: '100vh',
    background: '#fff',
    borderRadius: '12px 0 0 12px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
    textAlign: 'left',
    padding: '32px 32px 32px 32px',
    transform: show ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.25s',
    overflowY: 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  };

  const imagesBlockStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    overflowX: images.length > 1 ? 'auto' : 'visible',
    maxWidth: 220,
    minWidth: 120,
    alignItems: 'center',
    height: 140,
  };

  const infoBlockStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 8,
    minWidth: 0,
  };

  const rowStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: 24,
    alignItems: 'flex-start',
    marginBottom: 18,
  };

  const sizesRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
    marginBottom: 0,
    justifyContent: 'flex-start',
  };

  const sizeBtnStyle = {
    minWidth: 64,
    padding: '12px 0',
    background: '#fff',
    color: '#222',
    border: '2px solid #d1c4e9',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'border 0.2s',
  };

  const oneSizeBtnStyle = {
    width: '100%',
    padding: '16px 0',
    background: 'var(--purple)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: 24,
  };

  const handleSelectSize = async (size) => {
    if (step !== 'select' || isAdding) return; // Захист від повторного виклику
    setIsAdding(true);
    setSelectedSize(size);
    console.log('Selected size:', size);

    const modelId = product.modelId;
    if (!modelId) {
      console.warn('modelId is missing in product:', product);
      alert('Внутрішня помилка: відсутній modelId');
      setIsAdding(false);
      return;
    }
    const sizeName = size;
    const quantity = 1;

    try {
      await addToCart(modelId, sizeName, quantity);
      let cart = [];
      try { cart = JSON.parse(localStorage.getItem('cart')) || []; } catch (e) { cart = []; }
      cart.push({
        ...product,
        name: product.name || '',
        image: product.image || (product.images && product.images[0]) || '',
        color: product.color || '',
        price: product.price || 0,
        selectedSize: size
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
      setStep('added');
    } catch (error) {
      alert('Не вдалося додати товар в корзину');
    }
  };

  return ReactDOM.createPortal(
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', lineHeight: 1, color: '#222' }} aria-label="Закрити">×</button>
        {step === 'select' ? (
          <>
            <div style={{ fontWeight: 600, fontSize: '1.3rem', marginBottom: 24 }}>Оберіть розмір</div>
            <div style={rowStyle}>
              <div style={imagesBlockStyle}>
                <img src={getProductImage(product)} alt={product.name} style={{ width: images.length > 1 ? 90 : 120, height: images.length > 1 ? 90 : 120, objectFit: 'cover', borderRadius: 8, background: '#f6f6f6' }} />
                {images.length > 1 && images.slice(1).map((img, i) => (
                  <img key={i} src={img} alt={product.name} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8, background: '#f6f6f6' }} />
                ))}
              </div>
              <div style={infoBlockStyle}>
                <div style={{ fontWeight: 500, fontSize: '1.1rem', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                <div style={{ color: '#666', fontSize: '1rem', marginBottom: 2 }}>{product.price} UAH</div>
                <button style={{ background: 'none', border: 'none', color: 'var(--purple)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', padding: 0, textAlign: 'left', margin: '0 0 0 0' }}>
                  ОСОБЛИВОСТІ &gt;
                </button>
              </div>
            </div>
            {sizes.length === 1 ? (
              <button style={oneSizeBtnStyle} onClick={() => handleSelectSize(sizes[0])} disabled={isAdding}>{sizes[0]}</button>
            ) : (
              <div style={sizesRowStyle}>
                {sizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSize(size)}
                    style={sizeBtnStyle}
                    disabled={isAdding}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 32, height: 32, background: '#f6f6f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2l4-4" /></svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: '1.2rem' }}>Продукт додано в кошик</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 24 }}>
              <div style={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={getProductImage(product)} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 8, objectFit: 'cover', background: '#f6f6f6' }} />
              </div>
              <div style={{ textAlign: 'left', fontSize: '1.05rem' }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>{product.name}</div>
                {product.color && <div style={{ color: '#666', fontSize: '1rem' }}>колір: {product.color}</div>}
                {selectedSize && <div style={{ color: '#666', fontSize: '1rem' }}>розмір: {selectedSize}</div>}
              </div>
            </div>
            <button onClick={onCheckout} style={{width:'100%',background:'var(--purple)',color:'#fff',fontWeight:600,fontSize:'1.1rem',border:'none',borderRadius:4,padding:'12px 0',marginBottom:16,cursor:'pointer'}}>ПОПЕРЕДНІЙ ПЕРЕГЛЯД КОШИКА</button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default UnifiedCartModal; 