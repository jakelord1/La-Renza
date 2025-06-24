import React from 'react';
import ReactDOM from 'react-dom';

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.18)',
  zIndex: 3000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const boxStyle = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
  padding: '36px 32px 32px 32px',
  maxWidth: 420,
  width: '100%',
  textAlign: 'center',
  position: 'relative',
};

const imgStyle = {
  width: 90,
  height: 90,
  objectFit: 'cover',
  borderRadius: 12,
  marginBottom: 16,
  background: '#f6f6f6',
};

const closeBtnStyle = {
  position: 'absolute',
  top: 18,
  right: 18,
  background: 'none',
  border: 'none',
  fontSize: 28,
  cursor: 'pointer',
  lineHeight: 1,
  color: '#222',
};

const btnStyle = {
  width: '100%',
  padding: '14px 0',
  background: 'var(--purple)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '1.07rem',
  marginTop: 16,
  cursor: 'pointer',
};

const btnOutline = {
  width: '100%',
  padding: '14px 0',
  background: '#fff',
  color: '#222',
  border: '2px solid #222',
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '1.07rem',
  marginTop: 12,
  cursor: 'pointer',
};

const LoginToFavoriteModal = ({ show, onClose, productImage, onLogin, onRegister }) => {
  if (!show) return null;
  return ReactDOM.createPortal(
    <div style={modalStyle}>
      <div style={boxStyle}>
        <button onClick={onClose} style={closeBtnStyle} aria-label="Закрити">×</button>
        {productImage && <img src={productImage} alt="Фото товару" style={imgStyle} />}
        <div style={{fontWeight:600, fontSize:'1.2rem', marginBottom:8}}>Додано до улюблених</div>
        <div style={{fontSize:'1.07rem', color:'#444', marginBottom:24}}>
          Увійдіть, щоб додати товари до улюблених і зберегти їх на потім.
        </div>
        <button style={btnStyle} onClick={onLogin}>УВІЙТИ АБО СТВОРИТИ АККАУНТ</button>
        <button style={btnOutline} onClick={onRegister}>СТВОРИТИ АККАУНТ</button>
      </div>
    </div>,
    document.body
  );
};

export default LoginToFavoriteModal;
