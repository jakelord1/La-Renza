import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Spinner, Alert, Table, Modal, Image } from 'react-bootstrap';

const API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Images`;

const Images = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [errorImages, setErrorImages] = useState([]);

  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження зображень');
      const data = await res.json();
      setImages(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const resetForm = () => {
    setFile(null);
    setPreviewImage(null);
  };

  const getFullImageUrl = (path) => {
    if (!path) return '';
    return `/images/${path}`;
  };


  const handlePreviewImage = (imagePath) => {
    setPreviewImage(getFullImageUrl(imagePath));
    setPreviewKey(prev => prev + 1);
    setShowPreview(true);
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!file) {
      setAlert({ show: true, type: 'danger', message: 'Оберіть файл для завантаження' });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Не вдалося додати зображення');
      const data = await res.json(); 
      setAlert({ show: true, type: 'success', message: 'Зображення додано!' });
      setShowAddModal(false);
      resetForm();
      fetchImages();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const [editPath, setEditPath] = useState('');
const handleEditImage = (image) => {
    setEditingImage(image);
    setEditPath(image.path);
    setShowEditModal(true);
  };

  const handleUpdateImage = async (e) => {
    e.preventDefault();
    if (!editPath) {
      setAlert({ show: true, type: 'danger', message: 'Введіть шлях до зображення' });
      return;
    }
    setLoading(true);
    try {
      const body = { id: editingImage.id, path: editPath };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Не вдалося оновити зображення');
      setAlert({ show: true, type: 'success', message: 'Зображення оновлено!' });
      setShowEditModal(false);
      setEditingImage(null);
      resetForm();
      fetchImages();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити це зображення?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Не вдалося видалити зображення');
      setAlert({ show: true, type: 'success', message: 'Зображення видалено!' });
      fetchImages();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Зображення</h2>
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({...alert, show: false})} dismissible>
          {alert.message}
        </Alert>
      )}
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-4 mb-4" style={{maxWidth: 900, margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі зображення</h4>
          <Button
            variant="primary"
            style={{ background: '#6f42c1', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '1.05rem', padding: '8px 22px', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => { resetForm(); setShowAddModal(true); }}
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
            {images.length === 0 ? (
              <div className="text-muted text-center py-5">Зображень ще немає</div>
            ) : (
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Path</th>
                    <th>Preview</th>
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map(image => (
                    <tr key={image.id}>
                      <td>{image.id}</td>
                      <td style={{wordBreak:'break-all', maxWidth:220}}>{image.path}</td>
                      <td>
  <div 
    style={{
      width: 60, 
      height: 60, 
      cursor: image.path ? 'pointer' : 'default',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent'
    }}
    onClick={() => image.path && !errorImages.includes(image.id) && handlePreviewImage(image.path)}
  >
    {image.path && !errorImages.includes(image.id) ? (
      <Image
        key={`thumb-${image.id}-${previewKey}`}
        src={getFullImageUrl(image.path)}
        alt="preview"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}
        onError={e => {
          if (!errorImages.includes(image.id)) {
            setErrorImages(prev => [...prev, image.id]);
            e.target.onerror = null;
            e.target.src = 'https:via.placeholder.com/60x60?text=No+Image';
          }
        }}
      />
    ) : (
      <span className="text-muted">-</span>
    )}
  </div>
</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button variant="link" size="sm" onClick={() => handleEditImage(image)} title="Редагувати" className="p-0"><i className="bi bi-pencil"></i></Button>
                          <Button variant="link" size="sm" onClick={() => handleDeleteImage(image.id)} title="Видалити" className="p-0"><i className="bi bi-trash text-danger"></i></Button>
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

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Додати нове зображення</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddImage} className="row g-3">
            <div className="col-12">
              <div className="mb-3 text-center">
                {previewImage && (
                  <div style={{
                    minHeight: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '1rem'
                  }}>
                    <Image 
                      src={previewImage} 
                      alt="Попередній перегляд"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        objectFit: 'contain'
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
              </div>
              <label htmlFor="file-upload" className="form-label text-secondary small mb-1">Виберіть файл зображення</label>
              <Form.Control
                type="file"
                id="file-upload"
                accept="image"
                onChange={e => {
                  const f = e.target.files[0];
                  setFile(f);
                  if (f) {
                    const reader = new FileReader();
                    reader.onload = ev => setPreviewImage(ev.target.result);
                    reader.readAsDataURL(f);
                  } else {
                    setPreviewImage(null);
                  }
                }}
                className="form-control-lg"
              />
            </div>
            <div className="col-12 mt-2">
              <Button type="submit" className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" style={{ background: '#6f42c1', border: 'none', fontWeight:600, fontSize:'1.1rem', padding:'12px 0' }} disabled={loading}>
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-send me-2"></i>Додати</>}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setEditingImage(null); }} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Редагувати зображення</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateImage} className="row g-3">
            <div className="col-12">
              <label htmlFor="edit-path" className="form-label text-secondary small mb-1">Path</label>
              <Form.Control type="text" id="edit-path" value={editPath} onChange={e => setEditPath(e.target.value)} placeholder="URL або шлях до зображення" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12 mt-2">
              <Button type="submit" className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" style={{ background: '#6f42c1', border: 'none', fontWeight:600, fontSize:'1.1rem', padding:'12px 0' }} disabled={loading}>
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-save me-2"></i>Зберегти зміни</>}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showPreview} onHide={() => setShowPreview(false)} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Перегляд зображення</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {previewImage && (
            <Image 
              src={previewImage} 
              alt="Повний перегляд" 
              fluid 
              style={{ 
                maxHeight: '70vh', 
                width: 'auto',
                maxWidth: '100%',
                borderRadius: '8px'
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Images;