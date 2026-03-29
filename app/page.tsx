'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [activeTab, setActiveTab] = useState('Home');
  const [items, setItems] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [count, setCount] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchItems = async () => {
    const { data } = await supabase.from('Clothes').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => {
    fetchItems();

    // 🔥 REALTIME: HAM QO'SHISH, HAM O'CHIRISHNI TEKSHIRADI
    const channel = supabase.channel('realtime_clothes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Clothes' }, (payload) => {
        setItems((prev) => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'Clothes' }, (payload) => {
        // Botdan o'chirilsa, saytdagi ro'yxatdan ham olib tashlaydi
        setItems((prev) => prev.filter(item => item.id !== payload.old.id));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <main style={{
      position: 'relative', minHeight: '100dvh', width: '100dvw',
      overflowX: 'hidden', backgroundColor: '#050b14',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 0 120px 0', boxSizing: 'border-box'
    }}>

      {/* 🖼️ BACKGROUND */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/IMG_2933.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>

      <header style={{ textAlign: 'center', marginBottom: '30px', zIndex: 10 }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: 0, textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
          EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span>
        </h1>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '4px', marginTop: '5px' }}>OSON ONLINE XARID</p>
      </header>

      <div style={{ width: '90%', maxWidth: '500px', zIndex: 10, position: 'relative' }}>
        
        {/* --- 🌊 HOME TAB --- */}
        <div style={{
          display: activeTab === 'Home' ? 'flex' : 'none',
          width: '100%', aspectRatio: '4/5', borderRadius: '35px', position: 'relative',
          overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.2)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          background: "url('/IMG_2933.jpeg') center/cover"
        }}>
          <video ref={videoRef} autoPlay muted loop playsInline preload="auto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
            <source src="/-1880952146411559581.mp4" type="video/mp4" />
          </video>
          <h2 style={{ position: 'relative', zIndex: 2, color: '#fbbf24', fontSize: '28px', fontWeight: '900', textAlign: 'center', textShadow: '2px 2px 20px black', margin: 0 }}>ASSALOMU ALEYKUM</h2>
          <p style={{ position: 'relative', zIndex: 2, color: 'white', fontSize: '11px', fontWeight: '700', textAlign: 'center', marginTop: '10px', textShadow: '2px 2px 15px black', letterSpacing: '1px', textTransform: 'uppercase' }}>ONLAYN KIYIM DO'KONIMIZGA XUSH KELIBSIZ</p>
        </div>

        {/* --- 🛍️ KIYIMLAR RO'YXATI --- */}
        {activeTab === 'Kiyimlar' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', animation: 'fadeIn 0.3s ease' }}>
            {items.map((item) => (
              <div key={item.id} style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <img src={item.image_url} alt={item.name} onClick={() => { setSelectedProduct(item); setCount(1); }} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', cursor: 'pointer' }} />
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '800' }}>{item.price?.toLocaleString()} <span style={{fontSize: '9px'}}>so'm</span></div>
                  <p style={{ color: 'white', fontSize: '11px', margin: '5px 0', height: '2.4em', overflow: 'hidden' }}>{item.name}</p>
                  
                  {/* 🆕 KATALOGDAGI TUGMANI QAYTARDIM */}
                  <button 
                    onClick={() => { setSelectedProduct(item); setCount(1); }}
                    style={{ marginTop: '10px', width: '100%', padding: '8px', backgroundColor: '#5A31F4', color: 'white', border: 'none', borderRadius: '12px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    BUYURTMA BERISH
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Savat' && <div style={{ color: 'white', textAlign: 'center', padding: '50px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '30px', backdropFilter: 'blur(20px)' }}>SAVATCHANGIZ BO'SH</div>}
        {activeTab === 'Yoqtirganlar' && <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>YOQTIRGANLAR RO'YXATI BO'SH</div>}
      </div>

      {/* 🛍️ MODAL (MAHSULOT SAHIFASI) */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'white', zIndex: 1000, display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease-out' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', fontSize: '20px' }}>✕</button>
            <img src={selectedProduct.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ padding: '25px', flex: 1, backgroundColor: 'white', borderRadius: '30px 30px 0 0', marginTop: '-30px', position: 'relative', color: '#1a1a1a' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#5A31F4' }}>{selectedProduct.price?.toLocaleString()} so'm</div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginTop: '10px' }}>{selectedProduct.name}</h2>
            <div style={{ marginTop: '20px', padding: '12px', background: '#f8f9fa', borderRadius: '12px', fontSize: '13px' }}>📏 O'LCHAM: <span style={{fontWeight: 'bold'}}>{selectedProduct.sizes}</span></div>
            <div style={{ position: 'absolute', bottom: '30px', left: '20px', right: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: '16px', padding: '4px' }}>
                <button onClick={() => count > 1 && setCount(count-1)} style={{ border: 'none', width: '45px', height: '45px', fontSize: '24px', background: 'none' }}>−</button>
                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '800', fontSize: '18px' }}>{count}</span>
                <button onClick={() => setCount(count+1)} style={{ border: 'none', width: '45px', height: '45px', fontSize: '24px', background: 'none' }}>+</button>
              </div>
              <button onClick={() => { setSelectedProduct(null); setActiveTab('Savat'); }} style={{ flex: 1, height: '54px', backgroundColor: '#E5E1FF', color: '#5A31F4', border: 'none', borderRadius: '18px', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                O'TISH
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📱 NAVIGATION */}
      <nav style={{ position: 'fixed', bottom: '30px', width: '95%', maxWidth: '440px', height: '70px', borderRadius: '35px', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(25px) saturate(160%)', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 8px', zIndex: 100 }}>
        {[
          { id: 'Home', name: 'ASOSIY', icon: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
          { id: 'Kiyimlar', name: 'KIYIMLAR', icon: 'M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z' },
          { id: 'Yoqtirganlar', name: 'YOQTIRGANLAR', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
          { id: 'Savat', name: 'SAVAT', icon: 'M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' },
          { id: 'AI', name: 'AI', icon: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' },
          { id: 'Profil', name: 'PROFIL', icon: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' },
        ].map((tab) => (
          <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1, position: 'relative' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeTab === tab.id ? '#fbbf24' : 'white'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: '0.3s' }}>
              <path d={tab.icon}/>
              {tab.id === 'Profil' && <circle cx="12" cy="7" r="4"></circle>}
            </svg>
            <span style={{ fontSize: '7.5px', color: activeTab === tab.id ? '#fbbf24' : 'white', fontWeight: '800' }}>{tab.name}</span>
          </div>
        ))}
      </nav>

      <style jsx global>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </main>
  );
}
