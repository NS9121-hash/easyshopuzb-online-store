import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

// 1. BAZAGA ULANISH
const supabase = createClient(
  "https://muwjzycdzavfmasbnsl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU"
);

// 2. Keshni tozalash
export const revalidate = 0;

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*');

  return (
    <main style={{ backgroundColor: '#0a192f', minHeight: '100vh', position: 'relative', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* 🖼️ ORQA FON RASMI (MUKAMMAL VA BARQAROR YO'L) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <Image
          src="/IMG_2933.jpeg" // Siz yuklagan rasm nomi
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* Rasmni biroz qorong'ulashtirish (Kiyimlar va narxlar tiniq ko'rinishi uchun) */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}></div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* 🏠 ASOSIY KONTENT (Sizning dizayningiz 100% qaytarildi) */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'black', letterSpacing: '-1.5px', color: 'white' }}>
            EASYSHOP <span style={{ color: '#60a5fa' }}>UZB</span>
          </h1>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold' }}>
            🛒 Savat (0)
          </div>
        </header>

        {/* 👕 MAHSULOTLAR RO'YXATI (Dizayn to'liq qaytarildi) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {products?.map((product) => (
            <div key={product.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(2px)', rounded3xl: '20px', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ position: 'relative', height: '300px', width: '100%', marginBottom: '15px', overflow: 'hidden', borderRadius: '15px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: 'white' }}>{product.name}</h3>
              <p style={{ color: '#60a5fa', fontSize: '24px', fontWeight: 'extrabold', marginBottom: '15px' }}>{product.price} so'm</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '14px', color: '#94a3b8' }}>O'lcham: {product.size}</span>
                <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s active:scale-95' }}>
                  Sotib olish
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
