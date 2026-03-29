import { createClient } from '@supabase/supabase-js';

// 1. BAZAGA ULANISH
const supabase = createClient(
  "https://muwjzycdzavfmasbnsl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU"
);

// 2. Keshni tozalash (Doim yangi ma'lumotni ko'rsatadi)
export const revalidate = 0;

export default async function Home() {
  const { data: products, error } = await supabase.from('products').select('*');

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Tepa qism */}
        <header className="flex justify-between items-center py-6 mb-8 border-b border-slate-800">
          <h1 className="text-3xl font-bold text-white">EASYSHOP UZB</h1>
          <div className="bg-slate-800 px-4 py-2 rounded-lg text-white font-medium">🛒 Savat (0)</div>
        </header>

        {/* Agar xato bo'lsa yoki mahsulot yo'q bo'lsa */}
        {error && <p className="text-red-500 text-center py-10">Xatolik: {error.message}</p>}
        {(!products || products.length === 0) && !error && (
          <p className="text-slate-400 text-center py-10">Hozircha saytda mahsulotlar yo'q.</p>
        )}

        {/* Mahsulotlar ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products?.map((product) => (
            <div key={product.id} className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-xl">
              <div className="h-72 w-full mb-4 overflow-hidden rounded-lg bg-slate-800">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
              <p className="text-blue-400 font-bold text-2xl mb-4">{product.price} so'm</p>
              
              <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                <span className="text-slate-400 text-sm">O'lcham: {product.size}</span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold">
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
