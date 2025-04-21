import React from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import AccountProfile from './account/AccountProfile';
import AccountOrders from './account/AccountOrders';
import AccountAddresses from './account/AccountAddresses';
import AccountWishlist from './account/AccountWishlist';
import AccountSettings from './account/AccountSettings';

const Account = () => {
  const location = useLocation();

  return (
    <div className="account-page py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <div className="account-sidebar">
              <h4 className="mb-4">Мій кабінет</h4>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link 
                    to="/account" 
                    className={`nav-link ${location.pathname === '/account' ? 'active' : ''}`}
                  >
                    Профіль
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/account/orders" 
                    className={`nav-link ${location.pathname === '/account/orders' ? 'active' : ''}`}
                  >
                    Замовлення
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/account/addresses" 
                    className={`nav-link ${location.pathname === '/account/addresses' ? 'active' : ''}`}
                  >
                    Адреси
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/account/wishlist" 
                    className={`nav-link ${location.pathname === '/account/wishlist' ? 'active' : ''}`}
                  >
                    Обране
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/account/settings" 
                    className={`nav-link ${location.pathname === '/account/settings' ? 'active' : ''}`}
                  >
                    Налаштування
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-9">
            <Routes>
              <Route index element={<AccountProfile />} />
              <Route path="orders" element={<AccountOrders />} />
              <Route path="addresses" element={<AccountAddresses />} />
              <Route path="wishlist" element={<AccountWishlist />} />
              <Route path="settings" element={<AccountSettings />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account; 