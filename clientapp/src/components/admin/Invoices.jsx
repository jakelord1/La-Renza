import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Table, Modal, Form, Col, Row } from 'react-bootstrap';

const API_URL = 'https://localhost:7071/api/InvoiceInfos';
const USERS_API_URL = 'https://localhost:7071/api/Users';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  // Form states
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [city, setCity] = useState('');
  const [postIndex, setPostIndex] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [isDigital, setIsDigital] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження інвойсів');
      const data = await res.json();
      setInvoices(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(USERS_API_URL);
      if (!res.ok) throw new Error('Помилка завантаження користувачів');
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchInvoices();
  }, []);

  const resetForm = () => {
    setUserId('');
    setFullName('');
    setSecondName('');
    setCity('');
    setPostIndex('');
    setStreet('');
    setHouseNumber('');
    setIsDigital(false);
  };

  const handleAddInvoice = async (e) => {
    e.preventDefault();
    if (!userId || !fullName || !city || !postIndex || !street || !houseNumber) {
      setAlert({ show: true, type: 'danger', message: 'Заповніть всі обовʼязкові поля' });
      return;
    }
    setLoading(true);
    try {
      const body = {
        userId: Number(userId),
        fullName,
        secondName,
        city,
        postIndex,
        street,
        houseNumber,
        isDigital: Boolean(isDigital)
      };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Не вдалося додати інвойс');
      setAlert({ show: true, type: 'success', message: 'Інвойс додано!' });
      setShowAddModal(false);
      resetForm();
      fetchInvoices();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setUserId(invoice.userId ? String(invoice.userId) : '');
    setFullName(invoice.fullName || '');
    setSecondName(invoice.secondName || '');
    setCity(invoice.city || '');
    setPostIndex(invoice.postIndex || '');
    setStreet(invoice.street || '');
    setHouseNumber(invoice.houseNumber || '');
    setIsDigital(!!invoice.isDigital);
    setShowEditModal(true);
  };

  const handleUpdateInvoice = async (e) => {
    e.preventDefault();
    if (!userId || !fullName || !city || !postIndex || !street || !houseNumber) {
      setAlert({ show: true, type: 'danger', message: 'Заповніть всі обовʼязкові поля' });
      return;
    }
    setLoading(true);
    try {
      const body = {
        id: editingInvoice.id,
        userId: Number(userId),
        fullName,
        secondName,
        city,
        postIndex,
        street,
        houseNumber,
        isDigital: Boolean(isDigital)
      };
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Не вдалося оновити інвойс');
      setAlert({ show: true, type: 'success', message: 'Інвойс оновлено!' });
      setShowEditModal(false);
      setEditingInvoice(null);
      resetForm();
      fetchInvoices();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей інвойс?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Не вдалося видалити інвойс');
      setAlert({ show: true, type: 'success', message: 'Інвойс видалено!' });
      fetchInvoices();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  // const getUserName = (userId) => {
  //   const user = users.find(u => u.id === userId);
  //   return user ? `${user.firstName} ${user.lastName}` : 'Невідомий користувач';
  // };

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Інвойси</h2>
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({...alert, show: false})} dismissible>
          {alert.message}
        </Alert>
      )}
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-4 mb-4" style={{maxWidth: 1200, margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі інвойси</h4>
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
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>userId</th>
                  <th>Ім'я</th>
                  <th>Прізвище</th>
                  <th>Місто</th>
                  <th>Поштовий індекс</th>
                  <th>Вулиця</th>
                  <th>Будинок</th>
                  <th>Цифровий?</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4 text-muted">Інвойсів ще немає</td>
                  </tr>
                ) : (
                  invoices.map(invoice => (
                    <tr key={invoice.id}>
                      <td>{invoice.id}</td>
                      <td>{invoice.userId}</td>
                      <td>{invoice.fullName}</td>
                      <td>{invoice.secondName}</td>
                      <td>{invoice.city}</td>
                      <td>{invoice.postIndex}</td>
                      <td>{invoice.street}</td>
                      <td>{invoice.houseNumber}</td>
                      <td>{invoice.isDigital ? 'Так' : 'Ні'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button variant="link" size="sm" onClick={() => handleEditInvoice(invoice)} title="Редагувати" className="p-0">
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button variant="link" size="sm" onClick={() => handleDeleteInvoice(invoice.id)} title="Видалити" className="p-0">
                            <i className="bi bi-trash text-danger"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      {/* Add Invoice Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Додати інвойс</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddInvoice}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Користувач <span className="text-danger">*</span></Form.Label>
              <Form.Select 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)}
                required
              >
                <option value="">Виберіть користувача</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Повне ім'я <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Введіть повне ім'я"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Прізвище</Form.Label>
              <Form.Control 
                type="text" 
                value={secondName} 
                onChange={(e) => setSecondName(e.target.value)}
                placeholder="Введіть прізвище (якщо потрібно)"
              />
            </Form.Group>
            <Row>
              <Form.Group as={Col} md={6} className="mb-3">
                <Form.Label>Місто <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Введіть місто"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} md={6} className="mb-3">
                <Form.Label>Поштовий індекс <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" 
                  value={postIndex} 
                  onChange={(e) => setPostIndex(e.target.value)}
                  placeholder="Введіть поштовий індекс"
                  required
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} md={8} className="mb-3">
                <Form.Label>Вулиця <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" 
                  value={street} 
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Введіть назву вулиці"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label>Будинок <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" 
                  value={houseNumber} 
                  onChange={(e) => setHouseNumber(e.target.value)}
                  placeholder="Номер будинку"
                  required
                />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="Цифровий інвойс?" 
                checked={isDigital} 
                onChange={e => setIsDigital(e.target.checked)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)} disabled={loading}>
              Скасувати
            </Button>
            <Button variant="primary" type="submit" disabled={loading}
              style={{ background: '#6f42c1', border: 'none', fontWeight: 600 }}
            >
              {loading ? (
                <>
                  <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true" className="me-1" />
                  Збереження...
                </>
              ) : 'Зберегти'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Invoice Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Редагувати інвойс</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateInvoice}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Користувач <span className="text-danger">*</span></Form.Label>
              <Form.Select 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)}
                required
              >
                <option value="">Виберіть користувача</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Повне ім'я <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Введіть повне ім'я"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Прізвище</Form.Label>
              <Form.Control 
                type="text" 
                value={secondName} 
                onChange={(e) => setSecondName(e.target.value)}
                placeholder="Введіть прізвище (якщо потрібно)"
              />
            </Form.Group>
            <Row>
              <Form.Group as={Col} md={6} className="mb-3">
                <Form.Label>Місто <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Введіть місто"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} md={6} className="mb-3">
                <Form.Label>Поштовий індекс <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" 
                  value={postIndex} 
                  onChange={(e) => setPostIndex(e.target.value)}
                  placeholder="Введіть поштовий індекс"
                  required
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} md={8} className="mb-3">
                <Form.Label>Вулиця <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" 
                  value={street} 
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Введіть назву вулиці"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label>Будинок <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" 
                  value={houseNumber} 
                  onChange={(e) => setHouseNumber(e.target.value)}
                  placeholder="Номер будинку"
                  required
                />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="Цифровий інвойс?" 
                checked={isDigital} 
                onChange={e => setIsDigital(e.target.checked)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={loading}>
              Скасувати
            </Button>
            <Button variant="primary" type="submit" disabled={loading}
              style={{ background: '#6f42c1', border: 'none', fontWeight: 600 }}
            >
              {loading ? (
                <>
                  <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true" className="me-1" />
                  Оновлення...
                </>
              ) : 'Оновити'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Invoices; 