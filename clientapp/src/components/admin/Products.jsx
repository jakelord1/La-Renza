import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Spinner, Alert, Table, Modal, Image, Row, Col } from 'react-bootstrap';

const API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Products`;
const COLORS_API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Colors`;
const SIZES_API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Sizes`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [colorId, setColorId] = useState('');
  const [sizeId, setSizeId] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [_loadingData, setLoadingData] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження товарів');
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingData(true);
      try {
        const colorsRes = await fetch(COLORS_API_URL);
        if (!colorsRes.ok) throw new Error('Помилка завантаження кольорів');
        const colorsData = await colorsRes.json();
        setColors(colorsData);

        const sizesRes = await fetch(SIZES_API_URL);
        if (!sizesRes.ok) throw new Error('Помилка завантаження розмірів');
        const sizesData = await sizesRes.json();
        setSizes(sizesData);

        await fetchProducts();
      } catch (e) {
        setAlert({ show: true, type: 'danger', message: e.message });
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId('');
    setImageUrl('');
    setIsActive(true);
    setColorId('');
    setSizeId('');
    setQuantity('');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();


    const errors = [];
    if (!colorId) errors.push('колір');
    if (!sizeId) errors.push('розмір');
    if (!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) < 0) errors.push('кількість');
    
    if (errors.length > 0) {
      setAlert({ 
        show: true, 
        type: 'danger', 
        message: `Будь ласка, заповніть обов'язкові поля: ${errors.join(', ')}` 
      });
      return;
    }
    
    setLoading(true);
    try {
      const body = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        imageUrl: imageUrl.trim(),
        isActive,
        colorId: colorId ? parseInt(colorId) : null,
        sizeId: sizeId ? parseInt(sizeId) : null,
        quantity: quantity ? parseInt(quantity) : 0
      };
      
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Не вдалося додати товар');
      }
      
      setAlert({ show: true, type: 'success', message: 'Товар успішно додано!' });
      setShowAddModal(false);
      resetForm();
      fetchProducts();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price.toString());
    setCategoryId(product.categoryId.toString());
    setImageUrl(product.imageUrl || '');
    setIsActive(product.isActive);
    setColorId(product.colorId ? product.colorId.toString() : '');
    setSizeId(product.sizeId ? product.sizeId.toString() : '');
    setQuantity(product.quantity ? product.quantity.toString() : '0');
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    

    const errors = [];
    if (!colorId) errors.push('колір');
    if (!sizeId) errors.push('розмір');
    if (!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) < 0) errors.push('кількість');
    
    if (errors.length > 0) {
      setAlert({ 
        show: true, 
        type: 'danger', 
        message: `Будь ласка, заповніть обов'язкові поля: ${errors.join(', ')}` 
      });
      return;
    }
    
    setLoading(true);
    try {
      const body = {
        id: editingProduct.id,
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        imageUrl: imageUrl.trim(),
        isActive,
        colorId: colorId ? parseInt(colorId) : null,
        sizeId: sizeId ? parseInt(sizeId) : null,
        quantity: quantity ? parseInt(quantity) : 0
      };
      
      const res = await fetch(`${API_URL}/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Не вдалося оновити товар');
      }
      
      setAlert({ show: true, type: 'success', message: 'Товар оновлено успішно!' });
      setShowEditModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей товар?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Не вдалося видалити товар');
      
      setAlert({ show: true, type: 'success', message: 'Товар успішно видалено!' });
      fetchProducts();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const _renderProductModal = (isEdit = false) => {
    const ModalComponent = isEdit ? Modal : Modal;
    const handleSubmit = isEdit ? handleUpdateProduct : handleAddProduct;
    const title = isEdit ? 'Редагувати товар' : 'Додати товар';
    const submitText = isEdit ? 'Оновити' : 'Додати';
    
    return (
      <ModalComponent
        show={isEdit ? showEditModal : showAddModal}
        onHide={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Назва <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Опис</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Ціна <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>ID категорії <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>URL зображення</Form.Label>
              <Form.Control
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {imageUrl && (
                <div className="mt-2">
                  <Image src={imageUrl} thumbnail style={{ maxHeight: '100px' }} />
                </div>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="active-switch"
                label="Активний"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}
                disabled={loading}
              >
                Скасувати
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true" className="me-1" />
                    Завантаження...
                  </>
                ) : (
                  submitText
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </ModalComponent>
    );
  };

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Товари</h2>
      
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({...alert, show: false})} dismissible>
          {alert.message}
        </Alert>
      )}
      
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-4 mb-4" style={{maxWidth: 1200, margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі товари</h4>
          <Button
            variant="primary"
            style={{ background: '#6f42c1', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '1.05rem', padding: '8px 22px', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => { resetForm(); setShowAddModal(true); }}
          >
            <i className="bi bi-plus-lg" style={{fontSize:18}}></i> Додати
          </Button>
        </div>
        
        {loading && products.length === 0 ? (
          <div className="text-center py-4">
            <Spinner animation="border" role="status" style={{ color: '#6f42c1' }}>
              <span className="visually-hidden">Завантаження...</span>
            </Spinner>
          </div>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {products.length === 0 ? (
              <div className="text-muted text-center py-5">Товарів ще немає</div>
            ) : (
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Колір</th>
                    <th>Розмір</th>
                    <th>Кількість</th>
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.colorId ? colors.find(c => c.id === product.colorId)?.name || product.colorId : '-'}</td>
                      <td>{product.sizeId ? sizes.find(s => s.id === product.sizeId)?.name || product.sizeId : '-'}</td>
                      <td>{product.quantity || 0}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="link" 
                            size="sm" 
                            onClick={() => handleEditProduct(product)} 
                            title="Редагувати" 
                            className="p-0"
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button 
                            variant="link" 
                            size="sm" 
                            onClick={() => handleDeleteProduct(product.id)} 
                            title="Видалити" 
                            className="p-0"
                          >
                            <i className="bi bi-trash text-danger"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        )}
      </Card>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="md">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Додати новий товар</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProduct}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Колір <span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    value={colorId} 
                    onChange={(e) => setColorId(e.target.value)}
                    required
                    className="form-control-lg"
                  >
                    <option value="">Виберіть колір</option>
                    {colors.map(color => (
                      <option key={color.id} value={color.id}>
                        {color.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Розмір <span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    value={sizeId} 
                    onChange={(e) => setSizeId(e.target.value)}
                    required
                    className="form-control-lg"
                  >
                    <option value="">Виберіть розмір</option>
                    {sizes.map(size => (
                      <option key={size.id} value={size.id}>
                        {size.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Кількість <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="mt-4">
              <Button 
                type="submit" 
                className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" 
                style={{ background: '#6f42c1', border: 'none', fontWeight: 600, fontSize: '1.1rem', padding: '12px 0' }} 
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-send me-2"></i>Додати</>}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setEditingProduct(null); }} centered size="md">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Редагувати товар</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateProduct}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Колір <span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    value={colorId} 
                    onChange={(e) => setColorId(e.target.value)}
                    required
                    className="form-control-lg"
                  >
                    <option value="">Виберіть колір</option>
                    {colors.map(color => (
                      <option key={color.id} value={color.id}>
                        {color.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Розмір <span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    value={sizeId} 
                    onChange={(e) => setSizeId(e.target.value)}
                    required
                    className="form-control-lg"
                  >
                    <option value="">Виберіть розмір</option>
                    {sizes.map(size => (
                      <option key={size.id} value={size.id}>
                        {size.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Кількість <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="mt-4">
              <Button 
                type="submit" 
                className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" 
                style={{ background: '#6f42c1', border: 'none', fontWeight: 600, fontSize: '1.1rem', padding: '12px 0' }} 
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-save me-2"></i>Зберегти зміни</>}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Products;
