import React from 'react';

const mockAddresses = [
  {
    id: 1,
    name: 'Home',
    isDefault: true,
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States'
  },
  {
    id: 2,
    name: 'Office',
    isDefault: false,
    street: '456 Business Ave',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    country: 'United States'
  }
];

const AccountAddresses = () => {
  return (
    <div className="account-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Addresses</h2>
        <button className="btn btn-purple">
          <i className="bi bi-plus-lg me-2"></i>Add New Address
        </button>
      </div>
      
      <div className="row">
        {mockAddresses.map((address) => (
          <div key={address.id} className="col-md-6 mb-4">
            <div className="address-card">
              {address.isDefault && (
                <span className="badge bg-primary">Default</span>
              )}
              <h5>{address.name}</h5>
              <p className="mb-1">{address.street}</p>
              <p className="mb-1">
                {address.city}, {address.state} {address.zip}
              </p>
              <p className="mb-3">{address.country}</p>
              <div className="address-actions">
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-pencil me-2"></i>Edit
                </button>
                {!address.isDefault && (
                  <>
                    <button className="btn btn-sm btn-outline-secondary">
                      Set as Default
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="bi bi-trash me-2"></i>Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountAddresses; 