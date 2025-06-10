import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Alert, Table, Modal, Pagination } from 'react-bootstrap';

const API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Coupons`;

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження купонів');
      const data = await res.json();
      setCoupons(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const resetForm = () => {
    setName('');
    setPrice('');
    setDescription('');
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!name || !price || !description) {
      setAlert({ show: true, type: 'danger', message: "Будь ласка, заповніть всі обов'язкові поля" });
      return;
    }
    setLoading(true);
    try {
      const body = {
        name,
        price: parseFloat(price),
        description,
        users: []
      };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Не вдалося додати купон');
      setAlert({ show: true, type: 'success', message: 'Купон успішно додано!' });
      setShowAddModal(false);
      resetForm();
      fetchCoupons();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setName(coupon.name);
    setPrice(coupon.price.toString());
    setDescription(coupon.description);
    setShowEditModal(true);
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    if (!name || !price || !description) {
      setAlert({ show: true, type: 'danger', message: "Будь ласка, заповніть всі обов'язкові поля" });
      return;
    }
    setLoading(true);
    try {
      const body = {
        id: editingCoupon.id,
        name,
        price: parseFloat(price),
        description,
        users: editingCoupon.users || []
      };
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Не вдалося оновити купон');
      setAlert({ show: true, type: 'success', message: 'Купон успішно оновлено!' });
      setShowEditModal(false);
      setEditingCoupon(null);
      resetForm();
      fetchCoupons();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей купон?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Не вдалося видалити купон');
      setAlert({ show: true, type: 'success', message: 'Купон видалено!' });
      fetchCoupons();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = coupons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(coupons.length / itemsPerPage);

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
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Купони</h2>
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
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі купони</h4>
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
                <div className="text-muted text-center py-5">Купонів ще немає</div>
              ) : (
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Назва</th>
                      <th>Опис</th>
                      <th>Ціна</th>
                      <th>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(coupon => (
                      <tr key={coupon.id}>
                        <td>
                          <div className="fw-bold">{coupon.name}</div>
                        </td>
                        <td>{coupon.description}</td>
                        <td>
                          <span className="text-success">{coupon.price} ₴</span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="link" size="sm" onClick={() => handleEditCoupon(coupon)} title="Редагувати" className="p-0"><i className="bi bi-pencil"></i></Button>
                            <Button variant="link" size="sm" onClick={() => handleDeleteCoupon(coupon.id)} title="Видалити" className="p-0"><i className="bi bi-trash text-danger"></i></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
            {coupons.length > itemsPerPage && (
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
          <Modal.Title className="fw-bold">Додати новий купон</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCoupon} className="row g-3">
            <div className="col-12">
              <label htmlFor="name" className="form-label text-secondary small mb-1">Назва купона</label>
              <Form.Control type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Назва купона" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12">
              <label htmlFor="price" className="form-label text-secondary small mb-1">Ціна</label>
              <Form.Control type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} placeholder="Ціна" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12">
              <label htmlFor="description" className="form-label text-secondary small mb-1">Опис</label>
              <Form.Control as="textarea" id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Опис купона" style={{ minHeight: 80, resize: 'none' }} disabled={loading} className="rounded-3" />
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
        setEditingCoupon(null);
      }} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Редагувати купон</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateCoupon} className="row g-3">
            <div className="col-12">
              <label htmlFor="edit-name" className="form-label text-secondary small mb-1">Назва купона</label>
              <Form.Control type="text" id="edit-name" value={name} onChange={e => setName(e.target.value)} placeholder="Назва купона" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12">
              <label htmlFor="edit-price" className="form-label text-secondary small mb-1">Ціна</label>
              <Form.Control type="number" id="edit-price" value={price} onChange={e => setPrice(e.target.value)} placeholder="Ціна" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12">
              <label htmlFor="edit-description" className="form-label text-secondary small mb-1">Опис</label>
              <Form.Control as="textarea" id="edit-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Опис купона" style={{ minHeight: 80, resize: 'none' }} disabled={loading} className="rounded-3" />
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

export default Coupons; 