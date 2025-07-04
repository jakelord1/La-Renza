import React, { useEffect, useState } from 'react';
const API_URL = 'https://localhost:7071/api/Account';
const API_URL2 = 'https://localhost:7071/api/Coupons';


function CouponCarousel({ userCoupons, allCoupons, points ,onActivateCoupon }) {
  const [hovered, setHovered] = useState(false);
  const scrollRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handle = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    };
    el.addEventListener('scroll', handle);
    handle();
    return () => el.removeEventListener('scroll', handle);
  }, []);

  const scrollBy = (offset) => {
    scrollRef.current && scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };



  const userCouponIds = new Set(userCoupons.map(c => c.id));


  return (
    <div
      className="coupon-carousel-wrapper"
      style={{position:'relative',margin:'0 0 32px 0',display:'flex',alignItems:'center'}}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
    >
      <button
        className={`carousel-arrow-btn left${hovered ? ' show' : ''}`}
        onClick={() => scrollBy(-320)}
        aria-label="Попередній купон"
        style={{
          position:'absolute',
          left:-24,
          zIndex:2,
          opacity: hovered && canScrollLeft ? 1 : 0,
          pointerEvents: hovered && canScrollLeft ? 'auto' : 'none',
          transition:'opacity 0.2s',
          background:'rgba(255,255,255,0.9)',
          border:'1.5px solid #bdbdbd',
          borderRadius:'50%',
          width:48,
          height:48,
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          boxShadow:'0 2px 8px rgba(124,58,237,0.07)',
          cursor:canScrollLeft?'pointer':'default',
        }}
        disabled={!canScrollLeft}
      >
        <i className="bi bi-chevron-left" style={{fontSize:28,color: hovered ? 'var(--purple,#7c3aed)' : '#222',fontWeight:700}}></i>
      </button>
      <div
        ref={scrollRef}
        style={{display:'flex',overflowX:'auto',scrollSnapType:'x mandatory',gap:24,paddingBottom:8,scrollbarWidth:'none',msOverflowStyle:'none'}}
        className="coupon-carousel-scroll"
      >
{allCoupons.map(coupon => {
   const isActivated = userCouponIds.has(coupon.id);
   return (
            <div key={coupon.id}
              style={{
                minWidth:280,
                maxWidth:320,
                background:'#f3eafe',
                borderRadius:12,
                padding:24,
                scrollSnapAlign:'start',
                flex:'0 0 320px',
                marginBottom:0,
                display:'flex',
                flexDirection:'column',
                alignItems:'stretch',
                justifyContent:'space-between',
                boxShadow:'0 2px 8px rgba(124,58,237,0.07)'
              }}
            >
              <div style={{fontWeight:700, fontSize:18, marginBottom:8}}>{coupon.name}</div>
              <div style={{fontSize:15, color:'#444', marginBottom:16}}>{coupon.description}</div>

              {isActivated ? (
                <button
                  disabled
                  style={{
                    width: '100%',
                    background: '#28a745',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 16,
                    border: 'none',
                    borderRadius: 6,
                    padding: '12px 0',
                    cursor: 'default',
                  }}
                >
                  Активовано
                </button>
              ) : (
             <button
  onClick={() => onActivateCoupon(coupon.id)}
  disabled={coupon.disabled || points < coupon.price}
  title={points < coupon.price ? 'Недостатньо балів' : ''}
  style={{
    width: '100%',
    background: points >= coupon.price ? 'var(--purple, #7c3aed)' : '#d6dbe4',
    color: points >= coupon.price ? '#fff' : '#888',
    fontWeight: 600,
    fontSize: 16,
    border: 'none',
    borderRadius: 6,
    padding: '12px 0',
    cursor: points >= coupon.price ? 'pointer' : 'not-allowed',
  }}
>
  Активуй за {coupon.price} балів
</button>


              )}
            </div>
          );
        })}
        <div
          style={{
            minWidth:280,
            maxWidth:320,
            background:'#fff',
            border:'1px solid #e6e6e6',
            borderRadius:12,
            padding:24,
            scrollSnapAlign:'start',
            flex:'0 0 320px',
            marginBottom:0,
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            fontWeight:600,
            fontSize:18,
            color:'#000',
            cursor:'pointer',
            boxShadow:'0 2px 8px rgba(124,58,237,0.07)'
          }}
        >
          <span style={{marginBottom:12}}>Переглянути всі<br/>доступні купони</span>
          <span style={{fontSize:26,display:'inline-block',color:'var(--purple, #7c3aed)'}}>&rarr;</span>
        </div>
      </div>
      <button
        className={`carousel-arrow-btn right${hovered ? ' show' : ''}`}
        onClick={() => scrollBy(320)}
        aria-label="Наступний купон"
        style={{
          position:'absolute',
          right:-24,
          zIndex:2,
          opacity: hovered && canScrollRight ? 1 : 0,
          pointerEvents: hovered && canScrollRight ? 'auto' : 'none',
          transition:'opacity 0.2s',
          background:'rgba(255,255,255,0.9)',
          border:'1.5px solid #bdbdbd',
          borderRadius:'50%',
          width:48,
          height:48,
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          boxShadow:'0 2px 8px rgba(124,58,237,0.07)',
          cursor:canScrollRight?'pointer':'default',
        }}
        disabled={!canScrollRight}
      >
        <i className="bi bi-chevron-right" style={{fontSize:28,color: hovered ? 'var(--purple,#7c3aed)' : '#222',fontWeight:700}}></i>
      </button>
    </div>
  );
}


const AccountClub = () => {
  // CSS стили для фиолетовых чекбоксов
  const checkboxStyles = `
    <style>
      input[type="checkbox"]:checked {
        background-color: #6f42c1 !important;
        border-color: #6f42c1 !important;
      }
      input[type="checkbox"]:focus {
        border-color: #6f42c1 !important;
        box-shadow: 0 0 0 0.2rem rgba(111, 66, 193, 0.25) !important;
      }
    </style>
  `;

  const [showClubModal, setShowClubModal] = useState(false);
 const [points, setPoints] = useState(null);
  

const [allCoupons, setAllCoupons] = useState([]);
const [userCoupons, setUserCoupons] = useState([]);
const [loadingCoupons, setLoadingCoupons] = useState(false);


  const fetchUserCoupons = async () => {
        setLoadingCoupons(true);
    try {
      const response = await fetch(`${API_URL}/accountCoupons`, { credentials: 'include' });
      if (!response.ok) throw new Error('Помилка при отриманні купонів');
      const data = await response.json();
       console.log('User coupons:', data);
      setUserCoupons(data);
    } catch (err) {
      console.error(err);
      setUserCoupons([]); 
    } finally {
      setLoadingCoupons(false);
    }
  };
  const fetchPoints = async () => {
    try {
      const response = await fetch(`${API_URL}/accountProfile`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Помилка запиту');

      const data = await response.json();
      setPoints(data.laRenzaPoints ?? 0);
    } catch (error) {
      console.error('Помилка при отриманні балів:', error);
      setPoints(0); 
    }
  };

  const fetchAllCoupons = async () => {
    try {
      const response = await fetch(`${API_URL2}`, { credentials: 'include' });
      if (!response.ok) throw new Error('Ошибка при загрузке всех купонов');
      const data = await response.json();
       console.log('All coupons:', data); 
      setAllCoupons(data);
    } catch (error) {
      console.error(error);
      setAllCoupons([]);
    }
  };
  useEffect(() => {
  

  fetchAllCoupons();
  fetchUserCoupons();
   fetchPoints();
}, []);
  



  const handleActivateCoupon = async (couponId) => {
    try {
      const response = await fetch(`${API_URL}/accountCoupons`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponId),
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(`Помилка: ${errData.message || 'Невідома помилка'}`);
        return;
      }

      alert('Купон успішно активований!');
        await fetchUserCoupons();
       await  fetchAllCoupons();
        await fetchPoints();

   
    } catch (error) {
      alert('Помилка мережі: ' + error.message);
    }
  };
  return (
    <div className="account-content">
      <div dangerouslySetInnerHTML={{ __html: checkboxStyles }} />
      <h2 className="mb-4">Акаунт учасника клубу</h2>
      <div className="d-flex align-items-center mb-3" style={{justifyContent:'space-between'}}>
        <div style={{background:'var(--purple, #7c3aed)',color:'#fff',borderRadius: 24,padding:'8px 32px',fontWeight:700,fontSize:18}}>
        <div>
        {points !== null ? `${points} балів` : 'Завантаження...'}
        </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',minWidth:340,gap:10}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
            <span style={{fontSize:15,color:'#444',fontWeight:600,display:'flex',alignItems:'center',gap:6}}>
              На перевірці (30 днів)
              <span style={{fontSize:16,color:'#888'}}><i className="bi bi-info-circle" /></span>
            </span>
            <span style={{fontSize:15,color:'#444',fontWeight:700}}>0 балів</span>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
            <span style={{fontSize:15,color:'#444',fontWeight:600}}>
              Скоро закінчиться термін дії
            </span>
            <span style={{fontSize:15,color:'#444',fontWeight:700}}>0 балів</span>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Купони</h5>
        <a href="#" style={{color:'#222',fontWeight:600,letterSpacing:0.2,display:'flex',alignItems:'center',gap:4,fontSize:16,textDecoration:'none'}}>
          БІЛЬШЕ <span style={{fontSize:18,marginLeft:2}}>&#8250;</span>
        </a>
      </div>
   {loadingCoupons ? (
        <div>Загрузка купонов...</div>
      ) : (
    <CouponCarousel allCoupons={allCoupons} userCoupons={userCoupons} points={points}   onActivateCoupon={handleActivateCoupon} />

      )}

      <div className="d-flex justify-content-end mt-4" style={{gap:32}}>
        {/* <a href="#" style={{color:'var(--purple, #7c3aed)',fontWeight:600,textDecoration:'none'}}>ІСТОРІЯ БАЛІВ</a> */}
        <a href="#" onClick={e => {e.preventDefault(); setShowClubModal(true);}} style={{color:'var(--purple, #7c3aed)',fontWeight:600,textDecoration:'none'}}>ПРО La'Renza CLUB</a>
      </div>

      {showClubModal && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.4)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:18,maxWidth:440,width:'90%',padding:'32px 24px 24px 24px',boxShadow:'0 8px 32px rgba(0,0,0,0.15)',position:'relative'}}>
            <button onClick={()=>setShowClubModal(false)} style={{position:'absolute',top:0,right:7,fontSize:26,background:'none',border:'none',cursor:'pointer',color:'#222',zIndex:2}} aria-label="Закрити">&times;</button>

            <div style={{marginTop:32}}>
              <img src="/images/larenza-club-logo.png" alt="LaRenza Club" style={{maxWidth:200,display:'block',margin:'0 auto 18px auto'}}/>
              <div style={{fontWeight:700,fontSize:20,color:'#7c3aed',marginBottom:12,textAlign:'center'}}>З нами ви завжди виграєте</div>
              <div style={{fontSize:15,color:'#222',marginBottom:18,textAlign:'center'}}>
                LaRenza Club – це програма лояльності, заснована на співпраці. Ми цінуємо різні форми вашої участі і пропонуємо швидкі, конкретні вигоди з першої взаємодії. Участь у програмі дає вам легкий доступ до привабливих переваг, спеціальних пропозицій та акцій тільки для членів клубу.
              </div>
              <div style={{display:'flex',justifyContent:'center',gap:12,marginBottom:12}}>
                <div style={{background:'#f3eafe',borderRadius:20,padding:'8px 18px',fontWeight:600,fontSize:15,color:'#7c3aed'}}>150 балів на старт</div>
                <div style={{background:'#f3eafe',borderRadius:20,padding:'8px 18px',fontWeight:600,fontSize:15,color:'#7c3aed'}}>10 UAH = 1 бал</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountClub;
