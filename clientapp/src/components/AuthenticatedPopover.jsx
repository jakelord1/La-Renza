import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PURPLE = '#7c3aed';

const AuthenticatedPopover = ({ onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    onClose();
    navigate(path);
  };

  return (
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
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: 16,
        paddingBottom: 16,
        borderBottom: '1px solid #eee'
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#f5f3fb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12
        }}>
          <i className="bi bi-person-fill" style={{ color: PURPLE, fontSize: '1.2rem' }}></i>
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '1rem', color: '#000' }}>Ім'я користувача</div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>user@example.com</div>
        </div>
      </div>

      <div
        onClick={() => handleNavigation('/account')}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 0',
          color: '#000',
          textDecoration: 'none',
          fontSize: '0.95rem',
          fontWeight: 500,
          marginBottom: 8,
          cursor: 'pointer'
        }}
      >
        <i className="bi bi-person me-2" style={{ color: PURPLE }}></i>
        Мій кабінет
      </div>

      <div
        onClick={() => handleNavigation('/account/orders')}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 0',
          color: '#000',
          textDecoration: 'none',
          fontSize: '0.95rem',
          fontWeight: 500,
          marginBottom: 8,
          cursor: 'pointer'
        }}
      >
        <i className="bi bi-bag me-2" style={{ color: PURPLE }}></i>
        Мої замовлення
      </div>

      <div
        onClick={() => handleNavigation('/account/wishlist')}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 0',
          color: '#000',
          textDecoration: 'none',
          fontSize: '0.95rem',
          fontWeight: 500,
          marginBottom: 8,
          cursor: 'pointer'
        }}
      >
        <i className="bi bi-heart me-2" style={{ color: PURPLE }}></i>
        Обране
      </div>

      <div
        onClick={() => handleNavigation('/account/settings')}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 0',
          color: '#000',
          textDecoration: 'none',
          fontSize: '0.95rem',
          fontWeight: 500,
          marginBottom: 16,
          cursor: 'pointer'
        }}
      >
        <i className="bi bi-gear me-2" style={{ color: PURPLE }}></i>
        Налаштування
      </div>

      <button
        style={{
          width: '100%',
          background: '#fff',
          color: PURPLE,
          fontWeight: 600,
          fontSize: '0.95rem',
          border: `2px solid ${PURPLE}`,
          borderRadius: 4,
          padding: '10px 0',
          cursor: 'pointer',
          letterSpacing: 0.2,
          transition: 'background 0.15s, color 0.15s',
        }}
        onClick={() => {
          onClose();
          console.log('Logout clicked');
        }}
      >
        ВИЙТИ
      </button>
    </div>
  );
};

export default AuthenticatedPopover; 