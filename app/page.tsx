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

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('Clothes')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => {
    fetchItems();
    const channel = supabase
      .channel('realtime_clothes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Clothes' }, (payload) => {
        setItems((prev) => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'Clothes' }, (payload) => {
        setItems((prev) => prev.map((item) => (item.id === payload.new.id ? payload.new : item)));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'Clothes' }, (payload) => {
        setItems((prev) => prev.filter((item) => item.id !== payload.old.id));
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddToCart = (product: any) => {
    const newItem = {
      ...product,
      qty: count,
      chosenSize: selectedSize,
      chosenColor: selectedColor,
      addedAt: new Date(),
    };
    setCart((prev) => [...prev, newItem]);
    setSelectedProduct(null);
    setCount(1);
  };

  const totalCartItems = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100dvh',
        width: '100dvw',
        overflowX: 'hidden',
        backgroundColor: '#050b14',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 0 120px 0',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/IMG_2933.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      ></div>

      <header style={{ textAlign: 'center', marginBottom: '30px', zIndex: 10 }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '900',
            color: 'white',
            margin: 0,
            textShadow: '0 4px 10px rgba(0,0,0,0.5)',
          }}
        >
          EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span>
        </h1>
        <p
          style={{
            fontSize: '11px',
            fontWeight: '700',
            color: '#e2e8f0',
            letterSpacing: '4px',
            marginTop: '5px',
          }}
        >
          OSON ONLINE XARID
        </p>
      </header>

      <div style={{ width: '90%', maxWidth: '500px', zIndex: 10, position: 'relative' }}>
        {activeTab === 'Home' && (
          <div
            style={{
              width: '100%',
              aspectRatio: '4/5',
              borderRadius: '35px',
              position: 'relative',
              overflow: 'hidden',
              border: '1.5px solid rgba(255,255,255,0.2)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            >
              <source src="/-1880952146411559581.mp4" type="video/mp4" />
            </video>
            <h2
              style={{
                position: 'relative',
                zIndex: 2,
                color: '#fbbf24',
                fontSize: '28px',
                fontWeight: '900',
                textAlign: 'center',
                textShadow: '2px 2px 20px black',
              }}
            >
              ASSALOMU ALEYKUM
            </h2>
            <p
              style={{
                position: 'relative',
                zIndex: 2,
                color: 'white',
                fontSize: '11px',
                fontWeight: '700',
                textAlign: 'center',
                marginTop: '10px',
                textShadow: '2px 2px 15px black',
              }}
            >
              ONLAYN KIYIM DO'KONIMIZGA XUSH KELIBSIZ
            </p>
          </div>
        )}

        {activeTab === 'Kiyimlar' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedProduct(item);
                  setSelectedImageIndex(0);
                  setSelectedSize(item.sizes ? item.sizes.split(',')[0].trim() : '');
                  setSelectedColor(item.colors ? item.colors.split(',')[0].trim() : '');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '18px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <img
                  src={item.image_url?.split(',')[0].trim()}
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }}
                />
                <div style={{ padding: '12px' }}>
                  <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '800' }}>
                    {item.price?.toLocaleString()} so'm
                  </div>
                  <p style={{ color: 'white', fontSize: '12px', opacity: 0.8 }}>{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Savat' && (
          <div style={{ color: 'white' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>SAVAT BO'SH</div>
            ) : (
              cart.map((c, i) => <div key={i}>{c.name}</div>)
            )}
          </div>
        )}

        {/* DIZAYN UCHUN KERAKLI BARCHA BO'LIMLAR */}
        {activeTab === 'Look' && <div style={{ color: 'white', textAlign: 'center' }}>LOOK BOOK</div>}
        {activeTab === 'Yoqtirganlar' && <div style={{ color: 'white', textAlign: 'center' }}>SEVIMLILAR</div>}
        {activeTab === 'AI' && <div style={{ color: 'white', textAlign: 'center' }}>AI STYLE</div>}
        {activeTab === 'Profil' && <div style={{ color: 'white', textAlign: 'center' }}>PROFIL</div>}
      </div>

      {selectedProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '90dvh',
              background: '#141e32',
              borderRadius: '30px 30px 0 0',
              padding: '20px',
              overflowY: 'auto',
            }}
          >
            <div
              onClick={() => setSelectedProduct(null)}
              style={{ width: '40px', height: '5px', background: '#333', margin: '0 auto 20px' }}
            ></div>
            <img
              src={selectedProduct.image_url.split(',')[selectedImageIndex].trim()}
              style={{ width: '100%', borderRadius: '20px' }}
            />
            <div style={{ color: 'white', marginTop: '20px' }}>
              <h2 style={{ color: '#fbbf24' }}>{selectedProduct.price.toLocaleString()} so'm</h2>
              <p>{selectedProduct.name}</p>
              
              {/* O'lchamlar qatori */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                {selectedProduct.sizes?.split(',').map((s:any) => (
                  <div key={s} onClick={() => setSelectedSize(s)} style={{ padding: '10px', border: '1px solid #fbbf24', color: selectedSize === s ? '#000' : '#fff', background: selectedSize === s ? '#fbbf24' : 'transparent' }}>{s}</div>
                ))}
              </div>

              {/* Miqdor va Savat */}
              <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#222', padding: '10px', borderRadius: '10px' }}>
                  <button onClick={() => count > 1 && setCount(count - 1)} style={{ color: 'white', background: 'none', border: 'none', fontSize: '20px' }}>-</button>
                  <span>{count}</span>
                  <button onClick={() => setCount(count + 1)} style={{ color: 'white', background: 'none', border: 'none', fontSize: '20px' }}>+</button>
                </div>
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  style={{ flex: 1, background: '#fbbf24', border: 'none', fontWeight: 'bold', borderRadius: '10px' }}
                >
                  SAVATGA QO'SHISH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATSIYA - 7 TA IKONKA */}
      <nav
        style={{
          position: 'fixed',
          bottom: '25px',
          width: '92%',
          maxWidth: '440px',
          height: '70px',
          borderRadius: '35px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 100,
        }}
      >
        {[
          { id: 'Home', name: 'ASOSIY', icon: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
          { id: 'Kiyimlar', name: 'KIYIMLAR', icon: 'M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z' },
          { id: 'Look', name: 'LOOK', icon: 'M6 3h12l4 6-10 13L2 9Z' },
          { id: 'Yoqtirganlar', name: 'YOQTIRGAN', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
          { id: 'Savat', name: 'SAVAT', icon: 'M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' },
          { id: 'AI', name: 'AI', icon: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' },
          { id: 'Profil', name: 'PROFIL', icon: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' },
        ].map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={activeTab === tab.id ? '#fbbf24' : 'white'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={tab.icon} />
              {tab.id === 'Profil' && <circle cx="12" cy="7" r="4"></circle>}
            </svg>
            <span style={{ fontSize: '7px', color: activeTab === tab.id ? '#fbbf24' : 'white', marginTop: '4px' }}>
              {tab.name}
            </span>
          </div>
        ))}
      </nav>

      <style jsx global>{`
        * {
          -webkit-tap-highlight-color: transparent !important;
          outline: none !important;
        }
      `}</style>
    </main>
  );
}
