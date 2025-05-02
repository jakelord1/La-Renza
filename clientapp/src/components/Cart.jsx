import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCheckout, setIsCheckout] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(getCart());
    const update = () => setCartItems(getCart());
    window.addEventListener('cart-updated', update);
    return () => window.removeEventListener('cart-updated', update);
  }, []);

  const totalPrice = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const removeItem = (id) => {
    const updated = getCart().filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleCheckout = () => setIsCheckout(true);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order placed', { cartItems, formData });
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cart-updated'));
    setCartItems([]);
    setIsCheckout(false);
    setOrderPlaced(true);
  };

  return (
    <section className="cart-page bg-light py-5">
      <div className="container">
        <h2 className="text-center mb-4 text-purple fw-bold">Корзина</h2>
        {orderPlaced && (
          <div className="alert alert-success text-center">Дякуємо за ваше замовлення!</div>
        )}
        {!orderPlaced && (
          cartItems.length === 0 ? (
            <div className="card bg-white rounded-4 p-4 shadow-sm text-center mx-auto" style={{ maxWidth: '400px' }}>
              <p className="mb-0 text-secondary fs-5">Ваш кошик пустий.</p>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-6">
                <div className="row g-4 mb-4">
                  {cartItems.map(product => (
                    <div key={product.id} className="col-12">
                      <div className="d-flex align-items-center bg-white rounded-3 shadow-sm p-3">
                        <img src={product.image} alt={product.name} style={{width: 80, height: 80, objectFit: 'cover', borderRadius: '4px'}} />
                        <div className="ms-3 flex-grow-1">
                          <h5 className="mb-1">{product.name}</h5>
                          <p className="mb-0 text-purple fw-bold">{product.price} UAH</p>
                        </div>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => removeItem(product.id)}>Видалити</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-between align-items-center bg-white rounded-3 shadow-sm p-3">
                  <h4 className="mb-0">Вартість:</h4>
                  <h4 className="mb-0 text-purple fw-bold">{totalPrice.toFixed(2)} UAH</h4>
                </div>
                {!isCheckout && (
                  <div className="text-end mt-3">
                    <button className="btn text-white px-4 py-2" style={{background: 'var(--purple)'}} onClick={handleCheckout}>Оформити замовлення</button>
                  </div>
                )}
              </div>
              <div className="col-md-6">
                {isCheckout && (
                  <form onSubmit={handleSubmit} className="card p-4 bg-white rounded-4 shadow-sm" style={{ width: '100%' }}>
                    <h3 className="text-center mb-4 text-purple">Оформлення замовлення</h3>
                    <div className="mb-3">
                      <label className="form-label">Ім'я</label>
                      <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Телефон</label>
                      <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Адреса доставки</label>
                      <textarea className="form-control" name="address" value={formData.address} onChange={handleChange} rows={3} required />
                    </div>
                    <div className="text-end">
                      <button type="submit" className="btn text-white px-4 py-2" style={{background: 'var(--purple)'}}>Підтвердити замовлення</button>
                      <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/')}>Продовжити покупки</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Cart;
