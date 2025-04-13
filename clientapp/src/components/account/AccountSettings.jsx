import React from 'react';

const AccountSettings = () => {
  return (
    <div className="account-content">
      <h2 className="mb-4">Account Settings</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Email Notifications</h5>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="orderUpdates" defaultChecked />
              <label className="form-check-label" htmlFor="orderUpdates">
                Order updates and shipping notifications
              </label>
            </div>
          </div>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="promotions" defaultChecked />
              <label className="form-check-label" htmlFor="promotions">
                Promotions and special offers
              </label>
            </div>
          </div>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="newsletter" />
              <label className="form-check-label" htmlFor="newsletter">
                Weekly newsletter
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Change Password</h5>
          <form>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">Current Password</label>
              <input type="password" className="form-control" id="currentPassword" />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input type="password" className="form-control" id="newPassword" />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <input type="password" className="form-control" id="confirmPassword" />
            </div>
            <button type="submit" className="btn btn-purple">Update Password</button>
          </form>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Privacy Settings</h5>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="profileVisibility" defaultChecked />
              <label className="form-check-label" htmlFor="profileVisibility">
                Make my profile visible to other users
              </label>
            </div>
          </div>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="activityTracking" defaultChecked />
              <label className="form-check-label" htmlFor="activityTracking">
                Allow activity tracking for personalized recommendations
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-danger">
        <div className="card-body">
          <h5 className="card-title text-danger">Delete Account</h5>
          <p className="card-text">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="btn btn-outline-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings; 