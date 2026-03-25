// app/page.tsx
'use client';

export default function Home() {
  // PREMIUM LIQUID GLASS (Suyuq va yaltiroq oyna)
  const liquidGlass = {
    // 1. Shishaning o'ta tiniq asosi
    background: 'rgba(255, 255, 255, 0.12)', 
    
    // 2. Kuchli xiralashtirish (Suyuqlik effekti)
    backdropFilter: 'blur(40px) saturate(200%) brightness(120%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(120%)',
    
    borderRadius: '45px',
    
    // 3. YALTIRASH SIRI (Border emas, box-shadow orqali o'ta yorqin chetlar)
    border: '1px solid rgba(255, 255, 255, 0.5)',
    
    // 4. KO'P QATLAMLI SOYALAR (Qabariqlik beradi)
    boxShadow: `
      0 30px 60px rgba(0, 0, 0, 0.15),                /* Tashqi yumshoq soya */
      inset 0 0 0 1px rgba(255, 255, 255, 0.4),      /* Ichki ingichka nur */
      inset 0 4px 6px rgba(255, 255, 255, 0.6),      /* Tepadan tushayotgan nur */
      inset 0 -2px 10px rgba(255, 255, 255, 0.2)     /* Pastki yumshoq yaltirash */
    `,
    
    padding: '40px',
    position: 'relative' as 'relative',
    overflow: 'hidden' as 'hidden',
    width: '100%',
    boxSizing: 'border-box' as 'border-box'
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      // FON (Shisha yaxshi yaltirashi uchun biroz jiddiyroq rang)
      background: 'linear-gradient(145deg, #f0f2f5 0%, #c9d6ff 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px',
      boxSizing: 'border-box'
    }}>
      
      {/* FONDIAGI RANGIN DOG'LAR (Oyna orqasidan suyuq bo'lib ko'rinadi) */}
      <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '400px', height: '400px', background: 'rgba(212, 175, 55, 0.25)', borderRadius: '50%', filter: 'blur(100px)' }}></div>
      <div style={{ position: 'absolute', bottom: '15%', left: '-5%', width: '300px', height: '300px', background: 'rgba(100, 150, 255, 0.2)', borderRadius: '50%', filter: 'blur(80px)' }}></div>

      {/* HEADER */}
      <header style={{ textAlign: 'center', margin: '60px 0', position: 'relative', zIndex: 10 }}>
        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: '950', 
          color: '#1a1a1a', 
          textTransform: 'uppercase', 
          fontStyle: 'italic', 
          letterSpacing: '-2px',
          margin: 0
        }}>
          EASYSHOP<span style={{ color: '#d4af37' }}>_UZB</span>
        </h1>
        <p style={{ letterSpacing: '8px', color: '#888', fontSize: '10px', fontWeight: '900', marginTop: '5px' }}>OSON ONLINE XARID</p>
      </header>

      <div style={{ width: '100%', maxWidth: '380px', display: 'grid', gap: '35px', position: 'relative', zIndex: 10 }}>
        
        {/* ASOSIY BALANS KARTASI */}
        <div style={liquidGlass}>
          {/* Oyna ustidagi "glare" (quyosh nuri qaytishi) */}
          <div style={{ 
            position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', 
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}></div>
          
          <p style={{ fontSize: '11px', fontWeight: '900', color: '#b8962e', marginBottom: '15px', letterSpacing: '1px' }}>JORIY BALANS</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '40px' }}>
            <span style={{ fontSize: '58px', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-3px' }}>150 000</span>
            <span style={{ fontSize: '18px', color: '#999', fontWeight: 'bold' }}>BALL</span>
          </div>
          
          <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.06)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.4)' }}>
            <div style={{ width: '35%', height: '100%', background: 'linear-gradient(90deg, #d4af37, #f2e2a4)', borderRadius: '20px' }}></div>
          </div>
        </div>

        {/* AI TUGMASI */}
        <div style={{ ...liquidGlass, textAlign: 'center', cursor: 'pointer', padding: '30px' }}>
          <div style={{ 
            width: '65px', height: '65px', 
            background: 'linear-gradient(135deg, #d4af37, #b8962e)', 
            borderRadius: '22px', margin: '0 auto 20px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 15px 30px rgba(212, 175, 55, 0.4), inset 0 5px 10px rgba(255,255,255,0.5)'
          }}>
            <span style={{ fontSize: '30px' }}>📸</span>
          </div>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#1a1a1a' }}>AI Kiyib Ko'rish</h3>
          <p style={{ fontSize: '13px', color: '#777', marginTop: '5px' }}>Kelajakni hozir his qiling</p>
        </div>

      </div>

    </div>
  );
}
