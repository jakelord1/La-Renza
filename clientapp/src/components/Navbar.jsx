import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
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
              <Link className="nav-link px-3" to="/catalog?category=new">NEW</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/catalog?category=clothing">CLOTHING</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/catalog?category=accessories">ACCESSORIES</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/catalog?category=sale">SALE</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <Link to="/search" className="nav-link px-2 text-white">
              <i className="bi bi-search fs-5"></i>
            </Link>
            <div className="dropdown">
              <button className="btn btn-link nav-link px-2 text-white dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i className="bi bi-person fs-5"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/account">My Account</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/login">Sign In</Link></li>
                <li><Link className="dropdown-item" to="/register">Sign Up</Link></li>
              </ul>
            </div>
            <Link to="/cart" className="nav-link px-2 position-relative text-white">
              <i className="bi bi-bag fs-5"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 