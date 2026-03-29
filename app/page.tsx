export default function Home() {
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: 'white'
    }}>

      {/* 🖼️ ASOSIY ORQA FON RASMI */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "url('/IMG_2933.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0
      }}></div>

      {/* 🏠 ASOSIY KONTENT */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        paddingTop: '60px'
      }}>

        {/* 👑 TEPADAGI YOZUVLAR */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '0.5px', textShadow: '0 8px 16px rgba(0,0,0,0.3)' }}>
            EASYSHOP_<span style={{ color: '#F5C518' }}>UZB</span>
          </h1>
          <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '4px', marginTop: '6px', color: 'rgba(255,255,255,0.8)', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            OSON ONLINE XARID
          </p>
        </header>

        {/* 🌊 O'RTADAGI RAMKA (Apple Suyuq Shisha Hoshiyasi bilan) */}
        <div style={{
          width: '85%',
          maxWidth: '350px',
          aspectRatio: '4/5',
          borderRadius: '36px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end', /* Yozuvlarni pastga suramiz */
          alignItems: 'center',
          paddingBottom: '30px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4), inset 0 0 0 0.5px rgba(255,255,255,0.2)', /* Suyuq shisha ramka effekti */
          backgroundColor: 'rgba(255,255,255,0.02)'
        }}>
          
          {/* 📹 TINIQ VIDEO (Saturate bilan yorqinlashtirilgan) */}
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              filter: 'saturate(1.2) contrast(1.05)' /* Suvni yanada jonli qilamiz */
            }}
          >
            <source src="/-1880952146411559581.mp4" type="video/mp4" />
          </video>

          {/* Suyuq shisha soyasi (Yozuvlar suvga aralashib ketmasligi uchun pastki qismda mayin qorayish) */}
          <div style={{ 
            position: 'absolute', 
            bottom: 0, left: 0, width: '100%', height: '50%', 
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)', 
            zIndex: 1 
          }}></div>

          {/* RAMKA ICHIDAGI MATN (Toza Apple Typography) */}
          <h2 style={{
            position: 'relative', zIndex: 2, color: '#F5C518', fontSize: '26px', fontWeight: '800', textAlign: 'center',
            letterSpacing: '0.5px', textShadow: '0 4px 15px rgba(0,0,0,0.5)', padding: '0 20px', margin: '0 0 8px 0'
          }}>
            ASSALOMU ALEYKUM
          </h2>
          <p style={{
            position: 'relative', zIndex: 2, color: 'rgba(255,255,255,0.95)', fontSize: '13px', fontWeight: '500', textAlign: 'center',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)', padding: '0 30px', margin: 0, lineHeight: '1.4'
          }}>
            ONLAYN DO'KONIMIZGA XUSH KELIBSIZ!
          </p>
        </div>

        {/* 📱 PASTDAGI MENYU (APPLE LIQUID GLASS / VISION OS STYLE) */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          width: '90%',
          maxWidth: '380px',
          height: '76px',
          borderRadius: '38px',
          /* Suyuq shisha siri: Juda past opacity, o'ta yuqori blur va saturate */
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          /* Apple uslubidagi hoshiya nuri */
          border: '0.5px solid rgba(255, 255, 255, 0.15)',
          borderTop: '1px solid rgba(255, 255, 255, 0.3)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>

          {/* Kiyimlar (Aktiv) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transform: 'scale(1.05)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5C518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(245, 197, 24, 0.4))' }}>
              <path d="M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
            </svg>
            <span style={{ fontSize: '10px', color: '#F5C518', fontWeight: '600', letterSpacing: '0.3px' }}>Kiyimlar</span>
          </div>

          {/* Savat */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: 0.65 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <span style={{ fontSize: '10px', color: 'white', fontWeight: '500', letterSpacing: '0.3px' }}>Savat</span>
          </div>

          {/* AI */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: 0.65 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
            <span style={{ fontSize: '10px', color: 'white', fontWeight: '500', letterSpacing: '0.3px' }}>AI</span>
          </div>

          {/* Profil */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: 0.65 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span style={{ fontSize: '10px', color: 'white', fontWeight: '500', letterSpacing: '0.3px' }}>Profil</span>
          </div>

        </div>
      </div>
    </div>
  );
}
