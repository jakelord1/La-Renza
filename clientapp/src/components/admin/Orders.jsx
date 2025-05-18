import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Alert, Table, Modal, Pagination, Badge } from 'react-bootstrap';
import ordersData from '../../data/orders.json';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setOrders(ordersData.orders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    setLoading(true);
    
    setTimeout(() => {
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
      ));
      
      setAlert({
        show: true,
        type: 'success',
        message: 'Статус замовлення успішно оновлено!'
      });
      
      setLoading(false);
    }, 1000);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
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
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-4 mb-4" style={{maxWidth: 1200, margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі замовлення</h4>
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
                        </td>
                        <td>
                          <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className="text-success">{order.totalPrice} ₴</span>
                        </td>
                        <td>{order.paymentMethod}</td>
                        <td>{order.deliveryMethod}</td>
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
                              onClick={() => handleUpdateStatus(order.id, 'completed')}
                              title="Виконано"
                              className="p-0"
                            >
                              <i className="bi bi-check-lg text-success"></i>
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
                      {selectedOrder.items.map(item => (
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

  function getStatusColor(status) {
    switch(status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }
};

export default Orders;
