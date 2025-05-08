import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Alert, Table, Modal } from 'react-bootstrap';

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

const Comments = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [text, setText] = useState('');
  const [_image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [allComments, setAllComments] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);


  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: 'Футболка класична',
          sku: 'TS-001',
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Чорний', 'Білий', 'Сірий'],
          images: [
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg'
          ]
        },
        {
          id: 2,
          name: 'Джинси класичні',
          sku: 'JN-002',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Синій', 'Чорний'],
          images: [
            'https://example.com/image3.jpg'
          ]
        },
        {
          id: 3,
          name: 'Худі оверсайз',
          sku: 'HD-003',
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Чорний', 'Бежевий', 'Зелений'],
          images: [
            'https://example.com/image4.jpg',
            'https://example.com/image5.jpg'
          ]
        }
      ];
      
      setProducts(mockProducts);
      
      const mockComments = [
        {
          id: 1,
          productId: 1,
          text: 'Дуже якісний товар, рекомендую!',
          author: 'Анна',
          rating: 5,
          date: '2025-08-15',
          size: 'M',
          color: 'Чорний',
          image: null
        },
        {
          id: 2,
          productId: 1,
          text: 'Добре, але трохи великуватий розмір',
          author: 'Петро',
          rating: 4,
          date: '2025-08-10',
          size: 'L',
          color: 'Білий',
          image: null
        },
        {
          id: 3,
          productId: 2,
          text: 'Ідеальна посадка',
          author: 'Марія',
          rating: 5,
          date: '2025-08-05',
          size: 'M',
          color: 'Синій',
          image: null
        }
      ];
      
      setAllComments(mockComments);
      setLoading(false);
    }, 1000);
  }, []);

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value);
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setSelectedSize('');
    setSelectedColor('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      setAlert({
        show: true, 
        type: 'danger',
        message: 'Будь ласка, оберіть товар'
      });
      return;
    }
    
    if (!selectedSize) {
      setAlert({
        show: true, 
        type: 'danger',
        message: 'Будь ласка, оберіть розмір'
      });
      return;
    }
    
    if (!selectedColor) {
      setAlert({
        show: true, 
        type: 'danger',
        message: 'Будь ласка, оберіть колір'
      });
      return;
    }
    
    if (!text.trim()) {
      setAlert({
        show: true, 
        type: 'danger',
        message: 'Будь ласка, додайте текст коментаря'
      });
      return;
    }
    
    if (!author.trim()) {
      setAlert({
        show: true, 
        type: 'danger',
        message: 'Будь ласка, введіть автора'
      });
      return;
    }
    

    setLoading(true);
    
    setTimeout(() => {
      const newComment = {
        id: allComments.length + 1,
        productId: selectedProduct.id,
        text,
        author,
        rating,
        date: new Date().toISOString().split('T')[0],
        size: selectedSize,
        color: selectedColor,
        image: (imagePreview && typeof imagePreview === 'string' && imagePreview.match(/^https?:\/\//)) ? imagePreview : null
      };
      
      setAllComments([...allComments, newComment]);
      

      setText('');
      setAuthor('');
      setRating(5);
      setImage(null);
      setImagePreview(null);
      
      setAlert({
        show: true,
        type: 'success',
        message: 'Коментар успішно додано!'
      });
      
      setLoading(false);
    }, 1000);
  };

  const handleShowComment = (comment) => {
    setCurrentComment(comment);
    setShowCommentModal(true);
  };


  const handleDeleteComment = (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей коментар?')) {
      setAllComments(allComments.filter(comment => comment.id !== id));
      setAlert({
        show: true,
        type: 'success',
        message: 'Коментар видалено!'
      });
    }
  };

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
            variant="primary"
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
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {allComments.length === 0 ? (
              <div className="text-muted text-center py-5">Коментарів ще немає</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {allComments.map(comment => (
                  <div key={comment.id} className="d-flex align-items-start gap-3 p-3 rounded-4 shadow-sm bg-light position-relative" style={{minHeight: 90}}>
                    <div style={{width:48, height:48, borderRadius:12, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px #0001', flexShrink:0}}>
                    <div style={{width: 48, height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f3f3', borderRadius: 12, border: '1px solid #eee'}}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg" alt="?" style={{width: 32, height: 32, objectFit: 'contain'}} />
                    </div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="fw-bold">{comment.author}</span>
                        <span className="text-warning">{'★'.repeat(comment.rating)}</span>
                        <span className="text-muted small ms-2">{comment.date}</span>
                      </div>
                      <div className="mb-1">{comment.text}</div>
                      <div className="small text-secondary">{products.find(p => p.id === comment.productId)?.name || '-'} • {comment.size} • {comment.color}</div>
                    </div>
                    <div className="d-flex flex-column align-items-end gap-2 ms-2" style={{minWidth:36}}>
                      <Button variant="link" size="sm" onClick={() => handleShowComment(comment)} title="Деталі" className="p-0"><i className="bi bi-eye"></i></Button>
                      <Button variant="link" size="sm" onClick={() => handleDeleteComment(comment.id)} title="Видалити" className="p-0"><i className="bi bi-trash text-danger"></i></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Додати новий коментар</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12">
              <label htmlFor="product" className="form-label text-secondary small mb-1">Товар</label>
              <Form.Select id="product" className="form-select-lg custom-select" onChange={handleProductChange} disabled={loading} value={selectedProduct?.id || ''}>
                <option value="">Оберіть товар</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </Form.Select>
            </div>
            {selectedProduct && (
              <>
                <div className="col-6">
                  <label htmlFor="size" className="form-label text-secondary small mb-1">Розмір</label>
                  <Form.Select id="size" value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="form-select-lg custom-select" disabled={loading}>
                    <option value="">Розмір</option>
                    {selectedProduct.sizes.map(size => (<option key={size} value={size}>{size}</option>))}
                  </Form.Select>
                </div>
                <div className="col-6">
                  <label htmlFor="color" className="form-label text-secondary small mb-1">Колір</label>
                  <Form.Select id="color" value={selectedColor} onChange={e => setSelectedColor(e.target.value)} className="form-select-lg custom-select" disabled={loading}>
                    <option value="">Колір</option>
                    {selectedProduct.colors.map(color => (<option key={color} value={color}>{color}</option>))}
                  </Form.Select>
                </div>
              </>
            )}
            {selectedSize && selectedColor && (
              <>
                <div className="col-12">
                  <label htmlFor="author" className="form-label text-secondary small mb-1">Автор</label>
                  <Form.Control type="text" id="author" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Автор" disabled={loading} className="rounded-3" />
                </div>
                <div className="col-12">
                  <label htmlFor="comment" className="form-label text-secondary small mb-1">Текст коментаря</label>
                  <Form.Control as="textarea" id="comment" value={text} onChange={e => setText(e.target.value)} placeholder="Текст коментаря" style={{ minHeight: 80 }} disabled={loading} className="rounded-3" />
                </div>
                <div className="col-12 mb-2">
                  <label className="form-label text-secondary small mb-1">Оцінка</label>
                  <StarRating value={rating} onChange={setRating} disabled={loading} />
                </div>
                <div className="col-12 mt-2">
                  <Button type="submit" className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" style={{ background: '#6f42c1', border: 'none', fontWeight:600, fontSize:'1.1rem', padding:'12px 0' }} disabled={loading}>
                    {loading ? <Spinner size="sm" /> : <><i className="bi bi-send me-2"></i>Додати</>}
                  </Button>
                </div>
              </>
            )}
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
              <p><strong>Автор:</strong> {currentComment.author}</p>
              <p><strong>Рейтинг:</strong> {'★'.repeat(currentComment.rating)}</p>
              <p><strong>Дата:</strong> {currentComment.date}</p>
              <p><strong>Розмір:</strong> {currentComment.size}</p>
              <p><strong>Колір:</strong> {currentComment.color}</p>
              <p><strong>Текст:</strong> {currentComment.text}</p>
              {currentComment.image && typeof currentComment.image === 'string' && currentComment.image.match(/^https?:\/\//) ? (
                <div className="mt-3">
                  <p><strong>Зображення:</strong></p>
                  <img 
                    src={currentComment.image} 
                    alt="Фото відгуку" 
                    className="img-fluid rounded-3 shadow" 
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
    </div>
  );
};

export default Comments; 