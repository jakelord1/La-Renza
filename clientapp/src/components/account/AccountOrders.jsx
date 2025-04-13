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

const AccountOrders = () => {
  return (
    <div className="account-content">
      <h2 className="mb-4">My Orders</h2>
      <div className="table-responsive">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>{order.items} items</td>
                <td>${order.total}</td>
                <td>
                  <span className={`order-status ${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary">View Details</button>
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