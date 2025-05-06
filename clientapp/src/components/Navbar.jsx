import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CartCount from './CartCount';
import NavbarDropdownSection from './NavbarDropdownSection';
import data from '../data/dropdownSectionsData.json';

const categories = [
  { label: 'ВСІ', query: 'all' },
  { label: 'ЖІНКА', query: 'woman' },
  { label: 'ДІМ', query: 'home' },
  { label: 'ДИТИНА', query: 'child' },
  { label: 'ЧОЛОВІК', query: 'man' },
  { label: 'АКСЕСУАРИ', query: 'accessories' },
];

const NavbarDropdown = ({ section, onMouseLeave }) => {
  const category = data[section] || data['all'];
  const subcategories = category.subcategories || [];
  const [activeSub, setActiveSub] = useState(0);

  useEffect(() => {
    setActiveSub(0);
  }, [section]);

  return (
    <div
      className="navbar-dropdown-ua"
      onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute',
        right: 0,
        top: '100%',
        background: '#fff',
        zIndex: 1001,
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        padding: 0,
        borderBottom: '1px solid #eee',
        minHeight: 440,
        height: 480,
        width: '100vw',
        left: '50%',
        transform: 'translateX(-50%)',
        paddingTop: 1,
      }}
    >
      <div style={{
        maxWidth: 1080,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        background: '#fff',
        fontSize: 13,
        minHeight: 440,
        height: 480,
      }}>

        <div style={{ width: 240, background: '#fafbfc', borderRight: '1px solid #eee', padding: '22px 0', height: '100%' }}>
          {subcategories.map((sub, idx) => (
            <div
              key={sub.label}
              onMouseEnter={() => setActiveSub(idx)}
              style={{
                display: 'flex', alignItems: 'center', padding: '8px 18px', cursor: 'pointer', fontWeight: 500, fontSize: 14,
                background: idx === activeSub ? '#f5f5f5' : 'transparent',
                transition: 'background .18s',
              }}
            >
              <span style={{ marginRight: 12 }}>
                <i className={sub.icon}></i>
              </span>
              <span>{sub.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: 18, color: '#bbb' }}><i className="bi bi-chevron-right" /></span>
            </div>
          ))}
        </div>

        <NavbarDropdownSection section={section} activeSub={activeSub} />
      </div>
    </div>
  );
};

const Navbar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  const handleCategoryEnter = (catQuery) => {
    setActiveCategory(catQuery);
    setIsCategoryHovered(true);
    setHoveredNav(catQuery);
  };
  const handleCategoryLeave = () => {
    setIsCategoryHovered(false);

  };
  const handleNavLeave = () => {
    setIsDropdownHovered(false);

  };

  useEffect(() => {
    if (!isCategoryHovered && !isDropdownHovered) {
      setActiveCategory(null);
      setHoveredNav(null);
    }
  }, [isCategoryHovered, isDropdownHovered]);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white fixed-top"
      style={{ boxShadow: 'none', zIndex: 1002, position: 'relative', borderBottom: '1px solid #e5e5e5' }}
    >
      <div className="container" style={{ maxWidth: 1080, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>

        <div style={{ display: 'flex', alignItems: 'center', padding: '9px 0', width: '100%', position: 'relative' }}>

          <div style={{ flex: 1 }}></div>
          <Link className="navbar-brand" to="/" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
            <img src="/images/larenza-logo.png" alt="La'Renza" height="18" />
          </Link>
          <div className="d-flex align-items-center" style={{ gap: 8, marginLeft: 'auto' }}>
            <Link to="/search" className="nav-link px-2 text-primary">
              <i className="bi bi-search fs-5" style={{color:'#000'}}></i>
            </Link>
            <Link to="/favorites" className="nav-link px-2 text-warning position-relative">
              <i className="bi bi-heart fs-5" style={{color:'#000'}}></i>
            </Link>
            <div className="dropdown">
              <button className="btn btn-link nav-link px-2 text-dark dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i className="bi bi-person fs-5" style={{color:'#000'}}></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/account">Мій кабінет</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/login">Увійти</Link></li>
                <li><Link className="dropdown-item" to="/register">Реєстрація</Link></li>
              </ul>
            </div>
            <Link to="/cart" className="nav-link px-2 position-relative text-success">
              <i className="bi bi-bag fs-5" style={{color:'#000'}}></i>
              <CartCount />
            </Link>
          </div>
        </div>
        {/* Кнопки и меню под логотипом и иконками */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav" style={{ flex: 1 }}>
            <ul className="navbar-nav mx-auto" style={{ position: 'relative' }}>
              {categories.map((cat) => (
                <li
                  className="nav-item"
                  key={cat.label}
                  onMouseEnter={() => handleCategoryEnter(cat.query)}
                  onMouseLeave={handleCategoryLeave}
                  style={{ position: 'relative' }}
                >
                  <Link
                    className={"nav-link px-3 text-dark fw-bold"}
                    to={`/catalog?category=${cat.query}`}
                    style={{
                      fontSize: 15,
                      background: (activeCategory === cat.query || hoveredNav === cat.query) ? '#f5f5f5' : 'transparent',
                      borderRadius: 3,
                      fontWeight: 700,
                      transition: 'background .12s',
                    }}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {activeCategory && (
        <div
          onMouseEnter={() => setIsDropdownHovered(true)}
          onMouseLeave={handleNavLeave}
          style={{ position: 'absolute', left: 0, right: 0, top: '100%', zIndex: 1001, marginTop: '-1px' }}
        >
          <NavbarDropdown section={activeCategory} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;