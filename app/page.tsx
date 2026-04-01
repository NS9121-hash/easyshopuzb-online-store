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
  const [cart, setCart] = useState<any[]>([]); 
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [count, setCount] = useState(1);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleAddToCart = (product: any) => {
    const newItem = { ...product, qty: count, chosenSize: selectedSize, chosenColor: selectedColor, addedAt: new Date() };
    setCart((prev) => [...prev, newItem]);
    setSelectedProduct(null);
  };

  const fetchItems = async () => {
    const { data, error } = await supabase.from('Clothes').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => {
    fetchItems();
    const channel = supabase.channel('realtime_clothes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Clothes' }, (payload) => { setItems((prev) => [payload.new, ...prev]); })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'Clothes' }, (payload) => { setItems((prev) => prev.map(item => item.id === payload.new.id ? payload.new : item)); })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'Clothes' }, (payload) => { setItems((prev) => prev.filter(item => item.id !== payload.old.id)); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const totalCartItems = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <main style={{ position: 'relative', minHeight: '100dvh', width: '100dvw', overflowX: 'hidden', backgroundColor: '#050b14', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '40px 0 120px 0', boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/IMG_2933.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>

      <header style={{ textAlign: 'center', marginBottom: '30px', zIndex: 10 }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: 0, textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span></h1>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '4px', marginTop: '5px' }}>OSON ONLINE XARID</p>
      </header>

      <div style={{ width: '90%', maxWidth: '500px', zIndex: 10, position: 'relative' }}>
        
        {activeTab === 'Home' && (
          <div style={{ width: '100%', aspectRatio: '4/5', borderRadius: '35px', position: 'relative', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.2)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: "url('/IMG_2933.jpeg') center/cover" }}>
            <video ref={videoRef} autoPlay muted loop playsInline preload="auto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
              <source src="/-1880952146411559581.mp4" type="video/mp4" />
            </video>
            <h2 style={{ position: 'relative', zIndex: 2, color: '#fbbf24', fontSize: '28px', fontWeight: '900', textAlign: 'center', textShadow: '2px 2px 20px black', margin: 0 }}>ASSALOMU ALEYKUM</h2>
            <p style={{ position: 'relative', zIndex: 2, color: 'white', fontSize: '11px', fontWeight: '700', textAlign: 'center', marginTop: '10px', textShadow: '2px 2px 15px black', letterSpacing: '1px', textTransform: 'uppercase' }}>ONLAYN KIYIM DO'KONIMIZGA XUSH KELIBSIZ</p>
          </div>
        )}

        {activeTab === 'Kiyimlar' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', animation: 'fadeIn 0.3s ease' }}>
            {items.map((item) => {
              const firstImage = item.image_url ? item.image_url.split(',')[0] : '';
              return (
                <div key={item.id} 
                  tabIndex={-1}
                  onClick={() => { 
                    setSelectedProduct(item); setCount(1); setSelectedImageIndex(0); 
                    setSelectedSize(item.sizes ? item.sizes.split(',')[0].trim() : '');
                    setSelectedColor(item.colors ? item.colors.split(',')[0].trim() : '');
                  }} 
                  style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(15px) saturate(180%)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
                  
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                    <img src={firstImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  
                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '800' }}>{item.price?.toLocaleString()} <span style={{fontSize: '10px'}}>so'm</span></div>
                    <p style={{ color: 'white', fontSize: '12px', margin: '6px 0', height: '2.8em', overflow: 'hidden', lineHeight: '1.4', opacity: 0.9 }}>{item.name}</p>
                    
                    <button 
                      tabIndex={-1}
                      onClick={(e) => {
                        e.stopPropagation(); 
                        const defaultSize = item.sizes ? item.sizes.split(',')[0].trim() : '';
                        const defaultColor = item.colors ? item.colors.split(',')[0].trim() : '';
                        const newItem = { ...item, qty: 1, chosenSize: defaultSize, chosenColor: defaultColor, addedAt: new Date() };
                        setCart((prev) => [...prev, newItem]);
                      }}
                      style={{ 
                        marginTop: 'auto', width: '100%', padding: '10px', 
                        background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)', 
                        color: '#050b14', border: 'none', borderRadius: '12px', 
                        fontSize: '11px', fontWeight: '900', cursor: 'pointer', 
                        textTransform: 'uppercase', boxShadow: '0 5px 15px rgba(251, 191, 36, 0.3)',
                        WebkitTapHighlightColor: 'transparent', outline: 'none'
                      }}>
                      BUYURTMA BERISH
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'Savat' && (
          <div style={{ color: 'white', animation: 'fadeIn 0.3s ease' }}>
             {cart.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '30px', backdropFilter: 'blur(20px)' }}>SAVATCHANGIZ BO'SH</div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 {cart.map((c, i) => (
                   <div key={i} style={{ display: 'flex', gap: '15px', background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.15)', alignItems: 'center' }}>
                     <img src={c.image_url.split(',')[0]} style={{ width: '65px', height: '65px', borderRadius: '12px', objectFit: 'cover' }} />
                     <div style={{ flex: 1 }}>
                       <div style={{ fontSize: '14px', fontWeight: '700' }}>{c.name}</div>
                       <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{c.chosenColor} | {c.chosenSize}</div>
                       <div style={{ fontSize: '12px', color: '#fbbf24', marginTop: '4px', fontWeight: '800' }}>{c.price.toLocaleString()} so'm  <span style={{color: 'white', opacity: 0.5}}>x {c.qty}</span></div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {activeTab === 'Yoqtirganlar' && <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>YOQTIRGANLAR BO'SH</div>}
        {activeTab === 'Look' && <div style={{ color: '#fbbf24', textAlign: 'center', padding: '50px', fontWeight: 'bold' }}>PREMIUM LOOKS TEZ ORADA</div>}
        {activeTab === 'AI' && <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>AI YORDAMCHI TEZ ORADA</div>}
      </div>

      {selectedProduct && (() => {
        const productImages = selectedProduct.image_url ? selectedProduct.image_url.split(',') : [];
        const productSizes = selectedProduct.sizes ? selectedProduct.sizes.split(',').map((s:string) => s.trim()) : [];
        const productColors = selectedProduct.colors ? selectedProduct.colors.split(',').map((c:string) => c.trim()) : [];

        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', animation: 'fadeIn 0.3s ease' }}>
            
            <div style={{ width: '100%', maxWidth: '500px', height: '88dvh', background: '#050b14', borderRadius: '35px 35px 0 0', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              
              <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '120px' }}>
                
                {/* 🛑 RASM FONINI YOYISH (mix-blend-mode qo'shildi) */}
                <div style={{ position: 'relative', width: '100%', height: '32vh', background: '#DCDCDC', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                  <div onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '10px', width: '40px', height: '4px', background: 'rgba(0,0,0,0.1)', borderRadius: '10px', zIndex: 10 }}></div>
                  <button tabIndex={-1} onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#000', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none' }}>✕</button>
                  <img src={productImages[selectedImageIndex]} style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                </div>

                <div style={{ padding: '20px 25px', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ fontSize: '30px', fontWeight: '900', color: '#fbbf24' }}>{selectedProduct.price?.toLocaleString()} <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.6)'}}>so'm</span></div>
                    <div style={{ padding: '4px 10px', background: 'rgba(251,191,36,0.1)', border: '1px solid #fbbf24', borderRadius: '8px', color: '#fbbf24', fontSize: '9px', fontWeight: '900' }}>PREMIUM</div>
                  </div>
                  
                  {/* RANG VA O'LCHAMLAR (Paddinglar biroz qisqartirildi) */}
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>RANG:</div>
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none' }}>
                    {productImages.map((img: string, idx: number) => (
                      <div key={idx} onClick={() => setSelectedImageIndex(idx)} 
                        style={{ minWidth: '50px', height: '65px', borderRadius: '10px', border: selectedImageIndex === idx ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', background: '#fff' }}>
                        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>O'LCHAMLAR:</div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {productSizes.map((size: string, i: number) => (
                      <div key={i} onClick={() => setSelectedSize(size)} 
                        style={{ padding: '10px 20px', borderRadius: '12px', background: selectedSize === size ? '#fbbf24' : 'rgba(255,255,255,0.05)', color: selectedSize === size ? '#000' : '#fff', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' }}>{size}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 🛑 SAVATGA QO'SHISH TUGMASI MODALNING TAGIGA QOTIRILDI */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px 25px 35px 25px', background: '#050b14', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <button onClick={() => count > 1 && setCount(count-1)} style={{ color: 'white', border: 'none', background: 'none', width: '40px', height: '45px', fontSize: '20px' }}>−</button>
                  <span style={{ color: 'white', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{count}</span>
                  <button onClick={() => setCount(count+1)} style={{ color: 'white', border: 'none', background: 'none', width: '40px', height: '45px', fontSize: '20px' }}>+</button>
                </div>
                <button onClick={() => handleAddToCart(selectedProduct)} 
                  style={{ flex: 1, height: '45px', background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)', color: '#050b14', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '14px' }}>
                  SAVATGA QO'SHISH
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* NAVIGATSIYA */}
      <nav style={{ position: 'fixed', bottom: '30px', width: '95%', maxWidth: '440px', height: '70px', borderRadius: '35px', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(25px) saturate(160%)', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 8px', zIndex: 100 }}>
        {[
          { id: 'Home', name: 'ASOSIY', icon: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
          { id: 'Kiyimlar', name: 'KIYIMLAR', icon: 'M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z' },
          { id: 'Look', name: 'LOOK', icon: 'M6 3h12l4 6-10 13L2 9Z' }, 
          { id: 'Savat', name: 'SAVAT', icon: 'M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' },
          { id: 'Profil', name: 'PROFIL', icon: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' },
        ].map((tab) => (
          <div key={tab.id} onClick={() => setActiveTab(tab.id)} className="nav-item" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1, position: 'relative', WebkitTapHighlightColor: 'transparent', outline: 'none' }}>
            {tab.id === 'Savat' && totalCartItems > 0 && (
              <div style={{ position: 'absolute', top: '-6px', right: '12px', background: '#ef4444', color: 'white', fontSize: '9px', fontWeight: '900', minWidth: '16px', height: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid #050b14' }}>{totalCartItems}</div>
            )}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={activeTab === tab.id ? '#fbbf24' : 'white'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={tab.icon}/></svg>
            <span style={{ fontSize: '7px', color: activeTab === tab.id ? '#fbbf24' : 'white', fontWeight: '800' }}>{tab.name}</span>
          </div>
        ))}
      </nav>

      <style jsx global>{`
        * {
          -webkit-tap-highlight-color: transparent !important;
          -webkit-touch-callout: none !important;
        }
        body { background-color: #050b14; margin: 0; padding: 0; }
        .nav-item:active { background-color: transparent !important; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </main>
  );
}
