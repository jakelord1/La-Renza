import React from 'react';

const AccountProfile = () => {
  return (
    <div className="account-content">
      <h2 className="mb-4">Profile Information</h2>
      <div className="card">
        <div className="card-body">
          <form>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input type="text" className="form-control" id="firstName" />
              </div>
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="lastName" />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input type="tel" className="form-control" id="phone" />
            </div>
            <button type="submit" className="btn btn-purple">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile; 