import React, { useState, useRef, useEffect } from 'react';
import './ProductDetails.css';
import AddToCartModal from './AddToCartModal';
import LoginToFavoriteModal from './LoginToFavoriteModal';
import { Pagination } from 'react-bootstrap';

const API_URL = import.meta.env.VITE_BACKEND_API_LINK;

const ProductDetails = ({ model, products = [], comments = [] }) => {
  const [userNames, setUserNames] = useState({});
  const [showLikeTooltip, setShowLikeTooltip] = useState(null);  id коммента для тултипа
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [categoryName, setCategoryName] = useState('');
   Унікальні розміри з products
  const uniqueSizes = Array.from(new Set(products.map(p => p.size?.name).filter(Boolean)));
  const [selectedSize, setSelectedSize] = useState(uniqueSizes[0] || '');

   Додаємо стейт для активного кольору
  const [activeColorId, setActiveColorId] = useState((model.colors && model.colors[0]?.id) || null);

   Получаем имя категории по categoryId
  useEffect(() => {
    const catId = model?.categoryId;
    if (!catId) return;
    fetch(`${API_URL}/api/Categories/${catId}`, { method: 'GET' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && (data.name || data.Name)) setCategoryName(data.name || data.Name);
      })
      .catch(() => setCategoryName('Категорія'));
  }, [model?.categoryId]);

   Знаходимо продукт для активного кольору та розміру
  const activeProduct = products.find(
    p =>
      (activeColorId ? (p.color && p.color.id === activeColorId) : true) &&
      (selectedSize ? (p.size && p.size.name === selectedSize) : true)
  ) || products[0] || {};

   Додавання в кошик
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
const [addedProduct, setAddedProduct] = useState(null);

const handleAddToCart = () => {
  if (!selectedSize) return;
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  } catch (e) { cart = []; }
   Знаходимо продукт для обраного розміру та кольору
  const selectedProduct = products.find(p => (p.size?.name || '') === selectedSize && (!activeColorId || (p.color && p.color.id === activeColorId))) || products[0];
  if (!selectedProduct) return;
  const mainPhoto = model.photos && model.photos[0]?.path ? `/images/${model.photos[0].path}` : (selectedProduct.image || '');
  const exists = cart.find(item => item.id === selectedProduct.id);
   Визначаємо ціну: пріоритет — selectedProduct.price, далі product.color.model.price, далі model.price
  let finalPrice = selectedProduct.price;
  if (finalPrice == null) {
    if (selectedProduct.color && selectedProduct.color.model && selectedProduct.color.model.price != null) {
      finalPrice = selectedProduct.color.model.price;
    } else if (model.price != null) {
      finalPrice = model.price;
    } else {
      finalPrice = 0;
    }
  }

  if (exists) {
    exists.quantity = (exists.quantity || 1) + 1;
  } else {
    cart.push({ ...selectedProduct, name: model.name, quantity: 1, image: mainPhoto, price: finalPrice });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  setAddedProduct({ ...selectedProduct, image: mainPhoto, price: finalPrice });
  setShowAddToCartModal(true);
};
  
  const [showModal, setShowModal] = useState(false);  для інших модалок
 AddToCartModal state додано вище
  const [showSortList, setShowSortList] = useState(false);
  const [sort, setSort] = useState('ВІД НАЙНОВІШИХ');
  const [likedReviews, setLikedReviews] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const modalRef = useRef(null);
  const [openSections, setOpenSections] = useState({ description: true, features: false });
  const [reviews, setReviews] = useState([]);

   === Підрахунок відсотків відгуків ===
  const totalReviews = reviews.length;
  const countLess = reviews.filter(r => r.rating >= 1 && r.rating <= 3).length;
  const countIdeal = reviews.filter(r => r.rating === 4).length;
  const countMore = reviews.filter(r => r.rating === 5).length;
  const percentLess = totalReviews ? Math.round((countLess / totalReviews) * 100) : 0;
  const percentIdeal = totalReviews ? Math.round((countIdeal / totalReviews) * 100) : 0;
  const percentMore = totalReviews ? Math.round((countMore / totalReviews) * 100) : 0;

   Фетчимо коментарі з /api/Comments для цього товару
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch('/api/Comments');
        const allComments = await res.json();
        let filtered = [];
         console.log('products:', products);
         console.log('allComments:', allComments);
        if (Array.isArray(products) && products.length > 0) {
           Всі можливі productId з products
          const productIds = products.map(p => p.id).filter(Boolean);
           console.log('productIds:', productIds);
          filtered = Array.isArray(allComments)
            ? allComments.filter(c => productIds.includes(c.productId))
            : [];
           console.log('filtered:', filtered);
        } else {
           Fallback: як раніше
          filtered = Array.isArray(allComments)
            ? allComments.filter(c => c.productId === model.id)
            : [];
        }
        console.log('filtered:', filtered);
        setReviews(filtered);
      } catch (e) {
        setReviews([]);
      }
    }
    if (model?.id) fetchComments();
  }, [model?.id, products]);

  useEffect(() => {
    const uniqueUserIds = Array.from(new Set(reviews.map(r => r.userId).filter(Boolean)));
    if (uniqueUserIds.length === 0) return;
    Promise.all(
      uniqueUserIds.map(id =>
        fetch(`/api/Users/${id}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => ({ id, name: data?.fullName || data?.FullName || data?.name || 'Користувач' }))
          .catch(() => ({ id, name: 'Користувач' }))
      )
    ).then(results => {
      const map = {};
      results.forEach(({ id, name }) => { map[id] = name; });
      setUserNames(map);
    });
  }, [JSON.stringify(reviews)]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const MODELS_API_URL = `${API_URL}/api/Models`;

  const fetchModels = async () => {
    try {
      const res = await fetch(MODELS_API_URL);
      if (!res.ok) throw new Error('Помилка завантаження моделей');
      await res.json();
    } catch (e) {
       handle error if needed
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

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

  if (!model) return <div>Товар не знайдено</div>;

  const images = (model.photos && model.photos.length > 0)
    ? model.photos.map(photo => `/images/${photo.path}`)
    : [model.image || '/images/no-image.png'];

  const prevImage = () => setSelectedImageIdx((selectedImageIdx - 1 + images.length) % images.length);
  const nextImage = () => setSelectedImageIdx((selectedImageIdx + 1) % images.length);

  const breadcrumbs = [
    { label: "La'Renza", link: '/' },
    { label: categoryName || 'Категорія', link: '#' },
    { label: model?.title || model?.name || 'Товар', link: '#' },
  ];

  const sortOptions = [
    'ВІД НАЙНОВІШИХ',
    'ВІД НАЙСТАРШИХ',
    'ВІД НАЙВИЩОГО РЕЙТИНГУ',
    'ВІД НАЙНИЖЧОГО РЕЙТИНГУ',
    'ЗА ЛАЙКАМИ (БІЛЬШЕ)',
    'ЗА ЛАЙКАМИ (МЕНШЕ)',
  ];

  function getProductById(pid) {
    return products.find(p => p.id === pid) || {};
  }
  function getProductSize(pid) {
    return getProductById(pid)?.size?.name || '';
  }
  function getProductColor(pid) {
    return getProductById(pid)?.color?.name || '';
  }
  function formatDate(dateStr) {
    if (!dateStr) return '';
     Прибрати T, залишити тільки дату і час
    return dateStr.replace('T', ' ').replace(/:00.000Z$/, '');
  }

  const getSortedReviews = () => {
    if (sort === 'ВІД НАЙНОВІШИХ') return [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === 'ВІД НАЙСТАРШИХ') return [...reviews].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === 'ВІД НАЙВИЩОГО РЕЙТИНГУ') return [...reviews].sort((a, b) => b.rating - a.rating);
    if (sort === 'ВІД НАЙНИЖЧОГО РЕЙТИНГУ') return [...reviews].sort((a, b) => a.rating - b.rating);
    if (sort === 'ЗА ЛАЙКАМИ (БІЛЬШЕ)') return [...reviews].sort((a, b) => (b.likesAmount || 0) - (a.likesAmount || 0));
    if (sort === 'ЗА ЛАЙКАМИ (МЕНШЕ)') return [...reviews].sort((a, b) => (a.likesAmount || 0) - (b.likesAmount || 0));
    return reviews;
  };

  const handleLikeReview = (id) => {
    setLikedReviews(prev => {
      const alreadyLiked = !!prev[id];
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === id 
            ? { ...review, likesAmount: review.likesAmount + (alreadyLiked ? -1 : 1) }
            : review
        )
      );
      return { ...prev, [id]: !alreadyLiked };
    });
  };

   Pagination calculations
  const sortedReviews = getSortedReviews();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

     Previous button
    pages.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      />
    );

     First page
    if (startPage > 1) {
      pages.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        pages.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
      }
    }

     Page numbers
    for (let number = startPage; number <= endPage; number++) {
      pages.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

     Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
      }
      pages.push(
        <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

     Next button
    pages.push(
      <Pagination.Next 
        key="next" 
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      />
    );

    return pages;
  };

   --- временная переменная для авторизации ---
  const isLoggedIn = false;  Замените на реальную проверку

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
              <img src={images[selectedImageIdx]} alt={model?.title || model?.name || 'Товар'} className="main-image img-fluid rounded-3" style={{boxShadow: 'none !important', border: 'none !important', outline: 'none !important'}} />
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
                  onClick={() => setOpenSections(prev => ({ ...prev, description: !prev.description }))}
                >
                  <span>Опис товару</span>
                  
                  <span style={{marginLeft: 'auto', fontSize: 28, lineHeight: 1}}>
                    {openSections.description ? '−' : '+'}
                  </span>
                </div>
                {openSections.description && (
  <div className="accordion-body-custom" style={{padding: '8px 0 16px 0'}}>
    <div className="text-secondary">{model.description || 'Опис відсутній.'}</div>
  </div>
)}
              </div>
              <hr style={{margin: 0}} />

              <div className="accordion-item-custom">
                <div
                  className="accordion-header-custom d-flex align-items-center justify-content-between"
                  style={{cursor: 'pointer', padding: '12px 0', fontWeight: 600, fontSize: '1.1rem'}}
                  onClick={() => setOpenSections(prev => ({ ...prev, features: !prev.features }))}
                >
                  <span>Характеристики</span>
                  <span style={{marginLeft: 'auto', fontSize: 28, lineHeight: 1}}>
                    {openSections.features ? '−' : '+'}
                  </span>
                </div>
                {openSections.features && (
  <div className="accordion-body-custom" style={{padding: '8px 0 16px 0'}}>
    <ul className="list-unstyled text-secondary">
      {model.materialInfo ? (
        <li>{model.materialInfo}</li>
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
          
          <div className="d-flex align-items-center gap-3 mb-2">
            <h1 className="fw-bold h3 m-0">{model?.title || model?.name || 'Товар'}</h1>
          </div>
          <div className="price-block mb-2">
  <span className="current-price text-purple">{activeProduct?.price ?? model.price ?? 0} ₴</span>
</div> 

          <div className="mb-3">
  <span className="text-secondary me-2">Колір - {(() => {
  const colorObj = Array.isArray(model.colors) && model.colors.find(c => c.id === activeColorId);
  return colorObj?.name || 'чорний';
})()}</span>
  {Array.isArray(model.colors) && model.colors.length > 0 && (
    <div className="d-flex align-items-center mt-2 mb-2 gap-2">
      {model.colors.map((clr, idx) => {
  let colorImg = clr && clr.image && clr.image.path ? clr.image.path : (clr && clr.photo && clr.photo.path ? clr.photo.path : null);
  if (colorImg && colorImg.startsWith('/public/')) colorImg = colorImg.replace(/^\/public/, '');
  colorImg = colorImg ? `/images/${colorImg.replace(/^\, '')}` : null;
  const isActive = (clr.id && clr.id === activeColorId) || (!clr.id && idx === 0 && !activeColorId);
   Якщо clr — об'єкт з картинкою
  if (colorImg) {
    return (
      <span
        key={clr.id || idx}
        title={clr.name}
        onClick={() => setActiveColorId(clr.id)}
        style={{
          display: 'inline-block',
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: isActive ? '2px solid #a259e6' : '2px solid #eee',
          overflow: 'hidden',
          background: '#f4f4f4',
          boxShadow: isActive ? '0 2px 8px #a259e633' : '0 1px 3px #0001',
          cursor: 'pointer',
          marginRight: 2,
          marginLeft: 2
        }}
      >
        <img src={colorImg} alt={clr.name || 'color'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </span>
    );
  } else {
     Якщо clr — просто рядок кольору або об'єкт без картинки
    let bg = typeof clr === 'string' ? clr : (clr && clr.hex ? clr.hex : '#ccc');
    return (
      <span
        key={clr.id || idx}
        title={clr.name}
        onClick={() => setActiveColorId(clr.id)}
        style={{
          display: 'inline-block',
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: isActive ? '2px solid #a259e6' : '2px solid #eee',
          overflow: 'hidden',
          background: bg,
          boxShadow: isActive ? '0 2px 8px #a259e633' : '0 1px 3px #0001',
          cursor: 'pointer',
          marginRight: 2,
          marginLeft: 2
        }}
      ></span>
    );
  }
})} 
    </div>
  )}
</div>
<div className="size-selector mb-3">
  <div className="fw-semibold mb-2">Оберіть розмір:</div>
  <div className="d-flex gap-2 flex-wrap">
    {uniqueSizes.map(size => (
      <button
        key={size}
        className={`btn btn-sm ${selectedSize === size ? ' active' : ''}`}
        onClick={() => setSelectedSize(size)}
        style={{
          borderRadius: 8,
          minWidth: 48,
          fontWeight: 600,
          marginRight: 8,
          marginBottom: 8,
          background: selectedSize === size ? '#5a32a3' : '#a259e6',
          color: '#fff',
          border: 'none',
          boxShadow: selectedSize === size ? '0 2px 8px #a259e633' : '0 1px 3px #0001',
          transition: 'background 0.18s, color 0.18s',
        }}
      >
        {size}
      </button>
    ))}
  </div>
</div>
<div className="mb-2 d-flex align-items-center gap-2 review-compact">
  <span className="review-stars compact">{'★'.repeat(Math.round(model?.rate || 0))}</span>
  <span className="review-score">{model?.rate ? model.rate.toFixed(1) : '0.0'}/5</span>
  <a href="#product-reviews-section" className="review-link">
    відгуків ({reviews.length})
  </a>
</div>
          <div className="mb-3 d-flex align-items-center" style={{gap: 12}}>
            <button className="add-to-cart-btn btn-purple px-4 py-2 fw-bold" style={{height: 48, fontSize: '1.1rem', borderRadius: 12}} onClick={handleAddToCart}>
              Додати у кошик
            </button>
            <div style={{position:'relative'}}>
              <button
                className="btn"
                style={{
                  width: 48,
                  height: 48,
                  background: '#a259e6',
                  border: 'none',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px #0001',
                  transition: 'background 0.2s',
                  padding: 0
                }}
                onMouseOver={e => e.currentTarget.style.background = '#5a32a3'}
                onMouseOut={e => e.currentTarget.style.background = '#a259e6'}
                onClick={() => {
                  if (!isLoggedIn) {
                    setShowFavoriteModal(true);
                    return;
                  }
                  setIsFavorite(f => !f);
                }}
                aria-label={isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill={isFavorite ? '#fff' : 'none'} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>

            </div>
          </div>
        </div>
      </div>
      <div className="product-reviews-section mt-5" id="product-reviews-section">
        <h3 className="mb-3">Відгуки про товар <span className="badge bg-light">{reviews.length}</span></h3>
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
          <span className="badge badge-fit">менше {percentLess}%</span>
          <span className="badge badge-fit mx-1">ідеально {percentIdeal}%</span>
          <span className="badge badge-fit">більше {percentMore}%</span>
        </div>
        <div className="reviews-list">
          {currentItems.map(r => (
            <div key={r.id} className="card mb-3 p-3 shadow-sm d-flex flex-row align-items-start gap-3 position-relative">
              <div style={{width: 48, height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f3f3', borderRadius: 12, border: '1px solid #eee'}}>
                <img src="https:upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg" alt="?" style={{width: 32, height: 32, objectFit: 'contain'}} />
              </div>
              <div style={{flex: 1}}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fw-bold">{userNames[r.userId] || 'Користувач'}</span>
                  <span className="text-warning">{'★'.repeat(r.rating)}</span>
                  <span className="ms-2 small text-secondary">{formatDate(r.date)}</span>
                </div>
                <div className="mb-2">{r.text}</div>
                <div className="small text-secondary d-flex align-items-center gap-2">
                  <span>Розмір: {getProductSize(r.productId)}</span>
                  <span>•</span>
                  <span>Колір: {getProductColor(r.productId)}</span>
                </div>
              </div>

              <div style={{position: 'relative'}}>
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
                  onClick={() => {
                    if (!isLoggedIn) {
                      setShowLikeTooltip(r.id);
                      setTimeout(() => setShowLikeTooltip(null), 2000);
                      return;
                    }
                    handleLikeReview(r.id);
                  }}
                  aria-label={likedReviews[r.id] ? 'Відмінити лайк' : 'Лайкнути'}
                >
                  <svg width="20" height="20" fill={likedReviews[r.id] ? '#a259e6' : 'none'} stroke={likedReviews[r.id] ? '#a259e6' : '#bbb'} strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span style={{marginLeft: 2, color: '#222', fontWeight: 600, fontSize: '1rem'}}>{(typeof r.likesAmount === 'number' ? r.likesAmount : 0) + (likedReviews[r.id] ? 1 : 0)}</span>
                </button>
                {showLikeTooltip === r.id && (
                  <div style={{position: 'absolute', right: 0, top: 40, background: '#222', color: '#fff', borderRadius: 8, padding: '8px 14px', fontSize: 15, zIndex: 99, minWidth: 170, boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                    <span style={{fontWeight: 700, textDecoration: 'underline'}}>Увійдіть</span><br/>
                    вподобати відгук
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {sortedReviews.length > itemsPerPage && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination className="mb-0">
              {renderPagination()}
            </Pagination>
          </div>
        )}
      </div>

      { Модальне вікно підтвердження додавання в кошик */}
      <AddToCartModal
        show={showAddToCartModal}
        product={addedProduct ? {
          ...addedProduct,
          name: model.name,
          image: (model.photos && model.photos[0]?.path ? `/images/${model.photos[0].path}` : ''),
          color: (addedProduct.color && typeof addedProduct.color === 'object' ? addedProduct.color.name : addedProduct.color || '')
        } : null}
        onClose={() => setShowAddToCartModal(false)}
        onCheckout={() => { setShowAddToCartModal(false); window.location.href = '/cart'; }}
        modalRef={modalRef}
        selectedSize={selectedSize}
      />

      { Модалка для входа в избранное */}
      <LoginToFavoriteModal
        show={showFavoriteModal}
        onClose={() => setShowFavoriteModal(false)}
        productImage={model?.photos && model.photos[0]?.path ? `/images/${model.photos[0].path}` : ''}
        onLogin={() => { window.location.href = '/login'; }}
        onRegister={() => { window.location.href = '/register'; }}
      />
    </div>
  );
};

export default ProductDetails;
