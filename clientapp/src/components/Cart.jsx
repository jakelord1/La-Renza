import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from './common/Loader';

const API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Account/accountShoppingCarts`;
const Fav_API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Favorites`;


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
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const location = useLocation();
  useEffect(() => {
    setCartLoading(true);
    setCartError(null);
    fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Account/accountProfile`, { credentials: 'include' })
      .then(res => {
        if (res.status === 401 || !res.ok) {
          setIsLoggedIn(false);
          const val = JSON.parse(localStorage.getItem('cart'));
          setCartItems(Array.isArray(val) ? val : []);
          setCartLoading(false);
          return;
        }
        setIsLoggedIn(true);

        fetch('/api/Account/accountShoppingCarts', { credentials: 'include' })
          .then(cartsRes => {
            if (!cartsRes.ok) throw new Error('Не вдалося отримати серверну корзину');
            return cartsRes.json();
          })
          .then(async (carts) => {
            if (!Array.isArray(carts) || carts.length === 0) {
              setCartItems([]);
              setCartLoading(false);
              return;
            }

            const products = await Promise.all(
              carts.map(async (item) => {
                try {
                  const prodRes = await fetch(`/api/Products/${item.productId}`);
                  if (!prodRes.ok) return null;
                  const prod = await prodRes.json();
                  return {
                    id: item.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    name: prod.color?.model?.name || '',
                    color: prod.color?.name || '',
                    image: prod.color?.model?.photos?.[0]?.path ? `/images/${prod.color.model.photos[0].path}` : '',
                    price: prod.color?.model?.price || 0,
                    size: prod.size?.name || '',
                  };
                } catch {
                  return null;
                }
              })
            );
            setCartItems(products.filter(Boolean));
            setCartLoading(false);
          })
          .catch(e => {
            setCartError(e.message || 'Помилка при завантаженні серверної корзини');
            setCartLoading(false);
          });
      })
      .catch(() => {
        setIsLoggedIn(false);
        const val = JSON.parse(localStorage.getItem('cart'));
        setCartItems(Array.isArray(val) ? val : []);
        setCartLoading(false);
      });

    const update = () => {
      if (!isLoggedIn) {
        const val = JSON.parse(localStorage.getItem('cart'));
        setCartItems(Array.isArray(val) ? val : []);
      }
    };
    window.addEventListener('cart-updated', update);
    return () => window.removeEventListener('cart-updated', update);
  }, [location, isLoggedIn]);
  const [isCheckout, setIsCheckout] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderName, setPlacedOrderName] = useState('');
  const [placedOrderItems, setPlacedOrderItems] = useState([]);
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
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  
  const navigate = useNavigate();

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
    if (!isLoggedIn) {
      if (value === 0) {
        removeItem(id);
      } else {
        let newQuantity = value;
        if (typeof value === 'string') {
          newQuantity = parseInt(value, 10);
          if (isNaN(newQuantity)) newQuantity = 1;
        }
        newQuantity = Math.max(1, Math.min(1000, newQuantity));
        const updated = cartItems.map(item => {
          if (item.id === id) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        localStorage.setItem('cart', JSON.stringify(updated));
        setCartItems(updated);
        window.dispatchEvent(new Event('cart-updated'));
      }
    }
  };

  const addToFavorites = async (product) => {
    let favs = getFavorites();
    if (!favs.find(item => item.id === product.id)) {
      favs.push(product);
      setFavorites(favs);
      setFavoritesState(favs);
      if (!isLoggedIn) {
        removeItem(product.id);
      } else {
        try {
          const res = await fetch(`/api/Account/accountModels/${product.modelId || product.productId}`, {
            method: 'POST',
            credentials: 'include',
          });
          if (res.ok) {
            removeItem(product.id, product.productId);
          } else {
            const err = await res.json().catch(() => ({}));
            alert(err.message || 'Помилка при додаванні в обране');
          }
        } catch (e) {
          alert('Помилка при додаванні в обране');
        }
      }
    }
  };

  const isFavorite = (id) => favorites.some(item => item.id === id);

  const totalPrice = cartItems.reduce((sum, item) => sum + ((Number(item.price) || 0) * (item.quantity || 1)), 0);

  const deliveryCost = selectedDelivery ? Number(deliveryOptions.find(opt => opt.id === selectedDelivery)?.deliveryPrice ?? 0) : 0;
  

  const removeItem = async (id, productId) => {
    if (!isLoggedIn) {
      const updated = cartItems.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(updated));
      setCartItems(updated);
      window.dispatchEvent(new Event('cart-updated'));
    } else {
      try {
        const res = await fetch(`/api/Account/removeFromCartByProduct/${productId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (res.ok) {
          setCartItems(items => items.filter(item => item.productId !== productId));
        } else {
          const err = await res.json().catch(() => ({}));
          alert(err.message || 'Помилка при видаленні з корзини');
        }
      } catch (e) {
        alert('Помилка при видаленні з корзини');
      }
    }
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

      const productPromises = cartItems.map(item =>
        fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Products/${item.productId}`)
          .then(res => {
            if (!res.ok) throw new Error('Не вдалося отримати продукт з id ' + item.productId);
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
          ProductId: item.productId,
          Quantity: item.quantity,
          Price: Number(item.price) || 0,
          Product: {
            Id: fullProduct.id ?? item.productId ?? null,
            ColorId: fullProduct.colorId ?? item.colorId ?? null,
            SizeId: fullProduct.sizeId ?? item.sizeId ?? null,
            Quantity: item.quantity ?? fullProduct.quantity ?? null,
            Size: size,
            Color: color,
            UsersLikesId: fullProduct.usersLikesId || item.usersLikesId || null
          }
        };
      });

      //--- мінімальний order ---
      const order = {
        id: 0,
        userId: profile.id || 0,
        status: 'New',
        deliveryId: addressObj ? Number(addressObj.id) : 0,
        cuponsId: appliedCoupon ? appliedCoupon.id : undefined,
        orderName: profile.fullName ? `Order_${profile.id}` : (profile.email || ''),
        createdAt: now,
        completedAt: now,
        paymentMethod: paymentMethodInt,
        deliveryMethodId: Number(selectedDelivery) || 0,
        phonenumber: formData.phone || profile.phoneNumber || '',
        orderItems: orderItems.map(item => ({
          id: 0,
          orderId: 0,
          productId: item.ProductId || item.productId || 0,
          quantity: item.Quantity || item.quantity || 0,
          price: item.Price || item.price || 0
        })),
        user: {
          id: profile.id,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          fullName: profile.fullName,
          surName: profile.surName,
          password: profile.password
        }
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
      // Після оформлення — отримати orderName для останнього замовлення
      try {
        const ordersRes = await fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Account/accountOrders`, { credentials: 'include' });
        if (ordersRes.ok) {
          const orders = await ordersRes.json();
          if (Array.isArray(orders) && orders.length > 0) {
            // Беремо останнє замовлення (можливо, сортувати по даті)
            const lastOrder = orders[orders.length - 1];
            setPlacedOrderName(lastOrder.orderName);
            setPlacedOrderItems(lastOrder.orderItems || []);
          }
        }
      } catch {
        // do nothing
      }

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

  if (cartLoading) {
    return (
      <section className="cart-page py-5">
        <style>{customStyles}</style>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
          <Loader message="Завантаження кошика..." />
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page py-5">
      <style>{customStyles}</style>
      <div className="container">
        {cartError ? (
          <div className="alert alert-danger">{cartError}</div>
        ) : null}
        <h2 className="text-center mb-4 text-purple fw-bold">Корзина</h2>
        {orderPlaced && (
          <div className="card bg-white rounded-4 p-4 shadow-sm text-center mx-auto" style={{ maxWidth: '600px' }}>
            <div className="mb-4">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
            </div>
            <h3 className="text-success mb-3">Дякуємо за ваше замовлення!</h3>
            <div className="bg-light rounded-3 p-3 mb-3">
              <p className="mb-2">Назва замовлення: <strong>{placedOrderName || '—'}</strong></p>
              <div>
                <span className="fw-bold">Товари у замовленні:</span>
                <ul className="list-unstyled mt-2 mb-0">
                  {placedOrderItems.length > 0 ? (
                    placedOrderItems.map((item, idx) => (
                      <li key={idx} className="mb-1">
                        <span>{item.productName || item.name || 'Товар'} — </span>
                        <span>Кількість: {item.quantity || item.Quantity}</span>
                        <span className="ms-2">Ціна: {item.price || item.Price} UAH</span>
                      </li>
                    ))
                  ) : (
                    <li>—</li>
                  )}
                </ul>
              </div>
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
                        <button className="btn btn-outline-danger btn-sm me-2" onClick={() => removeItem(product.id, product.productId)}>Видалити</button>
                        {isLoggedIn && (
                          <button
                            className={`btn btn-sm ${isFavorite(product.id) ? 'btn-fav-filled' : 'btn-fav-outline'}`}
                            onClick={() => addToFavorites(product)}
                            disabled={isFavorite(product.id)}
                          >
                            {isFavorite(product.id) ? 'В обраному' : 'В обране'}
                          </button>
                        )}
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
                        disabled={!selectedDelivery || !selectedPayment || !isLoggedIn}
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
