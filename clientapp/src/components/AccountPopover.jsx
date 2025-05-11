import React from 'react';

const PURPLE = '#7c3aed';

const AccountPopover = ({ onLogin, onRegister }) => (
  <div style={{
    minWidth: 260,
    maxWidth: 320,
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 4px 24px rgba(124,58,237,0.10)',
    padding: '20px 18px 16px 18px',
    position: 'absolute',
    top: '48px',
    right: 0,
    zIndex: 1050,
    fontFamily: 'inherit',
  }}>
    <div style={{ fontWeight: 500, fontSize: '1.02rem', marginBottom: 6 }}>Ви користувач?</div>
    <button
      style={{
        width: '100%',
        background: PURPLE,
        color: '#fff',
        fontWeight: 700,
        fontSize: '1rem',
        border: 'none',
        borderRadius: 4,
        padding: '10px 0',
        marginBottom: 14,
        cursor: 'pointer',
        letterSpacing: 0.2,
        transition: 'background 0.15s',
      }}
      onClick={onLogin}
    >
      УВІЙТИ
    </button>
    <hr style={{ margin: '7px 0', borderColor: '#eee' }} />
    <div style={{ fontWeight: 500, fontSize: '1.02rem', marginBottom: 6 }}>Це ваш перший візит?</div>
    <button
      style={{
        width: '100%',
        background: '#fff',
        color: PURPLE,
        fontWeight: 700,
        fontSize: '1rem',
        border: `2px solid ${PURPLE}`,
        borderRadius: 4,
        padding: '10px 0',
        cursor: 'pointer',
        letterSpacing: 0.2,
        transition: 'background 0.15s, color 0.15s',
      }}
      onClick={onRegister}
    >
      ЗАРЕЄСТРУВАТИСЬ
    </button>
  </div>
);

export default AccountPopover; 