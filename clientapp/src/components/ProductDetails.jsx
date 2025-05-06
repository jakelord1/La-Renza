import React, { useState, useRef, useEffect } from 'react';
import './ProductDetails.css';
import AddToCartModal from './AddToCartModal';

const ProductDetails = ({ product }) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [favorite, setFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSortList, setShowSortList] = useState(false);
  const [sort, setSort] = useState('ВІД НАЙНОВІШИХ');
  const [likedReviews, setLikedReviews] = useState({});
  const modalRef = useRef(null);
  const [openSection, setOpenSection] = useState(null);


  useEffect(() => {
    if (!showModal) return;
    const handleKey = (e) => { if (e.key === 'Escape') setShowModal(false); };
    const handleClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) setShowModal(false);
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);

    const timer = setTimeout(() => setShowModal(false), 5000);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
      clearTimeout(timer);
    };
  }, [showModal]);

  if (!product) return <div>Товар не знайдено</div>;


  const images = product.images || [product.image];
  const prevImage = () => setSelectedImageIdx((selectedImageIdx - 1 + images.length) % images.length);
  const nextImage = () => setSelectedImageIdx((selectedImageIdx + 1) % images.length);

  const toggleFavorite = () => setFavorite(fav => !fav);

  const handleAddToCart = () => {
    let cart = [];
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
    }
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
      exists.quantity = (exists.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);
  const handleCheckout = () => {
    setShowModal(false);
    window.location.href = '/cart';
  };
  const handleContinue = () => setShowModal(false);

  const reviews = [
    {
      id: 1,
      author: 'Анастасія',
      date: '2025-04-25',
      rating: 5,
      text: 'Трохи оверсайз, мені лойк',
      color: 'чорний',
      size: 'L',
      fit: 'Ідеальна',
      likes: 12,
    },
    {
      id: 2,
      author: 'Олег',
      date: '2025-04-25',
      rating: 5,
      text: 'Супер якість',
      color: 'білий',
      size: 'XL',
      fit: 'Ідеальна',
      likes: 7,
    },
    {
      id: 3,
      author: 'Ірина',
      date: '2025-04-25',
      rating: 5,
      text: 'Класний матеріал. Розмір приблизно.',
      color: 'чорний',
      size: 'XS',
      fit: 'Ідеальна',
      likes: 3,
    },
  ];


  const breadcrumbs = [
    { label: 'La\'Renza', link: '/' },
    { label: 'Жінка', link: '/catalog?cat=woman' },
    { label: product.title || product.name, link: '#' },
  ];

  const sortOptions = [
    'ВІД НАЙНОВІШИХ',
    'ВІД НАЙСТАРШИХ',
    'ВІД НАЙВИЩОГО РЕЙТИНГУ',
    'ВІД НАЙНИЖЧОГО РЕЙТИНГУ',
  ];


  const getSortedReviews = () => {
    if (sort === 'ВІД НАЙНОВІШИХ') return [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === 'ВІД НАЙСТАРШИХ') return [...reviews].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === 'ВІД НАЙВИЩОГО РЕЙТИНГУ') return [...reviews].sort((a, b) => b.rating - a.rating);
    if (sort === 'ВІД НАЙНИЖЧОГО РЕЙТИНГУ') return [...reviews].sort((a, b) => a.rating - b.rating);
    return reviews;
  };


  const handleLikeReview = (id) => {
    setLikedReviews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="product-details-page container py-4">

      <div className="mb-3 text-secondary">
        {breadcrumbs.map((b, i) => (
          <span key={i}>
            <a href={b.link} className="text-decoration-none text-secondary me-1">{b.label}</a>
            {i !== breadcrumbs.length-1 && <i className="bi bi-chevron-right mx-1"></i>}
          </span>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-md-6 d-flex">
          <div className="vertical-thumbs d-flex flex-column align-items-center me-3" style={{gap: '8px'}}>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumb"
                className={`img-thumbnail p-1 mb-1${selectedImageIdx === idx ? ' selected' : ''}`}
                style={{width: 56, height: 56, objectFit: 'cover', cursor: 'pointer', borderRadius: 8}}
                onClick={() => setSelectedImageIdx(idx)}
              />
            ))}
          </div>
          <div className="flex-grow-1 position-relative d-flex flex-column">
            <div className="product-gallery mb-3 position-relative">
              <img src={images[selectedImageIdx]} alt={product.title || product.name} className="main-image img-fluid rounded-3" style={{boxShadow: 'none !important', border: 'none !important', outline: 'none !important'}} />
              {images.length > 1 && (
                <>
                  <button
                    className="carousel-arrow carousel-arrow-left position-absolute top-50 start-0 translate-middle-y d-flex align-items-center justify-content-center"
                    style={{ marginLeft: 15, zIndex: 4, left: 44, width: 50, height: 50, borderRadius: '50%', background: '#fff', border: 'none', boxShadow: '0 2px 8px #0001', cursor: 'pointer' }}
                    onClick={prevImage}
                    aria-label="Попередній"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                  <button
                    className="carousel-arrow carousel-arrow-right position-absolute top-50 end-0 translate-middle-y d-flex align-items-center justify-content-center"
                    style={{ marginRight: 15, zIndex: 4, right: 44, width: 50, height: 50, borderRadius: '50%', background: '#fff', border: 'none', boxShadow: '0 2px 8px #0001', cursor: 'pointer' }}
                    onClick={nextImage}
                    aria-label="Наступний"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
                  </button>
                </>
              )}
            </div>

            <div className="accordion-custom">

              <div className="accordion-item-custom">
                <div
                  className="accordion-header-custom d-flex align-items-center justify-content-between"
                  style={{cursor: 'pointer', padding: '12px 0', fontWeight: 600, fontSize: '1.1rem'}}
                  onClick={() => setOpenSection(openSection === 'description' ? null : 'description')}
                >
                  <span>Опис товару</span>
                  <span style={{marginLeft: 12, fontWeight: 400, color: '#888', fontSize: '1rem'}}>{product.sku || ''}</span>
                  <span style={{marginLeft: 'auto', fontSize: 28, lineHeight: 1}}>
                    {openSection === 'description' ? '−' : '+'}
                  </span>
                </div>
                {openSection === 'description' && (
                  <div className="accordion-body-custom" style={{padding: '8px 0 16px 0'}}>
                    <div className="text-secondary">{product.description || 'Опис відсутній.'}</div>
                  </div>
                )}
              </div>
              <hr style={{margin: 0}} />

              <div className="accordion-item-custom">
                <div
                  className="accordion-header-custom d-flex align-items-center justify-content-between"
                  style={{cursor: 'pointer', padding: '12px 0', fontWeight: 600, fontSize: '1.1rem'}}
                  onClick={() => setOpenSection(openSection === 'features' ? null : 'features')}
                >
                  <span>Характеристики</span>
                  <span style={{marginLeft: 'auto', fontSize: 28, lineHeight: 1}}>
                    {openSection === 'features' ? '−' : '+'}
                  </span>
                </div>
                {openSection === 'features' && (
                  <div className="accordion-body-custom" style={{padding: '8px 0 16px 0'}}>
                    <ul className="list-unstyled text-secondary">
                      {product.features && product.features.length > 0 ? (
                        product.features.map((f, i) => <li key={i}>• {f}</li>)
                      ) : (
                        <li>Немає характеристик.</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">

          {product.isBestseller && (
            <div className="bestseller-badge mb-2">BESTSELLER</div>
          )}
          <div className="d-flex align-items-center gap-3 mb-2">
            <h1 className="fw-bold h3 m-0">{product.title || product.name}</h1>
          </div>
          <div className="price-block mb-2">
            <span className="current-price text-purple">{product.price} ₴</span>
            {product.oldPrice && (
              <span className="old-price">{product.oldPrice} ₴</span>
            )}
          </div>

          <div className="mb-3">
            <span className="text-secondary me-2">Колір - {product.color || 'чорний'}</span>
            <div className="d-flex align-items-center mt-2 mb-2 gap-2">
              {(product.colors ? product.colors.slice(0, 3) : [
                '#f8f6f3', '#222', '#cfc6be'
              ]).map((clr, idx) => (
                <div key={idx} className={`color-dot${product.colorIndex === idx ? ' active' : ''}`} style={{background: clr, border: product.colorIndex === idx ? '2px solid #222' : '1px solid #ccc', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', boxSizing: 'border-box', display: 'inline-block'}}></div>
              ))}
            </div>
          </div>
          <div className="mb-2 d-flex align-items-center gap-2 review-compact">
            <span className="review-stars compact">{'★'.repeat(5)}</span>
            <span className="review-score">4,8/5</span>
            <a href="#product-reviews-section" className="review-link">
              відгуків ({reviews.length})
            </a>
          </div>
          <div className="size-selector mb-3">
            <div className="fw-semibold mb-2">Оберіть розмір:</div>
            <div className="d-flex gap-2 flex-wrap">
              {(product.sizes || ['S', 'M', 'L', 'XL']).map(size => (
                <button
                  key={size}
                  className={`btn btn-outline-dark btn-sm ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                  style={{ borderRadius: 8, minWidth: 48, fontWeight: 600, marginRight: 8, marginBottom: 8 }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3 d-flex align-items-center" style={{gap: 12}}>
            <button className="add-to-cart-btn btn-purple px-4 py-2 fw-bold" style={{height: 48, fontSize: '1.1rem', borderRadius: 12}} onClick={handleAddToCart}>
              Додати у кошик
            </button>
            <button
              className={`btn btn-light border border-2 favorite-btn-square ${favorite ? 'text-danger border-purple' : 'text-secondary'}`}
              aria-label="Додати в обране"
              onClick={toggleFavorite}
              style={{fontSize: 24, borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 8, boxSizing: 'border-box', padding: 0, background: '#fff', transition: 'box-shadow 0.2s, border-color 0.2s'}}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 8px #a259e633'}
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {favorite ? (
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="product-reviews-section mt-5" id="product-reviews-section">
        <h3 className="mb-3">Відгуки про товар <span className="badge bg-light text-dark">{reviews.length}</span></h3>
        <div className="mb-2 d-flex align-items-center" style={{gap: 10, zIndex: 10, position: 'relative', maxWidth: 420}}>
          <span style={{fontWeight: 600, fontSize: '1rem', whiteSpace: 'nowrap', color: '#222'}}>Сортувати:</span>
          <div className="position-relative" style={{width: 280}}>
            <button
              className="btn btn-light border shadow-sm d-flex align-items-center justify-content-start w-100 fw-semibold px-3 py-2"
              type="button"
              onClick={() => setShowSortList(v => !v)}
              aria-expanded={showSortList}
              style={{fontSize: '0.98rem', letterSpacing: 0.1, minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', whiteSpace: 'nowrap', overflow: 'hidden', width: '100%', textOverflow: 'ellipsis', borderRadius: 6}}
            >
              <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0, textAlign: 'left'}} title={sort.toLowerCase()}>
                {sort.toLowerCase()}
              </span>
              <i className={`bi ms-2 ${showSortList ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            </button>
            {showSortList && (
              <ul className="dropdown-menu show w-100 mt-1 shadow rounded-4 p-0" style={{position: 'absolute', top: '100%', left: 0, minWidth: '100%', fontWeight: 500, fontSize: '0.98rem', border: 'none'}}>
                {sortOptions.map(opt => (
                  <li key={opt}>
                    <button
                      className="dropdown-item py-2 px-3"
                      style={{
                        fontWeight: sort === opt ? 700 : 500,
                        color: sort === opt ? '#fff' : '#222',
                        background: sort === opt ? '#a259e6' : 'transparent',
                        borderRadius: 0,
                        transition: 'background 0.2s, color 0.2s',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textAlign: 'left',
                      }}
                      onClick={() => { setSort(opt); setShowSortList(false); }}
                    >
                      {opt.toLowerCase()}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mb-3">
          <span className="me-2">Чи добре підійшов товар?</span>
          <span className="badge badge-fit">менше 2%</span>
          <span className="badge badge-fit mx-1">ідеально 93%</span>
          <span className="badge badge-fit">більше 5%</span>
        </div>
        <div className="reviews-list">
          {getSortedReviews().map(r => (
            <div key={r.id} className="card mb-3 p-3 shadow-sm d-flex flex-row align-items-start gap-3 position-relative">

              <div style={{width: 48, height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f3f3', borderRadius: 12, border: '1px solid #eee'}}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg" alt="?" style={{width: 32, height: 32, objectFit: 'contain'}} />
              </div>
              <div style={{flex: 1}}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fw-bold">{r.author}</span>
                  <span className="text-warning">{'★'.repeat(r.rating)}</span>
                  <span className="ms-2 small text-secondary">{r.date}</span>
                </div>
                <div>{r.text}</div>
              </div>

              <button
                className="btn btn-like-review d-flex align-items-center justify-content-center"
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: likedReviews[r.id] ? '#a259e6' : '#bbb',
                  fontWeight: 500,
                  fontSize: '1rem',
                  padding: 0,
                  outline: 'none',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  userSelect: 'none',
                }}
                onClick={() => handleLikeReview(r.id)}
                aria-label={likedReviews[r.id] ? 'Відмінити лайк' : 'Лайкнути'}
              >
                <svg width="20" height="20" fill={likedReviews[r.id] ? '#a259e6' : 'none'} stroke={likedReviews[r.id] ? '#a259e6' : '#bbb'} strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span style={{marginLeft: 2, color: '#222', fontWeight: 600, fontSize: '1rem'}}>{r.likes + (likedReviews[r.id] ? 1 : 0)}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <AddToCartModal
        show={showModal}
        product={product}
        onClose={handleCloseModal}
        onCheckout={handleCheckout}
        onContinue={handleContinue}
        modalRef={modalRef}
      />
    </div>
  );
};

export default ProductDetails;
