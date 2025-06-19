import React, { useState, useEffect, useRef, useContext } from 'react';
import { BannerContext } from './BannerContext';
import './MainBanner.css';


const MainBanner = () => {
  const { carouselItems } = useContext(BannerContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex(idx => (idx + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const prev = () => setActiveIndex((activeIndex - 1 + carouselItems.length) % carouselItems.length);
  const next = () => setActiveIndex((activeIndex + 1) % carouselItems.length);

  return (
    <div className="container mb-4">
      <div
        className="main-carousel rounded-4 overflow-hidden position-relative w-100"
      >
        <a href={carouselItems[activeIndex].link} style={{ display: 'block' }}>
          <img
            src={carouselItems[activeIndex].image}
            alt="Promo"
            className="object-fit-cover"
          />
        </a>
        {/* Left Arrow */}
        <button
          className="carousel-arrow carousel-arrow-left position-absolute top-50 start-0 translate-middle-y d-flex align-items-center justify-content-center"
          style={{ zIndex: 4, left: 44, width: 56, height: 56, borderRadius: '50%', background: '#fff', border: 'none', boxShadow: '0 2px 8px #0001', cursor: 'pointer' }}
          onClick={prev}
          aria-label="Попередній"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        {/* Right Arrow */}
        <button
          className="carousel-arrow carousel-arrow-right position-absolute top-50 end-0 translate-middle-y d-flex align-items-center justify-content-center"
          style={{ zIndex: 4, right: 44, width: 56, height: 56, borderRadius: '50%', background: '#fff', border: 'none', boxShadow: '0 2px 8px #0001', cursor: 'pointer' }}
          onClick={next}
          aria-label="Наступний"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
        </button>
      </div>
    </div>
  );
};

export default MainBanner;
