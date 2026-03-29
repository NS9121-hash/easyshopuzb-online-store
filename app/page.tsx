export default function Home() {
  return (
    <main style={{
      position: 'relative',
      minHeight: '100dvh', /* 100vh emas, 100dvh - telefonda elementlarni kesmaydi */
      width: '100dvw',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'white',
      backgroundColor: '#0a192f',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 15px 30px 15px', /* Ekran chetlaridan joy tashlash */
    }}>

      {/* 🖼️ YORQIN ORQA FON (Umuman blursiz) */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "url('/IMG_2933.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 0
      }}></div>

      {/* 🏠 ASOSIY KONTENT (Tepa-past tartibda joylashgan elementlar) */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '400px', /* Mobil ekran uchun optimal kenglik */
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '25px' /* Elementlar orasidagi bo'shliq */
      }}>

        {/* 👑 TEPADAGI LOGOTIP VA SHIOR */}
        <header style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '900', 
            margin: 0, 
            letterSpacing: '1px',
            textShadow: '0 4px 15px rgba(0,0,0,0.4)' 
          }}>
            EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span>
          </h1>
          <p style={{ 
            fontSize: '11px', 
            color: '#e2e8f0', 
            letterSpacing: '4px', 
            marginTop: '8px', 
            fontWeight: '700',
            textShadow: '0 2px 5px rgba(0,0,0,0.4)'
          }}>
            OSON ONLINE XARID
          </p>
        </header>

        {/* 🌊 O'RTADAGI RAMKA VA ICHIDAGI VIDEO (Siz xohlagandek tiniq) */}
        <div style={{
          width: '100%',
          aspectRatio: '4/5', /* Ramkaning shakli */
          borderRadius: '35px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', /* Tekstni doim o'rtada ushlaydi */
          alignItems: 'center',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
          border: '1.5px solid rgba(255,255,255,0.25)'
        }}>
          {/* 📹 VIDEO (Hech qanday blur yoki qora qatlam yo'q) */}
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

          {/* MATN (O'rtada, o'qish qulay soya bilan) */}
          <h2 style={{
            position: 'relative', zIndex: 2, color: '#fbbf24', fontSize: '28px', fontWeight: '900', textAlign: 'center',
            textShadow: '0px 2px 8px rgba(0,0,0,1), 0px 4px 15px rgba(0,0,0,0.8)', padding: '0 20px', margin: 0
          }}>
            ASSALOMU ALEYKUM
          </h2>
          <p style={{
            position: 'relative', zIndex: 2, color: '#ffffff', fontSize: '13px', fontWeight: '700', textAlign: 'center',
            marginTop: '10px', textShadow: '0px 2px 6px rgba(0,0,0,1), 0px 2px 10px rgba(0,0,0,0.8)', padding: '0 30px', lineHeight: '1.5', margin: 0
          }}>
            ONLAYN DO'KONIMIZGA XUSH KELIBSIZ!
          </p>
        </div>

        {/* 📱 PASTDAGI MENYU (RAMKANING TAGIGA KO'CHIRILDI VA APPLE STYLE LIQUID GLASS EFFEKTI QO'SHILDI) */}
        <div style={{
          width: '100%', /* Ramkaning kengligi bilan bir xil */
          height: '75px',
          borderRadius: '40px',
          /* Suyuq shisha siri: Juda nozik oqish fon, yuqori transparency va tepada yarqiragan oq hoshiya */
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderTop: '2px solid rgba(255, 255, 255, 0.4)', /* Apple shishasining yaltiroq labi */
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 -5px 15px rgba(255,255,255,0.15)', /* Shisha hoshiyasining chuqurligi */
          zIndex: 20
        }}>

          {/* Kiyimlar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <div style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '50%', boxShadow: '0 0 10px rgba(255,255,255,0.1)' }}>
               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
            </div>
            <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: '800' }}>Kiyimlar</span>
          </div>

          {/* Savat (Ikonkalarning orqasi shaffof) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.9 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span style={{ fontSize: '10px', color: 'white', fontWeight: '700' }}>Savat</span>
          </div>

          {/* AI (Ikonkalarning orqasi shaffof) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.9 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            <span style={{ fontSize: '10px', color: 'white', fontWeight: '700' }}>AI</span>
          </div>

          {/* Profil (Ikonkalarning orqasi shaffof) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.9 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span style={{ fontSize: '10px', color: 'white', fontWeight: '700' }}>Profil</span>
          </div>

        </div>

      </div>
    </main>
  );
}
