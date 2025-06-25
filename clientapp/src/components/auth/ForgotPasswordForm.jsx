import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    

    if (!email) {
      setError('Email обязателен');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Неверный формат email');
      return;
    }

    console.log('Password reset requested for:', email);
    setSuccess(true);
    setError('');
  };

  if (success) {
    return (
      <section className="auth-page bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="bg-white rounded-4 p-5 shadow-sm text-center">
                <h1 className="text-center mb-4 text-purple">Перевірте пошту</h1>
                <p className="mb-4">
                  Інструкції для відновлення пароля були надіслані на ваш email.
                </p>
                <Link to="/login" className="btn btn-purple">Повернутися до входу</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="bg-white rounded-4 p-5 shadow-sm">
              <h1 className="text-center mb-4 text-purple">Відновлення пароля</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    id="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    required
                  />
                  {error && <div className="invalid-feedback">{error}</div>}
                </div>
                <button type="submit" className="btn btn-purple w-100 mb-3 text-white">
                  Надіслати інструкції
                </button>
                <div className="text-center">
                  <Link to="/login" className="text-purple">Повернутися до входу</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;