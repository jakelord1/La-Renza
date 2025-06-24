import React, { useEffect } from 'react';

const AddToCartModal = ({ show, product, onClose, onCheckout, modalRef, selectedSize }) => {
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.18)',
    zIndex: 2000,
    display: show ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: show ? 'auto' : 'none',
    transition: 'opacity 0.25s',
    opacity: show ? 1 : 0,
  };

  const cardStyle = {
    width: '330px',
    maxWidth: '94vw',
    background: '#fff',
    borderRadius: '18px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    padding: '28px 18px 22px 18px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    textAlign: 'center',
  };

  useEffect(() => {
    if (show && modalRef && modalRef.current) {
      const btn = modalRef.current.querySelector('button[data-focus-pay]');
      if (btn) btn.focus();
    }
  }, [show, modalRef]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!product) return null;
  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div ref={modalRef} style={cardStyle}>
        <button onClick={onClose} style={{position:'absolute',top:14,right:14,background:'none',border:'none',fontSize:26,cursor:'pointer',lineHeight:1, color:'#222',padding:0}} aria-label="Закрити">×</button>
        <div style={{marginBottom:16}}>
          <div style={{width:40,height:40,background:'#f6f6f6',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px auto'}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2l4-4"/></svg>
          </div>
          <div style={{fontWeight:700,fontSize:'1.33rem',marginBottom:6}}>Товар додано в кошик</div>
          <div style={{color:'#222',fontWeight:500,fontSize:'1.03rem',marginBottom:2}}>{product.name}{selectedSize ? ` - Розмір ${selectedSize}` : ''}</div>
          <div style={{color:'#222',fontWeight:700,fontSize:'1.13rem',marginBottom:13}}>{product.price != null ? `${product.price} UAH` : 'Ціна не вказана'}</div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:18}}>
          <img src={product.image} alt={product.name} style={{width:98,height:98,objectFit:'cover',borderRadius:10,background:'#f6f6f6'}} />
        </div>
        <button data-focus-pay onClick={onCheckout} style={{width:'100%',background:'var(--purple)',color:'#fff',fontWeight:700,fontSize:'1.06rem',border:'none',borderRadius:6,padding:'13px 0',marginBottom:10,cursor:'pointer',letterSpacing:0.5,boxShadow:'0 2px 8px rgba(162,89,230,0.08)'}}>ПЕРЕЙТИ ДО ОПЛАТИ</button>
        <button onClick={onClose} style={{width:'100%',background:'none',color:'#222',fontWeight:700,fontSize:'1.02rem',border:'none',borderRadius:6,padding:'8px 0',cursor:'pointer',textDecoration:'underline'}}>ПРОДОВЖИТИ ПОКУПКИ</button>
      </div>
    </div>
  );
};

export default AddToCartModal;