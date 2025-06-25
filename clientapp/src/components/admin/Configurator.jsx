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
  const [navbar, setNavbar] = useState([
    {
      navbarName: 'ВСІ',
      sideTabs: [
        {
          tabName: 'ВСІ',
          icon: '',
          groups: []
        }
      ]
    }
  ]);
  const [navbarId, setNavbarId] = useState(null);

  const [carousel, setCarousel] = useState([{ path: '', link: '' }]);
  const [carouselId, setCarouselId] = useState(null);
  const [promoArray, setPromoArray] = useState([{ title: '', link: '', active: false }]);
  const [promoId, setPromoId] = useState(null);
  const [categoryIds, setCategoryIds] = useState([]);
  const [categoryIdsId, setCategoryIdsId] = useState(null);
  const [categoryTabsIds, setCategoryTabsIds] = useState([]);
  const [categoryTabsIdsId, setCategoryTabsIdsId] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/Categories')
      .then(res => res.ok ? res.json() : [])
      .then(data => setAllCategories(Array.isArray(data) ? data : []));

    Promise.all([
      getConfigItem('Банери'),
      getConfigItem('PromoBanner'),
      getConfigItem('Категорії'),
      getConfigItem('Категорії для табів'),
      getConfigItem('Розділи меню')
    ]).then(([banners, promoItem, cats, tabsCats, navbarConfig]) => {
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
      if (tabsCats) {
        setCategoryTabsIds(Array.isArray(tabsCats.value) ? tabsCats.value : []);
        setCategoryTabsIdsId(tabsCats.id);
      }
      if (navbarConfig && Array.isArray(navbarConfig.value)) {
        setNavbar(navbarConfig.value);
        setNavbarId(navbarConfig.id);
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
    const bannerPayload = {
      name: 'Банери',
      type: 'bannerArray',
      value: carousel
    };
    if (carouselId) bannerPayload.id = carouselId;
    const ok = await saveConfigItem(bannerPayload);
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
    const promoPayload = {
      name: 'PromoBanner',
      type: 'array',
      value: promoArray
    };
    if (promoId) promoPayload.id = promoId;
    const ok = await saveConfigItem(promoPayload);
    setSuccess(ok ? 'Промо-банери збережено' : null);
    setError(ok ? null : 'Помилка збереження');
  };

  const saveCategoryIds = async () => {
    setSuccess(null); setError(null);
    const payload = {
      name: 'Категорії',
      type: 'categoryIds',
      value: categoryIds
    };
    if (categoryIdsId) payload.id = categoryIdsId;
    const ok = await saveConfigItem(payload);
    setSuccess(ok ? 'Категорії збережено' : null);
    setError(ok ? null : 'Помилка збереження');
  };

  const saveCategoryTabsIds = async () => {
    setSuccess(null); setError(null);
    const payload = {
      name: 'Категорії для табів',
      type: 'categoryTabsIds',
      value: categoryTabsIds
    };
    if (categoryTabsIdsId) payload.id = categoryTabsIdsId;
    const ok = await saveConfigItem(payload);
    setSuccess(ok ? 'Категорії для табів збережено' : null);
    setError(ok ? null : 'Помилка збереження');
  };

  return (
    <div>
      <h2 className="mb-4">Конфігуратор</h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="mb-4">
        <Card.Header>Категорії на головній</Card.Header>
        <Card.Body>
          <Form.Group controlId="mainCategories">
            <Form.Label>Виберіть категорії для головної</Form.Label>
            <div className="mb-3">
              {allCategories.map(cat => (
                <Form.Check
                  key={cat.id}
                  type="checkbox"
                  id={`cat-${cat.id}`}
                  label={cat.name}
                  checked={categoryIds.includes(cat.id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setCategoryIds([...categoryIds, cat.id]);
                    } else {
                      setCategoryIds(categoryIds.filter(id => id !== cat.id));
                    }
                  }}
                  className="mb-1"
                />
              ))}
            </div>
          </Form.Group>

          {categoryIds.length > 0 && (
            <div className="mb-3">
              <Form.Label>Порядок категорій на головній</Form.Label>
              {categoryIds.map((id, idx) => {
                const cat = allCategories.find(c => c.id === id);
                if (!cat) return null;
                return (
                  <div key={id} className="d-flex align-items-center mb-1 gap-2">
                    <span style={{ minWidth: 130 }}>{cat.name}</span>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const newOrder = [...categoryIds];
                        [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
                        setCategoryIds(newOrder);
                      }}
                    >↑</Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      disabled={idx === categoryIds.length - 1}
                      onClick={() => {
                        if (idx === categoryIds.length - 1) return;
                        const newOrder = [...categoryIds];
                        [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
                        setCategoryIds(newOrder);
                      }}
                    >↓</Button>
                  </div>
                );
              })}
            </div>
          )}

          <Button variant="primary" onClick={saveCategoryIds}>
            Зберегти категорії
          </Button>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>Категорії для табів</Card.Header>
        <Card.Body>
          <Form.Group controlId="tabsCategories">
            <Form.Label>Виберіть категорії для вкладок</Form.Label>
            <div className="mb-3">
              {allCategories.map(cat => (
                <Form.Check
                  key={cat.id}
                  type="checkbox"
                  id={`tabcat-${cat.id}`}
                  label={cat.name}
                  checked={categoryTabsIds.includes(cat.id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setCategoryTabsIds([...categoryTabsIds, cat.id]);
                    } else {
                      setCategoryTabsIds(categoryTabsIds.filter(id => id !== cat.id));
                    }
                  }}
                  className="mb-1"
                />
              ))}
            </div>
          </Form.Group>

          {categoryTabsIds.length > 0 && (
            <div className="mb-3">
              <Form.Label>Порядок категорій у вкладках</Form.Label>
              {categoryTabsIds.map((id, idx) => {
                const cat = allCategories.find(c => c.id === id);
                if (!cat) return null;
                return (
                  <div key={id} className="d-flex align-items-center mb-1 gap-2">
                    <span style={{ minWidth: 130 }}>{cat.name}</span>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const newOrder = [...categoryTabsIds];
                        [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
                        setCategoryTabsIds(newOrder);
                      }}
                    >↑</Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      disabled={idx === categoryTabsIds.length - 1}
                      onClick={() => {
                        if (idx === categoryTabsIds.length - 1) return;
                        const newOrder = [...categoryTabsIds];
                        [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
                        setCategoryTabsIds(newOrder);
                      }}
                    >↓</Button>
                  </div>
                );
              })}
            </div>
          )}

          <Button variant="primary" onClick={saveCategoryTabsIds}>
            Зберегти категорії для табів
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
      <Card className="mb-4">
        <Card.Header>Розділи меню (Navbar)</Card.Header>
        <Card.Body>
          <div className="mb-3 text-muted">
            <b>Пояснення:</b> Для кожної секції можна додати кілька вкладок зліва (sideTabs), для кожної вкладки — групи та категорії.
            <ul>
              <li><b>Назва в Navbar</b> — як буде відображатися у верхньому меню</li>
              <li><b>Вкладки зліва</b> — вкладки у випадаючому меню, для кожної можна задати іконку, групи та категорії</li>
              <li><b>Групи у вкладці</b> — підзаголовки та категорії для кожної вкладки</li>
            </ul>
          </div>
          <div>
            {navbar.map((section, sIdx) => (
              <div key={sIdx} className="mb-4 p-2 border rounded bg-light">
                <Row className="align-items-center mb-2">
                  <Col md={4}>
                    <InputGroup className="mb-2">
                      <InputGroup.Text>Назва в Navbar</InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={section.navbarName}
                        onChange={e => {
                          const updated = [...navbar];
                          updated[sIdx].navbarName = e.target.value;
                          setNavbar(updated);
                        }}
                        placeholder="Напр. ЖІНКА"
                      />
                    </InputGroup>
                  </Col>
                  <Col md={8}>
                    <strong>Вкладки зліва (sideTabs)</strong>
                    {section.sideTabs && section.sideTabs.map((tab, tIdx) => (
                      <div key={tIdx} className="mb-3 p-2 border rounded bg-white">
                        <Row>
                          <Col md={5}>
                            <Form.Group>
                              <Form.Label>Назва вкладки (tabName)</Form.Label>
                              <Form.Control
                                type="text"
                                value={tab.tabName}
                                onChange={e => {
                                  const updated = [...navbar];
                                  updated[sIdx].sideTabs[tIdx].tabName = e.target.value;
                                  setNavbar(updated);
                                }}
                                placeholder="Наприклад: Одяг"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={5}>
                            <Form.Group>
                              <Form.Label>Іконка (клас Bootstrap або URL)</Form.Label>
                              <Form.Control
                                type="text"
                                value={tab.icon}
                                onChange={e => {
                                  const updated = [...navbar];
                                  updated[sIdx].sideTabs[tIdx].icon = e.target.value;
                                  setNavbar(updated);
                                }}
                                placeholder="bi bi-bag або https://..."
                              />
                            </Form.Group>
                          </Col>
                          <Col md={2} className="text-end">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                const updated = [...navbar];
                                updated[sIdx].sideTabs.splice(tIdx, 1);
                                setNavbar(updated);
                              }}
                            >Видалити вкладку</Button>
                          </Col>
                        </Row>
                        <div className="mt-2">
                          <strong>Групи (підзаголовки)</strong>
                          {tab.groups && tab.groups.map((group, gIdx) => (
                            <div key={gIdx} className="mb-2 p-2 border rounded bg-light">
                              <Form.Group>
                                <Form.Label>Назва групи (підзаголовок)</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={group.groupName}
                                  onChange={e => {
                                    const updated = [...navbar];
                                    updated[sIdx].sideTabs[tIdx].groups[gIdx].groupName = e.target.value;
                                    setNavbar(updated);
                                  }}
                                  placeholder="Наприклад: Топ категорії"
                                />
                              </Form.Group>
                              <Form.Group className="mt-2">
                                <Form.Label>Категорії</Form.Label>
                                <Form.Select
  multiple
  value={group.categories}
  onChange={e => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    const updated = [...navbar];
    updated[sIdx].sideTabs[tIdx].groups[gIdx].categories = options;
    setNavbar(updated);
  }}
>
  <optgroup label="Глобальні категорії">
    {allCategories.filter(cat => cat.isGlobal).map(cat => (
      <option key={cat.id || cat._id} value={cat.id || cat._id}>
        {cat.name}
      </option>
    ))}
  </optgroup>
  <optgroup label="Підкатегорії">
    {allCategories.filter(cat => !cat.isGlobal).map(cat => {
      const parent = allCategories.find(p => p.id === cat.parentCategoryId);
      return (
        <option key={cat.id || cat._id} value={cat.id || cat._id}>
          {cat.name}{parent ? ` — ${parent.name}` : ''}
        </option>
      );
    })}
  </optgroup>
</Form.Select>
                              </Form.Group>
                              <div className="mt-2">
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => {
                                    const updated = [...navbar];
                                    updated[sIdx].sideTabs[tIdx].groups.splice(gIdx, 1);
                                    setNavbar(updated);
                                  }}
                                >Видалити групу</Button>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="secondary"
                            size="sm"
                            className="me-2"
                            onClick={() => {
                              const updated = [...navbar];
                              updated[sIdx].sideTabs[tIdx].groups.push({ groupName: '', categories: [] });
                              setNavbar(updated);
                            }}
                          >Додати групу</Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const updated = [...navbar];
                        updated[sIdx].sideTabs = updated[sIdx].sideTabs || [];
                        updated[sIdx].sideTabs.push({ tabName: '', icon: '', groups: [] });
                        setNavbar(updated);
                      }}
                    >Додати вкладку</Button>
                  </Col>
                  <Col md={12} className="text-end mt-2">
                    <Button
                      variant="danger"
                      onClick={() => {
                        setNavbar(navbar.filter((_, i) => i !== sIdx));
                      }}
                      disabled={navbar.length <= 1}
                    >Видалити секцію</Button>
                  </Col>
                </Row>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() => setNavbar([...navbar, { navbarName: '', sideTabs: [{ tabName: '', icon: '', groups: [] }] }])}
              className="me-2"
            >Додати секцію</Button>
            <Button
              variant="primary"
              onClick={async () => {
                setSuccess(null); setError(null);
                const payload = {
                  name: 'Розділи меню',
                  type: 'navbar',
                  value: navbar
                };
                if (navbarId) payload.id = navbarId;
                const ok = await saveConfigItem(payload);
                setSuccess(ok ? 'Розділи меню збережено' : null);
                setError(ok ? null : 'Помилка збереження');
              }}
            >Зберегти розділи</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Configurator;
