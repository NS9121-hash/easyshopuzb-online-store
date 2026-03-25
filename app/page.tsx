export default function Home() {
  return (
    <div className="app-container">
      
      {/* Header qismi - Liquid Glass Yozuvi */}
      <header className="header">
        <h1 className="glass-text">EASYSHOP_<span className="gold-text">UZB</span></h1>
        <p className="subtitle">OSON ONLINE XARID</p>
      </header>

      {/* Asosiy Qism (Hozircha bo'sh, bu yerga mahsulotlar/kiyimlar ro'yxati tushadi) */}
      <main className="main-content">
        {/* Kelajakda mahsulotlar shu yerda paydo bo'ladi */}
      </main>

      {/* Pastki navigatsiya menyusi - 4 ta tugma */}
      <div className="bottom-nav-wrapper">
        <nav className="glass-bottom-nav">
          {/* 1. Kiyimlar */}
          <button className="glass-nav-btn" aria-label="Mahsulotlar">
            👕
          </button>
          
          {/* 2. Savat */}
          <button className="glass-nav-btn" aria-label="Savat">
            🛒
          </button>
          
          {/* 3. AI Yordamchi */}
          <button className="glass-nav-btn" aria-label="AI Yordamchi">
            ✨
          </button>
          
          {/* 4. Profil */}
          <button className="glass-nav-btn" aria-label="Profil">
            👤
          </button>
        </nav>
      </div>

    </div>
  );
}
