"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="app-container">
      
      <header className="header">
        <h1 className="glass-text">EASYSHOP_<span className="gold-text">UZB</span></h1>
        <p className="subtitle">OSON ONLINE XARID</p>
      </header>

      <main className="main-content">
        <div className="welcome-glass-card">
          
          {/* 🌊 TAYYOR SUV VIDEOSI (FONDA) */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="background-video"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-clear-water-in-a-swimming-pool-1165-large.mp4" type="video/mp4" />
            {/* Agar video yuklanmasa, rasm ko'rinadi */}
            <img src="https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=1000&auto=format&fit=crop" alt="Water" />
          </video>

          {/* SUV USTIDAGI MATNLAR */}
          <div className="welcome-text-content">
            <h2 className="welcome-heading">
              <span className="welcome-gold">ASSALOMU ALEYKUM</span>
              <br />
              ONLAYN DO'KONIMIZGA XUSH KELIBSIZ!
            </h2>
          </div>
        </div>
      </main>

      {/* NAVIGATSIYA */}
      <div className="bottom-nav-wrapper">
        <nav className="glass-bottom-nav">
          {[
            { label: "Kiyimlar", icon: "M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" },
            { label: "Savat", icon: "M2.05 2.05h2l2.66 12.42a2 2 0 002 1.58h9.78a2 2 0 001.95-1.57l1.65-7.43H5.12" },
            { label: "AI", icon: "M12 3l1.91 5.81L20 10.75l-6.09 1.94L12 18.5l-1.91-5.81L4 10.75l6.09-1.94z" },
            { label: "Profil", icon: "M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" }
          ].map((item, i) => (
            <div key={i} className="glass-nav-item">
              <div className="glass-nav-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#eab351" strokeWidth="2.5"><path d={item.icon}/></svg>
              </div>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

    </div>
  );
}
