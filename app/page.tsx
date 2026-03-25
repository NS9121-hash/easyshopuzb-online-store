// app/page.tsx
'use client';

export default function Home() {
  const balance = 150000;
  const goal = 500000;
  const percentage = (balance / goal) * 100;

  return (
    <main className="min-h-screen p-4 md:p-8 relative overflow-hidden font-sans" 
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fcf8e8 50%, #f7efd2 100%)'
      }}>
      
      {/* FONDIAGI NOZIK TILLA DOG'LAR */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#d4af37]/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#d4af37]/10 rounded-full blur-[80px]"></div>

      {/* HEADER: EASYSHOP_UZB */}
      <div className="relative z-10 text-center mt-12 mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#d4af37] leading-none">
          EASYSHOP_UZB
        </h1>
        <p className="text-[10px] md:text-xs font-medium text-gray-400 tracking-[0.4em] uppercase mt-2">
          Oson online xarid
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6 relative z-10">
        
        {/* 1. JORIY BALANS KARTASI (ASLIY LIQUID GLASS) */}
        <div className="bg-white/40 backdrop-blur-2xl border border-white/60 p-8 rounded-[38px] shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
          <p className="text-[10px] font-bold text-[#b8962e] tracking-widest uppercase mb-4">Joriy Balans</p>
          
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-5xl font-bold text-gray-800 tracking-tighter">150 000</span>
            <span className="text-lg font-light text-gray-400">BALL</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-gray-400">Maqsad: 500,000</span>
              <span className="text-[#d4af37]">30%</span>
            </div>
            {/* SILLIQ PROGRESS BAR */}
            <div className="h-2.5 bg-white/60 rounded-full border border-white shadow-inner overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#d4af37] to-[#f2e2a4] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                style={{ width: '30%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* 2. AI VIRTUAL TRY-ON (KICHIKROQ VA NAFIS) */}
        <div className="bg-white/40 backdrop-blur-2xl border border-white/60 p-6 rounded-[35px] flex flex-col items-center group cursor-pointer active:scale-95 transition-all">
          <div className="w-14 h-14 bg-[#d4af37] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#d4af37]/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">AI Kiyib Ko'rish</h3>
          <p className="text-[11px] text-gray-400 font-medium">Rasmingizni yuklang</p>
        </div>

      </div>

      {/* BOTTOM NAV BAR (TELEFON UCHUN OPTIMIZATSIYA) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-xs bg-white/60 backdrop-blur-3xl border border-white/80 p-4 rounded-[30px] shadow-2xl flex justify-around items-center">
        <div className="w-10 h-10 bg-[#d4af37]/10 rounded-full flex items-center justify-center text-[#d4af37]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
        </div>
        <div className="w-10 h-10 text-gray-300">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
      </div>

    </main>
  );
}
