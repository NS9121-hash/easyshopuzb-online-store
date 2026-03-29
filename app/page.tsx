import { createClient } from '@supabase/supabase-js';

// 1. Bazaga ulanish
const supabase = createClient(
  "https://muwjzycdzavfmasbnsl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU"
);

// 2. Keshni tozalash
export const revalidate = 0;

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*');

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 🖼️ ORQA FON RASMI (100% Qotirilgan) */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: "url('/IMG_2933.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -10,
        backgroundColor: '#0a192f'
      }}>
        {/* Rasmni biroz qoraytirish (Kiyimlar va yozuvlar tiniq ko'rinishi uchun) */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}></div>
      </div>

      {/* 🏠 ASOSIY QISM VA YOZUVLAR */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', position: 'relative', zIndex: 1 }}>
        
        {/* Tepa qism (Header) */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', marginBottom: '30px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: 'white', margin: 0 }}>
            EASYSHOP <span style={{ color: '#38bdf8' }}>UZB</span>
          </h1>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '10px 20px', borderRadius: '30px', color: 'white', fontWeight: 'bold' }}>
            🛒 Savat (0)
          </div>
        </header>

        {/* Xatolik / Baza bo'sh bo'lsa */}
        {(!products || products.length === 0) && (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'rgba(255, 255, 255, 0.05)', WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }}>
            <h2 style={{ fontSize: '20px', margin: 0 }}>Hozircha saytda mahsulotlar yo'q.</h2>
          </div>
        )}

        {/* 👕 MAHSULOTLAR (Shishasimon "Glassmorphism" kartochkalar) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {products?.map((product) => (
            <div key={product.id} style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              WebkitBackdropFilter: 'blur(10px)', 
              backdropFilter: 'blur(10px)', 
              border: '1px solid rgba(255, 255, 255, 0.15)', 
              borderRadius: '20px', 
              padding: '15px',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
            }}>
              {/* Rasm */}
              <div style={{ width: '100%', height: '300px', borderRadius: '15px', overflow: 'hidden', marginBottom: '15px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              {/* Ma'lumotlar */}
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '18px', color: 'white', margin: '0 0 5px 0' }}>{product.name}</h3>
                <p style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold', margin: '0 0 15px 0' }}>{product.price} so'm</p>
              </div>
              
              {/* Tugma va o'lcham */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '15px' }}>
                <span style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 'bold' }}>{product.size}</span>
                <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Sotib olish
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
