import React from 'react';

const mockOrders = [
  {
    id: '#12345',
    date: '2024-03-15',
    total: '89.97',
    status: 'completed',
    items: 3
  },
  {
    id: '#12346',
    date: '2024-03-10',
    total: '129.99',
    status: 'processing',
    items: 2
  },
  {
    id: '#12347',
    date: '2024-03-05',
    total: '45.98',
    status: 'cancelled',
    items: 1
  }
];

const statusLabels = { completed: 'Виконано', processing: 'В обробці', cancelled: 'Скасовано' };

const AccountOrders = () => {
  return (
    <div className="account-content">
      <h2 className="mb-4">Мої замовлення</h2>
      <div className="table-responsive">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Замовлення</th>
              <th>Дата</th>
              <th>Кількість</th>
              <th>Сума</th>
              <th>Статус</th>
              <th>Дія</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>{order.items} шт.</td>
                <td>${order.total}</td>
                <td>
                  <span className={`order-status ${order.status}`}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary">Деталі</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountOrders; 