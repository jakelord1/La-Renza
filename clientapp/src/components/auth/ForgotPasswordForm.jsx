import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setError('Email обязателен');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Неверный формат email');
      return;
    }

    // TODO: Implement password reset logic
    console.log('Password reset requested for:', email);
    setSuccess(true);
    setError('');
  };

  if (success) {
    return (
      <div style={{ backgroundColor: '#343a40', color: '#fff', minHeight: 'calc(100vh - 76px)', marginTop: '-1px' }}>
        <div className="container py-5">
          <h1 className="text-center mb-5">Проверьте почту</h1>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="bg-dark p-4 rounded text-center">
                <p className="mb-4">
                  Инструкции по восстановлению пароля были отправлены на ваш email.
                </p>
                <Link to="/login" className="btn btn-primary">Вернуться к входу</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#343a40', color: '#fff', minHeight: 'calc(100vh - 76px)', marginTop: '-1px' }}>
      <div className="container py-5">
        <h1 className="text-center mb-5">Восстановление пароля</h1>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <form onSubmit={handleSubmit} className="bg-dark p-4 rounded">
              <div className="mb-4">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Отправить инструкции
              </button>
              <div className="text-center">
                <Link to="/login" className="text-primary">Вернуться к входу</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm; 