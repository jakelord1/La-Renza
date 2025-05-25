import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Table, Badge, Pagination, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const API_URL = 'https://localhost:7071/api/Colors';

const Colors = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    modelId: '',
    hex: ''
  });
  
  const [previewColor, setPreviewColor] = useState('#000000');

  // Fetch colors from API
  const fetchColors = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження кольорів');
      const data = await res.json();
      setColors(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей колір?')) {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Не вдалося видалити колір');
        setAlert({ show: true, type: 'success', message: 'Колір успішно видалено!' });
        fetchColors();
      } catch (e) {
        setAlert({ show: true, type: 'danger', message: e.message });
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'hex') {
      setPreviewColor(value);
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      modelId: '',
      hex: ''
    });
    setPreviewColor('#000000');
  };
  
  const handleAddColor = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.modelId) {
      setAlert({ show: true, type: 'danger', message: 'Будь ласка, заповніть всі обов\'язкові поля' });
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Не вдалося додати колір');
      
      setAlert({ show: true, type: 'success', message: 'Колір успішно додано!' });
      setShowAddModal(false);
      resetForm();
      fetchColors();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditColor = (color) => {
    setEditingColor(color);
    setFormData({
      name: color.name || '',
      modelId: color.modelId || '',
      hex: color.hex || ''
    });
    if (color.hex) setPreviewColor(color.hex);
    setShowEditModal(true);
  };
  
  const handleUpdateColor = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.modelId) {
      setAlert({ show: true, type: 'danger', message: 'Будь ласка, заповніть всі обов\'язкові поля' });
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${editingColor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingColor.id })
      });
      
      if (!res.ok) throw new Error('Не вдалося оновити колір');
      
      setAlert({ show: true, type: 'success', message: 'Колір успішно оновлено!' });
      setShowEditModal(false);
      setEditingColor(null);
      resetForm();
      fetchColors();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = colors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(colors.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev 
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <Pagination.Item 
              key={number} 
              active={number === currentPage}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </Pagination.Item>
          ))}
          <Pagination.Next 
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    );
  };

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Кольори</h2>
      
      {alert.show && (
        <Alert 
          variant={alert.type} 
          onClose={() => setAlert({...alert, show: false})} 
          dismissible
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-4 mb-4" style={{maxWidth: 1200, margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Список кольорів</h4>
          <Button 
            variant="primary"
            className="d-flex align-items-center gap-2"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            style={{ background: '#6f42c1', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '1.05rem', padding: '8px 22px' }}
          >
            <i className="bi bi-plus-lg" style={{fontSize:18}}></i> Додати колір
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
                <div className="text-muted text-center py-5">Кольорів ще немає</div>
              ) : (
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Назва</th>
                      <th>ID моделі</th>
                      <th>Фото</th>
                      <th>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(color => (
                      <tr key={color.id}>
                        <td>{color.id}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {color.name}
                            {color.hex && (
                              <span 
                                className="color-preview" 
                                style={{
                                  width: '20px', 
                                  height: '20px', 
                                  backgroundColor: color.hex,
                                  border: '1px solid #dee2e6',
                                  borderRadius: '4px'
                                }}
                                title={color.name}
                              />
                            )}
                          </div>
                        </td>
                        <td>{color.modelId}</td>
                        <td>
                          {color.photos && color.photos.length > 0 ? (
                            <span className="badge bg-primary">{color.photos.length}</span>
                          ) : (
                            <span className="text-muted">Немає</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="p-0"
                              title="Редагувати"
                              onClick={() => handleEditColor(color)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="p-0 text-danger"
                              onClick={() => handleDelete(color.id)}
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
            {colors.length > itemsPerPage && renderPagination()}
          </>
        )}
      </Card>

      {/* Add Color Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Додати новий колір</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddColor} className="row g-3">
            <div className="col-12">
              <Form.Group controlId="formName">
                <Form.Label>Назва кольору</Form.Label>
                <Form.Control 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Введіть назву кольору"
                  className="form-control-lg"
                  required
                />
              </Form.Group>
            </div>
            
            <div className="col-12">
              <Form.Group controlId="formModelId">
                <Form.Label>ID моделі</Form.Label>
                <Form.Control 
                  type="number" 
                  name="modelId"
                  value={formData.modelId}
                  onChange={handleInputChange}
                  placeholder="Введіть ID моделі"
                  className="form-control-lg"
                  required
                />
              </Form.Group>
            </div>
            
            <div className="col-12">
              <Form.Group controlId="formHex">
                <Form.Label>Колір (HEX)</Form.Label>
                <div className="d-flex align-items-center gap-3">
                  <Form.Control 
                    type="color" 
                    name="hex"
                    value={formData.hex || '#000000'}
                    onChange={handleInputChange}
                    className="form-control-lg p-1"
                    style={{ width: '70px', height: '45px' }}
                  />
                  <Form.Control 
                    type="text" 
                    name="hex"
                    value={formData.hex || ''}
                    onChange={handleInputChange}
                    placeholder="#RRGGBB"
                    className="form-control-lg"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </div>
                <div className="mt-2" style={{ 
                  width: '100%', 
                  height: '60px', 
                  backgroundColor: previewColor,
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}></div>
              </Form.Group>
            </div>
            
            <div className="col-12 mt-3">
              <Button 
                type="submit" 
                className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" 
                style={{ background: '#6f42c1', border: 'none', fontWeight:600, fontSize:'1.1rem', padding:'12px 0' }} 
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-send me-2"></i>Додати</>}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Color Modal */}
      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setEditingColor(null); }} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Редагувати колір</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateColor} className="row g-3">
            <div className="col-12">
              <Form.Group controlId="formEditName">
                <Form.Label>Назва кольору</Form.Label>
                <Form.Control 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Введіть назву кольору"
                  className="form-control-lg"
                  required
                />
              </Form.Group>
            </div>
            
            <div className="col-12">
              <Form.Group controlId="formEditModelId">
                <Form.Label>ID моделі</Form.Label>
                <Form.Control 
                  type="number" 
                  name="modelId"
                  value={formData.modelId}
                  onChange={handleInputChange}
                  placeholder="Введіть ID моделі"
                  className="form-control-lg"
                  required
                />
              </Form.Group>
            </div>
            
            <div className="col-12">
              <Form.Group controlId="formEditHex">
                <Form.Label>Колір (HEX)</Form.Label>
                <div className="d-flex align-items-center gap-3">
                  <Form.Control 
                    type="color" 
                    name="hex"
                    value={formData.hex || '#000000'}
                    onChange={handleInputChange}
                    className="form-control-lg p-1"
                    style={{ width: '70px', height: '45px' }}
                  />
                  <Form.Control 
                    type="text" 
                    name="hex"
                    value={formData.hex || ''}
                    onChange={handleInputChange}
                    placeholder="#RRGGBB"
                    className="form-control-lg"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </div>
                <div className="mt-2" style={{ 
                  width: '100%', 
                  height: '60px', 
                  backgroundColor: previewColor,
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}></div>
              </Form.Group>
            </div>
            
            <div className="col-12 mt-3">
              <Button 
                type="submit" 
                className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" 
                style={{ background: '#6f42c1', border: 'none', fontWeight:600, fontSize:'1.1rem', padding:'12px 0' }} 
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

export default Colors;