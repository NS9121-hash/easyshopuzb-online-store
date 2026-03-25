// app/page.tsx
'use client';

export default function Home() {
  // PREMIUM LIQUID GLASS (Suyuq shisha) uchun uslublar
  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.12)', // Juda shaffof
    backdropFilter: 'blur(35px) saturate(200%) brightness(105%)', // Orqa fonni suyuq qilish
    WebkitBackdropFilter: 'blur(35px) saturate(200%) brightness(105%)',
    borderRadius: '45px',
    border: '1px solid rgba(255, 255, 255, 0.4)', // Shisha chetidagi nur
    boxShadow: `
      0 15px 40px rgba(0, 0, 0, 0.1), 
      inset 0 0 20px rgba(255, 255, 255, 0.2),
      inset 0 2px 2px rgba(255, 255, 255, 0.4)
    `, // Qabariqlik beruvchi soyalar
    padding: '35px',
    position: 'relative' as 'relative',
    overflow: 'hidden' as 'hidden',
    width: '100%',
    boxSizing: 'border-box' as 'border-box'
  };

  return (
    <main style={{
      minHeight: '100vh',
      width: '100%',
      margin: '0',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      // Fonni biroz to'qroq qilsak, shisha yaxshi ko'rinadi
      background: 'linear-gradient(135deg, #ffffff 0%, #f7efd2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box'
    }}>
      
      {/* FONDIAGI RANGIN DOG'LAR */}
      <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '400px', height: '400px', background: 'rgba(212, 175, 55, 0.15)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '300px', height: '300px', background: 'rgba(212, 175, 55, 0.08)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }}></div>

      {/* HEADER */}
      <header style={{ textAlign: 'center', marginTop: '50px', marginBottom: '45px', position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '38px', fontWeight: '900', color: '#d4af37', margin: '0', letterSpacing: '-1.5px', textTransform: 'uppercase', fontStyle: 'italic' }}>
          EASYSHOP_UZB
        </h1>
        <p style={{ fontSize: '11px', color: '#b0b0b0', letterSpacing: '5px', marginTop: '10px', textTransform: 'uppercase', fontWeight: '600' }}>
          Oson online xarid
        </p>
      </header>

      <div style={{ width: '100%', maxWidth: '370px', display: 'grid', gap: '30px', position: 'relative', zIndex: 10 }}>
        
        {/* JORIY BALANS KARTASI */}
        <div style={glassStyle}>
          {/* Shisha yaltirashi uchun nurli qatlam */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)' }}></div>
          
          <p style={{ fontSize: '10px', fontWeight: '800', color: '#b8962e', margin: '0 0 15px 0', letterSpacing: '1.5px', opacity: 0.8 }}>JORIY BALANS</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '35px' }}>
            <span style={{ fontSize: '52px', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-2px' }}>150 000</span>
            <span style={{ fontSize: '18px', color: '#999', fontWeight: '300' }}>BALL</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#a0a0a0', marginBottom: '10px' }}>
            <span>MAQSAD: 500,000</span>
            <span style={{ color: '#d4af37' }}>30%</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.06)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.3)' }}>
            <div style={{ width: '30%', height: '100%', background: 'linear-gradient(90deg, #d4af37, #f2e2a4)', borderRadius: '20px', boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)' }}></div>
          </div>
        </div>

        {/* AI KIYIB KO'RISH TUGMASI */}
        <div style={{ ...glassStyle, textAlign: 'center', cursor: 'pointer' }}>
          <div style={{ 
            width: '55px', height: '55px', background: 'linear-gradient(135deg, #d4af37, #b8962e)', borderRadius: '18px', 
            margin: '0 auto 18px auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 12px 25px rgba(212, 175, 55, 0.35)'
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
          <h3 style={{ margin: '0', fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>AI Kiyib Ko'rish</h3>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>Rasmingizni yuklang</p>
        </div>

      </div>

      {/* BOTTOM NAV */}
      <nav style={{
        position: 'fixed',
        bottom: '35px',
        width: '85%',
        maxWidth: '320px',
        height: '70px',
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(30px) saturate(150%)',
        WebkitBackdropFilter: 'blur(30px) saturate(150%)',
        borderRadius: '35px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 20px 45px rgba(0,0,0,0.08)',
        zIndex: 100
      }}>
        <div style={{ fontSize: '24px', color: '#d4af37', padding: '12px', background: 'rgba(212, 175, 55, 0.12)', borderRadius: '20px' }}>🏠</div>
        <div style={{ fontSize: '24px', opacity: 0.2 }}>👤</div>
      </nav>

    </main>
  );
}
