import React, { createContext, useState } from 'react';

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

  return (
    <BannerContext.Provider value={{ carouselItems, setCarouselItems }}>
      {children}
    </BannerContext.Provider>
  );
};
