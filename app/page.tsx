export default function Home() {
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#050b14',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'white'
    }}>
      
      {/* 🖼️ ASOSIY ORQA FON RASMI (YORQIN!) */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "url('/IMG_2933.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0
      }}>
        {/* ❌ Qora parda butunlay olib tashlandi, rasm o'zining tabiiy yorqinligida chiqadi! */}
      </div>

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
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '1px' }}>
            EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span>
          </h1>
          <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '4px', marginTop: '5px', color: '#e2e8f0' }}>
            OSON ONLINE XARID
          </p>
        </header>

        {/* 🌊 O'RTADAGI RAMKA VA ICHIDAGI VIDEO */}
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
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {/* 📹 RAMKA ICHIDAGI VIDEO */}
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              zIndex: 0
            }}
          >
            <source src="/-1880952146411559581.mp4" type="video/mp4" />
          </video>
          
          {/* Yozuvlar o'qilishi uchun videoni biroz qoraytiramiz (faqat video ustida) */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,10,30,0.3)', zIndex: 1 }}></div>

          {/* RAMKA ICHIDAGI MATN */}
          <h2 style={{
            position: 'relative', zIndex: 2, color: '#fbbf24', fontSize: '28px', fontWeight: '800', textAlign: 'center',
            textShadow: '0 4px 10px rgba(0,0,0,0.8)', padding: '0 20px'
          }}>
            ASSALOMU ALEYKUM
          </h2>
          <p style={{
            position: 'relative', zIndex: 2, color: '#ffffff', fontSize: '13px', fontWeight: '600', textAlign: 'center',
            marginTop: '10px', textShadow: '0 2px 5px rgba(0,0,0,0.8)', padding: '0 30px', lineHeight: '1.5'
          }}>
            ONLAYN DO'KONIMIZGA XUSH KELIBSIZ!
          </p>
        </div>

        {/* 📱 PASTDAGI MENYU (Glassmorphism) */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          width: '90%',
          maxWidth: '380px',
          height: '75px',
          borderRadius: '40px',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          
          {/* Kiyimlar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
            </div>
            <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: '700' }}>Kiyimlar</span>
          </div>

          {/* Savat */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ padding: '8px', borderRadius: '50%' }}>
               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>Savat</span>
          </div>

          {/* AI */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ padding: '8px', borderRadius: '50%' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>AI</span>
          </div>

          {/* Profil */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ padding: '8px', borderRadius: '50%' }}>
               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>Profil</span>
          </div>

        </div>
      </div>
    </div>
  );
}
