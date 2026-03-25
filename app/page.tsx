// app/page.tsx
'use client';

export default function Home() {
  // ENG KUCHLI 3D LIQUID GLASS (Suyuq oyna) EFFEKTI
  const ultimateGlass = {
    // Shishaning o'ziga yorug'lik tushib turgan gradient (tepadan yorug')
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.05) 100%)',
    
    // Orqa fonni kuchli xiralashtirish
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)', // iPhone'lar uchun juda muhim!
    
    // Oynaning qirralari
    borderRadius: '40px',
    
    // 3D EFFECT SIKRETI: Tepa va chap tomoni yorug', pastki qismi xira chegara
    borderTop: '2px solid rgba(255, 255, 255, 0.8)',
    borderLeft: '2px solid rgba(255, 255, 255, 0.8)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    borderRight: '1px solid rgba(255, 255, 255, 0.2)',
    
    // SOYALAR: Tashqariga qora soya (ajratib ko'rsatadi), ichkariga oq soya (qalinlik beradi)
    boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.15), 
      inset 0 10px 20px rgba(255, 255, 255, 0.5)
    `,
    
    padding: '40px',
    position: 'relative' as 'relative',
    overflow: 'hidden' as 'hidden',
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      // OYNA KORINISHI UCHUN FON TO'QROQ VA MURAKKAB BO'LISHI SHART
      background: 'linear-gradient(135deg, #e0e5ec 0%, #bfcadb 100%)', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px',
      boxSizing: 'border-box'
    }}>
      
      {/* FONDIAGI KATTA RANG-BARANG SHAKLLAR (Aynan shular oyna orqali xiralashib, chiroyli ko'rinadi) */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: '#ffffff', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.6 }}></div>
      <div style={{ position: 'absolute', bottom: '20%', right: '5%', width: '350px', height: '350px', background: '#d4af37', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.4 }}></div>

      <header style={{ textAlign: 'center', margin: '50px 0', position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '40px', fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-2px', textShadow: '0 4px 10px rgba(255,255,255,0.5)' }}>
          EASYSHOP_UZB
        </h1>
        <p style={{ letterSpacing: '6px', color: '#555', fontSize: '11px', fontWeight: '800', marginTop: '5px' }}>
          OSON ONLINE XARID
        </p>
      </header>

      <div style={{ width: '100%', maxWidth: '380px', display: 'grid', gap: '35px', position: 'relative', zIndex: 10 }}>
        
        {/* BALANS KARTASI */}
        <div style={ultimateGlass}>
          <p style={{ fontSize: '12px', fontWeight: '800', color: '#886c12', marginBottom: '15px', letterSpacing: '1px' }}>JORIY BALANS</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '40px' }}>
            <span style={{ fontSize: '55px', fontWeight: '900', color: '#111', letterSpacing: '-2px', textShadow: '0 2px 10px rgba(255,255,255,0.8)' }}>150 000</span>
            <span style={{ fontSize: '18px', color: '#555', fontWeight: '600' }}>BALL</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800', color: '#666', marginBottom: '10px' }}>
            <span>MAQSAD: 500,000</span>
            <span style={{ color: '#886c12' }}>30%</span>
          </div>
          <div style={{ width: '100%', height: '14px', background: 'rgba(0,0,0,0.1)', borderRadius: '20px', overflow: 'hidden', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '30%', height: '100%', background: 'linear-gradient(90deg, #d4af37, #f2e2a4)', borderRadius: '20px', boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }}></div>
          </div>
        </div>

        {/* AI KIYIB KO'RISH TUGMASI */}
        <div style={{ ...ultimateGlass, padding: '30px', textAlign: 'center', cursor: 'pointer' }}>
          <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #d4af37, #b8962e)', borderRadius: '25px', margin: '0 auto 20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 30px rgba(212, 175, 55, 0.4), inset 0 5px 10px rgba(255,255,255,0.4)' }}>
             <span style={{ fontSize: '32px' }}>📸</span>
          </div>
          <h3 style={{ margin: '0', fontSize: '24px', fontWeight: '900', color: '#111' }}>AI Kiyib Ko'rish</h3>
          <p style={{ fontSize: '13px', color: '#555', marginTop: '8px', fontWeight: '600' }}>Rasmingizni yuklang</p>
        </div>

      </div>

    </div>
  );
}
