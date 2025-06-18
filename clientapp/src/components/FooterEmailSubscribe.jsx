import React, { useState } from 'react';
import './FooterEmailSubscribe.css';

const FooterEmailSubscribe = () => {
  const [email, setEmail] = useState('');
  const [checked, setChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!checked) {
      setError('Підтвердіть згоду з політикою конфіденційності');
      return;
    }
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError('Введіть коректний email');
      return;
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setEmail('');
    setChecked(false);
  };

  return (
    <section className="footer-subscribe-section py-3 mb-2 w-100" style={{background:'transparent'}}>
      <div className="container d-flex justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 px-0">
          <div className="bg-white p-4 p-md-5 mb-2 border border-light position-relative" style={{zIndex:2}}>
            <div className="text-center mb-3">
              <h3 className="fw-bold mb-2" style={{fontSize:'1.25rem', color:'var(--purple)'}}>Підпишись на розсилку La'renza</h3>
              <div className="small text-secondary mb-2">
                Отримуй спецпропозиції, секретні акції та персональні промокоди першими!
              </div>
            </div>
            <form className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-2" onSubmit={handleSubmit}>
              <div className="input-group flex-grow-1">
                <span className="input-group-text bg-white border-end-0"><i className="bi bi-envelope" /></span>
                <input
                  type="email"
                  className="form-control border-start-0"
                  placeholder="Ваша пошта"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{minWidth:180}}
                />
              </div>
              <button type="submit" className="btn-purple d-flex justify-content-center align-items-center fw-semibold" style={{height:40, paddingLeft: '16px', paddingRight: '16px'}}>Підписатися</button>
            </form>
            <div className="d-flex align-items-center justify-content-center gap-2 mt-2 mb-0">
              <input type="checkbox" id="footer-privacy" checked={checked} onChange={e => setChecked(e.target.checked)} style={{accentColor: checked ? 'var(--purple)' : '#fff', width:18, height:18, border:'2px solid #ccc', background:'#fff'}} />
              <label htmlFor="footer-privacy" className="small mb-0">
                Я ознайомлений(а) і погоджуюсь з <a href="#" className="text-decoration-underline">Політикою конфіденційності</a>
              </label>
            </div>
            {error && <div className="text-danger text-center small mt-1">{error}</div>}
            {submitted && (
              <div className="modal fade show" tabIndex="-1" style={{display:'block', background:'rgba(0,0,0,0.2)'}}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content" style={{borderRadius: '16px'}}>
                    <div className="modal-body text-center py-4">
                      <div className="fw-bold mb-2" style={{fontSize:'1.2rem', color:'#6f42c1'}}>Дякуємо! Ви підписані.</div>
                      <div className="d-flex justify-content-center">
                        <button type="button" className="btn-purple d-flex justify-content-center align-items-center fw-semibold mt-2 px-4" style={{height:40, paddingLeft: '16px', paddingRight: '16px'}} onClick={() => setSubmitted(false)}>OK</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterEmailSubscribe;
