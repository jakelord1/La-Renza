import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Alert, Table, Modal, Pagination } from 'react-bootstrap';

const Administrators = () => {
  const [administrators, setAdministrators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    setLoading(true);
    // Здесь должен быть запрос к API
    setTimeout(() => {
      setAdministrators([
        { id: 1, email: 'admin1@example.com', identifier: 'admin1' },
        { id: 2, email: 'admin2@example.com', identifier: 'admin2' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !identifier || !password) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Будь ласка, заповніть всі обов\'язкові поля'
      });
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const newAdmin = {
        id: administrators.length + 1,
        email,
        identifier,
      };
      
      setAdministrators([...administrators, newAdmin]);
      
      resetForm();
      
      setAlert({
        show: true,
        type: 'success',
        message: 'Адміністратора успішно додано!'
      });
      
      setLoading(false);
      setShowAddModal(false);
    }, 1000);
  };

  const handleUpdateAdmin = (e) => {
    e.preventDefault();
    
    if (!email || !identifier) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Будь ласка, заповніть всі обов\'язкові поля'
      });
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const updatedAdmin = {
        ...editingAdmin,
        email,
        identifier,
      };
      
      setAdministrators(administrators.map(admin => 
        admin.id === editingAdmin.id ? updatedAdmin : admin
      ));
      
      resetForm();
      
      setAlert({
        show: true,
        type: 'success',
        message: 'Адміністратора успішно оновлено!'
      });
      
      setLoading(false);
      setShowEditModal(false);
      setEditingAdmin(null);
    }, 1000);
  };

  const handleDeleteAdmin = (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цього адміністратора?')) {
      setAdministrators(administrators.filter(admin => admin.id !== id));
      setAlert({
        show: true,
        type: 'success',
        message: 'Адміністратора видалено!'
      });
    }
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setEmail(admin.email);
    setIdentifier(admin.identifier);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setEmail('');
    setIdentifier('');
    setPassword('');
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = administrators.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(administrators.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    pages.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      />
    );

    if (startPage > 1) {
      pages.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        pages.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
      }
    }

    for (let number = startPage; number <= endPage; number++) {
      pages.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
      }
      pages.push(
        <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    pages.push(
      <Pagination.Next 
        key="next" 
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      />
    );

    return pages;
  };

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Адміністратори</h2>
      {alert.show && (
        <Alert 
          variant={alert.type} 
          onClose={() => setAlert({...alert, show: false})} 
          dismissible
        >
          {alert.message}
        </Alert>
      )}
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-5 mb-4" style={{maxWidth: 1200, margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі адміністратори</h4>
          <Button
            variant="primary"
            style={{ background: '#6f42c1', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '1.05rem', padding: '8px 22px', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => setShowAddModal(true)}
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
            <div style={{ minHeight: '340px' }}>
              {currentItems.length === 0 ? (
                <div className="text-muted text-center py-5">Адміністраторів ще немає</div>
              ) : (
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Identifier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(admin => (
                      <tr key={admin.id}>
                        <td>
                          <div className="fw-bold">{admin.email}</div>
                        </td>
                        <td>{admin.identifier}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
            {administrators.length > itemsPerPage && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination className="mb-0">
                  {renderPagination()}
                </Pagination>
              </div>
            )}
          </>
        )}
      </Card>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Додати нового адміністратора</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12">
              <label htmlFor="email" className="form-label text-secondary small mb-1">Email</label>
              <Form.Control type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Введіть email" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12">
              <label htmlFor="identifier" className="form-label text-secondary small mb-1">Identifier</label>
              <Form.Control type="text" id="identifier" value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="Введіть identifier" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12">
              <label htmlFor="password" className="form-label text-secondary small mb-1">Пароль</label>
              <Form.Control type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Введіть пароль" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12 mt-2">
              <Button type="submit" className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" style={{ background: '#6f42c1', border: 'none', fontWeight:600, fontSize:'1.1rem', padding:'12px 0' }} disabled={loading}>
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-send me-2"></i>Додати</>}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => {
        setShowEditModal(false);
        setEditingAdmin(null);
      }} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Редагувати адміністратора</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateAdmin} className="row g-3">
            <div className="col-12">
              <label htmlFor="edit-email" className="form-label text-secondary small mb-1">Email</label>
              <Form.Control type="email" id="edit-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Введіть email" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12">
              <label htmlFor="edit-identifier" className="form-label text-secondary small mb-1">Identifier</label>
              <Form.Control type="text" id="edit-identifier" value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="Введіть identifier" disabled={loading} className="rounded-3" />
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

export default Administrators; 