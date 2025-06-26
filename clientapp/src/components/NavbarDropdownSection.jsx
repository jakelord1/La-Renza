import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavbarDropdownSection = ({ section, activeSub, menuSections, allCategories }) => {
  const navigate = useNavigate();
  const menuSection = menuSections.find(sec => (sec.navbarName || '').toLowerCase() === section) || menuSections[0];
  const sideTabs = menuSection?.sideTabs || [];
  const activeTab = sideTabs[activeSub] || sideTabs[0];
  const groups = activeTab?.groups || [];

  return (
    <div style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 38 }}>
      {groups.map((group, idx) => (
        <div key={idx} style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 18 }}>{group.groupName || 'Група'}</div>
          <div style={{ display: 'flex', gap: 32 }}>
            {group.categories.map(catId => {
              const cat = allCategories.find(c => String(c.id) === String(catId) || String(c._id) === String(catId));
              return (
                <div key={catId} style={{ textAlign: 'center', cursor: cat ? 'pointer' : 'default' }}
                  onClick={() => cat && navigate(`/catalog/category/${cat.id}`)}
                  tabIndex={cat ? 0 : -1}
                  role="button"
                >
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', background: '#f8f8f8',
                    margin: '0 auto 12px auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', overflow: 'hidden',
                  }}>
                    {cat && cat.image && cat.image.path
                      ? <img src={`/images/${cat.image.path}`} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 28, color: '#bbb' }}>···</span>
                    }
                  </div>
                  <div style={{ fontSize: 15 }}>{cat ? cat.name : 'Категорія'}</div>
                  {cat && cat.tag && (
                    <span style={{ fontSize: 12, color: cat.tag === 'NEW' ? '#3498db' : '#e67e22', marginLeft: 4 }}>{cat.tag}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NavbarDropdownSection;
