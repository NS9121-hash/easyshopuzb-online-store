import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

// Supabase ulanishi (Mahsulotlarni olish uchun)
const supabase = createClient(
  "https://muwjzycdzavfmasbnsl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU"
);

export default async function Home() {
  // Bazadan mahsulotlarni olish (Hammasini to'g'ri o'qishi uchun)
  const { data: products } = await supabase.from('products').select('*');

  return (
    <main className="min-h-screen relative text-white">
      {/* 🖼️ YANGI ORQA FON RASMI (Hech narsani buzmaydi) */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/public/IMG_2933.jpeg" // Siz yuklagan rasm nomi
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Rasmni biroz xiralashtirish (Kiyimlar tiniqroq ko'rinishi uchun) */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      </div>

      {/* 🏠 ASOSIY KONTENT (Sizning mavjud dizayningiz to'liqligicha saqlangan) */}
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex justify-between items-center py-8">
          <h1 className="text-4xl font-bold tracking-tighter drop-shadow-lg">
            EASYSHOP <span className="text-blue-400">UZB</span>
          </h1>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 cursor-pointer">
            🛒 Savat (0)
          </div>
        </header>

        {/* 👕 MAHSULOTLAR RO'YXATI (Dizayn to'liq saqlangan) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products?.map((product) => (
            <div 
              key={product.id} 
              className="group bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 hover:border-blue-400 transition-all duration-300 shadow-2xl"
            >
              <div className="relative h-80 w-full mb-4 overflow-hidden rounded-2xl">
                <img 
               src={product.image_url} 
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
              <p className="text-blue-300 font-bold text-lg mb-2">{product.price} so'm</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">O'lcham: {product.size}</span>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-colors">
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
