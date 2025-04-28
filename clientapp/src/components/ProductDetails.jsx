import React, { useState } from 'react';
import './ProductDetails.css';

// Приймає товар через пропс product
const ProductDetails = ({ product }) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);

  if (!product) return <div>Товар не знайдено</div>;

  // Для каруселі
  const images = product.images || [product.image];
  const prevImage = () => setSelectedImageIdx((selectedImageIdx - 1 + images.length) % images.length);
  const nextImage = () => setSelectedImageIdx((selectedImageIdx + 1) % images.length);

  // Логіка для лайка (обране)
  const toggleFavorite = () => setFavorite(fav => !fav);

  // MOCK Відгуки
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
    },
  ];

  // MOCK Breadcrumbs
  const breadcrumbs = [
    { label: 'La\'Renza', link: '/' },
    { label: 'Жінка', link: '/catalog?cat=woman' },
    { label: product.title || product.name, link: '#' },
  ];

  return (
    <div className="product-details-page container py-4">
      {/* Breadcrumbs */}
      <div className="mb-3 text-secondary">
        {breadcrumbs.map((b, i) => (
          <span key={i}>
            <a href={b.link} className="text-decoration-none text-secondary me-1">{b.label}</a>
            {i !== breadcrumbs.length-1 && <i className="bi bi-chevron-right mx-1"></i>}
          </span>
        ))}
      </div>
      <div className="row g-4">
        {/* Галерея */}
        <div className="col-md-6 d-flex">
          {/* Вертикальна карусель (зліва) */}
          <div className="vertical-thumbs d-flex flex-column align-items-center me-3" style={{gap: '8px'}}>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumb"
                className={`img-thumbnail p-1 mb-1 ${selectedImageIdx === idx ? 'border border-2 border-primary' : ''}`}
                style={{width: 56, height: 56, objectFit: 'cover', cursor: 'pointer', borderRadius: 8, background: '#fff'}}
                onClick={() => setSelectedImageIdx(idx)}
              />
            ))}
          </div>
          <div className="flex-grow-1 position-relative">
            <div className="product-gallery mb-3 position-relative">
              <img src={images[selectedImageIdx]} alt={product.title || product.name} className="main-image img-fluid rounded-3 shadow-sm" />
              {/* Стрілки як у MainBanner */}
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
          </div>
        </div>

        {/* Інформація */}
        <div className="col-md-6">
          {/* Назва */}
          <div className="d-flex align-items-center gap-3 mb-2">
            <h1 className="fw-bold h3 m-0">{product.title || product.name}</h1>
          </div>
          <div className="mb-2">
            <span className="fs-4 fw-bold text-purple">{product.price} ₴</span>
            {product.oldPrice && (
              <span className="fs-6 ms-2 text-decoration-line-through text-secondary">{product.oldPrice} ₴</span>
            )}
          </div>
          <div className="mb-3">
            <span className="badge bg-success me-2">В наявності</span>
            {product.isNew && <span className="badge bg-warning text-dark me-2">Новинка</span>}
            {product.isBestseller && <span className="badge bg-danger me-2">Хіт продажу</span>}
          </div>
          {/* Колір + палітра */}
          <div className="mb-3">
            <span className="text-secondary me-2">Колір - {product.color || 'чорний'}</span>
            <div className="d-flex align-items-center mt-2 mb-2 gap-2">
              {(product.colors || [
                '#f8f6f3', '#222', '#cfc6be', '#d5d1d0', '#eaeaea', '#fff', '#000', '#bdbdbd', '#f8f6f3', '#eaeaea', '#d5d1d0'
              ]).map((clr, idx) => (
                <div key={idx} className={`color-dot${product.colorIndex === idx ? ' active' : ''}`} style={{background: clr, border: product.colorIndex === idx ? '2px solid #222' : '1px solid #ccc', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', boxSizing: 'border-box', display: 'inline-block'}}></div>
              ))}
            </div>
          </div>
          {/* Рейтинг та кількість відгуків */}
          <div className="mb-3 d-flex align-items-center gap-2">
            <span className="text-warning" style={{fontSize:24}}>{'★'.repeat(5)}</span>
            <span className="fw-bold fs-5">4,8/5</span>
            <button type="button" className="ms-2 text-decoration-underline text-dark btn btn-link p-0 border-0" style={{fontSize:'inherit'}} onClick={() => {
              const el = document.getElementById('product-reviews-section');
              if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
            }}>відгуків (3751)</button>
          </div>
          {/* Вибір розміру */}
          <div className="mb-3">
            <div className="fw-semibold mb-2">Оберіть розмір:</div>
            <div className="d-flex gap-2 flex-wrap">
              {(product.sizes || ['S', 'M', 'L', 'XL']).map(size => (
                <button
                  key={size}
                  className={`btn btn-outline-dark btn-sm ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* Кількість + Додати у кошик + Обране */}
          <div className="mb-3 d-flex align-items-center gap-3">
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Math.min(100, Number(e.target.value))))}
              className="form-control"
              style={{ width: 80 }}
            />
            <button className="btn btn-purple px-4 py-2 fw-bold">
              Додати у кошик
            </button>
            <button className={`btn btn-light border border-2 p-2 ms-2 favorite-btn-square ${favorite ? 'text-danger' : 'text-secondary'}`} aria-label="Додати в обране" onClick={toggleFavorite} style={{fontSize:22, borderRadius: '10px'}}>
              {favorite ? (
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              ) : (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              )}
            </button>
          </div>
          <div className="mb-4">
            <div className="fw-semibold mb-1">Опис товару:</div>
            <div className="text-secondary">{product.description || 'Опис відсутній.'}</div>
          </div>
          <div className="mb-4">
            <div className="fw-semibold mb-1">Характеристики:</div>
            <ul className="list-unstyled text-secondary">
              {product.features && product.features.length > 0 ? (
                product.features.map((f, i) => <li key={i}>• {f}</li>)
              ) : (
                <li>Немає характеристик.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {/* Відгуки */}
      <div className="product-reviews-section mt-5" id="product-reviews-section">
        <h3 className="mb-3">Відгуки про товар <span className="badge bg-light text-dark">{reviews.length}</span></h3>
        <div className="mb-3 d-flex align-items-center gap-3">
          <span className="fs-4 fw-bold">4,8/5</span>
          <span className="text-warning">{'★'.repeat(5)}</span>
          <span className="ms-3 small text-success bg-light rounded-pill px-3 py-1">Всі відгуки перевірені</span>
        </div>
        <div className="mb-3">
          <span className="me-2">Чи добре підійшов товар?</span>
          <span className="badge bg-light text-dark">менше 2%</span>
          <span className="badge bg-light text-dark mx-1">ідеально 93%</span>
          <span className="badge bg-light text-dark">більше 5%</span>
        </div>
        <div className="mb-2 small text-secondary">СОРТУВАТИ: ВІД НАЙНОВІШИХ</div>
        <div className="reviews-list">
          {reviews.map(r => (
            <div key={r.id} className="card mb-3 p-3 shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="fw-bold">{r.author}</span>
                <span className="text-warning">{'★'.repeat(r.rating)}</span>
                <span className="ms-2 small text-secondary">{r.date}</span>
              </div>
              <div>{r.text}</div>
              <div className="mt-2 small text-secondary">
                колір: {r.color}, куплений розмір: {r.size}. Відповідність до розміру: <b>{r.fit}</b>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
