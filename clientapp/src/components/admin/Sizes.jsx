import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Spinner, Alert, Table, Modal, Accordion, Image } from 'react-bootstrap';

const API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Sizes`;
const CATEGORIES_API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Categories`;

const Sizes = () => {
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSize, setEditingSize] = useState(null);

  const [categoryId, setCategoryId] = useState('');
  const [category, setCategory] = useState(null);
  const [name, setName] = useState('');

  const [selectedImage, setSelectedImage] = useState(null);

  const fetchSizes = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження розмірів');
      const data = await res.json();
      setSizes(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(CATEGORIES_API_URL);
      if (!res.ok) throw new Error('Помилка завантаження категорій');
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSizes();
  }, []);

  const resetForm = () => {
    setCategoryId('');
    setCategory(null);
    setName('');
  };

  const handleAddSize = async (e) => {
    e.preventDefault();
    if (!categoryId || !name) {
      setAlert({ show: true, type: 'danger', message: 'Виберіть категорію та введіть назву розміру' });
      return;
    }
    setLoading(true);
    try {
      const selectedCategory = categories.find(c => c.id === Number(categoryId));
      const body = {
        categoryId: Number(categoryId),
        category: selectedCategory,
        name
      };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Не вдалося додати розмір');
      setAlert({ show: true, type: 'success', message: 'Розмір додано!' });
      setShowAddModal(false);
      resetForm();
      fetchSizes();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSize = (size) => {
    setEditingSize(size);
    setCategoryId(size.categoryId ? String(size.categoryId) : '');
    setCategory(size.category ?? null);
    setName(size.name);
    setShowEditModal(true);
  };

  const handleUpdateSize = async (e) => {
    e.preventDefault();
    if (!categoryId || !name) {
      setAlert({ show: true, type: 'danger', message: 'Виберіть категорію та введіть назву розміру' });
      return;
    }
    setLoading(true);
    try {
      const body = {
        id: editingSize.id,
        categoryId: Number(categoryId),
        category: category,
        name
      };
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Не вдалося оновити розмір');
      setAlert({ show: true, type: 'success', message: 'Розмір оновлено!' });
      setShowEditModal(false);
      setEditingSize(null);
      resetForm();
      fetchSizes();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSize = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей розмір?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Не вдалося видалити розмір');
      setAlert({ show: true, type: 'success', message: 'Розмір видалено!' });
      fetchSizes();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const sizesByCategory = categories.map(cat => ({
    ...cat,
    sizes: sizes.filter(s => s.categoryId === cat.id)
  })).filter(group => group.sizes.length > 0);


  // const handleImageClick = (path) => {
  //   setSelectedImage(path);
  // };

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Розміри</h2>
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({...alert, show: false})} dismissible>
          {alert.message}
        </Alert>
      )}
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-4 mb-4" style={{maxWidth: 900, margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі розміри</h4>
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
          <Accordion defaultActiveKey={sizesByCategory[0]?.id?.toString() || ''} alwaysOpen>
            {sizesByCategory.length === 0 ? (
              <div className="text-muted text-center py-5">Розмірів ще немає</div>
            ) : (
              sizesByCategory.map(group => (
                <Accordion.Item eventKey={group.id.toString()} key={group.id}>
                  <Accordion.Header><b>{group.name}</b></Accordion.Header>
                  <Accordion.Body>
                    <Table hover className="align-middle mb-0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Назва</th>
                          <th>Дії</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.sizes.map(size => (
                          <tr key={size.id}>
                            <td>{size.id}</td>
                            <td>{size.name}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button variant="link" size="sm" onClick={() => handleEditSize(size)} title="Редагувати" className="p-0"><i className="bi bi-pencil" style={{color: '#6f42c1'}}></i></Button>
                                <Button variant="link" size="sm" onClick={() => handleDeleteSize(size.id)} title="Видалити" className="p-0"><i className="bi bi-trash text-danger"></i></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              ))
            )}
          </Accordion>
        )}
      </Card>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Додати новий розмір</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSize} className="row g-3">
            <div className="col-12">
              <label htmlFor="categoryId" className="form-label text-secondary small mb-1">Категорія</label>
              <Form.Select id="categoryId" value={categoryId} onChange={e => setCategoryId(e.target.value)} disabled={loading} className="rounded-3">
                <option value="">Оберіть категорію</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-12">
              <label htmlFor="name" className="form-label text-secondary small mb-1">Назва розміру</label>
              <Form.Control type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Наприклад: S, M, L" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12 mt-2">
              <Button type="submit" className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" style={{ background: '#6f42c1', border: 'none', fontWeight:600, fontSize:'1.1rem', padding:'12px 0' }} disabled={loading}>
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-send me-2"></i>Додати</>}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setEditingSize(null); }} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Редагувати розмір</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSize} className="row g-3">
            <div className="col-12">
              <label htmlFor="edit-categoryId" className="form-label text-secondary small mb-1">Категорія</label>
              <Form.Select id="edit-categoryId" value={categoryId} onChange={e => setCategoryId(e.target.value)} disabled={loading} className="rounded-3">
                <option value="">Оберіть категорію</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-12">
              <label htmlFor="edit-name" className="form-label text-secondary small mb-1">Назва розміру</label>
              <Form.Control type="text" id="edit-name" value={name} onChange={e => setName(e.target.value)} placeholder="Наприклад: S, M, L" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12 mt-2">
              <Button type="submit" className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" style={{ background: '#6f42c1', border: 'none', fontWeight:600, fontSize:'1.1rem', padding:'12px 0' }} disabled={loading}>
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-save me-2"></i>Зберегти зміни</>}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Full-Size Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && <Image src={selectedImage} alt="Full Size" fluid />}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Sizes; 