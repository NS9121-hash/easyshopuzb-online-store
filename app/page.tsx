'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [activeTab, setActiveTab] = useState('Kiyimlar'); // Katalogdan boshlaymiz
  const [items, setItems] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [count, setCount] = useState(1);

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase.from('Clothes').select('*').order('created_at', { ascending: false });
      if (data) setItems(data);
    };
    fetchItems();

    const channel = supabase.channel('realtime_clothes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Clothes' }, (payload) => setItems((prev) => [payload.new, ...prev]))
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'Clothes' }, (payload) => setItems((prev) => prev.filter(item => item.id !== payload.old.id)))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <main style={{
      minHeight: '100dvh', width: '100dvw', overflowX: 'hidden',
      backgroundColor: '#050b14', // Ko'k-qora fon
      color: 'white', fontFamily: 'system-ui, sans-serif',
      padding: '20px 0 120px 0', boxSizing: 'border-box'
    }}>

      {/* 👑 LOGO HUDUDI */}
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: 'white', margin: 0 }}>
          EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span>
        </h1>
        <p style={{ fontSize: '10px', color: '#88aaff', letterSpacing: '4px', textTransform: 'uppercase' }}>OSON ONLINE XARID</p>
      </header>

      {/* 🔄 KONTENT KONTEYNERI */}
      <div style={{ width: '92%', margin: '0 auto', position: 'relative' }}>
        
        {/* --- 🛍️ KIYIMLAR (YANGI UZUM GLASS DIZAYNI) --- */}
        {activeTab === 'Kiyimlar' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', animation: 'fadeIn 0.5s ease' }}>
            {items.map((item) => (
              <div key={item.id} style={{
                background: 'rgba(255, 255, 255, 0.05)', // Juda yengil glass fon
                borderRadius: '24px',
                border: '1.5px solid rgba(255, 255, 255, 0.1)', // Glass border
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}>
                {/* MAHSULOT RASMI - BOSGANDA TAFSILOTLAR OCHILADI */}
                <div onClick={() => { setSelectedProduct(item); setCount(1); }} style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', cursor: 'pointer' }}>
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* MA'LUMOTLAR */}
                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '800' }}>
                    {item.price?.toLocaleString()} <span style={{fontSize: '10px'}}>so'm</span>
                  </div>
                  <p style={{ color: 'white', fontSize: '12px', margin: '8px 0', height: '2.8em', overflow: 'hidden', opacity: 0.9 }}>
                    {item.name}
                  </p>
                  
                  {/* SIZ SO'RAGAN TUGMA - BOSGANDA SAVATGA O'TADI */}
                  <button 
                    onClick={() => setActiveTab('Savat')}
                    style={{
                      marginTop: '12px', width: '100%',
                      padding: '12px', backgroundColor: '#7000FF', // Uzum binafsha
                      color: 'white', border: 'none', borderRadius: '14px',
                      fontSize: '11px', fontWeight: '800', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    BUYURTMA BERISH
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Savat' && <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>SAVATCHANGIZ BO'SH</div>}
      </div>

      {/* 🛍️ MODAL (MAHSULOT SAHIFASI) - TOZALANGAN QISM */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'white', zIndex: 1000, display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease-out', color: '#1a1a1a' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', fontSize: '20px' }}>✕</button>
            <img src={selectedProduct.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ padding: '25px', flex: 1, backgroundColor: 'white', borderRadius: '30px 30px 0 0', marginTop: '-30px', position: 'relative' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#5A31F4' }}>{selectedProduct.price?.toLocaleString()} so'm</div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginTop: '10px' }}>{selectedProduct.name}</h2>
            
            {/* O'lcham bloki */}
            <div style={{ marginTop: '20px', padding: '12px', background: '#f8f9fa', borderRadius: '12px', fontSize: '13px', color: '#555' }}>
              📏 O'lcham: <span style={{fontWeight: 'bold', color: '#000'}}>{selectedProduct.sizes}</span>
            </div>

            {/* PASTDAGI TUGMALAR (FIXED) */}
            <div style={{ position: 'absolute', bottom: '30px', left: '20px', right: '20px', display: 'flex', gap: '12px' }}>
              {/* SONINI TANLASH */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: '16px', padding: '4px' }}>
                <button onClick={() => count > 1 && setCount(count-1)} style={{ border: 'none', width: '45px', height: '45px', fontSize: '24px', background: 'none' }}>−</button>
                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '800', fontSize: '18px' }}>{count}</span>
                <button onClick={() => setCount(count+1)} style={{ border: 'none', width: '45px', height: '45px', fontSize: '24px', background: 'none' }}>+</button>
              </div>

              {/* O'TISH TUGMASI */}
              <button 
                onClick={() => { setSelectedProduct(null); setActiveTab('Savat'); }}
                style={{ flex: 1, backgroundColor: '#E5E1FF', color: '#5A31F4', border: 'none', borderRadius: '18px', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                O'TISH
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📱 6 TALIK LIQUID GLASS MENYU */}
      <nav style={{
        position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
        width: '90%', maxWidth: '400px', height: '70px',
        borderRadius: '35px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(30px) saturate(200%)', // Menyu uchun Blur qoldirdik (chiroyli chiqadi)
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '0 10px', boxShadow: '0 15px 50px rgba(0,0,0,0.5)',
        zIndex: 100
      }}>
        {[
          { id: 'Home', name: 'Bosh sahifa', icon: (active: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#7000FF" : "none"} stroke={active ? "#7000FF" : "white"} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> },
          { id: 'Kiyimlar', name: 'Katalog', icon: (active: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#7000FF" : "white"} strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> },
          { id: 'Yurak', name: 'Yurak', icon: (active: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#7000FF" : "white"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> },
          { id: 'Savat', name: 'Savat', icon: (active: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#7000FF" : "white"} strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg> },
          { id: 'AI', name: 'AI', icon: (active: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#7000FF" : "white"} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> },
          { id: 'Profil', name: 'Profil', icon: (active: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#7000FF" : "white"} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> }
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              flex: 1, textAlign: 'center', color: active ? '#7000FF' : 'white'
            }}>
              {tab.icon(active)}
              <span style={{ fontSize: '9px', fontWeight: active ? '700' : '500', transition: '0.2s' }}>
                {tab.name}
              </span>
            </div>
          );
        })}
      </nav>

      {/* GLOBAL CSS */}
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </main>
  );
}
