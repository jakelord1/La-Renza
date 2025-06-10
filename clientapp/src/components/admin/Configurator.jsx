import React, { useEffect, useState } from 'react';
import { Button, Form, Card, Row, Col, InputGroup, Spinner, Alert } from 'react-bootstrap';

const getConfigItem = async (name) => {
  const res = await fetch('/api/Configurator');
  if (!res.ok) return null;
  const data = await res.json();
  return data.find(item => item.name === name) || null;
};

const saveConfigItem = async (item) => {
  const method = item.id ? 'PUT' : 'POST';
  let payload = item;
  if (method === 'POST') {
    const { _id, ...rest } = item;
    payload = rest;
  }
  const res = await fetch('/api/Configurator', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.ok;
};

const Configurator = () => {
    const [carousel, setCarousel] = useState([{ path: '', link: '' }]);
  const [carouselId, setCarouselId] = useState(null);
  const [promoArray, setPromoArray] = useState([{ title: '', link: '', active: false }]);
  const [promoId, setPromoId] = useState(null);
  const [categoryIds, setCategoryIds] = useState([]);
  const [categoryIdsId, setCategoryIdsId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

    useEffect(() => {
    setLoading(true);
    Promise.all([
      getConfigItem('Банери'),
      getConfigItem('PromoBanner'),
      getConfigItem('Категорії')
    ]).then(([banners, promoItem, cats]) => {
      if (banners) {
        setCarousel(Array.isArray(banners.value) ? banners.value.map(x => ({ path: x.path || '', link: x.link || '' })) : [{ path: '', link: '' }]);
        setCarouselId(banners.id);
      }
      if (promoItem) {
        setPromoArray(Array.isArray(promoItem.value) ? promoItem.value.map(item => ({
          ...item,
          active: typeof item.active === 'boolean' ? item.active : false
        })) : [{ title: '', link: '', active: false }]);
        setPromoId(promoItem.id);
      }
      if (cats) {
        setCategoryIds(Array.isArray(cats.value) ? cats.value : []);
        setCategoryIdsId(cats.id);
      }
      setLoading(false);
    }).catch(e => {
      setError('Помилка завантаження: ' + e);
      setLoading(false);
    });
  }, []);

    const handleCarouselChange = (idx, field, value) => {
    setCarousel(carousel.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const addCarouselItem = () => setCarousel([...carousel, { path: '', link: '' }]);
  const removeCarouselItem = (idx) => setCarousel(carousel.filter((_, i) => i !== idx));
  const saveCarousel = async () => {
    setSuccess(null); setError(null);
    const ok = await saveConfigItem({
      id: carouselId,
      name: 'Банери',
      type: 'bannerArray',
      value: carousel
    });
    setSuccess(ok ? 'Банери збережено' : null);
    setError(ok ? null : 'Помилка збереження');
  };

    const handlePromoChange = (idx, field, value) => {
    setPromoArray(promoArray.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
    const setActivePromo = (idx) => {
    setPromoArray(promoArray.map((item, i) => ({ ...item, active: i === idx })));
  };

  const addPromoItem = () => setPromoArray([...promoArray, { title: '', link: '' }]);
  const removePromoItem = (idx) => setPromoArray(promoArray.filter((_, i) => i !== idx));
  const savePromo = async () => {
    setSuccess(null); setError(null);
    const ok = await saveConfigItem({
      id: promoId,
      name: 'PromoBanner',
      type: 'array',
      value: promoArray
    });
    setSuccess(ok ? 'Промо-банери збережено' : null);
    setError(ok ? null : 'Помилка збереження');
  };

    const handleCategoryIdsChange = (str) => {
    // Ожидается строка вида "1,2,3"
    setCategoryIds(str.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)));
  };
  const saveCategoryIds = async () => {
    setSuccess(null); setError(null);
    const ok = await saveConfigItem({
      id: categoryIdsId,
      name: 'Категорії',
      type: 'categoryIds',
      value: categoryIds
    });
    setSuccess(ok ? 'Категорії збережено' : null);
    setError(ok ? null : 'Помилка збереження');
  };

  return (
    <div>
      <h2 className="mb-4">Конфігуратор</h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Категории */}
      <Card className="mb-4">
        <Card.Header>Категорії на головній</Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Список id категорій (через кому)</Form.Label>
            <Form.Control
              type="text"
              value={categoryIds.join(',')}
              onChange={e => handleCategoryIdsChange(e.target.value)}
              placeholder="1,2,3"
            />
          </Form.Group>
          <Button variant="primary" onClick={saveCategoryIds}>
            Зберегти категорії
          </Button>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>Головний банер (карусель)</Card.Header>
        <Card.Body>
          {carousel.map((item, idx) => (
            <Row key={idx} className="align-items-center mb-3">
              <Col md={5}>
                <InputGroup>
                  <InputGroup.Text>Зображення</InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={item.path}
                    onChange={e => handleCarouselChange(idx, 'path', e.target.value)}
                    placeholder="URL зображення"
                  />
                </InputGroup>
              </Col>
              <Col md={5}>
                <InputGroup>
                  <InputGroup.Text>Посилання</InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={item.link}
                    onChange={e => handleCarouselChange(idx, 'link', e.target.value)}
                    placeholder="/catalog, /sale тощо"
                  />
                </InputGroup>
              </Col>
              <Col md={2} className="text-end">
                <Button
                  variant="danger"
                  onClick={() => removeCarouselItem(idx)}
                  disabled={carousel.length <= 1}
                >
                  Видалити
                </Button>
              </Col>
            </Row>
          ))}
          <Button variant="secondary" onClick={addCarouselItem} className="me-2">
            Додати слайд
          </Button>
          <Button variant="primary" onClick={saveCarousel}>
            Зберегти банери
          </Button>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>Промо-банери</Card.Header>
        <Card.Body>
          {promoArray.map((item, idx) => (
            <Row key={idx} className="align-items-center mb-3">
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>Текст</InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={item.title}
                    onChange={e => handlePromoChange(idx, 'title', e.target.value)}
                    placeholder="Текст промо-банеру"
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>Посилання</InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={item.link}
                    onChange={e => handlePromoChange(idx, 'link', e.target.value)}
                    placeholder="/catalog, /sale тощо"
                  />
                </InputGroup>
              </Col>
              <Col md={2} className="text-center">
                <Form.Check
                  type="radio"
                  name="activePromo"
                  checked={!!item.active}
                  onChange={() => setActivePromo(idx)}
                  label="Активний"
                />
              </Col>
              <Col md={2} className="text-end">
                <Button
                  variant="danger"
                  onClick={() => removePromoItem(idx)}
                  disabled={promoArray.length <= 1}
                >
                  Видалити
                </Button>
              </Col>
            </Row>
          ))}
          <Button variant="secondary" onClick={addPromoItem} className="me-2">
            Додати промо
          </Button>
          <Button variant="primary" onClick={savePromo}>
            Зберегти промо-банери
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Configurator;
