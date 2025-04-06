import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h5>Shop</h5>
            <ul className="list-unstyled">
              <li><Link to="/new-arrivals" className="text-white-50">New Arrivals</Link></li>
              <li><Link to="/best-sellers" className="text-white-50">Best Sellers</Link></li>
              <li><Link to="/sale" className="text-white-50">Sale</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Help</h5>
            <ul className="list-unstyled">
              <li><Link to="/contact" className="text-white-50">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-white-50">Shipping</Link></li>
              <li><Link to="/returns" className="text-white-50">Returns</Link></li>
            </ul>
          </div>
          <div className="col-md-6">
            <h5>About Us</h5>
            <p className="text-white-50">
              Fashion-forward clothing and accessories for the modern lifestyle.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 