import React, { createContext, useState, useEffect } from 'react';

export const BannerContext = createContext();

const defaultCarouselItems = [
  {
    image: '../src/assets/images/banner/car-banner.png',
    link: '/catalog',
  },
  {
    image: '../src/assets/images/banner/delivery-banner.png',
    link: '/favorites',
  },
  {
    image: '../src/assets/images/banner/plants-banner.png',
    link: '/sale',
  },
];

export const BannerProvider = ({ children }) => {
  const [carouselItems, setCarouselItems] = useState(defaultCarouselItems);

  useEffect(() => {
    fetch('/api/Configurator')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) return;
        const banners = data.find(item => item.name === 'Банери');
        if (banners && Array.isArray(banners.value) && banners.value.length > 0) {
          setCarouselItems(
            banners.value.map(b => ({ image: b.path, link: b.link }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <BannerContext.Provider value={{ carouselItems, setCarouselItems }}>
      {children}
    </BannerContext.Provider>
  );
};
