export default function Home() {
  return (
    <main style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      {/* 📹 FON RASMI (YORQIN VA TINIQ) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: "url('/IMG_2933.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -1
      }}></div>

      {/* 👑 TEPADAGI LOGOTIP VA SHIOR */}
      <header style={{ marginTop: '60px', textAlign: 'center', zIndex: 10 }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '900', 
          color: '#ffffff', 
          margin: 0, 
          letterSpacing: '1px',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)' 
        }}>
          EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span>
        </h1>
        <p style={{ 
          fontSize: '11px', 
          color: '#cbd5e1', 
          letterSpacing: '5px', 
          marginTop: '8px', 
          fontWeight: '600' 
        }}>
          OSON ONLINE XARID
        </p>
      </header>

      {/* 🌊 O'RTADAGI SALOMLASHISH KARTASI */}
      <div style={{
        marginTop: '50px',
        width: '85%',
        maxWidth: '360px',
        aspectRatio: '4/4.5',
        borderRadius: '35px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 5
      }}>
         {/* Karta ichidagi video (Hech qanday blur yo'q, yorqinlik kuchaytirildi) */}
         <video
           autoPlay
           muted
           loop
           playsInline
           style={{
             position: 'absolute',
             top: 0,
             left: 0,
             width: '100%',
             height: '100%',
             objectFit: 'cover',
             zIndex: 0,
             // ❌ Videoning yorqinligi va rangini kuchaytiramiz
             filter: 'brightness(1.5) contrast(1.1) saturate(1.4)'
           }}
         >
           <source src="/-1880952146411559581.mp4" type="video/mp4" />
         </video>

         {/* ❌ Videoni qoraytirish effekti butunlay olib tashlandi */}

         {/* MATNLAR */}
         <div style={{
           position: 'relative',
           zIndex: 1,
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
         }}>
           <h2 style={{
             color: '#fbbf24', fontSize: '26px', fontWeight: '800', textAlign: 'center',
             textShadow: '0 4px 15px rgba(0,0,0,0.9)'
           }}>
             ASSALOMU ALEYKUM
           </h2>
           <p style={{
             color: '#ffffff', fontSize: '14px', fontWeight: '600', textAlign: 'center',
             marginTop: '12px', textShadow: '0 2px 8px rgba(0,0,0,0.8)', padding: '0 20px', lineHeight: '1.5'
           }}>
             ONLAYN DO'KONIMIZGA XUSH KELIBSIZ!
           </p>
         </div>
      </div>

      {/* 📱 PASTDAGI NAVIGATION MENYU */}
      <div style={{
        position: 'absolute',
        bottom: '35px',
        width: '90%',
        maxWidth: '380px',
        height: '75px',
        borderRadius: '38px',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 10px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
        zIndex: 20
      }}>
        
        {/* Kiyimlar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
          <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: '700' }}>Kiyimlar</span>
        </div>

        {/* Savat */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', opacity: 0.7 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          <span style={{ fontSize: '10px', color: '#ffffff', fontWeight: '600' }}>Savat</span>
        </div>

        {/* AI */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', opacity: 0.7 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          <span style={{ fontSize: '10px', color: '#ffffff', fontWeight: '600' }}>AI</span>
        </div>

        {/* Profil */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', opacity: 0.7 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span style={{ fontSize: '10px', color: '#ffffff', fontWeight: '600' }}>Profil</span>
        </div>

      </div>
    </main>
  );
}
