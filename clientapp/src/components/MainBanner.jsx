import React from 'react';

const MainBanner = () => (
  <div className="container mb-4">
    <div className="rounded-4 overflow-hidden position-relative w-100" style={{minHeight: 280, maxHeight: 400, background: 'linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%)'}}>
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Promo" className="w-100 h-100 position-absolute top-0 start-0 object-fit-cover" style={{opacity: 0.7, minHeight: 280, maxHeight: 400, objectFit: 'cover'}} />
      <div className="position-absolute top-50 start-50 translate-middle text-center w-100 px-2" style={{zIndex: 2}}>
        <h2 className="fw-bold text-dark mb-3" style={{fontSize: '2.4rem', textShadow: '0 2px 8px #fff8'}}>Весняна колекція для дому</h2>
        <a href="#" className="btn btn-lg btn-purple px-4 shadow">Дивитись</a>
      </div>
    </div>
  </div>
);

export default MainBanner;
