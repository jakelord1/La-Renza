import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 160px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
      padding: '10px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        padding: '60px 40px',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(111,66,193,0.08)'
      }}>
        <h1 style={{
          fontSize: '140px',
          fontWeight: '700',
          color: 'var(--purple)',
          margin: '0',
          lineHeight: '1'
        }}>404</h1>
        
        <h2 style={{
          fontSize: '32px',
          fontWeight: '600',
          color: '#222',
          margin: '30px 0'
        }}>Сторінку не знайдено</h2>
        
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          На жаль, сторінку, яку ви шукаєте, не знайдено. 
          Можливо, вона була переміщена або видалена.
        </p>
        
        <Link 
          to="/"
          style={{
            display: 'inline-block',
            background: 'var(--purple)',
            color: '#fff',
            padding: '14px 36px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '18px',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#5a32a3'}
          onMouseOut={(e) => e.target.style.background = 'var(--purple)'}
        >
          Повернутися на головну
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 