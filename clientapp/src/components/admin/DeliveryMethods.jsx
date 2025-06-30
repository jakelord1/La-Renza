import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Spinner, Alert, Table, Modal } from 'react-bootstrap';

const API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/DeliveryMethods`;

const DeliveryMethods = () => {
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);

  const [name, setName] = useState('');
  const [deliveryPrice, setDeliveryPrice] = useState('');

  const fetchDeliveryMethods = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження методів доставки');
      const data = await res.json();
      setDeliveryMethods(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryMethods();
  }, []);

  const resetForm = () => {
    setName('');
    setDeliveryPrice('');
  };

  const handleAddMethod = async (e) => {
    e.preventDefault();
    if (!name || !deliveryPrice) {
      setAlert({ show: true, type: 'danger', message: 'Заповніть всі поля' });
      return;
    }
    setLoading(true);
    try {
      const body = {
        name,
        deliveryPrice: Number(deliveryPrice)
      };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Не вдалося додати метод доставки');
      setAlert({ show: true, type: 'success', message: 'Метод доставки додано!' });
      setShowAddModal(false);
      resetForm();
      fetchDeliveryMethods();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEditMethod = (method) => {
    setEditingMethod(method);
    setName(method.name);
    setDeliveryPrice(String(method.deliveryPrice));
    setShowEditModal(true);
  };

  const handleUpdateMethod = async (e) => {
    e.preventDefault();
    if (!name || !deliveryPrice) {
      setAlert({ show: true, type: 'danger', message: 'Заповніть всі поля' });
      return;
    }
    setLoading(true);
    try {
      const body = {
        id: editingMethod.id,
        name,
        deliveryPrice: Number(deliveryPrice)
      };
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Не вдалося оновити метод доставки');
      setAlert({ show: true, type: 'success', message: 'Метод доставки оновлено!' });
      setShowEditModal(false);
      setEditingMethod(null);
      resetForm();
      fetchDeliveryMethods();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMethod = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей метод доставки?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Не вдалося видалити метод доставки');
      setAlert({ show: true, type: 'success', message: 'Метод доставки видалено!' });
      fetchDeliveryMethods();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Методи доставки</h2>
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({...alert, show: false})} dismissible>
          {alert.message}
        </Alert>
      )}
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-4 mb-4" style={{maxWidth: 900, margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі методи доставки</h4>
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
          <Table hover className="align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Назва</th>
                <th>Вартість доставки</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {deliveryMethods.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">Методів доставки ще немає</td>
                </tr>
              ) : (
                deliveryMethods.map(method => (
                  <tr key={method.id}>
                    <td>{method.id}</td>
                    <td>{method.name}</td>
                    <td>{method.deliveryPrice} ₴</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button variant="link" size="sm" onClick={() => handleEditMethod(method)} title="Редагувати" className="p-0"><i className="bi bi-pencil"></i></Button>
                        <Button variant="link" size="sm" onClick={() => handleDeleteMethod(method.id)} title="Видалити" className="p-0"><i className="bi bi-trash text-danger"></i></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Додати новий метод доставки</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMethod} className="row g-3">
            <div className="col-12">
              <label htmlFor="name" className="form-label text-secondary small mb-1">Назва методу доставки</label>
              <Form.Control 
                type="text" 
                id="name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Наприклад: Нова Пошта, Укрпошта" 
                disabled={loading} 
                className="rounded-3" 
              />
            </div>
            <div className="col-12">
              <label htmlFor="deliveryPrice" className="form-label text-secondary small mb-1">Вартість доставки (₴)</label>
              <Form.Control 
                type="number" 
                id="deliveryPrice" 
                value={deliveryPrice} 
                onChange={e => setDeliveryPrice(e.target.value)} 
                placeholder="0" 
                disabled={loading} 
                className="rounded-3" 
                min="0"
                step="0.01"
              />
            </div>
            <div className="col-12 mt-2">
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

      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setEditingMethod(null); }} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Редагувати метод доставки</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateMethod} className="row g-3">
            <div className="col-12">
              <label htmlFor="edit-name" className="form-label text-secondary small mb-1">Назва методу доставки</label>
              <Form.Control 
                type="text" 
                id="edit-name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Наприклад: Нова Пошта, Укрпошта" 
                disabled={loading} 
                className="rounded-3" 
              />
            </div>
            <div className="col-12">
              <label htmlFor="edit-deliveryPrice" className="form-label text-secondary small mb-1">Вартість доставки (₴)</label>
              <Form.Control 
                type="number" 
                id="edit-deliveryPrice" 
                value={deliveryPrice} 
                onChange={e => setDeliveryPrice(e.target.value)} 
                placeholder="0" 
                disabled={loading} 
                className="rounded-3" 
                min="0"
                step="0.01"
              />
            </div>
            <div className="col-12 mt-2">
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

export default DeliveryMethods; 