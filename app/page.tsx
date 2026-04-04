'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase konfiguratsiyasi
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  // Asosiy holatlar (states)
  const [activeTab, setActiveTab] = useState('Home');
  const [items, setItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]); 
  const [favorites, setFavorites] = useState<any[]>([]); // Yoqtirganlar uchun state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [count, setCount] = useState(1);
  
  // Mahsulot detallari uchun holatlar
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false); // Rasmni to'liq ko'rish uchun

  const videoRef = useRef<HTMLVideoElement>(null);

  // Savatga qo'shish funksiyasi
  const handleAddToCart = (product: any) => {
    const newItem = { 
      ...product, 
      qty: count, 
      chosenSize: selectedSize, 
      chosenColor: selectedColor, 
      addedAt: new Date() 
    };
    setCart((prev) => [...prev, newItem]);
    setSelectedProduct(null);
  };

  // ✅ Yoqtirganlarga qo'shish funksiyasi
  const toggleFavorite = (e: React.MouseEvent, product: any) => {
    e.stopPropagation(); // Kartani ochilib ketishidan saqlaydi
    setFavorites((prev) => {
      const isExist = prev.find((fav) => fav.id === product.id);
      if (isExist) {
        return prev.filter((fav) => fav.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Ma'lumotlarni bazadan olish
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('Clothes')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  // Real-time o'zgarishlarni kuzatish
  useEffect(() => {
    fetchItems();
    const channel = supabase.channel('realtime_clothes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Clothes' }, (payload) => { 
        setItems((prev) => [payload.new, ...prev]); 
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'Clothes' }, (payload) => { 
        setItems((prev) => prev.map(item => item.id === payload.new.id ? payload.new : item)); 
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'Clothes' }, (payload) => { 
        setItems((prev) => prev.filter(item => item.id !== payload.old.id)); 
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const totalCartItems = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <main style={{ position: 'relative', minHeight: '100dvh', width: '100dvw', overflowX: 'hidden', backgroundColor: '#050b14', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '40px 0 120px 0', boxSizing: 'border-box' }}>
      {/* Orqa fon */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/IMG_2933.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '30px', zIndex: 10 }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: 0, textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span></h1>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '4px', marginTop: '5px' }}>OSON ONLINE XARID</p>
      </header>

      {/* Asosiy kontent maydoni */}
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
              const isLiked = favorites.some((fav) => fav.id === item.id);
              return (
                <div key={item.id} 
                  tabIndex={-1}
                  onClick={() => { 
                    setSelectedProduct(item); setCount(1); setSelectedImageIndex(0); 
                    setSelectedSize(item.sizes ? item.sizes.split(',')[0].trim() : '');
                    setSelectedColor(item.colors ? item.colors.split(',')[0].trim() : '');
                  }} 
                  style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(15px) saturate(180%)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', position: 'relative' }}>
                  
                  {/* ✅ LIQUID GLASS HEART BUTTON WITH BLUE COLOR */}
                  <div 
                    onClick={(e) => toggleFavorite(e, item)}
                    style={{ 
                      position: 'absolute', top: '10px', right: '10px', zIndex: 20, 
                      width: '32px', height: '32px', borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)', transition: '0.3s'
                    }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "#3b82f6" : "none"} stroke={isLiked ? "#3b82f6" : "white"} strokeWidth="2.5">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>

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

        {/* ✅ YOQTIRGANLAR BO'LIMI - DINAMIK RENDERING */}
        {activeTab === 'Yoqtirganlar' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '20px', fontSize: '18px' }}>YOQTIRGANLAR ({favorites.length})</h3>
            {favorites.length === 0 ? (
              <div style={{ color: 'white', textAlign: 'center', padding: '50px', background: 'rgba(255,255,255,0.05)', borderRadius: '25px' }}>YOQTIRGANLAR BO'SH</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                {favorites.map((item) => (
                  <div key={item.id} 
                    onClick={() => setSelectedProduct(item)}
                    style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden', position: 'relative' }}>
                    <div onClick={(e) => toggleFavorite(e, item)} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 20, width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(239, 68, 68, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                    </div>
                    <img src={item.image_url.split(',')[0]} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
                    <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
                      <div style={{ color: '#fbbf24', fontSize: '16px', fontWeight: '800' }}>{item.price?.toLocaleString()} so'm</div>
                      <p style={{ color: 'white', fontSize: '11px', marginTop: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Look' && <div style={{ color: '#fbbf24', textAlign: 'center', padding: '50px', fontWeight: 'bold' }}>PREMIUM LOOKS TEZ ORADA</div>}
        {activeTab === 'AI' && <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>AI YORDAMCHI TEZ ORADA</div>}
      </div>

      {/* MAHSULOT DETALLARI MODALI */}
      {selectedProduct && (() => {
        const productImages = selectedProduct.image_url ? selectedProduct.image_url.split(',') : [];
        const productSizes = selectedProduct.sizes ? selectedProduct.sizes.split(',').map((s:string) => s.trim()) : [];
        const productColors = selectedProduct.colors ? selectedProduct.colors.split(',').map((c:string) => c.trim()) : [];

        return (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.3s ease' }}>
              
              <div style={{ width: '100%', maxWidth: '500px', height: '94dvh', position: 'relative', animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(20, 30, 50, 0.45)', backdropFilter: 'blur(50px) saturate(200%)', WebkitBackdropFilter: 'blur(50px) saturate(200%)', borderRadius: '35px 35px 0 0', border: '1.5px solid rgba(255,255,255,0.2)', borderBottom: 'none', zIndex: 0, pointerEvents: 'none' }}></div>

                <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', paddingBottom: '30px' }}>
                  
                  <div onClick={() => setSelectedProduct(null)} style={{ width: '50px', height: '5px', background: 'rgba(255,255,255,0.5)', borderRadius: '10px', margin: '15px auto', cursor: 'pointer', flexShrink: 0 }}></div>
                  <button tabIndex={-1} onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: '38px', height: '38px', color: 'white', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent', outline: 'none' }}>✕</button>

                  {/* RASM BLOKI - BOSILGANDA KATTALASHADI */}
                  <div 
                    onClick={() => setIsFullScreen(true)}
                    style={{ position: 'relative', width: '100%', height: '28vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 25px 0 25px', flexShrink: 0, background: '#DCDCDC', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)', cursor: 'zoom-in' }}>
                    <img src={productImages[selectedImageIndex]} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '16px', boxShadow: '0 15px 35px rgba(0,0,0,0.5)', objectFit: 'contain' }} />
                    <div style={{ position: 'absolute', bottom: '10px', right: '35px', background: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '50%', color: 'white' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                    </div>
                  </div>

                  <div style={{ padding: '15px 25px', color: 'white', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '32px', fontWeight: '900', color: '#fbbf24', letterSpacing: '-1px', textShadow: '0 4px 15px rgba(251, 191, 36, 0.3)' }}>{selectedProduct.price?.toLocaleString()} <span style={{fontSize: '14px', color: 'rgba(255,255,255,0.6)'}}>so'm</span></div>
                      <div style={{ padding: '6px 12px', background: 'rgba(251,191,36,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(251,191,36,0.5)', borderRadius: '12px', color: '#fbbf24', fontSize: '10px', fontWeight: '900', letterSpacing: '1px' }}>PREMIUM</div>
                    </div>
                    
                    {/* Ranglar/Rasm tanlash */}
                    {productImages.length > 0 && (
                      <div style={{ marginTop: '15px' }}>
                        <div style={{ fontSize: '13px', color: 'white', fontWeight: '700', marginBottom: '10px', letterSpacing: '0.5px' }}>
                          <span style={{color: 'rgba(255,255,255,0.5)'}}>RANG: </span> 
                          {productColors[selectedImageIndex] || `Maxsus Rang`}
                        </div>
                        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
                          {productImages.map((img: string, idx: number) => (
                            <div key={idx} 
                              onClick={() => { setSelectedImageIndex(idx); setSelectedColor(productColors[idx] || `Maxsus Rang`); }} 
                              style={{ 
                                minWidth: '60px', width: '60px', aspectRatio: '3/4', borderRadius: '12px', 
                                border: selectedImageIndex === idx ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.2)', 
                                overflow: 'hidden', opacity: selectedImageIndex === idx ? 1 : 0.6, transition: '0.3s'
                              }}>
                              <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* O'lchamlar */}
                    {productSizes.length > 0 && productSizes[0] !== '' && (
                      <div style={{ marginTop: '15px' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '800', marginBottom: '10px' }}>O'LCHAMLAR:</div>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {productSizes.map((size: string, i: number) => (
                            <div key={i} onClick={() => setSelectedSize(size)} 
                              style={{ width: '48px', height: '48px', borderRadius: '14px', 
                                background: selectedSize === size ? '#fbbf24' : 'rgba(255,255,255,0.08)', 
                                color: selectedSize === size ? '#050b14' : 'white', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '900', 
                                border: '1px solid', borderColor: selectedSize === size ? '#fbbf24' : 'rgba(255,255,255,0.3)'
                              }}>
                              {size}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Soni va Savatga qo'shish */}
                    <div style={{ marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '18px', padding: '4px', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <button onClick={() => count > 1 && setCount(count-1)} style={{ border: 'none', background: 'none', color: 'white', fontSize: '22px', width: '45px', height: '45px' }}>−</button>
                        <span style={{ minWidth: '18px', textAlign: 'center', fontWeight: '900', fontSize: '18px' }}>{count}</span>
                        <button onClick={() => setCount(count+1)} style={{ border: 'none', background: 'none', color: 'white', fontSize: '22px', width: '45px', height: '45px' }}>+</button>
                      </div>
                      <button onClick={() => handleAddToCart(selectedProduct)} 
                        style={{ flex: 1, height: '55px', background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)', color: '#050b14', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '14px', boxShadow: '0 15px 35px rgba(251, 191, 36, 0.4)' }}>
                        SAVATGA QO'SHISH
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RASMNI TO'LIQ EKRANDA KO'RISH MODALI */}
            {isFullScreen && (
              <div 
                onClick={() => setIsFullScreen(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
                <button style={{ position: 'absolute', top: '40px', right: '20px', background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', fontWeight: 'bold' }}>✕</button>
                <img 
                  src={productImages[selectedImageIndex]} 
                  style={{ maxWidth: '95%', maxHeight: '85%', objectFit: 'contain', borderRadius: '10px', boxShadow: '0 0 50px rgba(255,255,255,0.1)' }} 
                  onClick={(e) => e.stopPropagation()} 
                />
              </div>
            )}
          </>
        );
      })()}

      {/* Navigatsiya menyusi */}
      <nav style={{ position: 'fixed', bottom: '30px', width: '95%', maxWidth: '440px', height: '70px', borderRadius: '35px', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(25px)', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 8px', zIndex: 100 }}>
        {[
          { id: 'Home', name: 'ASOSIY', icon: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
          { id: 'Kiyimlar', name: 'KIYIMLAR', icon: 'M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z' },
          { id: 'Look', name: 'LOOK', icon: 'M6 3h12l4 6-10 13L2 9Z' }, 
          { id: 'Yoqtirganlar', name: 'YOQTIRGAN', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
          { id: 'Savat', name: 'SAVAT', icon: 'M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' },
          { id: 'AI', name: 'AI', icon: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' },
          { id: 'Profil', name: 'PROFIL', icon: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' },
        ].map((tab) => (
          <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1, position: 'relative' }}>
            {tab.id === 'Savat' && totalCartItems > 0 && (
              <div style={{ position: 'absolute', top: '-6px', right: '12px', background: '#ef4444', color: 'white', fontSize: '9px', fontWeight: '900', minWidth: '16px', height: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #050b14' }}>
                {totalCartItems}
              </div>
            )}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={activeTab === tab.id ? '#fbbf24' : 'white'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d={tab.icon}/>
            </svg>
            <span style={{ fontSize: '7px', color: activeTab === tab.id ? '#fbbf24' : 'white', fontWeight: '800' }}>{tab.name}</span>
          </div>
        ))}
      </nav>

      <style jsx global>{`
        * { -webkit-tap-highlight-color: transparent; outline: none !important; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </main>
  );
}

