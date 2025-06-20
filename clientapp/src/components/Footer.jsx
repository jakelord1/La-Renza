import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-larenza bg-white pt-4 pb-2">
      <div className="container">
        <div className="row mt-4 gy-4" style={{borderTop: '1px solid #eee'}}>
          <div className="col-12 col-sm-6 col-lg-3 text-md-start text-center">
            <div className="fw-bold mb-2 small text-uppercase text-purple">La'renza</div>
            <ul className="list-unstyled mb-0 small">
              <li><a href="#" className="footer-link text-dark">Про магазин</a></li>
              <li><a href="#" className="footer-link text-dark">Доставка і оплата</a></li>
              <li><a href="#" className="footer-link text-dark">Повернення</a></li>
              <li><a href="#" className="footer-link text-dark">Контакти</a></li>
            </ul>
          </div>
          <div className="col-12 col-sm-6 col-lg-3 text-md-start text-center">
            <div className="fw-bold mb-2 small text-uppercase text-purple">Покупцям</div>
            <ul className="list-unstyled mb-0 small">
              <li><a href="#" className="footer-link text-dark">FAQ</a></li>
              <li><a href="#" className="footer-link text-dark">Як замовити</a></li>
              <li><a href="#" className="footer-link text-dark">Відстежити замовлення</a></li>
              <li><a href="#" className="footer-link text-dark">Таблиця розмірів</a></li>
              <li><a href="#" className="footer-link text-dark">Бонусна програма</a></li>
              <li><a href="#" className="footer-link text-dark">Подарункові сертифікати</a></li>
            </ul>
          </div>
          <div className="col-12 col-sm-6 col-lg-3 text-md-start text-center">
            <div className="fw-bold mb-2 small text-uppercase text-purple">Сервіси</div>
            <ul className="list-unstyled mb-0 small">
              <li><a href="#" className="footer-link text-dark">Мій профіль</a></li>
              <li><a href="#" className="footer-link text-dark">Обране</a></li>
              <li><a href="#" className="footer-link text-dark">Історія замовлень</a></li>
              <li><a href="#" className="footer-link text-dark">Повернення товару</a></li>
              <li><a href="#" className="footer-link text-dark">Зворотній зв'язок</a></li>
            </ul>
          </div>
          <div className="col-12 col-sm-6 col-lg-3 text-md-start text-center">
            <div className="fw-bold mb-2 small text-uppercase text-purple">Ми у соцмережах</div>
            <div className="d-flex gap-2 mb-2 justify-content-center justify-content-lg-start">
              <a href="#" className="footer-social"><i className="bi bi-facebook" /></a>
              <a href="#" className="footer-social"><i className="bi bi-instagram" /></a>
              <a href="#" className="footer-social"><i className="bi bi-tiktok" /></a>
              <a href="#" className="footer-social"><i className="bi bi-youtube" /></a>
            </div>
            <div className="mb-2 small">Завантажте додаток</div>
            <div className="d-flex gap-2 mb-3 justify-content-center justify-content-lg-start">
              <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{height:32}} /></a>
              <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg" alt="App Store" style={{height:32}} /></a>
            </div>
            <div className="bg-light rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 small mt-2 mx-auto mx-lg-0">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg" alt="UA" style={{width:20, borderRadius: '50%'}} />
              Україна
            </div>
          </div>
        </div>
        <div className="text-center pt-4 pb-2 small text-secondary-50 mt-3">
          &copy; {new Date().getFullYear()} La'Renza. Всі права захищено.
        </div>
      </div>
    </footer>
  );
};

export default Footer;