export default function Home() {
  return (
    <div className="app-container">
      
      {/* Header qismi */}
      <header className="header">
        <h1 className="logo-text">EASYSHOP_<span className="gold-text">UZB</span></h1>
        <p className="subtitle">OSON ONLINE XARID</p>
      </header>

      {/* Joriy Balans Kartasi */}
      <div className="liquid-glass-card">
        <p className="card-label">JORIY BALANS</p>
        <div className="balance-container">
          <div className="balance-numbers">
            <span className="number">150</span>
            <span className="number">000</span>
          </div>
          <span className="currency">BALL</span>
        </div>
        
        {/* Progress Bar */}
        <div className="glass-progress-track">
          <div className="glass-progress-fill"></div>
        </div>
      </div>

      {/* AI Kiyib ko'rish Kartasi */}
      <div className="liquid-glass-card ai-card">
        <div className="glass-icon-wrapper">
          <span className="emoji">📸</span>
        </div>
        <h2 className="card-title">AI Kiyib Ko'rish</h2>
        <p className="card-subtitle">Kelajakni hozir his qiling</p>
      </div>

      {/* Pastki navigatsiya menyusi */}
      <nav className="glass-bottom-nav">
        <button className="glass-nav-btn">←</button>
        <button className="glass-nav-btn">→</button>
        <button className="glass-nav-btn">+</button>
        <button className="glass-nav-btn">10</button>
        <button className="glass-nav-btn">●●●</button>
      </nav>

    </div>
  );
}
