// app/page.tsx
'use client';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      margin: '0',
      padding: '20px',
      fontFamily: 'sans-serif',
      background: 'linear-gradient(135deg, #ffffff 0%, #fdf9ec 50%, #f7efd2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box'
    }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '900', 
          color: '#d4af37', 
          margin: '0', 
          letterSpacing: '-1px',
          textTransform: 'uppercase'
        }}>
          EASYSHOP_UZB
        </h1>
        <p style={{ 
          fontSize: '10px', 
          color: '#a0a0a0', 
          letterSpacing: '4px', 
          marginTop: '8px',
          textTransform: 'uppercase'
        }}>
          Oson online xarid
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '360px', display: 'grid', gap: '25px' }}>
        
        {/* JORIY BALANS KARTASI */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '35px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
        }}>
          <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#b8962e', margin: '0 0 15px 0', letterSpacing: '1px' }}>
            JORIY BALANS
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '30px' }}>
            <span style={{ fontSize: '45px', fontWeight: 'bold', color: '#1a1a1a' }}>150 000</span>
            <span style={{ fontSize: '16px', color: '#999' }}>BALL</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', color: '#999', marginBottom: '8px' }}>
            <span>MAQSAD: 500,000</span>
            <span style={{ color: '#d4af37' }}>30%</span>
          </div>
          <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: '30%', height: '100%', background: 'linear-gradient(90deg, #d4af37, #f2e2a4)', borderRadius: '10px' }}></div>
          </div>
        </div>

        {/* AI KIYIB KO'RISH */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '30px',
          padding: '25px',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          cursor: 'pointer'
        }}>
          <div style={{ 
            width: '50px', height: '50px', background: '#d4af37', borderRadius: '15px', 
            margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 20px rgba(212, 175, 55, 0.3)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
          <h3 style={{ margin: '0', fontSize: '18px', color: '#1a1a1a' }}>AI Kiyib Ko'rish</h3>
          <p style={{ fontSize: '11px', color: '#999', marginTop: '5px' }}>Rasmingizni yuklang</p>
        </div>

      </div>

      {/* BOTTOM NAV */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        width: '80%',
        maxWidth: '300px',
        height: '65px',
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        borderRadius: '30px',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 15px 35px rgba(0,0,0,0.05)'
      }}>
        <div style={{ color: '#d4af37', padding: '10px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '15px' }}>🏠</div>
        <div style={{ color: '#ccc' }}>👤</div>
      </div>

    </div>
  );
}
