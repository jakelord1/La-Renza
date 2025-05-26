import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Alert, Table, Modal, Pagination, Badge, FormControl } from 'react-bootstrap';

const API_URL = 'https://localhost:7071/api/Orders';
const USERS_API_URL = 'https://localhost:7071/api/Users';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    status: '',
    deliveryId: '',
    cuponsId: '',
    orderName: '',
    paymentMethod: '',
    deliveryMethodId: '',
    phonenumber: ''
  });
  
  const [errorFields, setErrorFields] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження замовлень');
      const data = await res.json();
      setOrders(data);
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
    fetchOrders();
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditOrder = (order) => {
  if (!order) return;
  setSelectedOrder(order);
  setFormData({
    userId: order.userId || '',
    status: order.status || 'Нове',
    deliveryId: order.deliveryId || '',
    cuponsId: order.cuponsId || '',
    orderName: order.orderName || '',
    paymentMethod: order.paymentMethod || 'Готівка',
    deliveryMethodId: order.deliveryMethodId || '',
    phonenumber: order.phonenumber || '',
    notes: order.notes || '',
    totalPrice: order.totalPrice || 0,
    id: order.id
  });
  setShowEditModal(true);
};

  const handleAddOrder = () => {
    setFormData({
      userId: '',
      status: '',
      deliveryId: '',
      cuponsId: '',
      orderName: '',
      paymentMethod: '',
      deliveryMethodId: '',
      phonenumber: ''
    });
    setErrorFields({});
    setSelectedOrder(null);
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    
    const errors = {};
    if (!formData.userId) errors.userId = 'Оберіть клієнта';
    if (!formData.status) errors.status = 'Вкажіть статус';
    
    if (Object.keys(errors).length > 0) {
      setErrorFields(errors);
      setLoading(false);
      return;
    }
    
    try {
      const url = selectedOrder ? `${API_URL}/${selectedOrder.id}` : API_URL;
      const method = selectedOrder ? 'PUT' : 'POST';
      
      const orderData = {
        ...formData,
        ...(selectedOrder && { id: selectedOrder.id })
      };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || (selectedOrder ? 'Не вдалося оновити замовлення' : 'Не вдалося створити замовлення'));
      }
      
      setAlert({
        show: true,
        type: 'success',
        message: selectedOrder ? 'Замовлення оновлено успішно!' : 'Замовлення створено успішно!'
      });
      
      setShowEditModal(false);
      fetchOrders();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) throw new Error('Не вдалося оновити статус замовлення');
      
      setAlert({
        show: true,
        type: 'success',
        message: 'Статус замовлення успішно оновлено!'
      });
      
      
      fetchOrders();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    
    const orderWithDefaults = {
      ...order,
      items: order.items || [],
      totalPrice: order.totalPrice || 0,
      status: order.status || 'Нове',
      paymentMethod: order.paymentMethod || 'Не вказано',
      orderName: order.orderName || 'Без назви',
      phonenumber: order.phonenumber || 'Не вказано',
      deliveryId: order.deliveryId || 'Не вказано',
      cuponsId: order.cuponsId || 'Не використовувався',
      deliveryMethodId: order.deliveryMethodId || 'Не вказано',
      notes: order.notes || '',
      createdAt: order.createdAt || new Date().toISOString(),
      completedAt: order.completedAt || null
    };
    
    setSelectedOrder(orderWithDefaults);
    setShowDetailsModal(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
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
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Замовлення</h2>
      {alert.show && (
        <Alert 
          variant={alert.type} 
          onClose={() => setAlert({...alert, show: false})} 
          dismissible
        >
          {alert.message}
        </Alert>
      )}
      
      
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Деталі замовлення #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3 fw-bold">Інформація про замовлення</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Статус:</strong> <Badge bg={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
                      <p><strong>Дата замовлення:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                      <p><strong>Завершення:</strong> {selectedOrder.completedAt ? new Date(selectedOrder.completedAt).toLocaleString() : 'Не завершено'}</p>
                      <p><strong>Метод оплати:</strong> {selectedOrder.paymentMethod || 'Не вказано'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Клієнт:</strong> {selectedOrder.userId || 'Невідомо'}</p>
                      <p><strong>Телефон:</strong> {selectedOrder.phonenumber || 'Не вказано'}</p>
                      <p><strong>ID купона:</strong> {selectedOrder.cuponsId || 'Не використовувався'}</p>
                      <p><strong>ID доставки:</strong> {selectedOrder.deliveryId || 'Не вказано'}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <h5 className="mb-3 fw-bold">Додаткова інформація</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Назва замовлення:</strong> {selectedOrder.orderName || 'Не вказано'}</p>
                      <p><strong>ID методу доставки:</strong> {selectedOrder.deliveryMethodId || 'Не вказано'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Загальна сума:</strong> <span className="text-success fw-bold">{selectedOrder.totalPrice || 0} ₴</span></p>
                      {selectedOrder.notes && (
                        <p><strong>Примітки:</strong> {selectedOrder.notes}</p>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <Card className="mt-4">
                  <Card.Body>
                    <h5 className="mb-3 fw-bold">Товари у замовленні</h5>
                    <Table hover className="align-middle">
                      <thead>
                        <tr>
                          <th>Товар</th>
                          <th>Кількість</th>
                          <th>Ціна</th>
                          <th>Сума</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name || `Товар #${index + 1}`}</td>
                            <td>{item.quantity || 1}</td>
                            <td>{item.price || 0} ₴</td>
                            <td>{(item.quantity || 1) * (item.price || 0)} ₴</td>
                          </tr>
                        ))}
                        <tr className="table-active">
                          <td colSpan="3" className="text-end fw-bold">Всього:</td>
                          <td className="fw-bold">{selectedOrder.totalPrice || 0} ₴</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowDetailsModal(false)}
            className="px-4"
          >
            Закрити
          </Button>
          {selectedOrder && (
            <Button 
              variant="primary"
              onClick={() => {
                setShowDetailsModal(false);
                handleEditOrder(selectedOrder);
              }}
              className="px-4"
            >
              <i className="bi bi-pencil me-2"></i>Редагувати
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      
      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setSelectedOrder(null); }} centered size="md" dialogClassName="modal-narrow">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Редагувати замовлення</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12">
              <Form.Label className="mb-1 fw-medium">Клієнт <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                className={errorFields.userId ? 'is-invalid' : ''}
                disabled={loading}
              >
                <option value="">Виберіть клієнта</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name || `Користувач #${user.id}`}
                  </option>
                ))}
              </Form.Select>
              {errorFields.userId && <div className="invalid-feedback">{errorFields.userId}</div>}
            </div>
            <div className="col-12">
              <Form.Label className="mb-1 fw-medium">Статус <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={errorFields.status ? 'is-invalid' : ''}
                disabled={loading}
              >
                <option value="">Виберіть статус</option>
                <option value="Нове">Нове</option>
                <option value="В обробці">В обробці</option>
                <option value="Відправлено">Відправлено</option>
                <option value="Доставлено">Доставлено</option>
                <option value="Скасовано">Скасовано</option>
              </Form.Select>
              {errorFields.status && <div className="invalid-feedback">{errorFields.status}</div>}
            </div>
            <div className="col-12">
              <Form.Label className="mb-1 fw-medium">ID доставки</Form.Label>
              <FormControl
                type="text"
                name="deliveryId"
                value={formData.deliveryId || ''}
                onChange={handleInputChange}
                className={errorFields.deliveryId ? 'is-invalid' : ''}
                disabled={loading}
                placeholder="Введіть ID доставки"
              />
              {errorFields.deliveryId && <div className="invalid-feedback">{errorFields.deliveryId}</div>}
            </div>
            <div className="col-12">
              <Form.Label className="mb-1 fw-medium">ID купона</Form.Label>
              <FormControl
                type="text"
                name="cuponsId"
                value={formData.cuponsId || ''}
                onChange={handleInputChange}
                className={errorFields.cuponsId ? 'is-invalid' : ''}
                disabled={loading}
                placeholder="Введіть ID купона"
              />
              {errorFields.cuponsId && <div className="invalid-feedback">{errorFields.cuponsId}</div>}
            </div>
            <div className="col-12">
              <Form.Label className="mb-1 fw-medium">Назва замовлення</Form.Label>
              <FormControl
                type="text"
                name="orderName"
                value={formData.orderName || ''}
                onChange={handleInputChange}
                className={errorFields.orderName ? 'is-invalid' : ''}
                disabled={loading}
                placeholder="Введіть назву замовлення"
              />
              {errorFields.orderName && <div className="invalid-feedback">{errorFields.orderName}</div>}
            </div>
            <div className="col-12">
              <Form.Label className="mb-1 fw-medium">Метод оплати</Form.Label>
              <Form.Select
                name="paymentMethod"
                value={formData.paymentMethod || ''}
                onChange={handleInputChange}
                className={errorFields.paymentMethod ? 'is-invalid' : ''}
                disabled={loading}
              >
                <option value="">Виберіть спосіб оплати</option>
                <option value="Готівка">Готівка</option>
                <option value="Картка">Картка</option>
                <option value="Онлайн оплата">Онлайн оплата</option>
              </Form.Select>
              {errorFields.paymentMethod && <div className="invalid-feedback">{errorFields.paymentMethod}</div>}
            </div>
            <div className="col-12">
              <Form.Label className="mb-1 fw-medium">ID методу доставки</Form.Label>
              <FormControl
                type="text"
                name="deliveryMethodId"
                value={formData.deliveryMethodId || ''}
                onChange={handleInputChange}
                className={errorFields.deliveryMethodId ? 'is-invalid' : ''}
                disabled={loading}
                placeholder="Введіть ID методу доставки"
              />
              {errorFields.deliveryMethodId && <div className="invalid-feedback">{errorFields.deliveryMethodId}</div>}
            </div>
            <div className="col-12">
              <Form.Label className="mb-1 fw-medium">Телефон</Form.Label>
              <FormControl
                type="tel"
                name="phonenumber"
                value={formData.phonenumber || ''}
                onChange={handleInputChange}
                className={errorFields.phonenumber ? 'is-invalid' : ''}
                disabled={loading}
                placeholder="+380XXXXXXXXX"
              />
              {errorFields.phonenumber && <div className="invalid-feedback">{errorFields.phonenumber}</div>}
            </div>
            <div className="col-12">
              <Form.Label className="mb-1 fw-medium">Примітки до замовлення</Form.Label>
              <FormControl
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
                className={errorFields.notes ? 'is-invalid' : ''}
                disabled={loading}
                placeholder="Введіть додаткові примітки"
              />
              {errorFields.notes && <div className="invalid-feedback">{errorFields.notes}</div>}
            </div>
            <div className="col-12 mt-2">
              <Button type="submit" className="w-100 btn-lg rounded-3 d-flex align-items-center justify-content-center gap-2" style={{ background: '#6f42c1', border: 'none', fontWeight:600, fontSize:'1.1rem', padding:'12px 0' }} disabled={loading}>
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-save me-2"></i>Зберегти зміни</>}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-4 mb-4" style={{maxWidth: 1200, margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі замовлення</h4>
          <Button
            variant="primary"
            style={{ background: '#6f42c1', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '1.05rem', padding: '8px 22px', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={handleAddOrder}
            disabled={loading}
          >
            <i className="bi bi-plus-lg" style={{fontSize:18}}></i> Додати замовлення
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
                <div className="text-muted text-center py-5">Замовлень ще немає</div>
              ) : (
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Номер замовлення</th>
                      <th>Статус</th>
                      <th>Дата замовлення</th>
                      <th>Сума</th>
                      <th>Метод оплати</th>
                      <th>Метод доставки</th>
                      <th>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(order => (
                      <tr key={order.id}>
                        <td>
                          <div className="fw-bold">#{order.id}</div>
                          <div className="text-muted small">Клієнт: {order.userId || 'Невідомо'}</div>
                        </td>
                        <td>
                          <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className="text-success">{order.totalPrice} ₴</span>
                        </td>
                        <td>{order.paymentMethod || 'Невказано'}</td>
                        <td>{order.deliveryMethodId ? `ID: ${order.deliveryMethodId}` : 'Невказано'}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="link" 
                              size="sm" 
                              onClick={() => handleViewDetails(order)} 
                              title="Деталі"
                              className="p-0"
                            >
                              <i className="bi bi-eye"></i>
                            </Button>
                            <Button 
                              variant="link" 
                              size="sm" 
                              onClick={() => handleEditOrder(order)}
                              title="Редагувати"
                              className="p-0"
                            >
                              <i className="bi bi-pencil text-primary"></i>
                            </Button>
                            <Button 
                              variant="link" 
                              size="sm" 
                              onClick={() => handleUpdateStatus(order.id, 'Скасовано')}
                              title="Скасувати"
                              className="p-0"
                            >
                              <i className="bi bi-x-lg text-danger"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
            {orders.length > itemsPerPage && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination className="mb-0">
                  {renderPagination()}
                </Pagination>
              </div>
            )}
          </>
        )}
      </Card>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Деталі замовлення #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Card className="mb-3">
                <Card.Body>
                  <h5 className="mb-3">Інформація про замовлення</h5>
                  <Row>
                    <Col md={6}>
                      <p><strong>Статус:</strong> {selectedOrder.status}</p>
                      <p><strong>Дата замовлення:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                      <p><strong>Дата виконання:</strong> {selectedOrder.completedAt ? new Date(selectedOrder.completedAt).toLocaleString() : 'Не виконано'}</p>
                      <p><strong>Метод оплати:</strong> {selectedOrder.paymentMethod}</p>
                      <p><strong>Метод доставки:</strong> {selectedOrder.deliveryMethod}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Ім'я замовника:</strong> {selectedOrder.orderName}</p>
                      <p><strong>Телефон:</strong> {selectedOrder.phonenumber}</p>
                      <p><strong>Купон:</strong> {selectedOrder.cuponsId ? `#${selectedOrder.cuponsId}` : 'Немає'}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <h5 className="mb-3">Товари замовлення</h5>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Назва</th>
                        <th>Кількість</th>
                        <th>Ціна за одиницю</th>
                        <th>Всього</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(selectedOrder.items) && selectedOrder.items.map(item => (
                        <tr key={item.id}>
                          <td>{item.product.name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price} ₴</td>
                          <td>{item.quantity * item.price} ₴</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3} className="text-end fw-bold">Всього:</td>
                        <td className="fw-bold">{selectedOrder.totalPrice} ₴</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Нове':
      return 'primary';
    case 'В обробці':
      return 'warning';
    case 'Відправлено':
      return 'info';
    case 'Доставлено':
      return 'success';
    case 'Скасовано':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default Orders;
