import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';

const API_URL = 'https://localhost:7071/api/Users';

const AccountAddresses = () => {
 const [addresses, setAddresses] = useState([]);
 const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const [form, setForm] = useState({
    id: null,
    secondName: '',
    fullName: '',
    street: '',
    city: '',
    houseNum: '',
    postIndex: '',
    additionalInfo: '',
    phoneNumber: '',
  });

 const [isEditing, setIsEditing] = useState(false);

 const fetchAddresses = async () => {
    try {
      const res = await fetch(`${API_URL}/accountAddresses`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Не вдалося отримати адреси');
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      setAlert({ show: true, type: 'danger', message: err.message });
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

   const handleOpenModal = () => {
    setIsEditing(false);
    setForm({
      id: null,
      secondName: '',
      fullName: '',
      street: '',
      city: '',
      houseNum: '',
      postIndex: '',
      additionalInfo: '',
      phoneNumber: '',
    });
    setShowModal(true);
  };
  const handleEditClick = (address) => {
    setIsEditing(true);
    setForm({ ...address });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleDelete = async (id) => {
  if (!window.confirm('Ви впевнені, що хочете видалити цю адресу?')) return;

  try {
    const res = await fetch(`${API_URL}/accountAddresses/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Не вдалося видалити адресу');
    }

    setAlert({ show: true, type: 'success', message: 'Адресу видалено успішно' });
    fetchAddresses();
  } catch (err) {
    setAlert({ show: true, type: 'danger', message: err.message });
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `${API_URL}/accountAddresses/${form.id}`
        : `${API_URL}/accountAddresses`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let errorMessage = isEditing ? 'Не вдалося оновити адресу' : 'Не вдалося додати адресу';
       try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
        }
        throw new Error(errorMessage);
      }

      await fetchAddresses();

      setForm({
        id: null,
        secondName: '',
        fullName: '',
        street: '',
        city: '',
        houseNum: '',
        postIndex: '',
        additionalInfo: '',
        phoneNumber: '',
      });

      handleCloseModal();

      setAlert({ show: true, type: 'success',  message: isEditing ? 'Адресу оновлено успішно' : 'Адресу додано успішно',});
    } catch (err) {
      setAlert({ show: true, type: 'danger', message: err.message });
    }
  };
  return (
         <>
                {alert.show && (
                    <Alert variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                        {alert.message}
                    </Alert>
                )}
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
              </div>
              <div className="address-actions d-flex gap-2 mt-auto">
                <button className="btn btn-sm btn-outline-secondary"   onClick={() => handleEditClick(address)}>
                  <i className="bi bi-pencil me-2"></i>Редагувати
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(address.id)} >
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
                  <h5 className="modal-title">{isEditing ? 'Редагувати адресу' : 'Додати адресу'}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Прізвище</label>
                     <input
                        type="text"
                        className="form-control"
                        name="secondName"
                        value={form.secondName}
                        onChange={handleChange}
                        required
                      />
                      </div>
                  <div className="mb-3">
                    <label className="form-label">ПІБ</label>
                   <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                      /> </div>
                  <div className="mb-3">
                    <label className="form-label">Вулиця</label>
                   <input
                        type="text"
                        className="form-control"
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        required
                      />
                       </div>
                  <div className="mb-3">
                    <label className="form-label">Місто</label>
                   <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                      /> </div>
                  <div className="mb-3">
                    <label className="form-label">Будинок</label>
                  <input
                        type="text"
                        className="form-control"
                        name="houseNum"
                        value={form.houseNum}
                        onChange={handleChange}
                        required
                      /> </div>
                  <div className="mb-3">
                    <label className="form-label">Поштовий індекс</label>
                  <input
                        type="text"
                        className="form-control"
                        name="postIndex"
                        value={form.postIndex}
                        onChange={handleChange}
                        required
                      />  </div>
                  <div className="mb-3">
                    <label className="form-label">Додаткова інформація</label>
                  <input
                        type="text"
                        className="form-control"
                        name="additionalInfo"
                        value={form.additionalInfo}
                        onChange={handleChange}
                      />  </div>
                  <div className="mb-3">
                    <label className="form-label">Телефон</label>
                     <input
                        type="text"
                        className="form-control"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        required
                      />   </div>

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Скасувати</button>
                  <button type="submit" className="btn" style={{ background: '#8e24aa', color: '#fff' }}>    {isEditing ? 'Зберегти' : 'Додати'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default AccountAddresses;