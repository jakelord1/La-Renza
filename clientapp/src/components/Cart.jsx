import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Account/accountShoppingCarts`;
const Fav_API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Favorites`;

const getCart = async () => {
    try {
        setLoading(true);
        const authRes = await fetch('/api/Account/accountProfile', { credentials: 'include' });
        setIsAuthenticated(authRes.ok);
        if (!authRes.ok) {
            const val = JSON.parse(localStorage.getItem('cart'));
            return Array.isArray(val) ? val : [];
            setLoading(false);
            return;
        }
        else {
            const res = await fetch(`${API_URL}`, { credentials: 'include' });
            if (res.ok) {
                const val = await res.json();
                setLoading(false);
                return;
            }
        }
  } catch {
    return [];
  }
};


const fetchShopCart = () => {
  return getCart();
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
const [addresses, setAddresses] = useState([]);
const [addressLoading, setAddressLoading] = useState(false);
const [addressError, setAddressError] = useState(null);
const [selectedAddress, setSelectedAddress] = useState('');
  
  
  const navigate = useNavigate();

  useEffect(() => {
    let fetched = fetchShopCart();
    if (!Array.isArray(fetched)) fetched = [];
    setCartItems(fetched);
    setFavoritesState(getFavorites());
    const update = () => setCartItems(getCart());
    window.addEventListener('cart-updated', update);
    return () => window.removeEventListener('cart-updated', update);
  }, []);

  // Визначаємо залогіненого користувача як у Navbar.jsx
  const location = useLocation();
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Account/accountProfile`, { credentials: 'include' })
      .then(res => {
        if (res.status === 401 || !res.ok) {
          setIsLoggedIn(false);
          return;
        }
        return res.json().then(data => {
          setIsLoggedIn(!!data && !!data.email);
        });
      })
      .catch(() => setIsLoggedIn(false));
  }, [location]);

  // Якщо залогінений — фетчимо адреси
  useEffect(() => {
    if (!isLoggedIn) {
      setAddresses([]);
      setAddressError(null);
      setSelectedAddress('');
      setAddressLoading(false);
      return;
    }
    setAddressLoading(true);
    setAddressError(null);
    fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Account/accountAddresses`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Помилка при отриманні адрес');
        return res.json();
      })
      .then(data => {
        setAddresses(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) setSelectedAddress(data[0].id || '');
      })
      .catch(err => setAddressError(err.message))
      .finally(() => setAddressLoading(false));
  }, [isLoggedIn]);

  const [deliveryOptions, setDeliveryOptions] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/DeliveryMethods`)
      .then(res => {
        if (!res.ok) throw new Error('Помилка при отриманні методів доставки');
        return res.json();
      })
      .then(data => setDeliveryOptions(Array.isArray(data) ? data : []));
  }, []);
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
  // Вартість доставки для підрахунку (беремо deliveryPrice, як у UI)
  const deliveryCost = selectedDelivery ? Number(deliveryOptions.find(opt => opt.id === selectedDelivery)?.deliveryPrice ?? 0) : 0;
  

  const removeItem = (id) => {
    const updated = getCart().filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleCheckout = () => setIsCheckout(true);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDelivery || !selectedPayment || !selectedAddress) return;

    try {
      const profileRes = await fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Account/accountProfile`, { credentials: 'include' });
      if (!profileRes.ok) throw new Error('Не вдалося отримати профіль користувача');
      const profile = await profileRes.json();

      const addressObj = addresses.find(a => a.id === selectedAddress);

      let appliedCoupon = null;
      if (promoApplied && promoCode) {
        if (window.coupons && Array.isArray(window.coupons)) {
          appliedCoupon = window.coupons.find(c => c.code === promoCode) || null;
        }
      }

      const paymentMap = { card: 1, gpay: 2, apay: 3, cash: 0 };
      const paymentMethodInt = paymentMap[selectedPayment] ?? 0;

      const now = new Date();
      const dateStr = now.toISOString().slice(0, 19);

      const productPromises = cartItems.map(item =>
        fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Products/${item.id}`)
          .then(res => {
            if (!res.ok) throw new Error('Не вдалося отримати продукт з id ' + item.id);
            return res.json();
          })
      );
      const fullProducts = await Promise.all(productPromises);

      const orderItems = cartItems.map((item, idx) => {
        const fullProduct = fullProducts[idx];
        let size = null;
        if (fullProduct.size) {
          size = { ...fullProduct.size };
        } else if (item.size && typeof item.size === 'object') {
          size = {
            Id: item.size.id ?? null,
            CategoryId: item.size.categoryId ?? null,
            Name: item.size.name ?? '',
          };
        }
        let color = null;
        if (fullProduct.color) {
          color = { ...fullProduct.color };
        } else if (item.color && typeof item.color === 'object') {
          color = { ...item.color };
        }
        return {
          Id: 0,
          OrderId: null,
          ProductId: item.id,
          Quantity: item.quantity,
          Price: Number(item.price) || 0,
          Product: {
            Id: fullProduct.id ?? item.id ?? null,
            ColorId: fullProduct.colorId ?? item.colorId ?? null,
            SizeId: fullProduct.sizeId ?? item.sizeId ?? null,
            Quantity: item.quantity ?? fullProduct.quantity ?? null,
            Size: size,
            Color: color,
            UsersLikesId: fullProduct.usersLikesId || item.usersLikesId || null
          }
        };
      });

      const User = {
        Id: profile.id,
        Email: profile.email,
        PhoneNumber: profile.phoneNumber,
        FullName: profile.fullName,
        SurName: profile.surName,
        BirthDate: profile.birthDate,
        Gender: profile.gender,
        Password: profile.password,
        NewsOn: profile.newsOn,
        LaRenzaPoints: profile.laRenzaPoints
      };
      const Delivery = addressObj ? {
        Id: addressObj.id,
        UserId: addressObj.userId,
        SecondName: addressObj.secondName,
        FullName: addressObj.fullName,
        Street: addressObj.street,
        City: addressObj.city,
        HouseNum: addressObj.houseNum,
        PostIndex: addressObj.postIndex,
        AdditionalInfo: addressObj.additionalInfo,
        PhoneNumber: addressObj.phoneNumber
      } : null;
      const Cupons = appliedCoupon ? {
        Id: appliedCoupon.id,
        Name: appliedCoupon.name,
        Description: appliedCoupon.description,
        Price: appliedCoupon.price,
        Users: appliedCoupon.users || []
      } : null;

      // 9. Order-об'єкт з PascalCase-ключами
      const order = {
        Id: 0,
        UserId: profile.id,
        Status: 'Ready',
        DeliveryId: addressObj ? Number(addressObj.id) : null,
        CuponsId: appliedCoupon ? appliedCoupon.id : null,
        OrderName: profile.fullName ? `Order_${profile.id}` : (profile.email || ''),
        CreatedAt: dateStr,
        CompletedAt: dateStr,
        PaymentMethod: paymentMethodInt,
        DeliveryMethodId: Number(selectedDelivery),
        Phonenumber: profile.phoneNumber || '',
        OrderItems: orderItems,
        User,
        Delivery,
        Cupons,
        Dm: null
      };

      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Account/addOrder`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Помилка при оформленні замовлення');
      }
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cart-updated'));
      setCartItems([]);
      setIsCheckout(false);
      setOrderPlaced(true);
      alert('Замовлення успішно оформлено!');
    } catch (error) {
      alert(error.message || 'Помилка оформлення замовлення');
    }
  };

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoApplied(true);
      setPromoDiscount(totalPrice * 0.1); 
    } else {
      alert('Невірний промокод');
    }
  };

  
  

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
        onChange(0);  
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
                        <a href="/login" className="btn mt-2 text-white" style={{background: 'var(--purple)'}}>Увійти</a>
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
                              {opt.name} <span className="ms-2">{opt.deliveryPrice} UAH</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Виберіть спосіб оплати</label>
                      <div>
                        {paymentOptions.map(opt => (
                          <div className="form-check mb-1" key={opt.id}>
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

                    {/* Поле телефону */}
                    <div className="mb-3">
                      <label className="form-label">Телефон</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Введіть номер телефону"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>

                    {/* Селектор адрес */}
                    {isLoggedIn && (
                      <div className="mb-3">
                        <label className="form-label">Оберіть адресу доставки</label>
                        {addressLoading && <div>Завантаження адрес...</div>}
                        {addressError && <div className="text-danger">{addressError}</div>}
                        {!addressLoading && !addressError && addresses.length === 0 && (
                          <div>У вас немає збережених адрес.</div>
                        )}
                        {!addressLoading && !addressError && addresses.length > 0 && (
                          <div className="address-list-group bg-light p-2 mb-2">
                            {addresses.map(addr => (
                              <label key={addr.id} className="d-flex align-items-start py-2 px-3 mb-0 flex-column flex-md-row" style={{ cursor: 'pointer', gap: 8 }}>
                                <div className="d-flex align-items-start" style={{minWidth:32}}>
                                  <input
                                    type="radio"
                                    className="address-radio me-2 mt-1"
                                    name="address"
                                    value={addr.id}
                                    checked={selectedAddress === addr.id}
                                    onChange={() => setSelectedAddress(addr.id)}
                                    required
                                  />
                                </div>
                                <div className="flex-grow-1">
                                  <div><b>{addr.fullName || addr.recipientName || ''}</b> {addr.phone && <span className="ms-2">{addr.phone}</span>}</div>
                                  <div>{addr.city}, {addr.street} {addr.house}{addr.flat ? ", кв. " + addr.flat : ''}</div>
                                  {addr.postIndex && <div>Індекс: {addr.postIndex}</div>}
                                  {addr.addressLine && <div className="text-muted small">{addr.addressLine}</div>}
                                  {addr.comment && <div className="text-muted small">{addr.comment}</div>}
                                </div>
                                <div className="d-flex flex-column align-items-end ms-md-2 mt-2 mt-md-0">
                                  {addr.isMain && <span className="badge bg-purple mb-1">Основна</span>}
                                </div>
                                {addr.isMain && <span className="badge bg-purple ms-2">Основна</span>}
                              </label>
                            ))}
                          </div>
                        )}
                        <button type="button" className="add-address-btn mt-2" style={{fontWeight:500}} onClick={() => window.location.href='/account/addresses'}>
                          <i className="bi bi-plus-circle me-2"></i> Додати нову адресу
                        </button>
                      </div>
                    )}

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
                        <span className="fw-bold">
                          {selectedDelivery
                            ? `${(deliveryOptions.find(opt => opt.id === selectedDelivery)?.deliveryPrice ?? 0)} UAH`
                            : '—'}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold">Загальна сума:</span>
                        <span className="fw-bold text-purple fs-5">{(totalPrice - (promoApplied ? promoDiscount : 0) + deliveryCost).toFixed(2)} UAH</span>
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
