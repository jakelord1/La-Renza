import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Table, Badge, Pagination, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';

const API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Colors`;

const Colors = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [availableImages, setAvailableImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePage, setImagePage] = useState(1);
  const [imagesPerPage] = useState(12); 
  
  const [formData, setFormData] = useState({
    name: '',
    modelId: '',
    imageId: '',
    imagePreview: ''
  });
  const [allModels, setAllModels] = useState([]);
  
  

  
  useEffect(() => {
    const fetchAvailableImages = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Images`);
        if (!res.ok) throw new Error('Помилка завантаження зображень');
        const data = await res.json();
        setAvailableImages(data);
      } catch (e) {
        console.error('Error fetching images:', e);
      }
    };
    const fetchAllModels = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Models`);
        if (!res.ok) throw new Error('Помилка завантаження моделей');
        const data = await res.json();
        setAllModels(data);
      } catch (e) {
        console.error('Error fetching models:', e);
      }
    };
    fetchAvailableImages();
    fetchAllModels();
  }, []);

  
  const filteredImages = searchQuery
    ? availableImages.filter(img => 
        img.path.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableImages;

  
  const indexOfLastImage = imagePage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);
  const imageTotalPages = Math.ceil(filteredImages.length / imagesPerPage);

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
  };

  const handleImageSelect = (img) => {
    setFormData(prev => ({
      ...prev,
      imageId: img.id,
      imagePreview: img.path
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      modelId: '',
      imageId: '',
      imagePreview: ''
    });
    setSearchQuery('');
    setImagePage(1);
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddColor = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.modelId || !formData.imageId) {
      setAlert({ show: true, type: 'danger', message: 'Введіть назву, оберіть модель і зображення для кольору!' });
      return;
    }
    setLoading(true);
    try {
      const modelObj = allModels.find(m => String(m.id) === String(formData.modelId));
      const imageObj = availableImages.find(img => String(img.id) === String(formData.imageId));
      if (!modelObj || !imageObj) {
        setAlert({ show: true, type: 'danger', message: 'Модель або зображення не знайдено!' });
        setLoading(false);
        return;
      }
      const modelForRequest = {
        name: modelObj.name,
        description: modelObj.description,
        materialInfo: modelObj.materialInfo,
        startDate: modelObj.startDate,
        price: modelObj.price,
        photos: [],
        rate: modelObj.rate,
        bage: modelObj.bage,
        categoryId: modelObj.categoryId,
        category: typeof modelObj.category === 'string' ? modelObj.category : (modelObj.category?.name || ''),
        sizes: Array.isArray(modelObj.sizes) ? modelObj.sizes : []
      };

      const requestBody = {
        name: formData.name,
        modelId: Number(formData.modelId),
        imageId: Number(formData.imageId),
        image: { path: imageObj.path },
        model: modelForRequest
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Не вдалося додати колір');
      }
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
      imageId: color.imageId || '',
      imagePreview: color.image?.path || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateColor = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.modelId || !formData.imageId) {
      setAlert({ show: true, type: 'danger', message: 'Введіть назву, оберіть модель і зображення для кольору!' });
      return;
    }
    setLoading(true);
    try {
      const modelObj = allModels.find(m => String(m.id) === String(formData.modelId));
      const imageObj = availableImages.find(img => String(img.id) === String(formData.imageId));
      if (!modelObj || !imageObj) {
        setAlert({ show: true, type: 'danger', message: 'Модель або зображення не знайдено!' });
        setLoading(false);
        return;
      }
      const modelForRequest = {
        name: modelObj.name,
        description: modelObj.description,
        materialInfo: modelObj.materialInfo,
        startDate: modelObj.startDate,
        price: modelObj.price,
        rate: modelObj.rate,
        bage: modelObj.bage,
        photos: [],
        categoryId: modelObj.categoryId,
        category: typeof modelObj.category === 'string' ? modelObj.category : (modelObj.category?.name || ''),
        sizes: Array.isArray(modelObj.sizes) ? modelObj.sizes : []
      };

      const requestBody = {
        id: editingColor.id,
        name: formData.name,
        modelId: Number(formData.modelId),
        imageId: Number(formData.imageId),
        image: { path: imageObj.path },
        model: modelForRequest
      };

      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Не вдалося оновити колір');
      }
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
                          <div className="d-flex gap-1" style={{maxWidth: '150px', flexWrap: 'wrap'}}>
                            {color.image && (
                              <Image
                                src={color.image.path ? `/images/${color.image.path.replace(/^[/\\]+/, '')}` : 'https://via.placeholder.com/30x30?text=No+Image'}
                                alt="Фото кольору"
                                style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #dee2e6' }}
                                onError={e => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/30x30?text=No+Image';
                                }}
                              />
                            )}
                          </div>
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

      
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Додати новий колір</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddColor} className="row g-3">
            <div className="col-12">
              <Form.Group controlId="formAddName">
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
              <Form.Group controlId="formAddModelId">
                <Form.Label>Оберіть модель <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="modelId"
                  value={formData.modelId}
                  onChange={handleInputChange}
                  className="form-control-lg"
                  required
                >
                  <option value="">Оберіть модель...</option>
                  {allModels.map(m => (
                    <option key={m.id} value={m.id}>{m.name} (ID: {m.id})</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-12">
              <Form.Group controlId="formAddImage">
                <Form.Label>Оберіть зображення</Form.Label>
                <InputGroup>
                  <FormControl
                    placeholder="Пошук зображення..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {currentImages.map(img => (
                    <div key={img.id} style={{ border: formData.imageId == img.id ? '2px solid #6f42c1' : '1px solid #ccc', borderRadius: 6, padding: 2, cursor: 'pointer' }} onClick={() => handleImageSelect(img)}>
                      <Image src={`/images/${img.path.replace(/^[/\\]+/, '')}`} alt="img" style={{ maxHeight: 60, maxWidth: 90, objectFit: 'contain', borderRadius: 4 }} />
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-center">
                  {formData.imagePreview && (
                    <>
                      <span className="text-muted">Обрано: </span>
                      <span style={{ fontSize: 12, color: '#888', marginRight: 8 }}>{formData.imagePreview}</span>
                    </>
                  )}
                </div>
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
                <Form.Label>Оберіть модель <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="modelId"
                  value={formData.modelId}
                  onChange={handleInputChange}
                  className="form-control-lg"
                  required
                >
                  <option value="">Оберіть модель...</option>
                  {allModels.map(m => (
                    <option key={m.id} value={m.id}>{m.name} (ID: {m.id})</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-12">
              <Form.Group controlId="formEditImage">
                <Form.Label>Оберіть зображення</Form.Label>
                <InputGroup>
                  <FormControl
                    placeholder="Пошук зображення..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {currentImages.map(img => (
                    <div key={img.id} style={{ border: formData.imageId == img.id ? '2px solid #6f42c1' : '1px solid #ccc', borderRadius: 6, padding: 2, cursor: 'pointer' }} onClick={() => handleImageSelect(img)}>
                      <Image src={`/images/${img.path.replace(/^[/\\]+/, '')}`} alt="img" style={{ maxHeight: 60, maxWidth: 90, objectFit: 'contain', borderRadius: 4 }} />
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-center">
                  {formData.imagePreview && (
                    <>
                      <span className="text-muted">Обрано: </span>
                      <span style={{ fontSize: 12, color: '#888', marginRight: 8 }}>{formData.imagePreview}</span>
                    </>
                  )}
                </div>
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