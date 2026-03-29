import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://muwjzycdzavfmasbnsl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU"
);

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*');

  return (
    <main className="min-h-screen relative bg-[#0a192f] text-white">
      {/* 🖼️ ORQA FONNI BOSHQACHA USULDA QO'YAMIZ (Xatosiz variant) */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/IMG_2933.jpeg')",
          backgroundColor: "#0a192f" // Rasm chiqmasa, to'q ko'k rang turadi
        }}
      >
        {/* Rasmni biroz qorong'ulashtirish */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-6xl mx-auto p-6 relative z-10">
        <header className="flex justify-between items-center py-8">
          <h1 className="text-4xl font-bold tracking-tighter drop-shadow-2xl">
            EASYSHOP <span className="text-blue-400">UZB</span>
          </h1>
          <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-lg">
            🛒 Savat (0)
          </div>
        </header>

        {/* 👕 MAHSULOTLAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {products?.map((product) => (
            <div 
              key={product.id} 
              className="group bg-white/5 backdrop-blur-xl rounded-3xl p-4 border border-white/10 hover:border-blue-500/50 transition-all duration-300 shadow-2xl"
            >
              <div className="relative h-80 w-full mb-4 overflow-hidden rounded-2xl bg-gray-800">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x500?text=Rasm+yoq")}
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
              <p className="text-blue-400 font-bold text-lg mb-2">{product.price} so'm</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">O'lcham: {product.size}</span>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl transition-all active:scale-95 font-medium shadow-lg shadow-blue-900/20">
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
