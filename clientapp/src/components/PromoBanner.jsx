import React from 'react';

const PromoBanner = () => (
  <div style={{
    width: '100%',
    background: '#7326b6',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    minHeight: 38,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: 0.1,
    padding: '0 0',
    border: 'none',
    zIndex: 2000,
  }}>
    Безкоштовна доставка при замовленні від 300000₴ по всій Україні!
  </div>
);

export default PromoBanner;
