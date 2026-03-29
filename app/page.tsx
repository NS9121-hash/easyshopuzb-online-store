import { createClient } from '@supabase/supabase-js';

// Bazaga ulanish
const supabase = createClient(
  "https://muwjzycdzavfmasbnsl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU"
);

// Keshni o'chirish (Ma'lumot doim yangilanadi)
export const revalidate = 0;

export default async function Home() {
  // Bazadan ma'lumotlarni olinishi
  // UI uchun mahsulotlar hozircha kerak emas, lekin struktura uchun qoldiramiz
  const { data: products } = await supabase.from('products').select('*');

  return (
    <main className="min-h-screen relative text-white font-sans overflow-hidden">
      {/* 🖼️ ORQA FON RASMI */}
      <div className="fixed inset-0 -z-10 bg-[#0a1122]">
        <img
          src="/public/background.png" // Bu image_20.png loyihada deb taxmin qilamiz
          alt="Background"
          className="object-cover w-full h-full opacity-70"
        />
      </div>

      {/* 👑 TEPADAGI YOZUVLAR */}
      <header className="flex flex-col items-center pt-10 pb-4 z-10 relative">
        <h1 className="text-3xl font-extrabold tracking-tighter text-white">
          EASYSHOP_<span className="text-[#fbbf24]">UZB</span>
        </h1>
        <p className="text-[11px] font-semibold text-white tracking-[6px] mt-1 opacity-90 uppercase">
          OSON ONLINE XARID
        </p>
      </header>

      {/* 🌊 O'RTADAGI KATTA KARTA */}
      <div className="flex flex-col items-center justify-center pt-8 pb-32 z-10 relative px-6">
        <div className="w-full max-w-[380px] aspect-[4/5] rounded-[40px] overflow-hidden relative border border-white/20 shadow-2xl">
          <img
            src="/public/water-intro.png" // Internetdan topilgan o'xshash suv tasviri
            alt="Welcome Water"
            className="object-cover w-full h-full"
          />
          {/* Suv ustiga overlay matnlar o'qilishi uchun */}
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-3xl font-extrabold tracking-tighter text-[#fbbf24]">
              ASSALOMU ALEYKUM
            </h2>
            <p className="text-[13px] font-semibold text-white mt-4 leading-5">
              ONLAYN DO'KONIMIZGA XUSH KELIBSIZ!
            </p>
          </div>
        </div>
      </div>

      {/* 📱 PASTDAGI MENYU (Bottom Navigation Bar) */}
      <div className="fixed bottom-0 inset-x-0 flex justify-center pb-8 z-20 px-6">
        <div className="bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 shadow-2xl px-6 py-3 w-full max-w-[400px]">
          <div className="flex justify-between items-center">
            {/* Kiyimlar */}
            <div className="flex flex-col items-center cursor-pointer">
              <div className="p-3 bg-white/10 rounded-full border border-white/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
              </div>
              <span className="text-[10px] font-bold text-[#fbbf24] mt-2">Kiyimlar</span>
            </div>

            {/* Savat */}
            <div className="flex flex-col items-center cursor-pointer relative">
              <div className="p-3 bg-white/5 rounded-full border border-white/5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                {/* Savat sanog'i */}
                <div className="absolute top-1 right-1 bg-[#fbbf24] text-black rounded-full text-[9px] font-black w-4 h-4 flex items-center justify-center">0</div>
              </div>
              <span className="text-[10px] font-bold text-white/70 mt-2">Savat</span>
            </div>

            {/* AI */}
            <div className="flex flex-col items-center cursor-pointer">
              <div className="p-3 bg-white/5 rounded-full border border-white/5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <span className="text-[10px] font-bold text-white/70 mt-2">AI</span>
            </div>

            {/* Profil */}
            <div className="flex flex-col items-center cursor-pointer">
              <div className="p-3 bg-white/5 rounded-full border border-white/5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <span className="text-[10px] font-bold text-white/70 mt-2">Profil</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
