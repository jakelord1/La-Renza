import React from 'react';
import { Link } from 'react-router-dom';
import CartCount from './CartCount'; // Assuming CartCount is in the same directory

const Navbar = () => {
  return (
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
              <Link className="nav-link px-3 text-dark fw-semibold" to="/catalog?category=new">НОВИНКИ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 text-dark fw-semibold" to="/catalog?category=clothing">ОДЯГ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 text-dark fw-semibold" to="/catalog?category=accessories">АКСЕСУАРИ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 text-dark fw-semibold" to="/catalog?category=sale">РОЗПРОДАЖ</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
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
      </div>
    </nav>
  );
};

export default Navbar;