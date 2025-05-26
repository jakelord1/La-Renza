import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Spinner, Alert, Table, Modal, Accordion } from 'react-bootstrap';

const API_URL = 'https://localhost:7071/api/Categories';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const [imageId, setImageId] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження категорій');
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName('');
    setParentCategoryId('');
    setIsGlobal(false);
    setImageId('');
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      setAlert({ show: true, type: 'danger', message: 'Введіть назву категорії' });
      return;
    }
    setLoading(true);
    try {
      const body = {
        name,
        parentCategoryId: isGlobal || !parentCategoryId ? null : Number(parentCategoryId),
        isGlobal,
        imageId: imageId ? Number(imageId) : null
      };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Не вдалося додати категорію');
      setAlert({ show: true, type: 'success', message: 'Категорію додано!' });
      setShowAddModal(false);
      resetForm();
      fetchCategories();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setParentCategoryId(cat.parentCategoryId ? String(cat.parentCategoryId) : '');
    setIsGlobal(cat.isGlobal);
    setImageId(cat.imageId ? String(cat.imageId) : '');
    setShowEditModal(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      setAlert({ show: true, type: 'danger', message: 'Введіть назву категорії' });
      return;
    }
    setLoading(true);
    try {
      const body = {
        id: editingCategory.id,
        name,
        parentCategoryId: isGlobal || !parentCategoryId ? null : Number(parentCategoryId),
        isGlobal,
        imageId: imageId ? Number(imageId) : null
      };
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Не вдалося оновити категорію');
      setAlert({ show: true, type: 'success', message: 'Категорію оновлено!' });
      setShowEditModal(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цю категорію?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Не вдалося видалити категорію');
      setAlert({ show: true, type: 'success', message: 'Категорію видалено!' });
      fetchCategories();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const globalCategories = categories.filter(c => c.isGlobal);
  const childCategories = categories.filter(c => !c.isGlobal);
  const categoriesByGlobal = globalCategories.map(globalCat => ({
    ...globalCat,
    children: childCategories.filter(child => child.parentCategoryId === globalCat.id)
  }));

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Категорії</h2>
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({...alert, show: false})} dismissible>
          {alert.message}
        </Alert>
      )}
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-4 mb-4" style={{maxWidth: 900, margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі категорії</h4>
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
          <Accordion defaultActiveKey={categoriesByGlobal[0]?.id?.toString() || ''} alwaysOpen>
            {categoriesByGlobal.length === 0 ? (
              <div className="text-muted text-center py-5">Категорій ще немає</div>
            ) : (
              categoriesByGlobal.map(group => (
                <Accordion.Item eventKey={group.id.toString()} key={group.id}>
                  <Accordion.Header><b>{group.name}</b></Accordion.Header>
                  <Accordion.Body>
                    <Table hover className="align-middle mb-0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Назва</th>
                          <th>Глобальна</th>
                          <th>ImageId</th>
                          <th>Дії</th>
                        </tr>
                      </thead>
                      <tbody>

                        <tr key={group.id} style={{background:'#f8f9fa'}}>
                          <td>{group.id}</td>
                          <td>{group.name}</td>
                          <td>Так</td>
                          <td>{group.imageId ?? '-'}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button variant="link" size="sm" onClick={() => handleEditCategory(group)} title="Редагувати" className="p-0"><i className="bi bi-pencil"></i></Button>
                              <Button variant="link" size="sm" onClick={() => handleDeleteCategory(group.id)} title="Видалити" className="p-0"><i className="bi bi-trash text-danger"></i></Button>
                            </div>
                          </td>
                        </tr>

                        {group.children.length === 0 ? null : group.children.map(child => (
                          <tr key={child.id}>
                            <td>{child.id}</td>
                            <td>{child.name}</td>
                            <td>Ні</td>
                            <td>{child.imageId ?? '-'}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button variant="link" size="sm" onClick={() => handleEditCategory(child)} title="Редагувати" className="p-0"><i className="bi bi-pencil"></i></Button>
                                <Button variant="link" size="sm" onClick={() => handleDeleteCategory(child.id)} title="Видалити" className="p-0"><i className="bi bi-trash text-danger"></i></Button>
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
          <Modal.Title className="fw-bold">Додати нову категорію</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCategory} className="row g-3">
            <div className="col-12">
              <label htmlFor="name" className="form-label text-secondary small mb-1">Назва</label>
              <Form.Control type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Наприклад: Текстиль" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12">
              <Form.Check type="checkbox" id="isGlobal" label="Глобальна (без батьківської)" checked={isGlobal} onChange={e => { setIsGlobal(e.target.checked); if (e.target.checked) setParentCategoryId(''); }} disabled={loading} />
            </div>
            <div className="col-12">
              <label htmlFor="parentCategoryId" className="form-label text-secondary small mb-1">Батьківська категорія</label>
              <Form.Select id="parentCategoryId" value={parentCategoryId} onChange={e => setParentCategoryId(e.target.value)} disabled={loading || isGlobal} className="rounded-3">
                <option value="">Немає</option>
                {categories.filter(c => c.isGlobal).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-12">
              <label htmlFor="imageId" className="form-label text-secondary small mb-1">ImageId</label>
              <Form.Control type="number" id="imageId" value={imageId} onChange={e => setImageId(e.target.value)} placeholder="ID зображення" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12 mt-2">
              <Button type="submit" className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" style={{ background: '#6f42c1', border: 'none', fontWeight:600, fontSize:'1.1rem', padding:'12px 0' }} disabled={loading}>
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-send me-2"></i>Додати</>}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setEditingCategory(null); }} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Редагувати категорію</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateCategory} className="row g-3">
            <div className="col-12">
              <label htmlFor="edit-name" className="form-label text-secondary small mb-1">Назва</label>
              <Form.Control type="text" id="edit-name" value={name} onChange={e => setName(e.target.value)} placeholder="Наприклад: Текстиль" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12">
              <Form.Check type="checkbox" id="edit-isGlobal" label="Глобальна (без батьківської)" checked={isGlobal} onChange={e => { setIsGlobal(e.target.checked); if (e.target.checked) setParentCategoryId(''); }} disabled={loading} />
            </div>
            <div className="col-12">
              <label htmlFor="edit-parentCategoryId" className="form-label text-secondary small mb-1">Батьківська категорія</label>
              <Form.Select id="edit-parentCategoryId" value={parentCategoryId} onChange={e => setParentCategoryId(e.target.value)} disabled={loading || isGlobal} className="rounded-3">
                <option value="">Немає</option>
                {categories.filter(c => c.isGlobal).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-12">
              <label htmlFor="edit-imageId" className="form-label text-secondary small mb-1">ImageId</label>
              <Form.Control type="number" id="edit-imageId" value={imageId} onChange={e => setImageId(e.target.value)} placeholder="ID зображення" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12 mt-2">
              <Button type="submit" className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" style={{ background: '#6f42c1', border: 'none', fontWeight:600, fontSize:'1.1rem', padding:'12px 0' }} disabled={loading}>
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-save me-2"></i>Зберегти зміни</>}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Categories; 