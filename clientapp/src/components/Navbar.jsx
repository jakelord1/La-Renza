import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AccountPopover from './AccountPopover';
import AuthenticatedPopover from './AuthenticatedPopover';
import CartCount from './CartCount';

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
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Simulating auth state
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
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/catalog">Каталог</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/new">Новинки</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/sale">Розпродаж</Link>
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
                  isAuthenticated ? (
                    <AuthenticatedPopover onClose={() => setShowPopover(false)} />
                  ) : (
                    <AccountPopover
                      onLogin={() => window.location.href = '/login'}
                      onRegister={() => window.location.href = '/register'}
                    />
                  )
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
            <div className="w-100 mb-4">
              <form className="d-flex">
                <input
                  type="search"
                  className="form-control form-control-lg border-0"
                  placeholder="Пошук товарів..."
                  style={{ boxShadow: 'none' }}
                  autoFocus
                />
                <button className="btn btn-link" type="button" onClick={() => setShowSearch(false)}>
                  <i className="bi bi-x-lg fs-4"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
