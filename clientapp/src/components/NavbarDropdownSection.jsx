import React from 'react';
import data from '../data/dropdownSectionsData.json';

const NavbarDropdownSection = ({ section, activeSub }) => {
  const category = data[section] || data['all'];
  const subcategories = category.subcategories || [];
  const activeSections = subcategories[activeSub]?.sections || [];

  return (
    <div style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 38 }}>
      {activeSections.map((section, idx) => (
        <div key={idx} style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 18 }}>{section.title}</div>
          <div style={{ display: 'flex', gap: 32 }}>
            {section.items.map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', background: item.gray ? '#f2f2f2' : '#f8f8f8',
                  margin: '0 auto 12px auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: item.gray ? '1px solid #e0e0e0' : 'none', overflow: 'hidden',
                }}>
                  {item.img
                    ? <img src={item.img} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 28, color: '#bbb' }}>···</span>
                  }
                </div>
                <div style={{ fontSize: 15 }}>{item.label}</div>
                {item.tag && (
                  <span style={{ fontSize: 12, color: item.tag === 'NEW' ? '#3498db' : '#e67e22', marginLeft: 4 }}>{item.tag}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NavbarDropdownSection;
