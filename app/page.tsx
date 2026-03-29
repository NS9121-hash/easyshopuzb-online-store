export default function Home() {
  return (
    <main style={{
      position: 'relative',
      minHeight: '100dvh',
      width: '100dvw',
      overflowX: 'hidden',
      backgroundColor: '#050b14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 0 30px 0',
      boxSizing: 'border-box'
    }}>

      {/* 🖼️ ORQA FON RASMI */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('/IMG_2933.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0
      }}></div>

      {/* 👑 TEPADAGI YOZUVLAR */}
      <header style={{ textAlign: 'center', marginBottom: '30px', zIndex: 10 }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: 0, textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
          EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span>
        </h1>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '4px', marginTop: '5px' }}>
          OSON ONLINE XARID
        </p>
      </header>

      {/* 🌊 O'RTADAGI RAMKA (100% TINIQ VIDEO) */}
      <div style={{
        width: '85%',
        maxWidth: '350px',
        aspectRatio: '4/5',
        borderRadius: '35px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1.5px solid rgba(255,255,255,0.3)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        zIndex: 10
      }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src="/-1880952146411559581.mp4" type="video/mp4" />
        </video>

        <h2 style={{
          position: 'relative', zIndex: 2, color: '#fbbf24', fontSize: '28px', fontWeight: '900', textAlign: 'center',
          textShadow: '2px 2px 15px rgba(0,0,0,1)', padding: '0 20px', margin: 0
        }}>
          ASSALOMU ALEYKUM
        </h2>
        <p style={{
          position: 'relative', zIndex: 2, color: 'white', fontSize: '13px', fontWeight: '700', textAlign: 'center',
          marginTop: '10px', textShadow: '2px 2px 10px rgba(0,0,0,1)', padding: '0 30px', margin: 0
        }}>
          ONLAYN DO'KONIMIZGA XUSH KELIBSIZ!
        </p>
      </div>

      {/* 📱 YANGILANGAN 6 TALIK MENYU (LIQUID GLASS) */}
      <div style={{
        marginTop: '25px',
        width: '95%',
        maxWidth: '420px',
        height: '70px',
        borderRadius: '35px',
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(25px) saturate(160%)',
        WebkitBackdropFilter: 'blur(25px) saturate(160%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderTop: '1.5px solid rgba(255, 255, 255, 0.4)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 5px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
        zIndex: 20
      }}>

        {/* 1. Home (Kirish) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ padding: '6px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '50%' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <span style={{ fontSize: '9px', color: '#fbbf24', fontWeight: '800' }}>Asosiy</span>
        </div>

        {/* 2. Kiyimlar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: 0.8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
          <span style={{ fontSize: '9px', color: 'white', fontWeight: '650' }}>Kiyimlar</span>
        </div>

        {/* 3. Yurak (Sevimlilar) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: 0.8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span style={{ fontSize: '9px', color: 'white', fontWeight: '650' }}>Yurak</span>
        </div>

        {/* 4. Savat */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: 0.8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          <span style={{ fontSize: '9px', color: 'white', fontWeight: '650' }}>Savat</span>
        </div>

        {/* 5. AI */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: 0.8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          <span style={{ fontSize: '9px', color: 'white', fontWeight: '650' }}>AI</span>
        </div>

        {/* 6. Profil */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: 0.8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span style={{ fontSize: '9px', color: 'white', fontWeight: '650' }}>Profil</span>
        </div>

      </div>
    </main>
  );
}
