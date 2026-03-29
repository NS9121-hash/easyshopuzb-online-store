export default function Home() {
  return (
    <main style={{
      position: 'relative',
      minHeight: '100dvh',
      width: '100dvw',
      overflow: 'hidden',
      backgroundColor: '#050b14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>

      {/* 🖼️ ORQA FON RASMI */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('/IMG_2933.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0
      }}></div>

      {/* 🏠 KONTENT */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        width: '100%', height: '100dvh', paddingTop: '60px'
      }}>

        {/* 👑 LOGOTIP */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: 0, textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
            EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span>
          </h1>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '4px', marginTop: '5px' }}>
            OSON ONLINE XARID
          </p>
        </header>

        {/* 🌊 O'RTADAGI RAMKA (FAQAT TINIQ VIDEO) */}
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
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}>
          {/* 📹 VIDEO: 100% TABIIY VA TINIQ HOLATDA */}
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0
            }}
          >
            <source src="/-1880952146411559581.mp4" type="video/mp4" />
          </video>

          {/* MATN: Yozuvlar o'zgarishsiz, o'qilishi uchun orqasidagi soya kuchli qoladi */}
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

      </div>
    </main>
  );
}
