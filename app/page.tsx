// app/page.tsx
'use client';

export default function Home() {
  return (
    <main className="min-h-screen w-full relative overflow-hidden font-sans flex flex-col items-center" 
      style={{
        background: 'radial-gradient(circle at top right, #ffffff 0%, #fdf9ec 40%, #f7efd2 100%)',
        padding: '24px'
      }}>
      
      {/* FONDIAGI NOZIK TILLA DOG'LAR (Blur effekti fonni boyitadi) */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 left-[-10%] w-64 h-64 bg-[#d4af37]/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* HEADER: EASYSHOP_UZB */}
      <div className="relative z-10 text-center mt-12 mb-10">
        <h1 className="text-4xl font-black tracking-tight text-[#d4af37] leading-none uppercase italic">
          EASYSHOP_UZB
        </h1>
        <p className="text-[10px] font-bold text-gray-400 tracking-[0.5em] uppercase mt-3">
          Oson online xarid
        </p>
      </div>

      <div className="w-full max-w-sm space-y-8 relative z-10">
        
        {/* 1. JORIY BALANS KARTASI (ASLIY LIQUID GLASS) */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.25)', // SHAFFOFLIKNI OSHIRDIK
          backdropFilter: 'blur(20px)',               // SHISHA EFFEKTI
          WebkitBackdropFilter: 'blur(20px)',         // SAFARI UCHUN
          border: '1px solid rgba(255, 255, 255, 0.5)', // CHEGARA YALTIRASHI
          borderRadius: '40px',
          padding: '35px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)'
        }}>
          <p className="text-[10px] font-bold text-[#b8962e] tracking-widest uppercase mb-4">Joriy Balans</p>
          
          <div className="flex items-baseline gap-2 mb-10">
            <span className="text-5xl font-bold text-[#1a1a1a] tracking-tighter">150 000</span>
            <span className="text-lg font-light text-gray-500">BALL</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-[11px] font-bold text-gray-400 tracking-wider">
              <span>MAQSAD: 500,000</span>
              <span className="text-[#d4af37]">30%</span>
            </div>
            {/* SILLIQ PROGRESS BAR */}
            <div className="h-2.5 bg-black/5 rounded-full overflow-hidden relative border border-white/20">
              <div 
                className="h-full bg-[#d4af37] rounded-full"
                style={{ 
                  width: '30%', 
                  boxShadow: '0 0 15px rgba(212, 175, 55, 0.5)',
                  background: 'linear-gradient(90deg, #d4af37 0%, #f2e2a4 100%)' 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* 2. AI VIRTUAL TRY-ON KARTASI */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.25)', // SHAFFOFLIK
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '35px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }} className="active:scale-95 transition-all">
          <div className="w-14 h-14 bg-[#d4af37] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#d4af37]/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#1a1a1a]">AI Kiyib Ko'rish</h3>
          <p className="text-[11px] text-gray-500 font-medium">Rasmingizni yuklang</p>
        </div>

      </div>

      {/* 3. FLOATING NAV BAR */}
      <div className="fixed bottom-10 w-[85%] max-w-xs h-16 flex justify-around items-center" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderRadius: '32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)'
      }}>
        <div className="p-3 bg-[#d4af37]/20 rounded-2xl text-[#d4af37]">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
        </div>
        <div className="p-3 text-gray-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
      </div>

    </main>
  );
}
