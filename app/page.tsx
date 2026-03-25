// app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [balance, setBalance] = useState(150000);
  const goal = 500000;
  const percentage = (balance / goal) * 100;

  return (
    // ORQA FON: Tilla va Oq aralash (Liquid Style)
    <main className="min-h-screen p-6 md:p-12 font-sans overflow-hidden relative" 
      style={{
        background: 'radial-gradient(circle at top right, #fff9e6 0%, #ffffff 50%, #f3e5ab 100%)'
      }}>
      
      {/* FONDIAGI SUYUQ SHAKLLAR */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-white rounded-full blur-[100px]"></div>

      {/* ASOSIY KIRISH OYNASI (EASYSHOP_UZB) */}
      <div className="relative z-10 flex flex-col items-center justify-center mb-16 mt-10">
        <div className="p-10 rounded-[40px] border border-white/40 bg-white/20 backdrop-blur-2xl shadow-2xl text-center border-b-white/10 border-r-white/10">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#D4AF37]" 
            style={{ textShadow: '0 10px 20px rgba(212, 175, 55, 0.2)' }}>
            EASYSHOP_UZB
          </h1>
          <p className="text-2xl md:text-3xl font-light text-gray-600 mt-2 tracking-[0.2em] uppercase">
            Oson online xarid
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10 max-w-6xl mx-auto">
        
        {/* 1. JORIY BALANS (SILLIQ BURCHAKLI LIQUID GLASS) */}
        <div className="relative p-10 rounded-[35px] border border-white/60 bg-white/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 hover:scale-[1.02]">
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-sm font-bold text-[#A67C00] tracking-widest uppercase mb-2">Joriy Balans</p>
              <h2 className="text-6xl font-bold tracking-tight text-gray-800">
                {balance.toLocaleString('uz-UZ')}
                <span className="text-2xl font-light text-gray-400 ml-3 text-[#D4AF37]">BALL</span>
              </h2>
            </div>

            <div className="mt-10">
              <div className="flex justify-between text-sm mb-2 font-medium text-gray-600">
                <span>Maqsad: 500,000</span>
                <span className="text-[#D4AF37]">{percentage}%</span>
              </div>
              {/* TILLA PROGRESS BAR */}
              <div className="w-full h-4 bg-white/50 rounded-full border border-white overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFE08A] rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. AI VIRTUAL TRY-ON (SILLIQ OYNA) */}
        <div className="relative p-10 rounded-[35px] border border-white/60 bg-white/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center group cursor-pointer transition-all hover:bg-white/40">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#FFE08A] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">AI Kiyib Ko'rish</h3>
          <p className="text-gray-500 mt-2 font-light">O'z rasmingizni yuklang va natijani ko'ring</p>
          <button className="mt-8 px-8 py-3 bg-[#D4AF37] text-white rounded-2xl font-bold shadow-lg hover:shadow-[#D4AF37]/40 transition-all active:scale-95">
            Rasmni yuklash
          </button>
        </div>
      </div>

      {/* FOMO BANNER */}
      <div className="mt-12 max-w-6xl mx-auto p-6 rounded-[30px] bg-white/40 border border-white/60 backdrop-blur-md flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <span className="text-3xl animate-bounce">🔥</span>
          <p className="text-gray-700 font-medium">Faqat bugun: <span className="text-[#A67C00] font-bold">2 barobar ko'p ball!</span></p>
        </div>
        <div className="text-3xl font-mono font-black text-[#D4AF37]">00:59:59</div>
      </div>
    </main>
  );
}
