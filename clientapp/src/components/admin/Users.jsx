import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Spinner, Alert, Table, Modal, Pagination, Badge } from 'react-bootstrap';

const API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Users`;

const genderOptions = [
  { value: 0, label: 'Жіночий' },
  { value: 1, label: 'Чоловічий' },
  { value: 2, label: 'Інше' }
];

// Добавим кастомные стили прямо в компонент
const customStyles = `
  .coupon-plus-btn {
    border-color: #6f42c1 !important;
    color: #6f42c1 !important;
    background: transparent !important;
    transition: background 0.2s, color 0.2s;
  }
  .coupon-plus-btn:disabled {
    background: #ede7f6 !important;
    color: #6f42c1 !important;
    border-color: #6f42c1 !important;
    opacity: 0.7;
  }
  .coupon-plus-btn .bi-plus {
    color: #6f42c1 !important;
    transition: color 0.2s;
  }
  .coupon-plus-btn:not(:disabled):hover, .coupon-plus-btn:not(:disabled):focus {
    background: #59359c !important;
    color: #fff !important;
    border-color: #6f42c1 !important;
  }
  .coupon-plus-btn:not(:disabled):hover .bi-plus, .coupon-plus-btn:not(:disabled):focus .bi-plus {
    color: #fff !important;
  }
  .btn-purple {
    background: #6f42c1 !important;
    color: #fff !important;
    border: none !important;
  }
  .btn-purple:hover, .btn-purple:focus {
    background: #59359c !important;
    color: #fff !important;
  }
  .btn-outline-danger .bi-trash {
    color: #dc3545 !important;
    transition: color 0.2s;
  }
  .btn-outline-danger:hover .bi-trash, .btn-outline-danger:focus .bi-trash {
    color: #fff !important;
  }
  .coupons-list-fixed {
    height: 400px;
    overflow-y: auto;
  }
`;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCoupons, setSelectedCoupons] = useState([]);

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [surName, setSurName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState(0);
  const [newsOn, setNewsOn] = useState(false);
  const [laRenzaPoints, setLaRenzaPoints] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження користувачів');
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !phoneNumber || !fullName || !surName || !birthDate) {
      setAlert({ show: true, type: 'danger', message: 'Будь ласка, заповніть всі обов\'язкові поля' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: users.length + 1,
        email,
        phoneNumber,
        fullName,
        surName,
        birthDate,
        gender: parseInt(gender),
        newsOn: newsOn ? 1 : 0,
        laRenzaPoints: parseInt(laRenzaPoints) || 0,
        coupons: []
      };
      setUsers([...users, newUser]);
      resetForm();
      setAlert({ show: true, type: 'success', message: 'Користувача додано!' });
      setLoading(false);
      setShowAddModal(false);
    }, 1000);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!email || !phoneNumber || !fullName || !surName || !birthDate) {
      setAlert({ show: true, type: 'danger', message: 'Будь ласка, заповніть всі обов\'язкові поля' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const updatedUser = {
        ...editingUser,
        email,
        phoneNumber,
        fullName,
        surName,
        birthDate,
        gender: parseInt(gender),
        newsOn: newsOn ? 1 : 0,
        laRenzaPoints: parseInt(laRenzaPoints) || 0
      };
      setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
      resetForm();
      setAlert({ show: true, type: 'success', message: 'Користувача оновлено!' });
      setLoading(false);
      setShowEditModal(false);
      setEditingUser(null);
    }, 1000);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цього користувача?')) {
      setUsers(users.filter(u => u.id !== id));
      setAlert({ show: true, type: 'success', message: 'Користувача видалено!' });
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEmail(user.email);
    setPhoneNumber(user.phoneNumber);
    setFullName(user.fullName);
    setSurName(user.surName);
    setBirthDate(user.birthDate);
    setGender(user.gender);
    setNewsOn(!!user.newsOn);
    setLaRenzaPoints(user.laRenzaPoints.toString());
    setShowEditModal(true);
  };

  const handleManageCoupons = (user) => {
    setSelectedUser(user);
    setSelectedCoupons(user.coupons || []);
    setShowCouponsModal(true);
  };

  const handleSaveCoupons = () => {
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, coupons: selectedCoupons }
        : user
    ));
    setAlert({ show: true, type: 'success', message: 'Купони користувача оновлено!' });
    setShowCouponsModal(false);
  };

  const handleAddCoupon = (coupon) => {
    if (!selectedCoupons.find(c => c.id === coupon.id)) {
      setSelectedCoupons([...selectedCoupons, coupon]);
    }
  };

  const handleRemoveCoupon = (couponId) => {
    setSelectedCoupons(selectedCoupons.filter(c => c.id !== couponId));
  };

  const resetForm = () => {
    setEmail('');
    setPhoneNumber('');
    setFullName('');
    setSurName('');
    setBirthDate('');
    setGender(0);
    setNewsOn(false);
    setLaRenzaPoints('');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    pages.push(
      <Pagination.Prev key="prev" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} />
    );
    if (startPage > 1) {
      pages.push(<Pagination.Item key={1} onClick={() => handlePageChange(1)}>1</Pagination.Item>);
      if (startPage > 2) pages.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
    }
    for (let number = startPage; number <= endPage; number++) {
      pages.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>
      );
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
      pages.push(<Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>);
    }
    pages.push(
      <Pagination.Next key="next" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} />
    );
    return pages;
  };

  // const maskPassword = (password) => '•'.repeat(Math.max(password.length, 6));

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Користувачі</h2>
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({...alert, show: false})} dismissible>{alert.message}</Alert>
      )}
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-4 mb-4" style={{maxWidth: 1400, margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі користувачі</h4>
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
          <>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {currentItems.length === 0 ? (
                <div className="text-muted text-center py-5">Користувачів ще немає</div>
              ) : (
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>E-mail</th>
                      <th>Телефон</th>
                      <th>Ім'я</th>
                      <th>Прізвище</th>
                      <th>Дата народження</th>
                      <th>Гендер</th>
                      <th>Купони</th>
                      <th>Розсилка</th>
                      <th>Поінти</th>
                      <th>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(user => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.fullName}</td>
                        <td>{user.surName}</td>
                        <td>{user.birthDate ? user.birthDate.slice(0, 10) : ''}</td>
                        <td>{user.gender === true ? 'Чоловічий' : user.gender === false ? 'Жіночий' : 'Інше'}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {(user.coupons || []).map(coupon => (
                              <span
                                key={coupon.id}
                                className="badge rounded-pill bg-primary"
                              >
                                {coupon.code}
                              </span>
                            ))}
                            <Button 
                              variant="link" 
                              size="sm" 
                              onClick={() => handleManageCoupons(user)}
                              className="p-0 ms-1"
                            >
                              <i className="bi bi-plus-circle"></i>
                            </Button>
                          </div>
                        </td>
                        <td>{user.newsOn ? 'Так' : 'Ні'}</td>
                        <td>{user.laRenzaPoints}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="link" size="sm" onClick={() => handleEditUser(user)} title="Редагувати" className="p-0"><i className="bi bi-pencil"></i></Button>
                            <Button variant="link" size="sm" onClick={() => handleDeleteUser(user.id)} title="Видалити" className="p-0"><i className="bi bi-trash text-danger"></i></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
            {users.length > itemsPerPage && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination className="mb-0">{renderPagination()}</Pagination>
              </div>
            )}
          </>
        )}
      </Card>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Додати користувача</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12">
              <label htmlFor="email" className="form-label text-secondary small mb-1">E-mail</label>
              <Form.Control type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12">
              <label htmlFor="phoneNumber" className="form-label text-secondary small mb-1">Телефон</label>
              <Form.Control type="text" id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+380..." />
            </div>
            <div className="col-12">
              <label htmlFor="fullName" className="form-label text-secondary small mb-1">Ім'я</label>
              <Form.Control type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Ім'я" />
            </div>
            <div className="col-12">
              <label htmlFor="surName" className="form-label text-secondary small mb-1">Прізвище</label>
              <Form.Control type="text" id="surName" value={surName} onChange={e => setSurName(e.target.value)} placeholder="Прізвище" required />
            </div>
            <div className="col-12">
              <label htmlFor="birthDate" className="form-label text-secondary small mb-1">Дата народження</label>
              <Form.Control type="date" id="birthDate" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
            </div>
            <div className="col-12">
              <label htmlFor="gender" className="form-label text-secondary small mb-1">Гендер</label>
              <Form.Select id="gender" value={gender} onChange={e => setGender(e.target.value)}>
                {genderOptions.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-12">
              <label htmlFor="newsOn" className="form-check-label text-secondary small mb-1">Розсилка</label>
              <Form.Check type="checkbox" id="newsOn" checked={newsOn} onChange={e => setNewsOn(e.target.checked)} />
            </div>
            <div className="col-12">
              <label htmlFor="laRenzaPoints" className="form-label text-secondary small mb-1">Поінти</label>
              <Form.Control type="text" id="laRenzaPoints" value={laRenzaPoints} onChange={e => setLaRenzaPoints(e.target.value)} placeholder="Поінти" />
            </div>
            <div className="col-12">
              <Button type="submit" variant="primary" disabled={loading} className="rounded-3">
                {loading ? <Spinner animation="border" size="sm" /> : 'Додати'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>


      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Редагувати користувача</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateUser} className="row g-3">
            <div className="col-12">
              <label htmlFor="email" className="form-label text-secondary small mb-1">E-mail</label>
              <Form.Control type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12">
              <label htmlFor="phoneNumber" className="form-label text-secondary small mb-1">Телефон</label>
              <Form.Control type="text" id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+380..." />
            </div>
            <div className="col-12">
              <label htmlFor="fullName" className="form-label text-secondary small mb-1">Ім'я</label>
              <Form.Control type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Ім'я" />
            </div>
            <div className="col-12">
              <label htmlFor="surName" className="form-label text-secondary small mb-1">Прізвище</label>
              <Form.Control type="text" id="surName" value={surName} onChange={e => setSurName(e.target.value)} placeholder="Прізвище" required />
            </div>
            <div className="col-12">
              <label htmlFor="birthDate" className="form-label text-secondary small mb-1">Дата народження</label>
              <Form.Control type="date" id="birthDate" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
            </div>
            <div className="col-12">
              <label htmlFor="gender" className="form-label text-secondary small mb-1">Гендер</label>
              <Form.Select id="gender" value={gender} onChange={e => setGender(e.target.value)}>
                {genderOptions.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-12">
              <label htmlFor="newsOn" className="form-check-label text-secondary small mb-1">Розсилка</label>
              <Form.Check type="checkbox" id="newsOn" checked={newsOn} onChange={e => setNewsOn(e.target.checked)} style={{ accentColor: '#6f42c1', width: 20, height: 20 }} />
            </div>
            <div className="col-12">
              <label htmlFor="laRenzaPoints" className="form-label text-secondary small mb-1">Поінти</label>
              <Form.Control type="text" id="laRenzaPoints" value={laRenzaPoints} onChange={e => setLaRenzaPoints(e.target.value)} placeholder="Поінти" />
            </div>
            <div className="col-12">
              <Button type="submit" style={{ background: '#6f42c1', border: 'none', fontWeight: 600, fontSize: '1.1rem', padding: '12px 0' }} className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2">
                {loading ? <Spinner animation="border" size="sm" /> : 'Оновити'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Coupons Modal */}
      <Modal show={showCouponsModal} onHide={() => setShowCouponsModal(false)} centered size="lg">
        <style>{customStyles}</style>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold" style={{ color: '#6f42c1' }}>Управління купонами користувача</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <h5 className="mb-3" style={{ color: '#6f42c1' }}>Доступні купони</h5>
              <div className="list-group coupons-list-fixed">
                {availableCoupons
                  .filter(coupon => !selectedCoupons.some(selected => selected.id === coupon.id))
                  .map(coupon => (
                    <div key={coupon.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{coupon.code}</strong>
                        <div className="text-muted small">{coupon.description}</div>
                      </div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleAddCoupon(coupon)}
                        className="coupon-plus-btn"
                      >
                        <i className="bi bi-plus"></i>
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
            <div className="col-md-6">
              <h5 className="mb-3" style={{ color: '#6f42c1' }}>Вибрані купони</h5>
              <div className="list-group coupons-list-fixed">
                {selectedCoupons.map(coupon => (
                  <div key={coupon.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{coupon.code}</strong>
                      <div className="text-muted small">{coupon.description}</div>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveCoupon(coupon.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCouponsModal(false)}>
            Скасувати
          </Button>
          <Button className="btn-purple" onClick={handleSaveCoupons}>
            Зберегти
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users; 