"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hasPermission, setHasPermission] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Qurilma iOS ekanligini va giroskop ruxsat so'rashni talab qilishini tekshirish
    if (typeof window !== "undefined" && typeof (window as any).DeviceOrientationEvent !== "undefined" && typeof (window as any).DeviceOrientationEvent.requestPermission === "function") {
      setIsIOS(true);
    } else {
      // Android va boshqa qurilmalarda ruxsat shart emas, avtomat ishlaydi
      setHasPermission(true);
      window.addEventListener("deviceorientation", handleOrientation);
    }
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let x = event.gamma || 0; // Chapga-o'ngga egilish (-90 dan 90 gacha)
    let y = event.beta || 0;  // Oldinga-orqaga egilish (-180 dan 180 gacha)

    // Suyuqlik to'kilib ketmasligi uchun egilish burchagini cheklaymiz
    if (x > 50) x = 50;
    if (x < -50) x = -50;
    if (y > 60) y = 60;
    if (y < 0) y = 0; // Faqat pastga egilganda ishlaydi

    setTilt({ x, y });
  };

  const requestAccess = async () => {
    try {
      const permission = await (window as any).DeviceOrientationEvent.requestPermission();
      if (permission === "granted") {
        setHasPermission(true);
        window.addEventListener("deviceorientation", handleOrientation);
      }
    } catch (error) {
      console.error("Giroskopga ruxsat olinmadi", error);
    }
  };

  return (
    <div className="app-container">
      
      {/* 1. HEADER */}
      <header className="header">
        <h1 className="glass-text">EASYSHOP_<span className="gold-text">UZB</span></h1>
        <p className="subtitle">OSON ONLINE XARID</p>
      </header>

      {/* 2. MAIN CONTENT (Harakatlanuvchi Suyuqlik) */}
      <main className="main-content">
        <div className="welcome-glass-card">
          
          {/* FIZIK HARAKATLANUVCHI SUV QATLAMI */}
          <div 
            className="water-layer-wrapper"
            style={{ 
              transform: `rotate(${-tilt.x}deg) translateY(${tilt.y * 0.6 - 20}px)` 
            }}
          >
            <div className="water-wave-1"></div>
            <div className="water-wave-2"></div>
          </div>

          {/* MATNLAR */}
          <div className="welcome-text-content">
            {isIOS && !hasPermission && (
              <button onClick={requestAccess} className="gyro-btn">
                🌊 Suv effektini yoqish
              </button>
            )}
            <h2 className="welcome-heading">
              <span className="welcome-gold">ASSALOMU ALEYKUM</span>
              <br />
              ONLAYN DO'KONIMIZGA XUSH KELIBSIZ!
            </h2>
          </div>

        </div>
      </main>

      {/* 3. BOTTOM NAV (Yorqin Tillarang Ikonkalar) */}
      <div className="bottom-nav-wrapper">
        <nav className="glass-bottom-nav">
          
          <button className="glass-nav-item">
            <div className="glass-nav-bubble">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>
            </div>
            <span className="nav-label">Kiyimlar</span>
          </button>
          
          <button className="glass-nav-item">
            <div className="glass-nav-bubble">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 002 1.58h9.78a2 2 0 001.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <span className="nav-label">Savat</span>
          </button>
          
          <button className="glass-nav-item">
            <div className="glass-nav-bubble">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.91 5.81L20 10.75l-6.09 1.94L12 18.5l-1.91-5.81L4 10.75l6.09-1.94z"/><path d="M5 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/><path d="M19 17l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/></svg>
            </div>
            <span className="nav-label">AI</span>
          </button>
          
          <button className="glass-nav-item">
            <div className="glass-nav-bubble">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span className="nav-label">Profil</span>
          </button>
          
        </nav>
      </div>

    </div>
  );
}
