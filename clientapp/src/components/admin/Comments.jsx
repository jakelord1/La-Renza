import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Alert, Table, Modal, Pagination } from 'react-bootstrap';
const API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Comments`;
const MODELS_API_URL = '/api/Models';
const CATEGORY_API_URL = '/api/Categories';
const USERS_API_URL = '/api/Users';
const IMAGES_API_URL = '/api/Images';

function StarRating({ value, onChange, disabled }) {
  return (
    <div className="star-rating d-flex align-items-center gap-1" style={{fontSize: '1.4rem'}}>
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          style={{cursor: disabled ? 'default' : 'pointer', color: star <= value ? '#6f42c1' : '#e0e0e0', transition: 'color 0.15s'}}
          onClick={() => !disabled && onChange(star)}
          onMouseOver={e => !disabled && (e.currentTarget.style.color = '#6f42c1')}
          onMouseOut={e => !disabled && (e.currentTarget.style.color = star <= value ? '#6f42c1' : '#e0e0e0')}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={star <= value ? '#6f42c1' : 'none'} stroke="#6f42c1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </span>
      ))}
    </div>
  );
}

const paginationStyles = {
  '.pagination': {
    '--bs-pagination-color': '#6f42c1',
    '--bs-pagination-bg': '#fff',
    '--bs-pagination-border-color': '#dee2e6',
    '--bs-pagination-hover-color': '#fff',
    '--bs-pagination-hover-bg': '#6f42c1',
    '--bs-pagination-hover-border-color': '#6f42c1',
    '--bs-pagination-focus-color': '#6f42c1',
    '--bs-pagination-focus-bg': '#e9ecef',
    '--bs-pagination-focus-box-shadow': '0 0 0 0.25rem rgba(111, 66, 193, 0.25)',
    '--bs-pagination-active-color': '#fff',
    '--bs-pagination-active-bg': '#6f42c1',
    '--bs-pagination-active-border-color': '#6f42c1',
    '--bs-pagination-disabled-color': '#6c757d',
    '--bs-pagination-disabled-bg': '#fff',
    '--bs-pagination-disabled-border-color': '#dee2e6',
  },
  '.page-link': {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '0.375rem',
    margin: '0 0.2rem',
    border: '1px solid var(--bs-pagination-border-color)',
    transition: 'all 0.2s ease-in-out',
  },
  '.page-item.active .page-link': {
    backgroundColor: 'var(--bs-pagination-active-bg)',
    borderColor: 'var(--bs-pagination-active-border-color)',
  },
  '.page-link:hover': {
    backgroundColor: 'var(--bs-pagination-hover-bg)',
    borderColor: 'var(--bs-pagination-hover-border-color)',
    color: 'var(--bs-pagination-hover-color)',
  },
  '.page-link:focus': {
    boxShadow: 'var(--bs-pagination-focus-box-shadow)',
  },
  '.page-item.disabled .page-link': {
    color: 'var(--bs-pagination-disabled-color)',
    backgroundColor: 'var(--bs-pagination-disabled-bg)',
    borderColor: 'var(--bs-pagination-disabled-border-color)',
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = Object.entries(paginationStyles)
  .map(([selector, styles]) => {
    return `${selector} { ${Object.entries(styles)
      .map(([property, value]) => `${property}: ${value};`)
      .join(' ')} }`;
  })
  .join('\n');
document.head.appendChild(styleSheet);

const Comments = () => {
  const [userNames, setUserNames] = useState({});
  const [modelNames, setModelNames] = useState({});
  const [colorNames, setColorNames] = useState({});
  const [colorIdToModelId, setColorIdToModelId] = useState({});
  const [sizeNames, setSizeNames] = useState({});
  const [productMap, setProductMap] = useState({});
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [allComments, setAllComments] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingComment, setEditingComment] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [commentImagePreview, setCommentImagePreview] = useState(null);
  const [commentImage, setCommentImage] = useState(null);

  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedColorId, setSelectedColorId] = useState('');
  const [selectedSizeId, setSelectedSizeId] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(MODELS_API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Помилка завантаження моделей');
        return res.json();
      })
      .then(data => setModels(data))
      .catch(() => setModels([]));
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Помилка завантаження коментарів');
        return res.json();
      })
      .then(async (data) => {
        setAllComments(data);
        const userIds = Array.from(new Set(data.map(c => c.userId).filter(Boolean)));
        const productIds = Array.from(new Set(data.map(c => c.productId).filter(Boolean)));
        const userReqs = userIds.map(id => fetch(`/api/Users/${id}`).then(r => r.ok ? r.json() : null).catch(()=>null));
        const userResults = await Promise.all(userReqs);
        const userMap = {};
        userResults.forEach((u, i) => { if (u && u.fullName) userMap[userIds[i]] = u.fullName; });
        setUserNames(userMap);
        const prodReqs = productIds.map(id => fetch(`/api/Products/${id}`).then(r => r.ok ? r.json() : null).catch(()=>null));
        const prodResults = await Promise.all(prodReqs);
        const prodMap = {};
        const colorIds = new Set();
        const sizeIds = new Set();
        prodResults.forEach((p, i) => {
          if (p) {
            prodMap[productIds[i]] = p;
            if (p.colorId) colorIds.add(p.colorId);
            if (p.sizeId) sizeIds.add(p.sizeId);
          }
        });
        setProductMap(prodMap);
        const colorIdArr = Array.from(colorIds);
        const colorReqs = colorIdArr.map(id => fetch(`/api/Colors/${id}`).then(r => r.ok ? r.json() : null).catch(()=>null));
        const colorResults = await Promise.all(colorReqs);
        const colorMap = {};
        const modelIds = new Set();
        colorResults.forEach((c, i) => {
          if (c) {
            colorMap[colorIdArr[i]] = c;
            if (c.modelId) modelIds.add(c.modelId);
          }
        });
        setColorNames(Object.fromEntries(colorIdArr.map((id, i) => [id, colorResults[i]?.name || '-'])));
        setColorIdToModelId(Object.fromEntries(colorIdArr.map((id, i) => [id, colorResults[i]?.modelId || null])));
        const sizeIdArr = Array.from(sizeIds);
        const sizeReqs = sizeIdArr.map(id => fetch(`/api/Sizes/${id}`).then(r => r.ok ? r.json() : null).catch(()=>null));
        const sizeResults = await Promise.all(sizeReqs);
        setSizeNames(Object.fromEntries(sizeIdArr.map((id, i) => [id, sizeResults[i]?.name || '-'])));
        const modelIdArr = Array.from(modelIds);
        const modelReqs = modelIdArr.map(id => fetch(`/api/Models/${id}`).then(r => r.ok ? r.json() : null).catch(()=>null));
        const modelResults = await Promise.all(modelReqs);
        setModelNames(Object.fromEntries(modelIdArr.map((id, i) => [id, modelResults[i]?.name || '-'])));
      })
      .catch(e => setAlert({ show: true, type: 'danger', message: e.message }))
      .finally(() => setLoading(false));
    setLoading(true);
    fetch(USERS_API_URL)
      .then(res => res.ok ? res.json() : [])
      .then(data => setUsers(data))
      .catch(() => setUsers([]));
    fetch('/api/Products')
      .then(res => res.ok ? res.json() : [])
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedModelId || !selectedColorId || !selectedSizeId) {
      setAlert({ show: true, type: 'danger', message: 'Будь ласка, оберіть модель, колір та розмір' });
      return;
    }
    if (!text.trim()) {
      setAlert({ show: true, type: 'danger', message: 'Будь ласка, додайте текст коментаря' });
      return;
    }
    if (!selectedUserId) {
      setAlert({ show: true, type: 'danger', message: 'Будь ласка, введіть автора' });
      return;
    }
    setLoading(true);
    try {
      const foundProduct = products.find(
        p =>
          String(p.color?.model?.id) === selectedModelId &&
          String(p.color?.id) === selectedColorId &&
          String(p.size?.id) === selectedSizeId
      );
      const productId = foundProduct ? foundProduct.id : null;
      if (!productId) {
        setAlert({ show: true, type: 'danger', message: 'Не знайдено відповідний товар (productId)' });
        return;
      }
      const newComment = {
        productId: Number(productId),
        userId: Number(selectedUserId),
        image: commentImage ? { path: commentImage.path } : null,
        text,
        rating,
        date: new Date().toISOString(),
        likesAmount: 0
      };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
      });
      if (!res.ok) throw new Error('Не вдалося додати коментар');
      setAlert({ show: true, type: 'success', message: 'Коментар успішно додано!' });
      setShowAddModal(false);
      setText('');
      setSelectedUserId('');
      setRating(5);
      setCommentImage(null);
      setCommentImagePreview(null);
      const commentsRes = await fetch(API_URL);
      const updatedComments = await commentsRes.json();
      setAllComments(updatedComments);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleShowComment = (comment) => {
    setCurrentComment(comment);
    setShowCommentModal(true);
  };


  const handleDeleteComment = async (id) => {
    if (window.confirm('Ви впевнені, що бажаєте видалити цей коментар?')) {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Не вдалося видалити коментар');
        setAlert({ show: true, type: 'success', message: 'Коментар видалено!' });
        const commentsRes = await fetch(API_URL);
        const updatedComments = await commentsRes.json();
        setAllComments(updatedComments);
      } catch (e) {
        setAlert({ show: true, type: 'danger', message: e.message });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditComment = async (comment) => {
    setEditingComment(comment);
    const product = products.find(p => p.id === comment.productId);
    setSelectedModelId(product?.color?.model?.id ? String(product.color.model.id) : '');
    setSelectedColorId(product?.color?.id ? String(product.color.id) : '');
    setSelectedSizeId(product?.size?.id ? String(product.size.id) : '');
    setSelectedUserId(comment.userId);
    setText(comment.text);
    setRating(comment.rating);
    setCommentImagePreview(comment.image);
    setShowEditModal(true);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!selectedModelId || !selectedColorId || !selectedSizeId) {
      setAlert({ show: true, type: 'danger', message: 'Будь ласка, оберіть модель, колір та розмір' });
      return;
    }
    if (!text.trim()) {
      setAlert({ show: true, type: 'danger', message: 'Будь ласка, додайте текст коментаря' });
      return;
    }
    if (!selectedUserId) {
      setAlert({ show: true, type: 'danger', message: 'Будь ласка, введіть автора' });
      return;
    }
    setLoading(true);
    try {
      const foundProduct = products.find(
        p =>
          String(p.color?.model?.id) === selectedModelId &&
          String(p.color?.id) === selectedColorId &&
          String(p.size?.id) === selectedSizeId
      );
      const productId = foundProduct ? foundProduct.id : null;
      if (!productId) {
        setAlert({ show: true, type: 'danger', message: 'Не знайдено відповідний товар (productId)' });
        return;
      }
      const updatedComment = {
        ...editingComment,
        productId: Number(productId),
        userId: Number(selectedUserId),
        image: commentImage ? { path: commentImage.path } : null,
        text,
        rating,
        date: editingComment.date || new Date().toISOString(),
        likesAmount: editingComment.likesAmount || 0
      };
      const res = await fetch(`${API_URL}/${editingComment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedComment)
      });
      if (!res.ok) throw new Error('Не вдалося оновити коментар');
      setAlert({ show: true, type: 'success', message: 'Коментар оновлено!' });
      setShowEditModal(false);
      setEditingComment(null);
      const commentsRes = await fetch(API_URL);
      const updatedComments = await commentsRes.json();
      setAllComments(updatedComments);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allComments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allComments.length / itemsPerPage);

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

    pages.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      />
    );

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

    pages.push(
      <Pagination.Next 
        key="next" 
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      />
    );

    return pages;
  };

  const handleCommentImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setCommentImagePreview(ev.target.result);
      reader.readAsDataURL(file);
      // Загружаем на сервер
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch(IMAGES_API_URL, { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Не вдалося додати зображення');
        const img = await res.json();
        setCommentImage(img);
      } catch (e) {
        setCommentImage(null);
      }
    } else {
      setCommentImagePreview(null);
      setCommentImage(null);
    }
  };

  const uniqueModels = Array.from(new Map(products.map(p => [p.color?.model?.id, p.color?.model])).values()).filter(Boolean);
  const filteredColors = products
    .filter(p => String(p.color?.model?.id) === selectedModelId)
    .map(p => p.color)
    .filter((color, idx, arr) => color && arr.findIndex(c => c.id === color.id) === idx);
  const filteredSizes = products
    .filter(p => String(p.color?.model?.id) === selectedModelId && String(p.color?.id) === selectedColorId)
    .map(p => p.size)
    .filter((size, idx, arr) => size && arr.findIndex(s => s.id === size.id) === idx);

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Коментарі</h2>
      {alert.show && (
        <Alert 
          variant={alert.type} 
          onClose={() => setAlert({...alert, show: false})} 
          dismissible
        >
          {alert.message}
        </Alert>
      )}
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-4 mb-4" style={{maxWidth: 900, margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі коментарі</h4>
          <Button
            style={{ background: '#6f42c1', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '1.05rem', padding: '8px 22px', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-lg" style={{fontSize:18}}></i> Додати
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" role="status" style={{ color: '#6f42c1' }}>
              <span className="visually-hidden">Завантаження...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {currentItems.length === 0 ? (
                <div className="text-muted text-center py-5">Коментарів ще немає</div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {currentItems.map(comment => (
  <div key={comment.id} className="d-flex align-items-start gap-3 p-3 rounded-4 shadow-sm bg-light position-relative" style={{minHeight: 90}}>
      <div style={{width:48, height:48, borderRadius:12, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px #0001', flexShrink:0}}>
        {comment.image && comment.image.path ? (
          <img src={"/images/" + comment.image.path} alt="фото відгуку" style={{width: 32, height: 32, objectFit: 'cover', borderRadius: 8}} />
        ) : (
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg" alt="?" style={{width: 32, height: 32, objectFit: 'contain'}} />
        )}
      </div>
    <div className="flex-grow-1">
      <div className="d-flex align-items-center gap-2 mb-1">
        <span className="fw-bold">{userNames[comment.userId] || comment.author}</span>
        <span className="text-warning">{'★'.repeat(comment.rating)}</span>
        <span className="text-muted small ms-2">{comment.date}</span>
      </div>
      <div className="mb-1">{comment.text}</div>
      <div className="small text-secondary">{
        (() => {
          const prod = productMap[comment.productId];
          if (!prod) return '-';
          const colorName = prod.colorId && colorNames[prod.colorId] ? colorNames[prod.colorId] : '-';
          const sizeName = prod.sizeId && sizeNames[prod.sizeId] ? sizeNames[prod.sizeId] : '-';
          const modelId = prod.colorId && colorIdToModelId[prod.colorId] ? colorIdToModelId[prod.colorId] : null;
          const modelName = modelId && modelNames[modelId] ? modelNames[modelId] : '-';
          return `${modelName} • ${sizeName} • ${colorName}`;
        })()
      }</div>
    </div>
    <div className="d-flex align-items-center gap-3 ms-2">
      <Button variant="link" size="sm" onClick={() => handleShowComment(comment)} title="Деталі" className="p-0"><i className="bi bi-eye"></i></Button>
      <Button variant="link" size="sm" onClick={() => handleEditComment(comment)} title="Редагувати" className="p-0"><i className="bi bi-pencil" style={{color: '#6f42c1'}}></i></Button>
      <Button variant="link" size="sm" onClick={() => handleDeleteComment(comment.id)} title="Видалити" className="p-0"><i className="bi bi-trash text-danger"></i></Button>
    </div>
  </div>
))}
              </div>
            )}
          </div>
          {allComments.length > itemsPerPage && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination className="mb-0">
                {renderPagination()}
              </Pagination>
            </div>
          )}
        </>
      )}
    </Card>

    <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="md" dialogClassName="modal-narrow">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">Додати новий коментар</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label htmlFor="model" className="form-label text-secondary small mb-1">Модель</label>
            <Form.Select
              id="model"
              value={selectedModelId}
              onChange={e => {
                setSelectedModelId(e.target.value);
                setSelectedColorId('');
                setSelectedSizeId('');
              }}
              required
              className="form-select-lg custom-select"
              disabled={loading}
            >
              <option value="">Оберіть модель</option>
              {uniqueModels.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </Form.Select>
          </div>
          {selectedModelId && (
            <div className="col-12">
              <label htmlFor="color" className="form-label text-secondary small mb-1">Колір</label>
              <Form.Select
                id="color"
                value={selectedColorId}
                onChange={e => {
                  setSelectedColorId(e.target.value);
                  setSelectedSizeId('');
                }}
                required
                className="form-select-lg custom-select"
                disabled={loading}
              >
                <option value="">Оберіть колір</option>
                {filteredColors.map(color => (
                  <option key={color.id} value={color.id}>{color.name}</option>
                ))}
              </Form.Select>
            </div>
          )}
          {selectedModelId && selectedColorId && (
            <div className="col-12">
              <label htmlFor="size" className="form-label text-secondary small mb-1">Розмір</label>
              <Form.Select
                id="size"
                value={selectedSizeId}
                onChange={e => setSelectedSizeId(e.target.value)}
                required
                className="form-select-lg custom-select"
                disabled={loading}
              >
                <option value="">Оберіть розмір</option>
                {filteredSizes.map(size => (
                  <option key={size.id} value={size.id}>{size.name}</option>
                ))}
              </Form.Select>
            </div>
          )}
          <div className="col-12">
            <label htmlFor="author" className="form-label text-secondary small mb-1">Автор</label>
            <Form.Select id="author" value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} className="form-select-lg custom-select" disabled={loading} required>
              <option value="">Оберіть автора</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.fullName} ({user.email})</option>
              ))}
            </Form.Select>
          </div>
          <div className="col-12">
            <label htmlFor="comment" className="form-label text-secondary small mb-1">Текст коментаря</label>
            <Form.Control as="textarea" id="comment" value={text} onChange={e => setText(e.target.value)} placeholder="Текст коментаря" style={{ minHeight: 80 }} disabled={loading} className="rounded-3" />
          </div>
          <div className="col-12 mb-2">
            <label className="form-label text-secondary small mb-1">Оцінка</label>
            <StarRating value={rating} onChange={setRating} disabled={loading} />
          </div>
          <div className="col-12">
            <label htmlFor="comment-image" className="form-label text-secondary small mb-1">Фото до коментаря</label>
            <Form.Control type="file" id="comment-image" accept="image/*" onChange={handleCommentImageChange} className="form-control-lg" />
            {commentImagePreview && (
              <div className="mt-2 text-center">
                <img src={commentImagePreview} alt="preview" style={{ maxWidth: 120, maxHeight: 120, objectFit: 'cover', borderRadius: 8 }} />
              </div>
            )}
          </div>
          <div className="col-12 mt-2">
            <Button type="submit" className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" style={{ background: '#6f42c1', border: 'none', fontWeight:600, fontSize:'1.1rem', padding:'12px 0' }} disabled={loading}>
              {loading ? <Spinner size="sm" /> : <><i className="bi bi-send me-2"></i>Додати</>}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>

    <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Деталі коментаря</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentComment && (
          <div>
            <p><strong>ID коментаря:</strong> {currentComment.id}</p>
            <p><strong>Автор:</strong> {userNames[currentComment.userId] || currentComment.author}</p>
            <p><strong>Товар:</strong> {
              (() => {
                const prod = productMap[currentComment.productId];
                if (!prod) return '-';
                const modelId = prod.colorId && colorIdToModelId[prod.colorId] ? colorIdToModelId[prod.colorId] : null;
                const modelName = modelId && modelNames[modelId] ? modelNames[modelId] : '-';
                return modelName;
              })()
            }</p>
            <p><strong>Розмір:</strong> {
              (() => {
                const prod = productMap[currentComment.productId];
                if (!prod) return '-';
                return prod.sizeId && sizeNames[prod.sizeId] ? sizeNames[prod.sizeId] : '-';
              })()
            }</p>
            <p><strong>Колір:</strong> {
              (() => {
                const prod = productMap[currentComment.productId];
                if (!prod) return '-';
                return prod.colorId && colorNames[prod.colorId] ? colorNames[prod.colorId] : '-';
              })()
            }</p>
            <p><strong>Рейтинг:</strong> {'★'.repeat(currentComment.rating)}</p>
            <p><strong>Дата:</strong> {currentComment.date}</p>
            <p><strong>Текст:</strong> {currentComment.text}</p>
            {currentComment.image && currentComment.image.path ? (
              <div className="mt-3">
                <p><strong>Зображення:</strong></p>
                <img 
                  src={"/images/" + currentComment.image.path}
                  alt="Фото відгуку"
                  style={{ width: 120, objectFit: 'cover', borderRadius: 8, margin: '0 auto', display: 'block' }}
                />
              </div>
            ) : (
              <div className="text-center text-secondary">Зображення відсутнє</div>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={() => setShowCommentModal(false)}>Закрити</Button>
      </Modal.Footer>
    </Modal>

    <Modal show={showEditModal} onHide={() => {
      setShowEditModal(false);
      setEditingComment(null);
    }} centered size="md" dialogClassName="modal-narrow">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">Редагувати коментар</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdateComment} className="row g-3">
          <div className="col-12">
            <label htmlFor="edit-model" className="form-label text-secondary small mb-1">Модель</label>
            <Form.Select
              id="edit-model"
              value={selectedModelId}
              onChange={e => {
                setSelectedModelId(e.target.value);
                setSelectedColorId('');
                setSelectedSizeId('');
              }}
              required
              className="form-select-lg custom-select"
              disabled={loading}
            >
              <option value="">Оберіть модель</option>
              {uniqueModels.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </Form.Select>
          </div>
          {selectedModelId && (
            <div className="col-12">
              <label htmlFor="edit-color" className="form-label text-secondary small mb-1">Колір</label>
              <Form.Select
                id="edit-color"
                value={selectedColorId}
                onChange={e => {
                  setSelectedColorId(e.target.value);
                  setSelectedSizeId('');
                }}
                required
                className="form-select-lg custom-select"
                disabled={loading}
              >
                <option value="">Оберіть колір</option>
                {filteredColors.map(color => (
                  <option key={color.id} value={color.id}>{color.name}</option>
                ))}
              </Form.Select>
            </div>
          )}
          {selectedModelId && selectedColorId && (
            <div className="col-12">
              <label htmlFor="edit-size" className="form-label text-secondary small mb-1">Розмір</label>
              <Form.Select
                id="edit-size"
                value={selectedSizeId}
                onChange={e => setSelectedSizeId(e.target.value)}
                required
                className="form-select-lg custom-select"
                disabled={loading}
              >
                <option value="">Оберіть розмір</option>
                {filteredSizes.map(size => (
                  <option key={size.id} value={size.id}>{size.name}</option>
                ))}
              </Form.Select>
            </div>
          )}
          <div className="col-12">
            <label htmlFor="edit-author" className="form-label text-secondary small mb-1">Автор</label>
            <Form.Select
              id="edit-author"
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
              className="form-select-lg custom-select"
              disabled={loading}
              required
            >
              <option value="">Оберіть автора</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.fullName} ({user.email})</option>
              ))}
            </Form.Select>
          </div>
          <div className="col-12">
            <label htmlFor="edit-comment" className="form-label text-secondary small mb-1">Текст коментаря</label>
            <Form.Control as="textarea" id="edit-comment" value={text} onChange={e => setText(e.target.value)} placeholder="Текст коментаря" style={{ minHeight: 80 }} disabled={loading} className="rounded-3" />
          </div>
          <div className="col-12 mb-2">
            <label className="form-label text-secondary small mb-1">Оцінка</label>
            <StarRating value={rating} onChange={setRating} disabled={loading} />
          </div>
          <div className="col-12">
            <label htmlFor="edit-comment-image" className="form-label text-secondary small mb-1">Фото до коментаря</label>
            <Form.Control type="file" id="edit-comment-image" accept="image/*" onChange={handleCommentImageChange} className="form-control-lg" />
            {(commentImagePreview || editingComment?.image?.path) && (
              <div className="mt-2 text-center">
                <img src={commentImagePreview || `/images/${editingComment.image.path}`} alt="preview" style={{ maxWidth: 120, maxHeight: 120, objectFit: 'cover', borderRadius: 8 }} />
              </div>
            )}
          </div>
          <div className="col-12 mt-2">
            <Button type="submit" className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" style={{ background: '#6f42c1', border: 'none', fontWeight:600, fontSize:'1.1rem', padding:'12px 0' }} disabled={loading}>
              {loading ? <Spinner size="sm" /> : <><i className="bi bi-save me-2"></i>Зберегти зміни</>}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Закрити</Button>
      </Modal.Footer>
    </Modal>
  </div>
  );
};

export default Comments;