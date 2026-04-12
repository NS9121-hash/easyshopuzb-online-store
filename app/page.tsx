'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- KONFIGURATSIYA ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  // --- ASOSIY HOLATLAR (STATE) ---
  const [activeTab, setActiveTab] = useState('Home');
  const [items, setItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]); 
  const [favorites, setFavorites] = useState<any[]>([]); 
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [count, setCount] = useState(1);
  
  // --- MAHSULOT DETALLARI ---
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // --- SAVAT VA BUYURTMA ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [userData, setUserData] = useState({ 
    name: '', 
    phone: '', 
    address: '', 
    telegram: '',
    comment: '' 
  });

  // --- QIDIRUV VA FILTR ---
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // --- AI VIRTUAL TRY-ON ---
  const [userImage, setUserImage] = useState<string | null>(null);
  const [clothImage, setClothImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // --- MA'LUMOTLARNI YUKLASH ---
  useEffect(() => {
    const loadData = () => {
      const savedFavs = localStorage.getItem('user_favs');
      const savedCart = localStorage.getItem('user_cart');
      
      if (savedFavs) {
        try { setFavorites(JSON.parse(savedFavs)); } catch(e) { console.error(e); }
      }
      
      if (savedCart) {
        try { setCart(JSON.parse(savedCart)); } catch(e) { console.error(e); }
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('user_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('user_cart', JSON.stringify(cart));
  }, [cart]);

  // --- SUPABASE REALTIME ---
  const fetchItems = async () => {
    if (!supabaseUrl) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Clothes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setItems(data);
      }
    } catch (err) {
      console.error("Xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    
    const clothesSubscription = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Clothes' },
        (payload) => {
          console.log('O\'zgarish yuz berdi:', payload);
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(clothesSubscription);
    };
  }, []);

  // --- FUNKSIYALAR ---
  const handleAddToCart = (product: any) => {
    const size = selectedSize || (product.sizes ? product.sizes.split(',')[0].trim() : 'Noma\'lum');
    const color = selectedColor || (product.colors ? product.colors.split(',')[0].trim() : 'Asosiy');

    setCart((prev) => {
      const isExist = prev.findIndex(
        (i) => i.id === product.id && i.chosenSize === size && i.chosenColor === color
      );

      if (isExist > -1) {
        const newCart = [...prev];
        newCart[isExist].qty += count;
        return newCart;
      }
      
      const newEntry = {
        ...product,
        qty: count,
        chosenSize: size,
        chosenColor: color,
        uniqueKey: Date.now()
      };
      return [...prev, newEntry];
    });

    setSelectedProduct(null);
    setCount(1);
    setIsCartOpen(true);
  };

  const toggleFavorite = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const found = prev.find((f) => f.id === product.id);
      if (found) {
        return prev.filter((f) => f.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, mode: 'user' | 'cloth') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (mode === 'user') setUserImage(reader.result as string);
        else setClothImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAI = async () => {
    if (!userImage || !clothImage) {
      alert("Iltimos, rasmlarni to'liq yuklang!");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await fetch('/api/vton', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_image: userImage, cloth_image: clothImage }),
      });
      const data = await response.json();
      if (data.success) {
        setAiResult(data.image_url);
      }
    } catch (error) {
      console.error("AI xatosi");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- HISOBLASH ---
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const displayItems = items.filter(item => {
    const nameMatch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'Kiyimlar') return nameMatch && (item.type === 'clothing' || !item.type);
    if (activeTab === 'Look') return nameMatch && item.type === 'look';
    if (activeTab === 'Yoqtirganlar') return nameMatch && favorites.some(f => f.id === item.id);
    return nameMatch;
  });

  return (
    <main style={{ 
      position: 'relative', 
      minHeight: '100dvh', 
      width: '100vw', 
      backgroundColor: '#050b14', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '40px 0 120px 0', 
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* BACKGROUND LAYER */}
      <div style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "url('/IMG_2933.jpeg')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        opacity: 0.35, 
        zIndex: 0 
      }}></div>

      {/* HEADER SECTION */}
      <header style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '38px', 
          fontWeight: '950', 
          color: 'white', 
          margin: 0, 
          textShadow: '0 5px 20px rgba(0,0,0,0.8)',
          letterSpacing: '-1.5px'
        }}>
          EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span>
        </h1>
        <div style={{ 
          width: '60px', 
          height: '4px', 
          backgroundColor: '#fbbf24', 
          margin: '12px auto', 
          borderRadius: '10px' 
        }}></div>
        <p style={{ 
          fontSize: '11px', 
          fontWeight: '700', 
          color: '#e2e8f0', 
          letterSpacing: '5px', 
          textTransform: 'uppercase' 
        }}>
          PREMIUM STORE
        </p>
      </header>

      {/* CONTENT AREA */}
      <div style={{ width: '92%', maxWidth: '480px', position: 'relative', zIndex: 10 }}>
        
        {/* TAB: HOME */}
        {activeTab === 'Home' && (
          <section style={{ animation: 'fadeIn 0.6s ease' }}>
            <div style={{ 
              width: '100%', 
              aspectRatio: '4/5', 
              borderRadius: '45px', 
              position: 'relative', 
              overflow: 'hidden', 
              boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              <video 
                ref={videoRef} 
                autoPlay muted loop playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src="/-1880952146411559581.mp4" type="video/mp4" />
              </video>
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to top, rgba(5,11,20,0.9) 0%, transparent 60%)' 
              }}></div>
              <div style={{ 
                position: 'absolute', 
                bottom: '50px', 
                left: 0, right: 0, 
                textAlign: 'center', 
                padding: '0 30px' 
              }}>
                <h2 style={{ color: '#fbbf24', fontSize: '30px', fontWeight: '900' }}>XUSH KELIBSIZ!</h2>
                <p style={{ color: 'white', fontSize: '14px', marginTop: '12px', opacity: 0.8, lineHeight: '1.5' }}>
                  Eng zamonaviy va sifatli kiyimlar to'plami faqat bizda.
                </p>
                <button 
                  onClick={() => setActiveTab('Kiyimlar')}
                  style={{ 
                    marginTop: '25px', 
                    padding: '16px 40px', 
                    borderRadius: '20px', 
                    background: 'white', 
                    border: 'none', 
                    fontWeight: '900', 
                    color: '#050b14',
                    fontSize: '14px',
                    boxShadow: '0 10px 20px rgba(255,255,255,0.2)'
                  }}
                >
                  KATALOGNI KO'RISH
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TAB: SHOPPING (KIYIMLAR, LOOK, FAV) */}
        {(activeTab === 'Kiyimlar' || activeTab === 'Look' || activeTab === 'Yoqtirganlar') && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ marginBottom: '25px' }}>
              <input 
                type="text" 
                placeholder="Qidiruv..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '18px 25px', 
                  borderRadius: '22px', 
                  background: 'rgba(255,255,255,0.07)', 
                  border: '1px solid rgba(255,255,255,0.12)', 
                  color: 'white', 
                  fontSize: '16px',
                  backdropFilter: 'blur(10px)'
                }}
              />
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '18px' 
            }}>
              {displayItems.map((item) => {
                const img = item.image_url ? item.image_url.split(',')[0] : '';
                const liked = favorites.some(f => f.id === item.id);
                return (
                  <div 
                    key={item.id} 
                    onClick={() => { setSelectedProduct(item); setCount(1); }}
                    style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '28px', 
                      border: '1px solid rgba(255,255,255,0.08)', 
                      overflow: 'hidden', 
                      position: 'relative' 
                    }}
                  >
                    <button 
                      onClick={(e) => toggleFavorite(e, item)}
                      style={{ 
                        position: 'absolute', 
                        top: '12px', right: '12px', 
                        zIndex: 5, 
                        background: 'rgba(0,0,0,0.3)', 
                        border: 'none', 
                        borderRadius: '50%', 
                        padding: '8px',
                        display: 'flex', alignItems: 'center'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : "white"} strokeWidth="2.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    <div style={{ aspectRatio: '3/4' }}>
                      <img src={img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '15px' }}>
                      <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '900' }}>
                        {item.price?.toLocaleString()} <span style={{fontSize: '11px'}}>UZS</span>
                      </div>
                      <div style={{ 
                        color: 'white', 
                        fontSize: '12px', 
                        marginTop: '6px', 
                        opacity: 0.7,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: AI */}
        {activeTab === 'AI' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '35px', padding: '30px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <h3 style={{ color: '#fbbf24', fontSize: '24px', fontWeight: '900' }}>AI VIRTUAL FITTING</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '25px', aspectRatio: '1/1', border: '2px dashed rgba(255,255,255,0.2)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {userImage ? <img src={userImage} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span style={{fontSize:'11px'}}>RASMINGIZ</span>}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'user')} style={{position:'absolute', inset:0, opacity:0}} />
                </div>
                <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '25px', aspectRatio: '1/1', border: '2px dashed rgba(255,255,255,0.2)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {clothImage ? <img src={clothImage} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span style={{fontSize:'11px'}}>KIYIM RASMI</span>}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'cloth')} style={{position:'absolute', inset:0, opacity:0}} />
                </div>
              </div>
              <button onClick={runAI} style={{ width: '100%', marginTop: '25px', padding: '18px', background: '#fbbf24', borderRadius: '20px', fontWeight: '900', border: 'none', color: '#050b14' }}>
                {isProcessing ? "TAYYORLANMOQDA..." : "KIYIB KO'RISH"}
              </button>
            </div>
            {aiResult && <div style={{ marginTop: '30px' }}><img src={aiResult} style={{ width: '100%', borderRadius: '30px' }} /></div>}
          </div>
        )}

        {/* TAB: PROFILE */}
        {activeTab === 'Profil' && (
          <div style={{ animation: 'fadeIn 0.4s ease', textAlign: 'center', color: 'white' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fbbf24' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '900' }}>PROFIL</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '30px' }}>
              {['Mening buyurtmalarim', 'Manzillar', 'Dastur haqida'].map(item => (
                <div key={item} style={{ padding: '22px', background: 'rgba(255,255,255,0.04)', borderRadius: '22px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* SAVAT MODALI */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1500, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '500px', height: '88dvh', background: '#f8f9fb', borderRadius: '40px 40px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '25px', background: 'white', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eef0f2' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1d23' }}>SAVATCHA ({totalQty})</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: '#f0f2f5', border: 'none', borderRadius: '50%', width: '40px', height: '40px' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '25px' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ background: 'white', padding: '18px', borderRadius: '25px', display: 'flex', gap: '18px', marginBottom: '15px' }}>
                  <img src={item.image_url?.split(',')[0]} style={{ width: '90px', height: '110px', borderRadius: '15px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '900', color: '#1a1d23' }}>{item.price?.toLocaleString()} so'm</div>
                    <div style={{ fontSize: '13px', color: '#718096' }}>{item.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                       <span>Soni: {item.qty}</span>
                       <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} style={{ color: '#ef4444', border: 'none', background: 'none' }}>O'CHIRISH</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: '30px', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span>Jami:</span>
                  <span style={{ fontWeight: '950', fontSize: '22px' }}>{totalPrice.toLocaleString()} so'm</span>
                </div>
                <button onClick={() => { setIsCartOpen(false); setIsCheckout(true); }} style={{ width: '100%', padding: '22px', background: '#050b14', color: 'white', borderRadius: '22px', fontWeight: '900' }}>SOTIB OLISH</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODALI */}
      {isCheckout && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '500px', background: 'white', borderRadius: '40px 40px 0 0', padding: '35px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '25px' }}>MA'LUMOTLAR</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Ism Familiya" onChange={(e) => setUserData({...userData, name: e.target.value})} style={{ width: '100%', padding: '18px', borderRadius: '18px', border: '1px solid #e2e8f0' }} />
              <input type="tel" placeholder="+998" onChange={(e) => setUserData({...userData, phone: e.target.value})} style={{ width: '100%', padding: '18px', borderRadius: '18px', border: '1px solid #e2e8f0' }} />
              <button onClick={() => { alert("Qabul qilindi!"); setIsCheckout(false); setCart([]); }} style={{ width: '100%', padding: '20px', background: '#fbbf24', borderRadius: '20px', fontWeight: '900' }}>TASDIQLASH</button>
              <button onClick={() => setIsCheckout(false)} style={{ color: '#a0aec0', border: 'none', background: 'none' }}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}

      {/* MAHSULOT DETALLARI */}
      {selectedProduct && (() => {
        const pImages = selectedProduct.image_url ? selectedProduct.image_url.split(',') : [];
        const pSizes = selectedProduct.sizes ? selectedProduct.sizes.split(',').map((s:any) => s.trim()) : [];
        const pColors = selectedProduct.colors ? selectedProduct.colors.split(',').map((c:any) => c.trim()) : [];

        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)' }}>
            <div style={{ width: '100%', maxWidth: '500px', height: '94dvh', background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(40px)', borderRadius: '45px 45px 0 0', border: '1px solid rgba(255,255,255,0.12)', overflowY: 'auto' }}>
              <div onClick={() => setSelectedProduct(null)} style={{ width: '45px', height: '5px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', margin: '18px auto' }}></div>
              <div style={{ padding: '0 25px 50px' }}>
                <div style={{ width: '100%', height: '38vh', borderRadius: '30px', overflow: 'hidden', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={pImages[selectedImageIndex]} alt="product" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ marginTop: '30px' }}>
                  <h2 style={{ color: '#fbbf24', fontSize: '36px', fontWeight: '950' }}>{selectedProduct.price?.toLocaleString()} UZS</h2>
                  <h3 style={{ color: 'white', fontSize: '20px', marginTop: '10px' }}>{selectedProduct.name}</h3>
                  <div style={{ marginTop: '25px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: '800' }}>RANG:</p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                      {pImages.map((img: any, idx: number) => (
                        <div key={idx} onClick={() => { setSelectedImageIndex(idx); setSelectedColor(pColors[idx] || ''); }} style={{ width: '60px', aspectRatio: '3/4', borderRadius: '12px', border: selectedImageIndex === idx ? '2px solid #fbbf24' : '1px solid white', overflow: 'hidden' }}>
                          <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '15px' }}>
                      <button onClick={() => count > 1 && setCount(count-1)} style={{ padding: '15px', color: 'white', background: 'none', border: 'none', fontSize: '20px' }}>-</button>
                      <span style={{ color: 'white', fontWeight: 'bold' }}>{count}</span>
                      <button onClick={() => setCount(count+1)} style={{ padding: '15px', color: 'white', background: 'none', border: 'none', fontSize: '20px' }}>+</button>
                    </div>
                    <button onClick={() => handleAddToCart(selectedProduct)} style={{ flex: 1, background: '#fbbf24', borderRadius: '15px', fontWeight: '900', border: 'none' }}>SAVATGA QO'SHISH</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* FOOTER NAV */}
      <nav style={{ position: 'fixed', bottom: '30px', width: '92%', maxWidth: '450px', height: '80px', borderRadius: '40px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(35px)', border: '1px solid rgba(255, 255, 255, 0.12)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1100 }}>
        {[
          { id: 'Home', n: 'ASOSIY', i: <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/> },
          { id: 'Kiyimlar', n: 'KIYIM', i: <path d="M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/> },
          { id: 'Look', n: 'LOOK', i: <path d="M6 3h12l4 6-10 13L2 9Z" /> }, 
          { id: 'Yoqtirganlar', n: 'FAV', i: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /> },
          { id: 'Savat', n: 'SAVAT', i: <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /> },
          { id: 'AI', n: 'AI', i: <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12" /> },
          { id: 'Profil', n: 'PROFIL', i: <circle cx="12" cy="7" r="4" /> },
        ].map((t) => (
          <div key={t.id} onClick={() => t.id === 'Savat' ? setIsCartOpen(true) : setActiveTab(t.id)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activeTab === t.id ? '#fbbf24' : 'white'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{t.i}</svg>
            <span style={{ fontSize: '8px', color: activeTab === t.id ? '#fbbf24' : 'white', fontWeight: '900' }}>{t.n}</span>
          </div>
        ))}
      </nav>

      <style jsx global>{`
        body { margin: 0; background-color: #050b14; }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </main>
  );
}
