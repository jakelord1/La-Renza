import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Modal, Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';


const API_URL = 'https://localhost:7071/api/Account/accountOrders';






const statusLabels = { completed: 'Виконано', processing: 'В обробці', cancelled: 'Скасовано' };
const paymentMethods = {
  0: 'Готівка',
  1: 'Карта',
  2: 'Apple Pay'
};

const AccountOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

useEffect(() => {
  fetch(API_URL, {
    credentials: 'include'
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    })
    .then((data) => setOrders(data))
    .catch((err) => console.error('Error fetching orders:', err))
    .finally(() => setLoading(false));
}, []);



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
      {loading ? (
        <div className="text-center"><Spinner animation="border" variant="primary" /></div>
      ) : orders.length === 0 ? (
        <p>Замовлення відсутні.</p>
      ) : (
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
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderName}</td>
                <td>
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                      {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
               <td>{paymentMethods[order.paymentMethod] || 'Невідомо'}</td>
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
      )}
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
            <div><b>Статус:</b> {statusLabels[selectedOrder.status]|| selectedOrder.status}</div>
            <div><b>ID доставки:</b> {selectedOrder.deliveryId}</div>
            <div><b>ID купону:</b> {selectedOrder.cuponsId || '-'}</div>
            <div><b>Створено:</b> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
            <div><b>Завершено:</b> {selectedOrder.completedAt ? new Date(selectedOrder.completedAt).toLocaleString() : '-'}</div>
            <div><b>Оплата:</b> {selectedOrder.paymentMethod  || 'Невідомо'}</div>
            <div><b>Телефон:</b> {selectedOrder.phonenumber}</div>
             {selectedOrder.cupons && (
              <div><b>Купон:</b> {selectedOrder.cupons.name} – {selectedOrder.cupons.description}</div>
            )}
            {selectedOrder.delivery && (
              <div>
                <b>Адреса:</b> {`${selectedOrder.delivery.city}, вул. ${selectedOrder.delivery.street}, буд. ${selectedOrder.delivery.houseNum}`}<br />
                <b>Додаткова інформація:</b> {selectedOrder.delivery.additionalInfo}
              </div>
            )}
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