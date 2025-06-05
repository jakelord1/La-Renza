import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Table, Modal, Form, Col, Row } from 'react-bootstrap';

const API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Adresses`;
const USERS_API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Users`;

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [userId, setUserId] = useState('');
  const [secondName, setSecondName] = useState('');
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [houseNum, setHouseNum] = useState('');
  const [postIndex, setPostIndex] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження адрес');
      const data = await res.json();
      setAddresses(data);
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
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setUserId('');
    setSecondName('');
    setFullName('');
    setStreet('');
    setCity('');
    setHouseNum('');
    setPostIndex('');
    setAdditionalInfo('');
    setPhoneNumber('');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!userId) {
      setAlert({ show: true, type: 'danger', message: 'Будь ласка, виберіть користувача' });
      return;
    }
    
    setLoading(true);
    try {
      const body = {
        userId: Number(userId),
        secondName,
        fullName,
        street,
        city,
        houseNum,
        postIndex,
        additionalInfo,
        phoneNumber
      };
      
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) throw new Error('Не вдалося додати адресу');
      
      setAlert({ show: true, type: 'success', message: 'Адресу додано!' });
      setShowAddModal(false);
      resetForm();
      fetchAddresses();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setUserId(address.userId ? String(address.userId) : '');
    setSecondName(address.secondName || '');
    setFullName(address.fullName || '');
    setStreet(address.street || '');
    setCity(address.city || '');
    setHouseNum(address.houseNum || '');
    setPostIndex(address.postIndex || '');
    setAdditionalInfo(address.additionalInfo || '');
    setPhoneNumber(address.phoneNumber || '');
    setShowEditModal(true);
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!userId) {
      setAlert({ show: true, type: 'danger', message: 'Будь ласка, виберіть користувача' });
      return;
    }
    
    setLoading(true);
    try {
      const body = {
        id: editingAddress.id,
        userId: Number(userId),
        secondName,
        fullName,
        street,
        city,
        houseNum,
        postIndex,
        additionalInfo,
        phoneNumber
      };
      
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) throw new Error('Не вдалося оновити адресу');
      
      setAlert({ show: true, type: 'success', message: 'Адресу оновлено!' });
      setShowEditModal(false);
      setEditingAddress(null);
      resetForm();
      fetchAddresses();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цю адресу?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Не вдалося видалити адресу');
      setAlert({ show: true, type: 'success', message: 'Адресу видалено!' });
      fetchAddresses();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Адреси</h2>
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({...alert, show: false})} dismissible>
          {alert.message}
        </Alert>
      )}
      
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-4 mb-4" style={{maxWidth: 1200, margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі адреси</h4>
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
                  <th>ПІБ</th>
                  <th>Адреса</th>
                  <th>Телефон</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {addresses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">Адрес ще немає</td>
                  </tr>
                ) : (
                  addresses.map(address => (
                    <tr key={address.id}>
                      <td>{address.id}</td>
                      <td>
                        <div>{address.fullName}</div>
                        {address.secondName && <div className="text-muted small">{address.secondName}</div>}
                      </td>
                      <td>
                        <div>{address.city}, {address.street} {address.houseNum}</div>
                        {address.additionalInfo && <div className="text-muted small">{address.additionalInfo}</div>}
                        {address.postIndex && <div className="text-muted small">Поштовий індекс: {address.postIndex}</div>}
                      </td>
                      <td>{address.phoneNumber}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button variant="link" size="sm" onClick={() => handleEditAddress(address)} title="Редагувати" className="p-0">
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button variant="link" size="sm" onClick={() => handleDeleteAddress(address.id)} title="Видалити" className="p-0">
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

      {/* Add Address Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Додати адресу</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddAddress}>
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
              <Form.Label>Повне ім'я</Form.Label>
              <Form.Control 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Введіть повне ім'я"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Прізвище (додатково)</Form.Label>
              <Form.Control 
                type="text" 
                value={secondName} 
                onChange={(e) => setSecondName(e.target.value)}
                placeholder="Введіть прізвище (якщо потрібно)"
              />
            </Form.Group>
            
            <Row>
              <Form.Group as={Col} md={8} className="mb-3">
                <Form.Label>Вулиця</Form.Label>
                <Form.Control 
                  type="text" 
                  value={street} 
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Введіть назву вулиці"
                />
              </Form.Group>
              
              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label>Будинок</Form.Label>
                <Form.Control 
                  type="text" 
                  value={houseNum} 
                  onChange={(e) => setHouseNum(e.target.value)}
                  placeholder="Номер будинку"
                />
              </Form.Group>
            </Row>
            
            <Row>
              <Form.Group as={Col} md={6} className="mb-3">
                <Form.Label>Місто</Form.Label>
                <Form.Control 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Введіть місто"
                />
              </Form.Group>
              
              <Form.Group as={Col} md={6} className="mb-3">
                <Form.Label>Поштовий індекс</Form.Label>
                <Form.Control 
                  type="text" 
                  value={postIndex} 
                  onChange={(e) => setPostIndex(e.target.value)}
                  placeholder="Введіть поштовий індекс"
                />
              </Form.Group>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Додаткова інформація</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                value={additionalInfo} 
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Додаткова інформація (квартира, під'їзд, поверх тощо)"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Номер телефону</Form.Label>
              <Form.Control 
                type="tel" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Введіть номер телефону"
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

      {/* Edit Address Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Редагувати адресу</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateAddress}>
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
              <Form.Label>Повне ім'я</Form.Label>
              <Form.Control 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Введіть повне ім'я"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Прізвище (додатково)</Form.Label>
              <Form.Control 
                type="text" 
                value={secondName} 
                onChange={(e) => setSecondName(e.target.value)}
                placeholder="Введіть прізвище (якщо потрібно)"
              />
            </Form.Group>
            
            <Row>
              <Form.Group as={Col} md={8} className="mb-3">
                <Form.Label>Вулиця</Form.Label>
                <Form.Control 
                  type="text" 
                  value={street} 
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Введіть назву вулиці"
                />
              </Form.Group>
              
              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label>Будинок</Form.Label>
                <Form.Control 
                  type="text" 
                  value={houseNum} 
                  onChange={(e) => setHouseNum(e.target.value)}
                  placeholder="Номер будинку"
                />
              </Form.Group>
            </Row>
            
            <Row>
              <Form.Group as={Col} md={6} className="mb-3">
                <Form.Label>Місто</Form.Label>
                <Form.Control 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Введіть місто"
                />
              </Form.Group>
              
              <Form.Group as={Col} md={6} className="mb-3">
                <Form.Label>Поштовий індекс</Form.Label>
                <Form.Control 
                  type="text" 
                  value={postIndex} 
                  onChange={(e) => setPostIndex(e.target.value)}
                  placeholder="Введіть поштовий індекс"
                />
              </Form.Group>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Додаткова інформація</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                value={additionalInfo} 
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Додаткова інформація (квартира, під'їзд, поверх тощо)"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Номер телефону</Form.Label>
              <Form.Control 
                type="tel" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Введіть номер телефону"
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

export default Addresses;
