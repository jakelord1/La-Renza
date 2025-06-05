import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const mockOrders = [
  {
    id: '#12345',
    status: 'completed',
    deliveryId: 'DEL-001',
    cuponsId: 'CUP-123',
    orderName: 'Замовлення №12345',
    createdAt: '2024-03-15T10:00:00',
    completedAt: '2024-03-16T13:00:00',
    paymentMethod: 'Карта',
    phonenumber: '+380991112233',
  },
  {
    id: '#12346',
    status: 'processing',
    deliveryId: 'DEL-002',
    cuponsId: '',
    orderName: 'Замовлення №12346',
    createdAt: '2024-03-10T15:30:00',
    completedAt: '',
    paymentMethod: 'Готівка',
    phonenumber: '+380992223344',
  },
  {
    id: '#12347',
    status: 'cancelled',
    deliveryId: 'DEL-003',
    cuponsId: 'CUP-999',
    orderName: 'Замовлення №12347',
    createdAt: '2024-03-05T09:15:00',
    completedAt: '',
    paymentMethod: 'Apple Pay',
    phonenumber: '+380993334455',
  }
];

const statusLabels = { completed: 'Виконано', processing: 'В обробці', cancelled: 'Скасовано' };

const AccountOrders = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="account-content">
      <h2 className="mb-4">Мої замовлення</h2>
      <div className="table-responsive">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Назва</th>
              <th>Статус</th>
              <th>Створено</th>
              <th>Оплата</th>
              <th>Телефон</th>
              <th>Дія</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderName}</td>
                <td>
                  <span className={`order-status ${order.status}`}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.phonenumber}</td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDetails(order)}>
                    Деталі
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrder && (
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          centered
          size="md"
          backdrop="static"
          contentClassName="shadow rounded"
        >
          <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <Modal.Title as="h4" style={{ fontWeight: 700 }}>Деталі замовлення</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ fontSize: 15 }}>
            <div><b>Назва:</b> {selectedOrder.orderName}</div>
            <div><b>Статус:</b> {statusLabels[selectedOrder.status]}</div>
            <div><b>ID доставки:</b> {selectedOrder.deliveryId}</div>
            <div><b>ID купону:</b> {selectedOrder.cuponsId || '-'}</div>
            <div><b>Створено:</b> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
            <div><b>Завершено:</b> {selectedOrder.completedAt ? new Date(selectedOrder.completedAt).toLocaleString() : '-'}</div>
            <div><b>Оплата:</b> {selectedOrder.paymentMethod}</div>
            <div><b>Телефон:</b> {selectedOrder.phonenumber}</div>
          </Modal.Body>
          <Modal.Footer style={{ borderTop: 'none', paddingTop: 0 }}>
            <Button 
              style={{ minWidth: 110, fontWeight: 600, background: '#6C27B6', border: 'none', color: '#fff' }}
              onClick={handleCloseModal}
            >
              Закрити
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AccountOrders;