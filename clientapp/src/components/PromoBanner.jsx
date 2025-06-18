import React, { useEffect, useState } from 'react';
import './PromoBanner.css';

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
    <div className="larenza-font promo-banner">
      {promoText}
    </div>
  );
};

export default PromoBanner;
