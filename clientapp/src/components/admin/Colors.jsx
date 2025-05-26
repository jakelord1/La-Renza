import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Table, Badge, Pagination, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';

const API_URL = 'https://localhost:7071/api/Colors';

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
    selectedImageIds: [],
    imagePreviews: []
  });
  
  const [previewLoading, setPreviewLoading] = useState(false);

  
  useEffect(() => {
    const fetchAvailableImages = async () => {
      try {
        const res = await fetch('https://localhost:7071/api/Images');
        if (!res.ok) throw new Error('Помилка завантаження зображень');
        const data = await res.json();
        setAvailableImages(data);
      } catch (e) {
        console.error('Error fetching images:', e);
      }
    };
    fetchAvailableImages();
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
  
  const resetForm = () => {
    setFormData({
      name: '',
      modelId: '',
      selectedImageIds: [],
      imagePreviews: []
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
  
  const toggleImageSelection = (imageId, imagePath) => {
    setFormData(prev => {
      const isSelected = prev.selectedImageIds.includes(imageId);
      return {
        ...prev,
        selectedImageIds: isSelected 
          ? prev.selectedImageIds.filter(id => id !== imageId)
          : [...prev.selectedImageIds, imageId],
        imagePreviews: isSelected
          ? prev.imagePreviews.filter(p => p !== imagePath)
          : [...prev.imagePreviews, imagePath]
      };
    });
  };

  const handleAddColor = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.modelId || formData.selectedImageIds.length === 0) {
      setAlert({ show: true, type: 'danger', message: 'Будь ласка, заповніть всі обов\'язкові поля та оберіть хоча б одне зображення' });
      return;
    }
    
    setLoading(true);
    
    
    const selectedImages = availableImages.filter(img => 
      formData.selectedImageIds.includes(img.id)
    );
    
    
    const photos = selectedImages.map((img, index) => ({
      id: 12345 + index,
      path: img.path
    }));
    
    const requestBody = {
      name: formData.name,
      modelId: Number(formData.modelId),
      imageId: Number(formData.selectedImageIds[0]), // Use first selected image as the main one
      photos: photos
    };
    
    try {
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
      selectedImageIds: color.photos?.map(p => p.id) || [],
      imagePreviews: color.photos?.map(p => p.path) || []
    });
    setShowEditModal(true);
  };
  
  const handleUpdateColor = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.modelId || !formData.selectedImageId) {
      setAlert({ show: true, type: 'danger', message: 'Будь ласка, заповніть всі обов\'язкові поля та оберіть зображення' });
      return;
    }
    
    setLoading(true);
    const requestBody = {
      id: Number(editingColor.id),
      name: formData.name,
      modelId: Number(formData.modelId),
      imageId: Number(formData.selectedImageId),
      photos: [] 
    };
    
    try {
      const res = await fetch(`${API_URL}/${editingColor.id}`, {
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
                            {color.photos && color.photos.length > 0 ? (
                              color.photos.map((photo, idx) => (
                                <img 
                                  key={idx}
                                  src={photo.path} 
                                  alt={`Фото ${idx + 1}`}
                                  style={{
                                    width: '30px',
                                    height: '30px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: '1px solid #dee2e6'
                                  }}
                                />
                              ))
                            ) : (
                              <span className="text-muted">Немає</span>
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
              <Form.Group controlId="formImage">
                <Form.Label>Зображення кольору</Form.Label>
                <div className="mb-3">
                  <InputGroup>
                    <FormControl
                      type="text"
                      placeholder="Пошук зображення..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="me-2"
                    />
                    <Button variant="outline-secondary" onClick={() => setSearchQuery('')}>
                      <i className="bi bi-x-lg"></i>
                    </Button>
                  </InputGroup>
                  <div className="mt-2">
                    <div className="d-flex flex-wrap gap-2">
                      {currentImages.map((img) => (
                        <div key={img.id} 
                          className="position-relative"
                          style={{
                            width: '80px',
                            height: '80px',
                            cursor: 'pointer',
                            border: formData.selectedImageIds.includes(img.id) ? '2px solid #6f42c1' : '1px solid #dee2e6',
                            borderRadius: '8px',
                            overflow: 'hidden'
                          }}
                          onClick={() => toggleImageSelection(img.id, img.path)}
                        >
                          <img 
                            src={img.path}
                            alt={img.path}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          {formData.selectedImageIds.includes(img.id) && (
                            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-50">
                              <i className="bi bi-check-lg text-success" style={{ fontSize: '24px' }}></i>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {filteredImages.length > 0 && (
                      <div className="mt-3">
                        <Pagination className="justify-content-center">
                          <Pagination.First 
                            onClick={() => setImagePage(1)}
                            disabled={imagePage === 1}
                          />
                          <Pagination.Prev 
                            onClick={() => setImagePage(Math.max(1, imagePage - 1))}
                            disabled={imagePage === 1}
                          />
                          {Array.from({ length: Math.min(5, imageTotalPages) }, (_, i) => i + 1).map((number) => (
                            <Pagination.Item 
                              key={number} 
                              active={number === imagePage}
                              onClick={() => setImagePage(number)}
                            >
                              {number}
                            </Pagination.Item>
                          ))}
                          {imageTotalPages > 5 && (
                            <>
                              <Pagination.Ellipsis />
                              <Pagination.Item 
                                active={imageTotalPages === imagePage}
                                onClick={() => setImagePage(imageTotalPages)}
                              >
                                {imageTotalPages}
                              </Pagination.Item>
                            </>
                          )}
                          <Pagination.Next 
                            onClick={() => setImagePage(Math.min(imageTotalPages, imagePage + 1))}
                            disabled={imagePage === imageTotalPages}
                          />
                          <Pagination.Last 
                            onClick={() => setImagePage(imageTotalPages)}
                            disabled={imagePage === imageTotalPages}
                          />
                        </Pagination>
                      </div>
                    )}
                    {filteredImages.length > 0 && (
                      <div className="text-center mt-2">
                        <Button 
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            setSearchQuery('');
                            setImagePage(1);
                            setFormData(prev => ({
                              ...prev,
                              selectedImageIds: [],
                              imagePreviews: []
                            }));
                          }}
                        >
                          Скинути вибір
                        </Button>
                      </div>
                    )}
                    {filteredImages.length === 0 && (
                      <div className="text-center text-muted mt-3">
                        {searchQuery ? 'Немає зображень, що відповідають вашому запиту' : 'Немає зображень'}
                      </div>
                    )}
                    
                    {/* Show selected images preview */}
                    {formData.selectedImageIds.length > 0 && (
                      <div className="mt-3">
                        <h6 className="mb-2">Вибрані зображення ({formData.selectedImageIds.length}):</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {formData.imagePreviews.map((preview, index) => (
                            <div key={index} className="position-relative">
                              <img 
                                src={preview} 
                                alt={`Обране зображення ${index + 1}`}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                  border: '1px solid #dee2e6'
                                }}
                              />
                              <button 
                                type="button"
                                className="btn-close position-absolute top-0 end-0"
                                style={{
                                  transform: 'translate(30%, -30%)',
                                  backgroundColor: 'white',
                                  borderRadius: '50%',
                                  width: '20px',
                                  height: '20px',
                                  fontSize: '10px',
                                  padding: '0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const imgId = formData.selectedImageIds[index];
                                  const imgPath = formData.imagePreviews[index];
                                  toggleImageSelection(imgId, imgPath);
                                }}
                              ></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
              <Form.Group controlId="formEditImage">
                <Form.Label>Зображення кольору</Form.Label>
                <div className="mb-3">
                  <Form.Control 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control-lg"
                  />
                </div>
                {(formData.imagePreview || (editingColor && editingColor.imageUrl)) && (
                  <div className="mt-2 text-center">
                    <Image 
                      src={formData.imagePreview || editingColor.imageUrl} 
                      alt="Поточне зображення" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px',
                        borderRadius: '8px',
                        border: '1px solid #dee2e6'
                      }}
                      onLoadStart={() => setPreviewLoading(true)}
                      onLoad={() => setPreviewLoading(false)}
                      onError={(e) => {
                        setPreviewLoading(false);
                        e.target.style.display = 'none';
                      }}
                    />
                    {previewLoading && (
                      <div className="text-center py-3">
                        <Spinner animation="border" size="sm" variant="secondary" />
                      </div>
                    )}
                  </div>
                )}
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