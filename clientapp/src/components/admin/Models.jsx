import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Spinner, Alert, Table, Modal, Badge } from 'react-bootstrap';

const API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Models`;

const Models = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewModel, setViewModel] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    materialInfo: '',
    startDate: '',
    price: 0,
    rate: 0,
    bage: ''
  });

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження моделей');
      const data = await res.json();
      setModels(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      materialInfo: '',
      startDate: '',
      price: 0,
      rate: 0,
      bage: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let processedValue = value;
    
    if (type === 'number') {
      
      processedValue = value === '' ? '' : parseFloat(value);
      if (isNaN(processedValue)) processedValue = '';
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const prepareModelData = (data) => {
    return {
      ...data,
      price: data.price === '' ? 0 : parseFloat(data.price),
      rate: data.rate === '' ? 0 : parseFloat(data.rate)
    };
  };

  const handleAddModel = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setAlert({ show: true, type: 'danger', message: 'Введіть назву моделі' });
      return;
    }
    
    setLoading(true);
    try {
      const modelData = prepareModelData(formData);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelData)
      });
      
      if (!res.ok) throw new Error('Не вдалося додати модель');
      
      setAlert({ show: true, type: 'success', message: 'Модель успішно додано!' });
      setShowAddModal(false);
      resetForm();
      fetchModels();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEditModel = (model) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      description: model.description || '',
      materialInfo: model.materialInfo || '',
      startDate: model.startDate ? model.startDate.split('T')[0] : '',
      price: typeof model.price === 'number' ? model.price : 0,
      rate: typeof model.rate === 'number' ? model.rate : 0,
      bage: model.bage || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateModel = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setAlert({ show: true, type: 'danger', message: 'Введіть назву моделі' });
      return;
    }
    
    setLoading(true);
    try {
      const modelData = {
        ...prepareModelData(formData),
        id: editingModel.id
      };
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelData)
      });
      
      if (!res.ok) throw new Error('Не вдалося оновити модель');
      
      setAlert({ show: true, type: 'success', message: 'Модель успішно оновлено!' });
      setShowEditModal(false);
      setEditingModel(null);
      resetForm();
      fetchModels();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModel = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цю модель?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Не вдалося видалити модель');
      
      setAlert({ show: true, type: 'success', message: 'Модель успішно видалено!' });
      fetchModels();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  
  const renderModal = (isEdit = false) => (
    <Modal show={isEdit ? showEditModal : showAddModal} onHide={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? 'Редагувати модель' : 'Додати модель'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={isEdit ? handleUpdateModel : handleAddModel}>
          <Form.Group className="mb-3">
            <Form.Label>Назва *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Опис</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Інформація про матеріали</Form.Label>
            <Form.Control
              type="text"
              name="materialInfo"
              value={formData.materialInfo}
              onChange={handleInputChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Дата початку</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Ціна</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price === '' ? '' : formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Рейтинг</Form.Label>
            <Form.Control
              type="number"
              name="rate"
              value={formData.rate === '' ? '' : formData.rate}
              onChange={handleInputChange}
              min="0"
              max="5"
              step="0.1"
              placeholder="0.0"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Бейдж</Form.Label>
            <Form.Control
              type="text"
              name="bage"
              value={formData.bage}
              onChange={handleInputChange}
              placeholder="Наприклад: НОВИНКА, АКЦІЯ"
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}>
              Скасувати
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true" />
                  <span className="ms-2">Збереження...</span>
                </>
              ) : (
                'Зберегти'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Моделі</h2>
      
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({...alert, show: false})} dismissible>
          {alert.message}
        </Alert>
      )}
      
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-4 mb-4" style={{maxWidth: '100%', margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі моделі</h4>
          <Button
            variant="primary"
            style={{ background: '#6f42c1', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '1.05rem', padding: '8px 22px', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => { resetForm(); setShowAddModal(true); }}
          >
            <i className="bi bi-plus-lg" style={{fontSize:18}}></i> Додати
          </Button>
        </div>
        
        {loading && !models.length ? (
          <div className="text-center py-4">
            <Spinner animation="border" role="status" style={{ color: '#6f42c1' }}>
              <span className="visually-hidden">Завантаження...</span>
            </Spinner>
          </div>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {models.length === 0 ? (
              <div className="text-muted text-center py-5">Моделей ще немає</div>
            ) : (
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Назва</th>
                    <th>Опис</th>
                    <th>Матеріали</th>
                    <th>Дата початку</th>
                    <th>Ціна</th>
                    <th>Рейтинг</th>
                    <th>Бейдж</th>
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map(model => (
                    <tr key={model.id}>
                      <td>{model.id}</td>
                      <td>{model.name}</td>
                      <td style={{maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} 
                          title={model.description}>
                        {model.description || '-'}
                      </td>
                      <td style={{maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                          title={model.materialInfo}>
                        {model.materialInfo || '-'}
                      </td>
                      <td>{model.startDate ? new Date(model.startDate).toLocaleDateString() : '-'}</td>
                      <td>{model.price ? `${model.price} грн` : '-'}</td>
                      <td>
                        {model.rate ? (
                          <div className="d-flex align-items-center">
                            <i className="bi bi-star-fill text-warning me-1"></i>
                            <span>{model.rate.toFixed(1)}</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td>
                        {model.bage ? (
                          <Badge bg="primary">{model.bage}</Badge>
                        ) : '-'}
                      </td>
                      <td>
  <div className="d-flex gap-2">
    <Button
      variant="outline-info"
      size="sm"
      onClick={() => { setViewModel(model); setShowViewModal(true); }}
      title="Детальніше"
    >
      <i className="bi bi-eye"></i>
    </Button>
    <Button
      variant="outline-primary"
      size="sm"
      onClick={() => handleEditModel(model)}
      title="Редагувати"
    >
      <i className="bi bi-pencil"></i>
    </Button>
    <Button
      variant="outline-danger"
      size="sm"
      onClick={() => handleDeleteModel(model.id)}
      title="Видалити"
    >
      <i className="bi bi-trash"></i>
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
      
      
      {renderModal()}
      {renderModal(true)}
      {/* Модальне вікно перегляду повної інформації */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Детальна інформація про модель</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewModel ? (
            <div>
              <div><strong>ID:</strong> {viewModel.id}</div>
              <div><strong>Назва:</strong> {viewModel.name}</div>
              <div><strong>Опис:</strong> {viewModel.description}</div>
              <div><strong>Матеріали:</strong> {viewModel.materialInfo}</div>
              <div><strong>Дата початку:</strong> {viewModel.startDate ? new Date(viewModel.startDate).toLocaleString() : '-'}</div>
              <div><strong>Ціна:</strong> {viewModel.price} грн</div>
              <div><strong>Рейтинг:</strong> {viewModel.rate}</div>
              <div><strong>Бейдж:</strong> {viewModel.bage}</div>
              <div><strong>Категорія ID:</strong> {viewModel.categoryId}</div>
              <div><strong>Фото:</strong>
                <ul>
                  {(viewModel.photos && viewModel.photos.length > 0) ? viewModel.photos.map(photo => (
                    <li key={photo.id}>{photo.path}</li>
                  )) : <li>-</li>}
                </ul>
              </div>
              <div><strong>Кольори:</strong>
                <ul>
                  {(viewModel.colors && viewModel.colors.length > 0) ? viewModel.colors.map(color => (
                    <li key={color.id}>
                      <div><strong>ID:</strong> {color.id}</div>
                      <div><strong>Назва:</strong> {color.name}</div>
                      <div><strong>Зображення:</strong> {color.image ? color.image.path : '-'}</div>
                      <div><strong>Фото кольору:</strong>
                        <ul>
                          {(color.photos && color.photos.length > 0) ? color.photos.map(ph => (
                            <li key={ph.id}>{ph.path}</li>
                          )) : <li>-</li>}
                        </ul>
                      </div>
                      <div><strong>modelId:</strong> {color.modelId}</div>
                    </li>
                  )) : <li>-</li>}
                </ul>
              </div>
            </div>
          ) : <div>Немає даних</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Закрити
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Models;
