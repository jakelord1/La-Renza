import React, { useState } from 'react';

const mockAddresses = [
  {
    id: 1,
    secondName: 'Іваненко',
    fullName: 'Іван Іваненко',
    street: 'Вулиця Шевченка',
    city: 'Київ',
    houseNum: '10А',
    postIndex: '01001',
    additionalInfo: 'Квартира 12',
    phoneNumber: '+380991234567',
    user: 'ivan@domain.com',
  },
  {
    id: 2,
    secondName: 'Петренко',
    fullName: 'Петро Петренко',
    street: 'Вулиця Січових Стрільців',
    city: 'Львів',
    houseNum: '22',
    postIndex: '79000',
    additionalInfo: '',
    phoneNumber: '+380981234567',
    user: 'petro@domain.com',
  }
];

const AccountAddresses = () => {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    secondName: '',
    fullName: '',
    street: '',
    city: '',
    houseNum: '',
    postIndex: '',
    additionalInfo: '',
    phoneNumber: '',
    user: '',
  });

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAddresses([
      ...addresses,
      { ...form, id: Date.now() },
    ]);
    setForm({
      secondName: '',
      fullName: '',
      street: '',
      city: '',
      houseNum: '',
      postIndex: '',
      additionalInfo: '',
      phoneNumber: '',
      user: '',
    });
    handleCloseModal();
  };

  return (
    <div className="account-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Адреси доставки</h2>
        <button
          className="btn"
          style={{ background: '#6C27B6', color: '#fff', fontWeight: 600 }}
          onClick={handleOpenModal}
        >
          <i className="bi bi-plus-lg me-2"></i>Додати нову адресу
        </button>
      </div>
      <div className="row">
        {addresses.map((address) => (
          <div key={address.id} className="col-md-6 mb-4">
            <div className="address-card p-4 shadow rounded position-relative d-flex flex-column justify-content-between" style={{ background: '#fff', borderLeft: `6px solid #6C27B6`, minHeight: 260, height: 260 }}>
              <div>
                <h5 className="mb-2" style={{ color: '#6C27B6', fontWeight: 700, wordBreak: 'break-word' }}>{address.secondName} {address.fullName}</h5>
                <div className="mb-1">{address.street} {address.houseNum}, {address.city}, {address.postIndex}</div>
                {address.additionalInfo && <div className="mb-1"><span className="fw-bold">Додаткова інформація:</span> {address.additionalInfo}</div>}
                <div className="mb-1"><span className="fw-bold">Телефон:</span> {address.phoneNumber}</div>
                <div className="mb-2"><span className="fw-bold">Користувач:</span> {address.user}</div>
              </div>
              <div className="address-actions d-flex gap-2 mt-auto">
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-pencil me-2"></i>Редагувати
                </button>
                <button className="btn btn-sm btn-outline-danger">
                  <i className="bi bi-trash me-2"></i>Видалити
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal show fade" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Додати адресу</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Прізвище</label>
                    <input type="text" className="form-control" name="secondName" value={form.secondName} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ПІБ</label>
                    <input type="text" className="form-control" name="fullName" value={form.fullName} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Вулиця</label>
                    <input type="text" className="form-control" name="street" value={form.street} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Місто</label>
                    <input type="text" className="form-control" name="city" value={form.city} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Будинок</label>
                    <input type="text" className="form-control" name="houseNum" value={form.houseNum} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Поштовий індекс</label>
                    <input type="text" className="form-control" name="postIndex" value={form.postIndex} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Додаткова інформація</label>
                    <input type="text" className="form-control" name="additionalInfo" value={form.additionalInfo} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Телефон</label>
                    <input type="text" className="form-control" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Користувач</label>
                    <input type="text" className="form-control" name="user" value={form.user} onChange={handleChange} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Скасувати</button>
                  <button type="submit" className="btn" style={{ background: '#8e24aa', color: '#fff' }}>Додати</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountAddresses;