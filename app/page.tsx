'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase ulanishi
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [activeTab, setActiveTab] = useState('Home');
  const [items, setItems] = useState<any[]>([]);

  // Bazadan kiyimlarni olish funksiyasi
  const fetchItems = async () => {
    const { data } = await supabase
      .from('Clothes')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => {
    fetchItems();

    // Realtime: Botdan yangi kiyim tushsa, sahifani yangilamasdan ko'rsatish
    const channel = supabase.channel('realtime_clothes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'clothes' }, (payload) => {
        setItems((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

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
      padding: '40px 0 120px 0',
      boxSizing: 'border-box'
    }}>

      {/* 🖼️ ORQA FON (O'SHA BIZ TANLAGAN RASM) */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('/IMG_2933.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0
      }}></div>

      {/* 👑 LOGO HUDUDI */}
      <header style={{ textAlign: 'center', marginBottom: '30px', zIndex: 10 }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: 0, textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
          EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span>
        </h1>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '4px', marginTop: '5px' }}>
          OSON ONLINE XARID
        </p>
      </header>

      {/* 🔄 ASOSIY KONTENT (STATE'GA QARAB O'ZGARADI) */}
      <div style={{
        width: '90%',
        maxWidth: activeTab === 'Kiyimlar' ? '600px' : '350px',
        zIndex: 10,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        
        {/* --- 🌊 1-VARIANT: HOME (SUV VIDEOSI) --- */}
        {activeTab === 'Home' && (
          <div style={{
            width: '100%', aspectRatio: '4/5',
            borderRadius: '35px', position: 'relative',
            overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.3)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
          }}>
            <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
              <source src="/-1880952146411559581.mp4" type="video/mp4" />
            </video>
            <h2 style={{ position: 'relative', zIndex: 2, color: '#fbbf24', fontSize: '28px', fontWeight: '900', textAlign: 'center', textShadow: '2px 2px 15px black' }}>
              ASSALOMU ALEYKUM
            </h2>
            <p style={{ position: 'relative', zIndex: 2, color: 'white', fontSize: '13px', fontWeight: '700', textAlign: 'center', marginTop: '10px', textShadow: '2px 2px 10px black' }}>
              ONLAYN DO'KONIMIZGA XUSH KELIBSIZ!
            </p>
          </div>
        )}

        {/* --- 🛍️ 2-VARIANT: KIYIMLAR (DINAMIK KATALOG) --- */}
        {activeTab === 'Kiyimlar' && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px',
            animation: 'fadeIn 0.5s ease'
          }}>
            {items.map((item) => (
              <div key={item.id} style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(25px) saturate(160%)',
                borderRadius: '25px', border: '1px solid rgba(255,255,255,0.2)',
                overflow: 'hidden', display: 'flex', flexDirection: 'column'
              }}>
                <img src={item.image_url} alt={item.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                <div style={{ padding: '12px' }}>
                  <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '800', textShadow: '0 0 10px rgba(251,191,36,0.5)' }}>
                    {item.price?.toLocaleString()} <span style={{fontSize: '10px'}}>so'm</span>
                  </div>
                  <p style={{ color: 'white', fontSize: '11px', margin: '5px 0', height: '2.8em', overflow: 'hidden' }}>{item.name}</p>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '6px', display: 'inline-block' }}>
                    O'lcham: {item.sizes}
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && <p style={{color: 'white', textAlign: 'center', gridColumn: 'span 2'}}>Hali mahsulot qo'shilmadi...</p>}
          </div>
        )}
      </div>

      {/* 📱 6 TALIK LIQUID GLASS MENYU (FIXED) */}
      <div style={{
        position: 'fixed', bottom: '30px',
        width: '95%', maxWidth: '440px', height: '70px',
        borderRadius: '35px', background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(25px) saturate(160%)',
        WebkitBackdropFilter: 'blur(25px) saturate(160%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '0 8px', boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
        zIndex: 100
      }}>
        
        {/* HAR BIR TUGMA */}
        {[
          { id: 'Home', name: 'Asosiy', icon: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
          { id: 'Kiyimlar', name: 'Kiyimlar', icon: 'M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z' },
          { id: 'Yurak', name: 'Yoqtirganlar', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
          { id: 'Savat', name: 'Savat', icon: 'M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' },
          { id: 'AI', name: 'AI', icon: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' },
          { id: 'Profil', name: 'Profil', icon: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
        ].map((tab) => (
          <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeTab === tab.id ? '#fbbf24' : 'white'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: '0.3s' }}>
              <path d={tab.icon}/>
            </svg>
            <span style={{ fontSize: '8.5px', color: activeTab === tab.id ? '#fbbf24' : 'white', fontWeight: activeTab === tab.id ? '800' : '650' }}>{tab.name}</span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
