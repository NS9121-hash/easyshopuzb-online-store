// app/page.tsx
'use client';

export default function Home() {
  // Shisha effekti uchun umumiy stil
  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.15)', // Juda past shaffoflik
    backdropFilter: 'blur(25px) saturate(180%)',
    WebkitBackdropFilter: 'blur(25px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '40px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
  };

  return (
    <main className="min-h-screen w-full relative font-sans flex flex-col items-center" 
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fdf9ec 50%, #f7efd2 100%)',
        padding: '24px',
        margin: '0'
      }}>
      
      {/* FONDIAGI DOG'LAR */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#d4af37]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 left-[-10%] w-64 h-64 bg-[#d4af37]/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* HEADER */}
      <div className="relative z-10 text-center mt-12 mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-[#d4af37] uppercase italic">
          EASYSHOP_UZB
        </h1>
        <p className="text-[10px] font-bold text-gray-400 tracking-[0.4em] uppercase mt-2">
          Oson online xarid
        </p>
      </div>

      <div className="w-full max-w-sm space-y-6 relative z-10">
        
        {/* 1. JORIY BALANS KARTASI */}
        <div style={{ ...glassStyle, padding: '35px' }}>
          <p className="text-[10px] font-bold text-[#b8962e] tracking-widest uppercase mb-4">Joriy Balans</p>
          
          <div className="flex items-baseline gap-2 mb-10">
            <span className="text-5xl font-bold text-gray-800 tracking-tighter">150 000</span>
            <span className="text-lg font-light text-gray-400">BALL</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-[11px] font-bold text-gray-400">
              <span>MAQSAD: 500,000</span>
              <span className="text-[#d4af37]">30%</span>
            </div>
            <div className="h-2.5 bg-black/5 rounded-full overflow-hidden border border-white/20">
              <div 
                className="h-full bg-gradient-to-r from-[#d4af37] to-[#f2e2a4]"
                style={{ width: '30%', boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)' }}
              ></div>
            </div>
          </div>
        </div>

        {/* 2. AI VIRTUAL TRY-ON KARTASI */}
        <div style={{ ...glassStyle, padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="w-14 h-14 bg-[#d4af37] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#d4af37]/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">AI Kiyib Ko'rish</h3>
          <p className="text-[11px] text-gray-400">Rasmingizni yuklang</p>
        </div>

      </div>

      {/* 3. NAV BAR */}
      <div className="fixed bottom-8 w-[85%] max-w-xs h-16 flex justify-around items-center" 
        style={{
          background: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
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
