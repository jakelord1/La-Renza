import React, { useState } from 'react';

const coupons = [
  {
    title: 'Знижка 100 UAH',
    desc: 'Після активації купон діє необмежений строк. Мінімальна сума покупки становить 300 UAH',
    points: 200,
    minSum: 300,
    disabled: true
  },
  {
    title: 'Знижка 200 UAH',
    desc: 'Після активації купон діє необмежений строк. Мінімальна сума покупки становить 500 UAH',
    points: 400,
    minSum: 500,
    disabled: true
  },
  {
    title: 'Знижка 500 UAH',
    desc: 'Після активації купон діє необмежений строк. Мінімальна сума покупки становить 1100 UAH',
    points: 1000,
    minSum: 1100,
    disabled: true
  }
];

function CouponCarousel({ coupons }) {
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
        {coupons.map((coupon, idx) => (
          <div
            key={idx}
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
            <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>{coupon.title}</div>
            <div style={{fontSize:15,color:'#444',marginBottom:16}}>{coupon.desc}</div>
            <button disabled={coupon.disabled} style={{width:'100%',background:'#d6dbe4',color:'#888',fontWeight:600,fontSize:16,border:'none',borderRadius:6,padding:'12px 0',cursor:'not-allowed'}}>
              Активуй за {coupon.points} балів
            </button>
          </div>
        ))}
        {/* Кнопка справа як окремий елемент */}
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
  return (
    <div className="account-content">
      <h2 className="mb-4">Акаунт учасника клубу</h2>
      <div className="d-flex align-items-center mb-3" style={{justifyContent:'space-between'}}>
        <div style={{background:'var(--purple, #7c3aed)',color:'#fff',borderRadius: 24,padding:'8px 32px',fontWeight:700,fontSize:18}}>
          150 балів
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
      <CouponCarousel coupons={coupons} />
      <div className="d-flex justify-content-end mt-4" style={{gap:32}}>
        <a href="#" style={{color:'var(--purple, #7c3aed)',fontWeight:600,textDecoration:'none'}}>ІСТОРІЯ БАЛІВ</a>
        <a href="#" style={{color:'var(--purple, #7c3aed)',fontWeight:600,textDecoration:'none'}}>ПРО La'Renza CLUB</a>
      </div>
    </div>
  );
};

export default AccountClub;
