import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Spinner, Alert, Table, Modal, Badge } from 'react-bootstrap';

const API_URL = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Models`;

const Models = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewModel, setViewModel] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    materialInfo: '',
    startDate: '',
    price: 0,
    rate: 0,
    bage: '',
    categoryId: '',
    sizes: [''],
    photos: [{ path: '' }],
    colors: [{ name: '', image: { path: '' } }]
  });
  const [categories, setCategories] = useState([]);
  const [allColors, setAllColors] = useState([]);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Помилка завантаження моделей');
      const data = await res.json();
      setModels(data);
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
    // Завантаження категорій
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Categories`);
        if (!res.ok) throw new Error('Помилка завантаження категорій');
        const data = await res.json();
        setCategories(data);
      } catch (e) {
        setAlert({ show: true, type: 'danger', message: e.message });
      }
    };
    fetchCategories();
    // Завантаження всіх кольорів
    const fetchColors = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Colors`);
        if (!res.ok) throw new Error('Помилка завантаження кольорів');
        const data = await res.json();
        setAllColors(data);
      } catch (e) {
        setAlert({ show: true, type: 'danger', message: e.message });
      }
    };
    fetchColors();
  }, []);

  const handleShowAddModal = () => {
    setFormData({
      name: '',
      description: '',
      materialInfo: '',
      startDate: '',
      price: '',
      rate: '',
      bage: '',
      categoryId: '',
      sizes: [''],
      photos: [],
      colors: []
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      materialInfo: '',
      startDate: '',
      price: 0,
      rate: 0,
      bage: '',
      categoryId: '',
      sizes: [''],
      photos: [],
      colors: [{ name: '', image: { path: '' } }]
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let processedValue = value;
    if (type === 'number') {
      processedValue = value === '' ? '' : parseFloat(value);
      if (isNaN(processedValue)) processedValue = '';
    }
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  // Для зміни розміру за індексом
  const handleSizeChange = (idx, val) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((s, i) => (i === idx ? val : s))
    }));
  };

  // Додати новий розмір
  const handleAddSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, '']
    }));
  };

  // Видалити розмір
  const handleRemoveSize = (idx) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== idx)
    }));
  };

  // ФОТО
  const handlePhotoChange = (idx, val) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map((p, i) => (i === idx ? { ...p, path: val } : p))
    }));
  };
  const handleAddPhoto = () => {
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, { path: '' }]
    }));
  };
  const handleRemovePhoto = (idx) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx)
    }));
  };

  // КОЛЬОРИ (оновлено: вибір із довідника)
  const handleColorToggle = (colorObj) => {
    setFormData(prev => {
      const exists = prev.colors.some(c => c.id === colorObj.id);
      return {
        ...prev,
        colors: exists
          ? prev.colors.filter(c => c.id !== colorObj.id)
          : [...prev.colors, colorObj]
      };
    });
  };

  const prepareModelData = (data) => {
    // Find the category name for the current model
    let categoryName = '';
    if (Array.isArray(categories) && data.categoryId) {
      const catObj = categories.find(c => c.id === Number(data.categoryId));
      if (catObj) categoryName = catObj.name;
    }
    return {
      ...data,
      price: data.price === '' ? 0 : parseFloat(data.price),
      rate: data.rate === '' ? 0 : parseFloat(data.rate),
      categoryId: data.categoryId === '' ? null : Number(data.categoryId),
      sizes: data.sizes.filter(s => s && s.trim() !== ''),
      photos: data.photos.filter(p => p && p.path && p.path.trim() !== ''),
      colors: data.colors && data.colors.length > 0 ? data.colors.map(color => {
        if (color.model) {
          // Ensure category field is present
          return {
            ...color,
            model: {
              ...color.model,
              category: color.model.category || categoryName
            }
          };
        } else {
          return color;
        }
      }) : []
    };
  };

  const handleAddModel = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setAlert({ show: true, type: 'danger', message: 'Введіть назву моделі' });
      return;
    }
    if (!formData.categoryId) {
      setAlert({ show: true, type: 'danger', message: 'Оберіть категорію' });
      return;
    }
    
    if (!formData.photos || formData.photos.filter(p => p.path && p.path.trim() !== '').length === 0) {
      setAlert({ show: true, type: 'danger', message: 'Додайте хоча б одне фото' });
      return;
    }
    // Кольори не обовʼязкові при створенні моделі
    // Якщо користувач додав хоча б один колір, то він має бути з картинкою
    if (formData.colors && formData.colors.length > 0) {
      const validColors = formData.colors.filter(c => c.name && c.name.trim() !== '' && c.image && c.image.path && c.image.path.trim() !== '');
      if (validColors.length !== formData.colors.length) {
        setAlert({ show: true, type: 'danger', message: 'Додайте зображення для кожного вибраного кольору' });
        return;
      }
    }
    setLoading(true);
    try {
      const modelData = prepareModelData(formData);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelData)
      });
      
      if (!res.ok) throw new Error('Не вдалося додати модель');
      
      setAlert({ show: true, type: 'success', message: 'Модель успішно додано!' });
      setShowAddModal(false);
      resetForm();
      fetchModels();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEditModel = (model) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      description: model.description || '',
      materialInfo: model.materialInfo || '',
      startDate: model.startDate ? model.startDate.split('T')[0] : '',
      price: typeof model.price === 'number' ? model.price : 0,
      rate: typeof model.rate === 'number' ? model.rate : 0,
      bage: model.bage || '',
      categoryId: model.categoryId ? String(model.categoryId) : '',
      sizes: model.sizes && model.sizes.length > 0 ? model.sizes : [''],
      photos: model.photos && model.photos.length > 0 ? model.photos.map(photo => ({ id: photo.id, path: photo.path })) : [],
      colors: model.colors && model.colors.length > 0 ? allColors.filter(ac => model.colors.some(mc => mc.id === ac.id)) : []
    });
    setShowEditModal(true);
  };

  const handleUpdateModel = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setAlert({ show: true, type: 'danger', message: 'Введіть назву моделі' });
      return;
    }
    if (!formData.categoryId) {
      setAlert({ show: true, type: 'danger', message: 'Оберіть категорію' });
      return;
    }
    
    if (!formData.photos || formData.photos.filter(p => p.path && p.path.trim() !== '').length === 0) {
      setAlert({ show: true, type: 'danger', message: 'Додайте хоча б одне фото' });
      return;
    }
    // Кольори не обовʼязкові при створенні моделі
    // Якщо користувач додав хоча б один колір, то він має бути з картинкою
    if (formData.colors && formData.colors.length > 0) {
      const validColors = formData.colors.filter(c => c.name && c.name.trim() !== '' && c.image && c.image.path && c.image.path.trim() !== '');
      if (validColors.length !== formData.colors.length) {
        setAlert({ show: true, type: 'danger', message: 'Додайте зображення для кожного вибраного кольору' });
        return;
      }
    }
    setLoading(true);
    try {
      const modelData = {
        ...prepareModelData(formData),
        id: editingModel.id
      };
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelData)
      });
      
      if (!res.ok) throw new Error('Не вдалося оновити модель');
      
      setAlert({ show: true, type: 'success', message: 'Модель успішно оновлено!' });
      setShowEditModal(false);
      setEditingModel(null);
      resetForm();
      fetchModels();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModel = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цю модель?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Не вдалося видалити модель');
      
      setAlert({ show: true, type: 'success', message: 'Модель успішно видалено!' });
      fetchModels();
    } catch (e) {
      setAlert({ show: true, type: 'danger', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  
  const renderModal = (isEdit = false) => (
    <Modal show={isEdit ? showEditModal : showAddModal} onHide={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? 'Редагувати модель' : 'Додати модель'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={isEdit ? handleUpdateModel : handleAddModel}>
          <Form.Group className="mb-3">
            <Form.Label>Назва *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Опис</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Інформація про матеріали</Form.Label>
            <Form.Control
              type="text"
              name="materialInfo"
              value={formData.materialInfo}
              onChange={handleInputChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Дата початку</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Ціна</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price === '' ? '' : formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Рейтинг</Form.Label>
            <Form.Control
              type="number"
              name="rate"
              value={formData.rate === '' ? '' : formData.rate}
              onChange={handleInputChange}
              min="0"
              max="5"
              step="0.1"
              placeholder="0.0"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Бейдж</Form.Label>
            <Form.Control
              type="text"
              name="bage"
              value={formData.bage}
              onChange={handleInputChange}
              placeholder="Наприклад: НОВИНКА, АКЦІЯ"
            />
          </Form.Group>
          {/* Категорія */}
          <Form.Group className="mb-3">
            <Form.Label>Категорія *</Form.Label>
            <Form.Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
            >
              <option value="">Оберіть категорію...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          {/* Розміри */}
          <Form.Group className="mb-3">
            <Form.Label>Розміри</Form.Label>
            {formData.sizes.map((size, idx) => (
              <div key={idx} className="d-flex mb-2 align-items-center gap-2">
                <Form.Control
                  type="text"
                  value={size}
                  onChange={e => handleSizeChange(idx, e.target.value)}
                  placeholder={"Розмір (наприклад: S, M, L, XL)"}
                  style={{ maxWidth: 200 }}
                />
                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveSize(idx)} disabled={formData.sizes.length === 1}>–</Button>
                {idx === formData.sizes.length - 1 && (
                  <Button variant="outline-success" size="sm" onClick={handleAddSize}>+</Button>
                )}
              </div>
            ))}
          </Form.Group>
          {/* Фото */}
          <Form.Group className="mb-3">
            <Form.Label>Фото *</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={async (e) => {
                const files = Array.from(e.target.files);
                if (!files.length) return;
                for (const file of files) {
                  const formDataImg = new FormData();
                  formDataImg.append('file', file);
                  try {
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Images/Upload`, {
                      method: 'POST',
                      body: formDataImg
                    });
                    if (!res.ok) {
                      const text = await res.text();
                      throw new Error(`Не вдалося завантажити фото! Статус: ${res.status}. Відповідь: ${text}`);
                    }
                    // Відповідь порожня, тому шукаємо файл у списку зображень за назвою
                    const filename = file.name;
                    const imagesRes = await fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Images`);
                    if (!imagesRes.ok) {
                      throw new Error('Не вдалося отримати список фото після завантаження');
                    }
                    const images = await imagesRes.json();
                    // Знаходимо останнє фото з такою ж назвою (path закінчується на імʼя файлу)
                    const found = images.reverse().find(img => img.path && img.path.endsWith(filename));
                    if (!found) {
                      // Діагностика: покажемо статус і кількість фото
                      const debug = `Після завантаження фото не знайдено у списку.\nІмʼя файлу: ${filename}\nВсього фото на сервері: ${images.length}`;
                      console.log(debug);
                      setAlert({ show: true, type: 'danger', message: debug });
                      throw new Error('Фото завантажено (upload), але не знайдено у списку зображень (GET /api/Images). Можливі причини: сервер не зберіг файл, або не оновив список. Спробуйте оновити сторінку або перевірити сервер.');
                    }
                    setFormData(prev => ({
                      ...prev,
                      photos: [...prev.photos, { id: found.id, path: found.path }]
                    }));
                  } catch (err) {
                    setAlert({ show: true, type: 'danger', message: err.message });
                  }
                }
                e.target.value = '';
              }}
            />
            <div className="d-flex gap-2 flex-wrap mt-2">
              {formData.photos.filter(p => p.path).map((photo, idx) => (
                <div key={idx} style={{position:'relative'}}>
                  <img src={`/images/${photo.path.replace(/^\\|^\//, '')}`} alt="Фото" style={{maxHeight:60, maxWidth:90, borderRadius:6, border:'1px solid #eee'}} />
                  <Button
                    variant="danger"
                    size="sm"
                    style={{position:'absolute', top:0, right:0, padding:'0 6px', fontSize:14, lineHeight:1}}
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      photos: prev.photos.filter((_, i) => i !== idx)
                    }))}
                  >×</Button>
                </div>
              ))}
            </div>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              type="submit"
              style={{ background: '#6f42c1', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '1.05rem', padding: '8px 22px', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {loading ? (
                <>
                  <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true" />
                  <span className="ms-2">Збереження...</span>
                </>
              ) : (isEdit ? 'Зберегти' : 'Додати')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{fontSize: '2.1rem'}}>Моделі</h2>
      
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({...alert, show: false})} dismissible>
          {alert.message}
        </Alert>
      )}
      
      <Card className="shadow rounded-4 border-0 bg-white bg-opacity-100 p-4 mb-4" style={{maxWidth: '100%', margin: '0 auto'}}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{fontSize:'1.3rem'}}>Всі моделі</h4>
          <Button
            variant="primary"
            style={{ background: '#6f42c1', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '1.05rem', padding: '8px 22px', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => { resetForm(); setShowAddModal(true); }}
          >
            <i className="bi bi-plus-lg" style={{fontSize:18}}></i> Додати
          </Button>
        </div>
        
        {loading && !models.length ? (
          <div className="text-center py-4">
            <Spinner animation="border" role="status" style={{ color: '#6f42c1' }}>
              <span className="visually-hidden">Завантаження...</span>
            </Spinner>
          </div>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {models.length === 0 ? (
              <div className="text-muted text-center py-5">Моделей ще немає</div>
            ) : (
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Назва</th>
                    <th>Опис</th>
                    <th>Матеріали</th>
                    <th>Дата початку</th>
                    <th>Ціна</th>
                    <th>Рейтинг</th>
                    <th>Бейдж</th>
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map(model => (
                    <tr key={model.id}>
                      <td>{model.id}</td>
                      <td>{model.name}</td>
                      <td style={{maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} 
                          title={model.description}>
                        {model.description || '-'}
                      </td>
                      <td style={{maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                          title={model.materialInfo}>
                        {model.materialInfo || '-'}
                      </td>
                      <td>{model.startDate ? new Date(model.startDate).toLocaleDateString() : '-'}</td>
                      <td>{model.price ? `${model.price} грн` : '-'}</td>
                      <td>
                        {model.rate ? (
                          <div className="d-flex align-items-center">
                            <i className="bi bi-star-fill text-warning me-1"></i>
                            <span>{model.rate.toFixed(1)}</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td>
                        {model.bage ? (
                          <Badge bg="primary">{model.bage}</Badge>
                        ) : '-'}
                      </td>
                      <td>
  <div className="d-flex gap-2">
    <Button
      variant="outline-info"
      size="sm"
      onClick={() => { setViewModel(model); setShowViewModal(true); }}
      title="Детальніше"
    >
      <i className="bi bi-eye"></i>
    </Button>
    <Button
      variant="outline-primary"
      size="sm"
      onClick={() => handleEditModel(model)}
      title="Редагувати"
    >
      <i className="bi bi-pencil"></i>
    </Button>
    <Button
      variant="outline-danger"
      size="sm"
      onClick={() => handleDeleteModel(model.id)}
      title="Видалити"
    >
      <i className="bi bi-trash"></i>
    </Button>
  </div>
</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        )}
      </Card>
      
      
      {renderModal()}
      {renderModal(true)}
      {/* Модальне вікно перегляду повної інформації */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Детальна інформація про модель</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewModel ? (
            <div>
              <div><strong>ID:</strong> {viewModel.id}</div>
              <div><strong>Назва:</strong> {viewModel.name}</div>
              <div><strong>Опис:</strong> {viewModel.description}</div>
              <div><strong>Матеріали:</strong> {viewModel.materialInfo}</div>
              <div><strong>Дата початку:</strong> {viewModel.startDate ? new Date(viewModel.startDate).toLocaleString() : '-'}</div>
              <div><strong>Ціна:</strong> {viewModel.price} грн</div>
              <div><strong>Рейтинг:</strong> {viewModel.rate}</div>
              <div><strong>Бейдж:</strong> {viewModel.bage}</div>
              <div><strong>Категорія:</strong> {categories.find(c => c.id === viewModel.categoryId)?.name || viewModel.categoryId || '-'}</div>
              <div><strong>Фото:</strong>
  <div style={{display:'flex', gap: 10, flexWrap:'wrap'}}>
    {(viewModel.photos && viewModel.photos.length > 0) ? viewModel.photos.map(photo => {
      // Формуємо шлях для відображення /images/{path}, видаляючи зайві слеші
      let cleanPath = photo.path ? photo.path.replace(/^[/\\]+/, '') : '';
      let displayUrl = cleanPath ? `/images/${cleanPath}` : '';
      return (
        <div key={photo.id} style={{border:'1px solid #eee', borderRadius:6, padding:2}}>
          <img src={displayUrl} alt="Фото моделі" style={{maxHeight:60, maxWidth:90, objectFit:'contain'}} />
          <div style={{fontSize:12, color:'#888'}}>{displayUrl}</div>
        </div>
      );
    }) : <span>-</span>}
  </div>
</div>
              <div><strong>Кольори:</strong>
                <div style={{display:'flex', gap: 18, flexWrap:'wrap'}}>
                  {(viewModel.colors && viewModel.colors.length > 0) ? viewModel.colors.map(color => (
                    <div key={color.id} style={{minWidth:110, border:'1px solid #eee', borderRadius:8, padding:6}}>
                      <div><strong>ID:</strong> {color.id}</div>
                      <div><strong>Назва:</strong> {color.name}</div>
                      <div><strong>Зображення:</strong> {color.image ? (() => {
  let cleanColorPath = color.image.path ? color.image.path.replace(/^[/\\]+/, '') : '';
  let colorImgUrl = cleanColorPath ? `/images/${cleanColorPath}` : '';
  return (
    <div>
      <img src={colorImgUrl} alt={color.name} style={{maxHeight:40, maxWidth:80, objectFit:'contain'}} />
      <div style={{fontSize:12, color:'#888'}}>{colorImgUrl}</div>
    </div>
  );
})() : '-'}</div>
                    </div>
                  )) : <span>-</span>}
                </div>
              </div>
              <div><strong>Розміри:</strong> {(viewModel.sizes && viewModel.sizes.length > 0) ? viewModel.sizes.join(', ') : 'немає'}</div>
            </div>
          ) : <div>Немає даних</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Закрити
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Models;
