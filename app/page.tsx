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
  const [cart, setCart] = useState<any[]>([]); // Savat xotirasi
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [count, setCount] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 🛒 SAVATGA QO'SHISH VA O'TISH FUNKSIYASI
  const handleAddToCart = (product: any) => {
    const orderItem = { ...product, quantity: count, addedAt: new Date().getTime() };
    setCart((prev) => [...prev, orderItem]);
    setSelectedProduct(null); // Modalni yopish
    setActiveTab('Savat'); // Avtomatik savat bo'limiga o'tish
  };

  const fetchItems = async () => {
    const { data } = await supabase.from('Clothes').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => {
    fetchItems();
    const channel = supabase.channel('realtime_clothes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Clothes' }, (payload) => {
        setItems((prev) => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'Clothes' }, (payload) => {
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
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,11,20,0.3) 0%, #050b14 98%)', zIndex: 1 }}></div>

      <header style={{ textAlign: 'center', marginBottom: '35px', zIndex: 10 }}>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: 'white', margin: 0, textShadow: '0 10px 20px rgba(0,0,0,0.5)', letterSpacing: '1px' }}>
          EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span>
        </h1>
        <p style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '4px', marginTop: '6px', textTransform: 'uppercase' }}>OSON Online Xarid</p>
      </header>

      <div style={{ width: '92%', maxWidth: '500px', zIndex: 10, position: 'relative' }}>
        
        {/* --- 🌊 HOME --- */}
        {activeTab === 'Home' && (
          <div style={{
            width: '100%', aspectRatio: '4/5', borderRadius: '35px', position: 'relative',
            overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            background: "url('/IMG_2933.jpeg') center/cover"
          }}>
            <video ref={videoRef} autoPlay muted loop playsInline preload="auto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
              <source src="/-1880952146411559581.mp4" type="video/mp4" />
            </video>
            <h2 style={{ position: 'relative', zIndex: 2, color: '#fbbf24', fontSize: '24px', fontWeight: '900', textAlign: 'center', textShadow: '2px 2px 20px black' }}>ASSALOMU ALEYKUM</h2>
            <p style={{ position: 'relative', zIndex: 2, color: 'white', fontSize: '10px', fontWeight: '500', textAlign: 'center', marginTop: '8px', textShadow: '2px 2px 10px black', letterSpacing: '1px', textTransform: 'uppercase' }}>onlayn kiyim do'konimizga xush kelibsiz</p>
          </div>
        )}

        {/* --- 🛍️ KIYIMLAR (PREMIUM LIQUID GLASS) --- */}
        {activeTab === 'Kiyimlar' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', animation: 'fadeIn 0.5s ease' }}>
            {items.map((item) => (
              <div key={item.id} style={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                backdropFilter: 'blur(15px)',
                borderRadius: '22px', 
                border: '1px solid rgba(255,255,255,0.08)', 
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
                boxShadow: '0 15px 30px rgba(0,0,0,0.4)'
              }}>
                <img src={item.image_url} alt={item.name} onClick={() => { setSelectedProduct(item); setCount(1); }} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', cursor: 'pointer' }} />
                <div style={{ padding: '10px' }}>
                  <div style={{ color: '#fbbf24', fontSize: '15px', fontWeight: '800' }}>{item.price?.toLocaleString()} <span style={{fontSize: '9px', opacity: 0.6}}>so'm</span></div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', margin: '4px 0', height: '2.4em', overflow: 'hidden', lineHeight: '1.2' }}>{item.name}</p>
                  <button onClick={() => { setSelectedProduct(item); setCount(1); }}
                    style={{ marginTop: '5px', width: '100%', padding: '9px', background: 'rgba(255, 255, 255, 0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '9px', fontWeight: '800', cursor: 'pointer', letterSpacing: '0.5px' }}>
                    BUYURTMA BERISH
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- 🛒 SAVAT --- */}
        {activeTab === 'Savat' && (
          <div style={{ color: 'white', animation: 'fadeIn 0.5s ease' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>Savat bo'sh</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {cart.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: '15px', background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', alignItems: 'center' }}>
                    <img src={c.image_url} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: '#fbbf24', marginTop: '4px' }}>{c.price.toLocaleString()} x {c.quantity}</div>
                    </div>
                  </div>
                ))}
                <button style={{ marginTop: '10px', padding: '15px', background: '#fbbf24', color: 'black', border: 'none', borderRadius: '15px', fontWeight: '800', fontSize: '14px' }}>BUYURTMANI TASDIQLASH</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🛍️ 💎 PREMIUM LIQUID GLASS MODAL */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ width: '100%', maxWidth: '500px', height: '82dvh', background: 'rgba(15, 23, 42, 0.92)', borderRadius: '40px 40px 0 0', position: 'relative', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -20px 50px rgba(0,0,0,0.5)', animation: 'slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
            <div onClick={() => setSelectedProduct(null)} style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', margin: '15px auto', cursor: 'pointer' }}></div>
            
            <div style={{ position: 'relative', width: '90%', margin: '0 auto', aspectRatio: '1/1', borderRadius: '25px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '36px', height: '36px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✕</button>
              <img src={selectedProduct.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ padding: '20px 25px', flex: 1, display: 'flex', flexDirection: 'column', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#fbbf24' }}>{selectedProduct.price?.toLocaleString()} <span style={{fontSize: '12px', opacity: 0.5}}>so'm</span></div>
                <div style={{ padding: '5px 12px', border: '1px solid #fbbf24', borderRadius: '10px', color: '#fbbf24', fontSize: '9px', fontWeight: '800' }}>PREMIUM</div>
              </div>
              
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginTop: '12px', opacity: 0.9 }}>{selectedProduct.name}</h2>
              
              <div style={{ marginTop: '20px', padding: '12px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>📏 O'LCHAMLAR:</span>
                <span style={{ fontWeight: '800', fontSize: '14px', color: 'white' }}>{selectedProduct.sizes}</span>
              </div>

              <div style={{ marginTop: 'auto', marginBottom: '30px', display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '18px', padding: '5px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <button onClick={() => count > 1 && setCount(count-1)} style={{ border: 'none', background: 'none', color: 'white', fontSize: '20px', width: '40px', height: '40px', cursor: 'pointer' }}>−</button>
                  <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: '900', fontSize: '18px' }}>{count}</span>
                  <button onClick={() => setCount(count+1)} style={{ border: 'none', background: 'none', color: 'white', fontSize: '20px', width: '40px', height: '40px', cursor: 'pointer' }}>+</button>
                </div>

                <button 
                  onClick={() => handleAddToCart(selectedProduct)}
                  style={{ 
                    flex: 1, height: '55px', 
                    background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', 
                    color: '#020617', border: 'none', borderRadius: '18px', 
                    fontWeight: '900', fontSize: '14px', letterSpacing: '0.5px',
                    boxShadow: '0 10px 25px rgba(251, 191, 36, 0.3)',
                    cursor: 'pointer'
                  }}>
                  SAVATGA QO'SHISH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📱 NAVIGATION (LIQUID STYLE) */}
      <nav style={{ position: 'fixed', bottom: '25px', width: '92%', maxWidth: '440px', height: '70px', borderRadius: '35px', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(25px) saturate(180%)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 8px', zIndex: 100, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        {[
          { id: 'Home', name: 'ASOSIY', icon: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
          { id: 'Kiyimlar', name: 'KIYIMLAR', icon: 'M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z' },
          { id: 'Yoqtirganlar', name: 'YURAK', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
          { id: 'Savat', name: 'SAVAT', icon: 'M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' },
          { id: 'Profil', name: 'PROFIL', icon: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' },
        ].map((tab) => (
          <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', flex: 1, position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activeTab === tab.id ? '#fbbf24' : 'rgba(255,255,255,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: '0.3s' }}>
              <path d={tab.icon}/>
              {tab.id === 'Profil' && <circle cx="12" cy="7" r="4"></circle>}
            </svg>
            <span style={{ fontSize: '8px', color: activeTab === tab.id ? '#fbbf24' : 'rgba(255,255,255,0.4)', fontWeight: '800' }}>{tab.name}</span>
          </div>
        ))}
      </nav>

      <style jsx global>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
}
