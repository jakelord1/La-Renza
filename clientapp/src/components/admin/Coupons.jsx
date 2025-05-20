import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Alert, Table, Modal, Pagination } from 'react-bootstrap';
import couponsData from '../../data/coupons.json';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCoupons(couponsData.coupons);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!code || !discount || !startDate || !endDate) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Будь ласка, заповніть всі обов\'язкові поля'
      });
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const newCoupon = {
        id: coupons.length + 1,
        code,
        discount: parseFloat(discount),
        startDate,
        endDate,
        description
      };
      
      setCoupons([...coupons, newCoupon]);
      
      resetForm();
      
      setAlert({
        show: true,
        type: 'success',
        message: 'Купон успішно додано!'
      });
      
      setLoading(false);
      setShowAddModal(false);
    }, 1000);
  };

  const handleUpdateCoupon = (e) => {
    e.preventDefault();
    
    if (!code || !discount || !startDate || !endDate) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Будь ласка, заповніть всі обов\'язкові поля'
      });
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const updatedCoupon = {
        ...editingCoupon,
        code,
        discount: parseFloat(discount),
        startDate,
        endDate,
        description
      };
      
      setCoupons(coupons.map(coupon => 
        coupon.id === editingCoupon.id ? updatedCoupon : coupon
      ));
      
      
      resetForm();
      
      setAlert({
        show: true,
        type: 'success',
        message: 'Купон успішно оновлено!'
      });
      
      setLoading(false);
      setShowEditModal(false);
      setEditingCoupon(null);
    }, 1000);
  };

  const handleDeleteCoupon = (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей купон?')) {
      setCoupons(coupons.filter(coupon => coupon.id !== id));
      setAlert({
        show: true,
        type: 'success',
        message: 'Купон видалено!'
      });
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDiscount(coupon.discount.toString());
    setStartDate(coupon.startDate);
    setEndDate(coupon.endDate);
    setDescription(coupon.description);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setCode('');
    setDiscount('');
    setStartDate('');
    setEndDate('');
    setDescription('');
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
                      <th>Код</th>
                      <th>Опис</th>
                      <th>Знижка</th>
                      <th>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(coupon => (
                      <tr key={coupon.id}>
                        <td>
                          <div className="fw-bold">{coupon.code}</div>
                        </td>
                        <td>{coupon.description}</td>
                        <td>
                          <span className="text-success">{coupon.discount} ₴</span>
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
          <Form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12">
              <label htmlFor="code" className="form-label text-secondary small mb-1">Код купона</label>
              <Form.Control type="text" id="code" value={code} onChange={e => setCode(e.target.value)} placeholder="Наприклад: WELCOME10" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12">
              <label htmlFor="discount" className="form-label text-secondary small mb-1">Розмір знижки</label>
              <Form.Control type="number" id="discount" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Наприклад: 100" disabled={loading} className="rounded-3" />
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
              <label htmlFor="edit-code" className="form-label text-secondary small mb-1">Код купона</label>
              <Form.Control type="text" id="edit-code" value={code} onChange={e => setCode(e.target.value)} placeholder="Наприклад: WELCOME10" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-12">
              <label htmlFor="edit-discount" className="form-label text-secondary small mb-1">Розмір знижки</label>
              <Form.Control type="number" id="edit-discount" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Наприклад: 100" disabled={loading} className="rounded-3" />
            </div>
            <div className="col-6">
              <label htmlFor="edit-startDate" className="form-label text-secondary small mb-1">Дата початку</label>
              <Form.Control type="date" id="edit-startDate" value={startDate} onChange={e => setStartDate(e.target.value)} disabled={loading} className="rounded-3" />
            </div>
            <div className="col-6">
              <label htmlFor="edit-endDate" className="form-label text-secondary small mb-1">Дата закінчення</label>
              <Form.Control type="date" id="edit-endDate" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={loading} className="rounded-3" />
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