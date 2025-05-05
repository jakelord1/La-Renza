import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CartCount from './CartCount';
import AccountPopover from './AccountPopover';

const popularTags = [
  'сумка', 'джинси жіночі', 'піжама', 'футболка',
  'лонгслів', 'футболка жіноча', 'боді', 'шорти'
];

const recommendedProducts = [
  {
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=400&q=80',
    title: 'Блузка',
    price: '339 UAH',
    onlineOnly: false,
    badge: ''
  },
  {
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&q=80',
    title: 'Джинсові спідн...',
    price: '659 UAH',
    onlineOnly: true,
    badge: ''
  },
  {
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=facearea&w=400&q=80',
    title: 'Футболка з кор...',
    price: '219 UAH',
    onlineOnly: true,
    badge: 'BESTSELLER'
  }
];

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const searchRef = useRef(null);
  const popoverTimeout = useRef();

  const handleToggleSearch = e => {
    e.preventDefault();
    setShowSearch(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = e => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top" style={{ boxShadow: 'none' }}>
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src="/images/larenza-logo.png" alt="La'Renza" height="18" />
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link px-3 text-dark fw-semibold" to="/catalog?category=new">
                  НОВИНКИ
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3 text-dark fw-semibold" to="/catalog?category=clothing">
                  ОДЯГ
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3 text-dark fw-semibold" to="/catalog?category=accessories">
                  АКСЕСУАРИ
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3 text-dark fw-semibold" to="/catalog?category=sale">
                  РОЗПРОДАЖ
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center position-relative" ref={searchRef}>
              <form className="search position-relative me-3" style={{ width: '200px' }} onSubmit={handleToggleSearch}>
                <i
                  className="bi bi-search position-absolute top-50 start-0 translate-middle-y text-dark ps-2"
                  style={{ fontSize: '1rem', cursor: 'pointer' }}
                  onClick={handleToggleSearch}
                />
                <input
                  type="search"
                  name="title"
                  className="form-control border-0 border-bottom"
                  placeholder="Пошук"
                  aria-label="Search"
                  style={{ paddingLeft: '35px' }}
                  onFocus={() => setShowSearch(true)}
                  readOnly
                />
              </form>

              <Link to="/favorites" className="nav-link px-2 text-warning position-relative">
                <i className="bi bi-heart fs-5" style={{ color: '#000' }}></i>
              </Link>

              <div
                className="position-relative"
                onMouseEnter={() => {
                  clearTimeout(popoverTimeout.current);
                  setShowPopover(true);
                }}
                onMouseLeave={() => {
                  popoverTimeout.current = setTimeout(() => setShowPopover(false), 120);
                }}
                style={{display: 'flex', alignItems: 'center'}}
              >
                <button
                  className="btn btn-link nav-link px-2 text-dark"
                  type="button"
                  style={{outline: 'none', boxShadow: 'none'}}
                  tabIndex={0}
                >
                  <i className="bi bi-person fs-5" style={{ color: '#000' }} />
                </button>
                {showPopover && (
                  <AccountPopover
                    onLogin={() => window.location.href = '/login'}
                    onRegister={() => window.location.href = '/register'}
                  />
                )}
              </div>

              <Link to="/cart" className="nav-link px-2 position-relative text-success">
                <i className="bi bi-bag fs-5" style={{ color: '#000' }}></i>
                <CartCount />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {showSearch && (
        <div
          className="search-overlay-outer"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.25)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={e => {
            if (e.target.classList.contains('search-overlay-outer')) setShowSearch(false);
          }}
        >
          <div
            className="search-overlay bg-white p-4 shadow rounded"
            style={{
              width: '95vw',
              maxWidth: '1400px',
              minHeight: '320px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn-close position-absolute"
              style={{ top: 16, right: 16, zIndex: 10 }}
              aria-label="Close"
              onClick={() => setShowSearch(false)}
            />
            <form className=" mb-4" style={{ width: '94%' }} onSubmit={handleToggleSearch}>
              <div className="position-relative">
                <i
                  className="bi bi-search position-absolute top-50 start-0 translate-middle-y text-dark ps-2"
                  style={{ fontSize: '1.2rem', left: '10px', cursor: 'pointer' }}
                  onClick={handleToggleSearch}
                />
                <input
                  type="search"
                  name="title"
                  className="form-control border-0 border-bottom ps-5 py-2"
                  placeholder="Пошук"
                  aria-label="Search"
                  autoFocus
                  style={{ fontSize: '1.2rem', background: 'transparent' }}
                />
              </div>
            </form>
            <div className="d-flex w-100 justify-content-center align-items-start" style={{gap: '80px'}}>
              <div style={{ minWidth: '260px', flex: '0 0 260px', paddingLeft: '40px' }}>
                <h6 className="mb-3">Найпопулярніші</h6>
                <div className="d-flex flex-wrap">
                  {popularTags.map(tag => (
                    <button key={tag} className="btn btn-outline-secondary btn-sm m-1">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ flex: '1 1 0', minWidth: '0', paddingLeft: '20px' }}>
                <h6 className="mb-3">Рекомендуємо</h6>
                <div className="d-flex flex-wrap justify-content-start">
                  {recommendedProducts.map((p, idx) => (
                    <div key={idx} style={{ width: '110px', margin: '0 12px 20px 0' }} className="text-center">
                      <img src={p.image} alt={p.title} className="img-fluid mb-2 rounded shadow-sm" style={{height: '110px', objectFit: 'cover', width: '100%'}} />
                      <p className="mb-1 small">{p.title}</p>
                      <p className="fw-bold mb-1 small">{p.price}</p>
                      {p.onlineOnly && <p className="text-muted small mb-1">тільки онлайн</p>}
                      {p.badge && <p className="text-warning small fw-bold mb-0">{p.badge}</p>}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h6 className="mb-3">Популярні колекції</h6>
                  <div className="d-flex flex-wrap gap-3">
                    <div className="text-center" style={{ width: '110px' }}>
                      <img src="https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=facearea&w=200&q=80" alt="Весна 2024" className="img-fluid rounded mb-2 shadow-sm" style={{height: '110px', objectFit: 'cover', width: '100%'}} />
                      <div className="small">Весна 2024</div>
                    </div>
                    <div className="text-center" style={{ width: '110px' }}>
                      <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=200&q=80" alt="Street Style" className="img-fluid rounded mb-2 shadow-sm" style={{height: '110px', objectFit: 'cover', width: '100%'}} />
                      <div className="small">Street Style</div>
                    </div>
                    <div className="text-center" style={{ width: '110px' }}>
                      <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=facearea&w=200&q=80" alt="Для дому" className="img-fluid rounded mb-2 shadow-sm" style={{height: '110px', objectFit: 'cover', width: '100%'}} />
                      <div className="small">Для дому</div>
                    </div>
                    <div className="text-center" style={{ width: '110px' }}>
                      <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=200&q=80" alt="Спорт" className="img-fluid rounded mb-2 shadow-sm" style={{height: '110px', objectFit: 'cover', width: '100%'}} />
                      <div className="small">Спорт</div>
                    </div>
                    <div className="text-center" style={{ width: '110px' }}>
                      <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=200&q=80" alt="Весна 2025" className="img-fluid rounded mb-2 shadow-sm" style={{height: '110px', objectFit: 'cover', width: '100%'}} />
                      <div className="small">Весна 2025</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
