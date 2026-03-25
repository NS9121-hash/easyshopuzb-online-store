"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let x = event.gamma || 0; 
    let y = event.beta || 0;  

    if (x > 30) x = 30; if (x < -30) x = -30;
    if (y > 40) y = 40; if (y < 0) y = 0; 

    setTilt({ x, y });
  };

  return (
    <div className="app-container">
      
      <header className="header">
        <h1 className="glass-text">EASYSHOP_<span className="gold-text">UZB</span></h1>
        <p className="subtitle">OSON ONLINE XARID</p>
      </header>

      <main className="main-content">
        <div className="welcome-glass-card">
          
          {/* FIZIK TINIQ SUV EFFEKTI (Toza CSS) */}
          <div 
            className="water-layer-wrapper"
            style={{ 
              transform: `rotate(${-tilt.x}deg) translateY(${tilt.y * 0.4 - 20}px)` 
            }}
          >
            <div className="water-wave-1"></div>
            <div className="water-wave-2"></div>
          </div>

          <div className="welcome-text-content">
            <h2 className="welcome-heading">
              <span className="welcome-gold">ASSALOMU ALEYKUM</span>
              <br />
              ONLAYN DO'KONIMIZGA XUSH KELIBSIZ!
            </h2>
          </div>

        </div>
      </main>

      {/* PASTKI MENYU */}
      <div className="bottom-nav-wrapper">
        <nav className="glass-bottom-nav">
          <Link href="/products" className="glass-nav-item">
            <div className="glass-nav-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>
            </div>
            <span className="nav-label">Kiyimlar</span>
          </Link>
          
          <Link href="/cart" className="glass-nav-item">
            <div className="glass-nav-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 002 1.58h9.78a2 2 0 001.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <span className="nav-label">Savat</span>
          </Link>
          
          <Link href="/ai-stylist" className="glass-nav-item">
            <div className="glass-nav-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.91 5.81L20 10.75l-6.09 1.94L12 18.5l-1.91-5.81L4 10.75l6.09-1.94z"/><path d="M5 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/><path d="M19 17l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/></svg>
            </div>
            <span className="nav-label">AI</span>
          </Link>
          
          <Link href="/profile" className="glass-nav-item">
            <div className="glass-nav-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span className="nav-label">Profil</span>
          </Link>
        </nav>
      </div>

    </div>
  );
}
