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
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [count, setCount] = useState(1);

  const fetchItems = async () => {
    const { data } = await supabase
      .from('Clothes')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => {
    fetchItems();
    const channel = supabase.channel('realtime_clothes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Clothes' }, (payload) => {
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

      {/* 🖼️ ORQA FON */}
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

      {/* 🔄 ASOSIY KONTENT */}
      <div style={{
        width: '90%',
        maxWidth: activeTab === 'Kiyimlar' ? '600px' : '350px',
        zIndex: 10,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative'
      }}>
        
        {/* --- 🌊 1-VARIANT: HOME --- */}
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
            <h2 style={{ position: 'relative', zIndex: 2, color: '#fbbf24', fontSize: '28px', fontWeight: '900', textAlign: 'center', textShadow: '2px 2px 15px black', margin: 0 }}>
              ASSALOMU ALEYKUM
            </h2>
            <p style={{ position: 'relative', zIndex: 2, color: 'white', fontSize: '11px', fontWeight: '700', textAlign: 'center', marginTop: '10px', textShadow: '2px 2px 10px black', letterSpacing: '2px', textTransform: 'uppercase' }}>
              ONLAYN KIYIM DO'KONIMIZGA XUSH KELIBSIZ
            </p>
          </div>
        )}

        {/* --- 🛍️ 2-VARIANT: KIYIMLAR --- */}
        {activeTab === 'Kiyimlar' && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px',
            animation: 'fadeIn 0.5s ease'
          }}>
            {items.map((item) => (
              <div key={item.id} 
                onClick={() => { setSelectedProduct(item); setCount(1); }}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(25px) saturate(160%)',
                  borderRadius: '25px', border: '1px solid rgba(255,255,255,0.2)',
                  overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer'
                }}>
                <img src={item.image_url} alt={item.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                <div style={{ padding: '12px' }}>
                  <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '800', textShadow: '0 0 10px rgba(251,191,36,0.5)' }}>
                    {item.price?.toLocaleString()} <span style={{fontSize: '10px'}}>so'm</span>
                  </div>
                  <p style={{ color: 'white', fontSize: '11px', margin: '5px 0' }}>{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- 🛒 3-VARIANT: SAVAT BO'LIMI --- */}
        {activeTab === 'Savat' && (
          <div style={{ color: 'white', textAlign: 'center', padding: '50px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', backdropFilter: 'blur(20px)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800' }}>SAVATCHANGIZ BO'SH</h2>
          </div>
        )}
      </div>

      {/* 🛍️ MAHSULOT SAHIFASI (MODAL) */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'white', zIndex: 1000, display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease-out' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            <img src={selectedProduct.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ padding: '25px', flex: 1, backgroundColor: 'white', borderRadius: '30px 30px 0 0', marginTop: '-30px', position: 'relative', color: '#1a1a1a' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#5A31F4' }}>{selectedProduct.price?.toLocaleString()} so'm</div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginTop: '10px' }}>{selectedProduct.name}</h2>
            
            <div style={{ marginTop: '20px', padding: '12px', background: '#f8f9fa', borderRadius: '12px', fontSize: '13px' }}>
              📏 O'LCHAM: <span style={{ fontWeight: 'bold' }}>{selectedProduct.sizes}</span>
            </div>

            <div style={{ position: 'absolute', bottom: '30px', left: '20px', right: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: '16px', padding: '4px' }}>
                <button onClick={() => count > 1 && setCount(count-1)} style={{ border: 'none', width: '45px', height: '45px', fontSize: '24px', background: 'none', cursor: 'pointer' }}>−</button>
                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '800', fontSize: '18px' }}>{count}</span>
                <button onClick={() => setCount(count+1)} style={{ border: 'none', width: '45px', height: '45px', fontSize: '24px', background: 'none', cursor: 'pointer' }}>+</button>
              </div>

              <button 
                onClick={() => { setSelectedProduct(null); setActiveTab('Savat'); }}
                style={{ flex: 1, height: '54px', backgroundColor: '#E5E1FF', color: '#5A31F4', border: 'none', borderRadius: '18px', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                O'TISH
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📱 6 TALIK LIQUID GLASS MENYU */}
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
        {[
          { id: 'Home', name: 'ASOSIY', icon: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
          { id: 'Kiyimlar', name: 'KIYIMLAR', icon: 'M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z' },
          { id: 'Yurak', name: 'YOQTIRGANLAR', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
          { id: 'Savat', name: 'SAVAT', icon: 'M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' },
          { id: 'AI', name: 'AI', icon: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' },
          { id: 'Profil', name: 'PROFIL', icon: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' },
        ].map((tab) => (
          <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1, position: 'relative' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeTab === tab.id ? '#fbbf24' : 'white'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: '0.3s' }}>
              <path d={tab.icon}/>
              {tab.id === 'Profil' && <circle cx="12" cy="7" r="4"></circle>}
            </svg>
            <span style={{ fontSize: '8px', color: activeTab === tab.id ? '#fbbf24' : 'white', fontWeight: activeTab === tab.id ? '800' : '650' }}>{tab.name}</span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
}
