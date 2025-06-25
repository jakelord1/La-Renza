import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Form, Image, Alert } from 'react-bootstrap';

const EditModelColorsModal = ({ show, onHide, allColors, modelColors, onSave, loading }) => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    setSelectedColors(modelColors ? modelColors.map(c => c.id) : []);
  }, [modelColors, show]);

  const handleToggleColor = (colorId) => {
    setSelectedColors(prev =>
      prev.includes(colorId)
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId]
    );
  };

  const handleSave = () => {
    if (!selectedColors.length) {
      setAlert({ show: true, type: 'danger', message: 'Оберіть хоча б один колір для моделі!' });
      return;
    }
    const selectedColorObjs = allColors.filter(c => selectedColors.includes(c.id));
    onSave(selectedColorObjs);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Редагування кольорів моделі</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert.show && (
          <Alert variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>
            {alert.message}
          </Alert>
        )}
        <div className="mb-3">Оберіть кольори, які будуть доступні для цієї моделі. Нові кольори створити тут не можна.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          {allColors.length === 0 && (
            <div className="text-muted">Немає доступних кольорів</div>
          )}
          {allColors.map(color => {
            let cleanPath = color.image && color.image.path ? color.image.path.replace(/^[/\\]+/, '') : '';
            let imgUrl = cleanPath ? `/images/${cleanPath}` : '';
            return (
              <div key={color.id} style={{ minWidth: 120, border: '1px solid #eee', borderRadius: 8, padding: 8, background: selectedColors.includes(color.id) ? '#f3eaff' : '#fff', cursor: 'pointer', boxShadow: selectedColors.includes(color.id) ? '0 0 0 2px #6f42c1' : 'none' }} onClick={() => handleToggleColor(color.id)}>
                <Form.Check
                  type="checkbox"
                  checked={selectedColors.includes(color.id)}
                  onChange={() => handleToggleColor(color.id)}
                  label={<span><b>{color.name}</b></span>}
                  id={`color-check-${color.id}`}
                />
                <div style={{ marginTop: 6, textAlign: 'center' }}>
                  {imgUrl ? (
                    <Image src={imgUrl} alt={color.name} style={{ maxHeight: 40, maxWidth: 70, objectFit: 'contain', borderRadius: 4 }} />
                  ) : (
                    <span className="text-muted">(без зображення)</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>ID: {color.id}</div>
              </div>
            );
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Скасувати
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading} style={{ background: '#6f42c1', border: 'none', fontWeight: 600 }}>
          {loading ? <Spinner size="sm" /> : 'Зберегти'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModelColorsModal;
