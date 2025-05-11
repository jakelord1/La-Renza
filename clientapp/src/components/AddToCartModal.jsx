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
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    pointerEvents: show ? 'auto' : 'none',
    transition: 'opacity 0.25s',
    opacity: show ? 1 : 0,
  };

  const panelStyle = {
    flex: '0 0 100%',
    maxWidth: 420,
    width: '100%',
    height: '100vh',
    background: '#fff',
    borderRadius: '12px 0 0 12px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
    position: 'relative',
    textAlign: 'left',
    padding: '32px 24px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    transform: show ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.25s',
    overflowY: 'auto',
  };

  useEffect(() => {
    if (show && modalRef && modalRef.current) {
      const btn = modalRef.current.querySelector('button[data-focus-pay]');
      if (btn) btn.focus();
    }
  }, [show, modalRef]);

  // Закрытие по клику вне панели
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!product) return null;
  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div ref={modalRef} style={panelStyle}>
        <button onClick={onClose} style={{position:'absolute',top:18,right:18,background:'none',border:'none',fontSize:28,cursor:'pointer',lineHeight:1, color:'#222'}} aria-label="Закрити">×</button>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
          <div style={{width:32,height:32,background:'#f6f6f6',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2l4-4"/></svg>
          </div>
          <div style={{fontWeight:600,fontSize:'1.2rem'}}>Продукт додано в кошик</div>
        </div>
        <div style={{display:'flex',alignItems:'flex-start',gap:18,marginBottom:24}}>
          <div style={{width:100,height:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <img src={product.image} alt={product.name} style={{maxWidth:'100%',maxHeight:'100%',borderRadius:8,objectFit:'cover',background:'#f6f6f6'}} />
          </div>
          <div style={{textAlign:'left',fontSize:'1.05rem'}}>
            <div style={{fontWeight:500,marginBottom:4}}>{product.name}</div>
            {product.color && <div style={{color:'#666',fontSize:'1rem'}}>колір: {product.color}</div>}
            {selectedSize && <div style={{color:'#666',fontSize:'1rem'}}>розмір: {selectedSize}</div>}
          </div>
        </div>
        <button data-focus-pay onClick={onCheckout} style={{width:'100%',background:'var(--purple)',color:'#fff',fontWeight:600,fontSize:'1.1rem',border:'none',borderRadius:4,padding:'12px 0',marginBottom:16,cursor:'pointer'}}>ПОПЕРЕДНІЙ ПЕРЕГЛЯД КОШИКА</button>
      </div>
    </div>
  );
};

export default AddToCartModal; 