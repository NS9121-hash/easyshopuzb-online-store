'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// SUPABASE'GA ULANISH
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [activeTab, setActiveTab] = useState('Home');
  const [items, setItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]); // Savat uchun
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [count, setCount] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  // SAVATGA QO'SHISH FUNKSIYASI
  const handleAddToCart = (product: any) => {
    const newItem = { ...product, qty: count, addedAt: new Date() };
    setCart((prev) => [...prev, newItem]);
    setSelectedProduct(null);
    setActiveTab('Savat'); 
  };

  // MA'LUMOTLARNI TORTIB OLISH
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('Clothes')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setItems(data);
    if (error) console.error("Kiyimlarni olishda xato:", error);
  };

  // REALTIME - JONLI YANGILANISH (Saytni yangilamasdan)
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

      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/IMG_2933.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>

      <header style={{ textAlign: 'center', marginBottom: '30px', zIndex: 10 }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: 0, textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
          EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span>
        </h1>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '4px', marginTop: '5px' }}>OSON ONLINE XARID</p>
      </header>

      <div style={{ width: '90%', maxWidth: '500px', zIndex: 10, position: 'relative' }}>
        
        {activeTab === 'Home' && (
          <div style={{
            width: '100%', aspectRatio: '4/5', borderRadius: '35px', position: 'relative',
            overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.2)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            background: "url('/IMG_2933.jpeg') center/cover"
          }}>
            <video ref={videoRef} autoPlay muted loop playsInline preload="auto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
              <source src="/-1880952146411559581.mp4" type="video/mp4" />
            </video>
            <h2 style={{ position: 'relative', zIndex: 2, color: '#fbbf24', fontSize: '28px', fontWeight: '900', textAlign: 'center', textShadow: '2px 2px 20px black', margin: 0 }}>ASSALOMU ALEYKUM</h2>
            <p style={{ position: 'relative', zIndex: 2, color: 'white', fontSize: '11px', fontWeight: '700', textAlign: 'center', marginTop: '10px', textShadow: '2px 2px 15px black', letterSpacing: '1px', textTransform: 'uppercase' }}>ONLAYN KIYIM DO'KONIMIZGA XUSH KELIBSIZ</p>
          </div>
        )}

        {/* 🛍️ BAZADAN KELGAN KIYIMLAR */}
        {activeTab === 'Kiyimlar' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', animation: 'fadeIn 0.3s ease' }}>
            {items.map((item) => (
              <div key={item.id} style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '25px', 
                border: '1px solid rgba(255,255,255,0.15)', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                  <img src={item.image_url} alt={item.name} onClick={() => { setSelectedProduct(item); setCount(1); }} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                </div>

                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '800' }}>{item.price?.toLocaleString()} <span style={{fontSize: '10px'}}>so'm</span></div>
                  <p style={{ color: 'white', fontSize: '12px', margin: '6px 0', height: '2.8em', overflow: 'hidden', lineHeight: '1.4', opacity: 0.9 }}>{item.name}</p>
                  <button onClick={() => { setSelectedProduct(item); setCount(1); }}
                    style={{ marginTop: 'auto', width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', color: 'white', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '15px', fontSize: '10px', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase' }}>
                    BUYURTMA BERISH
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SAVAT VA YOQTIRGANLAR */}
        {activeTab === 'Savat' && (
          <div style={{ color: 'white', animation: 'fadeIn 0.3s ease' }}>
             {cart.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '30px', backdropFilter: 'blur(20px)' }}>SAVATCHANGIZ BO'SH</div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 {cart.map((c, i) => (
                   <div key={i} style={{ display: 'flex', gap: '15px', background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.15)', alignItems: 'center' }}>
                     <img src={c.image_url} style={{ width: '65px', height: '65px', borderRadius: '15px', objectFit: 'cover' }} />
                     <div style={{ flex: 1 }}>
                       <div style={{ fontSize: '14px', fontWeight: '700' }}>{c.name}</div>
                       <div style={{ fontSize: '12px', color: '#fbbf24', marginTop: '4px', fontWeight: '800' }}>{c.price.toLocaleString()} so'm  <span style={{color: 'white', opacity: 0.5}}>x {c.qty}</span></div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {activeTab === 'Yoqtirganlar' && <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>YOQTIRGANLAR RO'YXATI BO'SH</div>}
        {activeTab === 'AI' && <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>AI YORDAMCHI TEZ ORADA</div>}
      </div>

      {/* 🛍️ PREMIUM MODAL (DETALNIY VIEW) */}
      {selectedProduct && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 1000, 
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ 
            width: '100%', maxWidth: '500px', height: '88dvh',
            background: 'linear-gradient(180deg, #0f172a 0%, #050b14 100%)',
            borderRadius: '40px 40px 0 0', position: 'relative',
            border: '1.5px solid rgba(255,255,255,0.1)', borderBottom: 'none',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {/* TEPADAGI HANDLER */}
            <div onClick={() => setSelectedProduct(null)} style={{ width: '45px', height: '5px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', margin: '15px auto', cursor: 'pointer' }}></div>
            
            {/* PREMIUM RASM */}
            <div style={{ position: 'relative', width: '92%', margin: '0 auto', aspectRatio: '1/1', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '38px', height: '38px', color: 'white', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✕</button>
              <img src={selectedProduct.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* MA'LUMOTLAR QISMI */}
            <div style={{ padding: '30px 25px', flex: 1, display: 'flex', flexDirection: 'column', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '30px', fontWeight: '900', color: '#fbbf24', letterSpacing: '-1px' }}>{selectedProduct.price?.toLocaleString()} <span style={{fontSize: '14px', color: 'rgba(255,255,255,0.5)'}}>so'm</span></div>
                <div style={{ padding: '6px 12px', background: 'rgba(251,191,36,0.1)', border: '1px solid #fbbf24', borderRadius: '10px', color: '#fbbf24', fontSize: '10px', fontWeight: '800' }}>PREMIUM</div>
              </div>
              
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginTop: '12px', lineHeight: '1.2' }}>{selectedProduct.name}</h2>
              
              <div style={{ 
                marginTop: '25px', padding: '15px 20px', 
                background: 'rgba(255,255,255,0.03)', borderRadius: '22px', 
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <span style={{ fontSize: '20px' }}>📏</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '1px' }}>O'LCHAMLAR:</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', marginTop: '2px', color: 'white' }}>{selectedProduct.sizes}</div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ marginTop: 'auto', marginBottom: '35px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '15px', 
                  background: 'rgba(255,255,255,0.05)', borderRadius: '22px', 
                  padding: '5px', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <button onClick={() => count > 1 && setCount(count-1)} style={{ border: 'none', background: 'none', color: 'white', fontSize: '24px', width: '45px', height: '45px', cursor: 'pointer' }}>−</button>
                  <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: '900', fontSize: '20px' }}>{count}</span>
                  <button onClick={() => setCount(count+1)} style={{ border: 'none', background: 'none', color: 'white', fontSize: '24px', width: '45px', height: '45px', cursor: 'pointer' }}>+</button>
                </div>

                {/* SAVATGA QO'SHISH TUGMASI ULANDI */}
                <button 
                  onClick={() => handleAddToCart(selectedProduct)}
                  style={{ 
                    flex: 1, height: '60px', 
                    background: 'linear-gradient(90deg, #fbbf24 0%, #d97706 100%)', 
                    color: '#050b14', border: 'none', borderRadius: '22px', 
                    fontWeight: '900', fontSize: '16px', letterSpacing: '0.5px',
                    boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)',
                    cursor: 'pointer', transition: '0.3s'
                  }}>
                  SAVATGA QO'SHISH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIZNING ORIGINAL NAVIGATSIYANGIZ */}
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
