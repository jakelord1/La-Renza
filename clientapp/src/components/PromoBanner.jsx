import React, { useEffect, useState } from 'react';

const PromoBanner = () => {
  const [promoText, setPromoText] = useState('');

  useEffect(() => {
    fetch('/api/Configurator')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const promo = data.find(item => item.name === 'PromoBanner' && item.type === 'array');
        if (promo && Array.isArray(promo.value)) {
          const active = promo.value.find(b => b.active);
          setPromoText(active ? active.title : '');
        } else {
          setPromoText('');
        }
      })
      .catch(() => setPromoText(''));
  }, []);

  return (
    <div className="larenza-font" style={{
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
      {promoText}
    </div>
  );
};

export default PromoBanner;
