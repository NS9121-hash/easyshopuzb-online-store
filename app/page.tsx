import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://muwjzycdzavfmasbnsl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU"
);

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*');

  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex justify-between items-center py-8 border-b border-white/10 mb-8">
          <h1 className="text-3xl font-black tracking-tighter">
            EASYSHOP <span className="text-blue-500">UZB</span>
          </h1>
          <div className="bg-white/5 border border-white/10 px-5 py-2 rounded-full font-medium">
            🛒 Savat (0)
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products?.map((product) => (
            <div key={product.id} className="bg-[#0f172a] rounded-3xl p-5 border border-white/5 shadow-2xl">
              <div className="relative h-80 w-full mb-6 overflow-hidden rounded-2xl bg-[#1e293b]">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-blue-400 font-extrabold text-2xl mb-4">{product.price} so'm</p>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-gray-400">O'lcham: {product.size}</span>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold active:scale-95 transition-transform">
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
