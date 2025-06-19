import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
};

const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  } catch {
    return [];
  }
};

const setFavorites = (favorites) => {
  localStorage.setItem('favorites', JSON.stringify(favorites));
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
  const [favorites, setFavoritesState] = useState(getFavorites());
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 1, name: 'Дім', address: 'вул. Шевченка, 10, кв. 5, Київ' },
    { id: 2, name: 'Робота', address: 'вул. Хрещатик, 22, офіс 15, Київ' }
  ]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(getCart());
    setFavoritesState(getFavorites());
    const update = () => setCartItems(getCart());
    window.addEventListener('cart-updated', update);
    return () => window.removeEventListener('cart-updated', update);
  }, []);

  const deliveryOptions = [
    { id: 'nova', name: 'Нова Пошта (отримання у відділенні)', price: 50, eta: '1-5 днів' },
    { id: 'meest_pay', name: 'Meest Пошта (оплата при отриманні)', price: 50, eta: '2-9 днів' },
    { id: 'meest_online', name: 'Meest Пошта (онлайн оплата)', price: 0, eta: '2-9 днів' },
    { id: 'nova_online', name: 'Нова Пошта (онлайн оплата)', price: 0, eta: '1-5 днів' },
  ];
  const paymentOptions = [
    { id: 'card', name: 'Банківська карта' },
    { id: 'gpay', name: 'Google Pay' },
    { id: 'apay', name: 'Apple Pay' },
  ];

  const changeQuantity = (id, value) => {
    if (value === 0) {
      removeItem(id);
    } else {
      let newQuantity = value;
      if (typeof value === 'string') {
        newQuantity = parseInt(value, 10);
        if (isNaN(newQuantity)) newQuantity = 1;
      }
      newQuantity = Math.max(1, Math.min(1000, newQuantity));
      const updated = getCart().map(item => {
        if (item.id === id) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(updated));
      window.dispatchEvent(new Event('cart-updated'));
    }
  };

  const addToFavorites = (product) => {
    let favs = getFavorites();
    if (!favs.find(item => item.id === product.id)) {
      favs.push(product);
      setFavorites(favs);
      setFavoritesState(favs);
      removeItem(product.id);
    }
  };

  const isFavorite = (id) => favorites.some(item => item.id === id);

  const totalPrice = cartItems.reduce((sum, item) => sum + ((Number(item.price) || 0) * (item.quantity || 1)), 0);
  const deliveryPrice = selectedDelivery ? deliveryOptions.find(opt => opt.id === selectedDelivery)?.price || 0 : 0;
  const totalWithDelivery = totalPrice + deliveryPrice;

  const removeItem = (id) => {
    const updated = getCart().filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleCheckout = () => setIsCheckout(true);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDelivery || !selectedPayment) return;
    console.log('Order placed', { cartItems, formData, selectedDelivery, selectedPayment });
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cart-updated'));
    setCartItems([]);
    setIsCheckout(false);
    setOrderPlaced(true);
  };

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoApplied(true);
      setPromoDiscount(totalPrice * 0.1); 
    } else {
      alert('Невірний промокод');
    }
  };

  const totalWithDiscount = totalPrice - promoDiscount;
  const finalTotal = totalWithDiscount + deliveryPrice;

  function QuantitySelector({ quantity, onChange }) {
    const [custom, setCustom] = useState(false);
    const [customValue, setCustomValue] = useState(quantity > 9 ? quantity : '');

    useEffect(() => {
      if (quantity > 9) {
        setCustom(false); 
        setCustomValue(quantity);
      } else {
        setCustom(false);
        setCustomValue('');
      }
    }, [quantity]);

    const handleSelect = e => {
      if (e.target.value === '10+') {
        setCustom(true);
        setCustomValue(quantity > 9 ? quantity : '');
      } else if (e.target.value === '0') {
        onChange(0); // удалить
      } else {
        setCustom(false);
        onChange(Number(e.target.value));
      }
    };

    const handleInput = e => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 4) val = val.slice(0, 4);
      setCustomValue(val);
    };

    const handleConfirm = () => {
      let num = Math.max(10, Math.min(1000, Number(customValue)));
      if (!customValue || isNaN(num)) return;
      onChange(num);
      setCustom(false);
    };

    const handleInputKeyDown = e => {
      if (e.key === 'Enter') {
        handleConfirm();
      }
      if (e.key === 'Escape') {
        setCustom(false);
        setCustomValue(quantity > 9 ? quantity : '');
      }
    };

    const standardOptions = [1,2,3,4,5,6,7,8,9];
    const showCustomOption = quantity > 9 && !standardOptions.includes(quantity);

    return (
      <>
        {!custom ? (
          <select
            className="form-select form-select-sm d-inline-block"
            style={{width: 70, display: 'inline-block'}}
            value={quantity === 0 ? 1 : quantity}
            onChange={handleSelect}
          >
            <option value="0" style={{color: 'red'}}>0 (Видалити)</option>
            {standardOptions.map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
            <option value="10+">10+</option>
            {showCustomOption && (
              <option value={quantity}>{quantity}</option>
            )}
          </select>
        ) : (
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 4}}>
            <input
              type="number"
              min="10"
              max="1000"
              className="form-control form-control-sm d-inline-block"
              style={{width: 60, display: 'inline-block'}}
              value={customValue}
              onChange={handleInput}
              onKeyDown={handleInputKeyDown}
              placeholder="10+"
              autoFocus
            />
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              style={{height: 32, fontWeight: 600, minWidth: 32}}
              onClick={handleConfirm}
              disabled={!customValue || isNaN(Number(customValue)) || Number(customValue) < 10 || Number(customValue) > 1000}
            >Підтвердити</button>
          </div>
        )}
      </>
    );
  }

  const customStyles = `
    .address-list-group {
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e0e0e0;
    }
    .address-radio {
      appearance: none;
      -webkit-appearance: none;
      background: #fff;
      border: 2px solid #bbb;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      margin-right: 12px;
      position: relative;
      outline: none;
      transition: border-color 0.2s;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      cursor: pointer;
      vertical-align: middle;
      display: inline-block;
    }
    .address-radio:checked {
      border-color: var(--purple, #8000ff);
    }
    .address-radio:checked::after {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      background: var(--purple, #8000ff);
      border-radius: 50%;
      position: absolute;
      top: 3px;
      left: 3px;
    }
    .add-address-btn {
      background: var(--purple, #8000ff) !important;
      color: #fff !important;
      border-radius: 0 0 16px 16px !important;
      border: none !important;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
      justify-content: flex-start;
      margin-top: 0;
      width: 100%;
      padding-left: 32px;
      padding-right: 32px;
      box-sizing: border-box;
      transition: background 0.2s;
    }
    .add-address-btn:hover, .add-address-btn:focus {
      background: #6a00cc !important;
      color: #fff !important;
    }
    .add-address-btn .bi {
      color: #fff !important;
    }
    .btn-fav-outline {
      color: var(--purple, #8000ff) !important;
      border: 1.5px solid var(--purple, #8000ff) !important;
      background: #fff !important;
      font-weight: 500;
      transition: background 0.2s, color 0.2s;
    }
    .btn-fav-outline:hover, .btn-fav-outline:focus {
      background: var(--purple, #8000ff) !important;
      color: #fff !important;
    }
    .btn-fav-filled {
      background: var(--purple, #8000ff) !important;
      color: #fff !important;
      border: 1.5px solid var(--purple, #8000ff) !important;
      font-weight: 500;
    }
  `;

  return (
    <section className="cart-page py-5">
      <style>{customStyles}</style>
      <div className="container">
        <h2 className="text-center mb-4 text-purple fw-bold">Корзина</h2>
        {orderPlaced && (
          <div className="card bg-white rounded-4 p-4 shadow-sm text-center mx-auto" style={{ maxWidth: '600px' }}>
            <div className="mb-4">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
            </div>
            <h3 className="text-success mb-3">Дякуємо за ваше замовлення!</h3>
            <p className="mb-3">Ваше замовлення успішно оформлено. Ми надіслали підтвердження на вашу електронну пошту.</p>
            <div className="bg-light rounded-3 p-3 mb-3">
              <p className="mb-2">Номер замовлення: <strong>#{Math.floor(Math.random() * 1000000)}</strong></p>
              <p className="mb-0">Очікувана дата доставки: <strong>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</strong></p>
            </div>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-outline-primary" onClick={() => navigate('/')}>Повернутися до магазину</button>
              <button className="btn btn-primary" onClick={() => navigate('/orders')}>Переглянути замовлення</button>
            </div>
          </div>
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
                          <div className="d-flex align-items-center mt-2 gap-2">
                            <span>Кількість:</span>
                            <QuantitySelector
                              quantity={product.quantity || 1}
                              onChange={val => changeQuantity(product.id, val)}
                            />
                          </div>
                        </div>
                        <button className="btn btn-outline-danger btn-sm me-2" onClick={() => removeItem(product.id)}>Видалити</button>
                        <button
                          className={`btn btn-sm ${isFavorite(product.id) ? 'btn-fav-filled' : 'btn-fav-outline'}`}
                          onClick={() => addToFavorites(product)}
                          disabled={isFavorite(product.id)}
                        >
                          {isFavorite(product.id) ? 'В обраному' : 'В обране'}
                        </button>
                      </div>
                    </div>
                  ))}
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
                    
                    {!isLoggedIn && (
                      <div className="alert mb-4" style={{ 
                        backgroundColor: 'rgba(var(--purple-rgb), 0.1)', 
                        borderColor: 'var(--purple)',
                        color: 'var(--purple)'
                      }}>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-info-circle me-2"></i>
                          <div>
                            <strong>Увійдіть для оформлення замовлення</strong>
                            <p className="mb-0">Отримайте доступ до збережених адрес та історії замовлень</p>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          className="btn mt-2 text-white" 
                          style={{background: 'var(--purple)'}}
                          onClick={() => setIsLoggedIn(true)}
                        >
                          Увійти
                        </button>
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Виберіть спосіб доставки</label>
                      <div>
                        {deliveryOptions.map(opt => (
                          <div className="form-check mb-1" key={opt.id}>
                            <input
                              className="form-check-input"
                              type="radio"
                              id={`delivery-${opt.id}`}
                              name="delivery"
                              value={opt.id}
                              checked={selectedDelivery === opt.id}
                              onChange={() => setSelectedDelivery(opt.id)}
                              required
                            />
                            <label className="form-check-label" htmlFor={`delivery-${opt.id}`}>
                              {opt.name} <span className="text-muted">({opt.eta})</span> — <span className="fw-bold">{opt.price === 0 ? 'Безкоштовно' : `${opt.price} UAH`}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {isLoggedIn ? (
                      <div className="mb-3">
                        <label className="form-label">Виберіть адресу доставки</label>
                        <div className="address-list-group">
                          {savedAddresses.map(address => (
                            <label key={address.id} className="list-group-item d-flex align-items-center" style={{border: 'none', borderBottom: '1px solid #eee', borderRadius: 0, padding: '16px 20px', cursor: 'pointer'}}>
                              <input
                                type="radio"
                                name="savedAddress"
                                className="address-radio"
                                checked={selectedAddress === address.id}
                                onChange={() => {
                                  setSelectedAddress(address.id);
                                  setFormData(prev => ({ ...prev, address: address.address }));
                                }}
                              />
                              <div>
                                <strong style={{color: selectedAddress === address.id ? 'var(--purple)' : undefined}}>{address.name}</strong>
                                <p className="mb-0 text-muted">{address.address}</p>
                              </div>
                            </label>
                          ))}
                          <button type="button" className="add-address-btn w-100 py-3 px-3 border-0" >
                            <i className="bi bi-plus-circle"></i>
                            Додати нову адресу
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Виберіть спосіб оплати</label>
                      <div>
                        {paymentOptions.map(opt => (
                          <div className="form-check form-check-inline" key={opt.id}>
                            <input
                              className="form-check-input"
                              type="radio"
                              id={`payment-${opt.id}`}
                              name="payment"
                              value={opt.id}
                              checked={selectedPayment === opt.id}
                              onChange={() => setSelectedPayment(opt.id)}
                              required
                            />
                            <label className="form-check-label" htmlFor={`payment-${opt.id}`}>{opt.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Промокод</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Введіть промокод"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          disabled={promoApplied}
                        />
                        <button
                          type="button"
                          className="btn text-white"
                          style={{background: 'var(--purple)'}}
                          onClick={handlePromoCode}
                          disabled={promoApplied}
                        >
                          Застосувати
                        </button>
                      </div>
                      {promoApplied && (
                        <div className="text-success mt-2">
                          <i className="bi bi-check-circle me-1"></i>
                          Промокод успішно застосовано
                        </div>
                      )}
                    </div>

                    <div className="border-top pt-3 mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Вартість товарів:</span>
                        <span className="fw-bold">{totalPrice.toFixed(2)} UAH</span>
                      </div>
                      {promoApplied && (
                        <div className="d-flex justify-content-between align-items-center mb-2 text-success">
                          <span>Знижка:</span>
                          <span className="fw-bold">-{promoDiscount.toFixed(2)} UAH</span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Доставка:</span>
                        <span className="fw-bold">{selectedDelivery ? `${deliveryPrice} UAH` : '—'}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold">Загальна сума:</span>
                        <span className="fw-bold text-purple fs-5">{finalTotal.toFixed(2)} UAH</span>
                      </div>
                    </div>

                    <div className="text-end">
                      <button 
                        type="submit" 
                        className="btn text-white px-4 py-2" 
                        style={{background: 'var(--purple)'}} 
                        disabled={!selectedDelivery || !selectedPayment}
                      >
                        Підтвердити замовлення
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-purple ms-2" 
                        onClick={() => navigate('/')}
                      >
                        Продовжити покупки
                      </button>
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
