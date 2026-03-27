"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let renderer: any;
    let frameId: any;

    const init3D = async () => {
      // Kutubxonalarni dinamik yuklash
      const THREE = await import("three");
      const { Water } = await import("three-stdlib");

      if (!isMounted || !mountRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      const scene = new THREE.Scene();
      
      // Kamera aynan ramka markaziga qaraydi
      const camera = new THREE.PerspectiveCamera(55, width / height, 1, 1000);
      camera.position.set(0, 0, 350); 

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);

      // Suv tekisligi ramka o'lchamida
      const waterGeometry = new THREE.PlaneGeometry(width * 1.5, height * 1.5);
      
      const water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(
          'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg',
          (t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
        ),
        sunDirection: new THREE.Vector3(0, 0, 1),
        sunColor: 0xffffff,
        waterColor: 0x0077be, // Tiniq ko'k suv
        distortionScale: 5.0,
      });

      scene.add(water);

      const animate = () => {
        if (!isMounted) return;
        water.material.uniforms['time'].value += 1.0 / 60.0;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      
      animate();
      setIsReady(true);
    };

    init3D();

    return () => {
      isMounted = false;
      cancelAnimationFrame(frameId);
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="app-container" style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      
      <header className="header" style={{ textAlign: "center", paddingTop: "50px", position: "relative", zIndex: 10 }}>
        <h1 className="glass-text" style={{ fontSize: "42px", fontWeight: "900" }}>EASYSHOP_<span style={{ color: "#eab351" }}>UZB</span></h1>
        <p style={{ letterSpacing: "5px", color: "rgba(0,0,0,0.5)", fontSize: "12px" }}>OSON ONLINE XARID</p>
      </header>

      <main style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "40px" }}>
        <div className="welcome-glass-card" style={{
          width: "90%", maxWidth: "400px", height: "450px",
          borderRadius: "40px", border: "1px solid rgba(255,255,255,0.4)",
          position: "relative", overflow: "hidden",
          background: "rgba(255, 255, 255, 0.1)", // Qora rang olib tashlandi
          boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          backdropFilter: "blur(5px)"
        }}>
          
          {/* JONLI SUV (Faqat yuklanganda ko'rinadi) */}
          <div ref={mountRef} style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            zIndex: 0, opacity: isReady ? 1 : 0, transition: "opacity 2s"
          }} />

          {/* MATNLAR */}
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", paddingTop: "140px", pointerEvents: "none" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "900", color: "#fff", textShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
              ASSALOMU <br/> ALEYKUM
            </h2>
            <p style={{ fontSize: "14px", marginTop: "40px", color: "rgba(255,255,255,0.8)", fontWeight: "600" }}>
              ONLAYN DO'KONIMIZGA XUSH KELIBSIZ!
            </p>
          </div>
        </div>
      </main>

      {/* NAVIGATSIYA */}
      <div className="bottom-nav-wrapper">
         <div style={{
           display: "flex", justifyContent: "space-around", padding: "15px",
           background: "rgba(255,255,255,0.2)", backdropFilter: "blur(15px)",
           borderRadius: "30px", border: "1px solid rgba(255,255,255,0.3)",
           margin: "0 20px"
         }}>
           <span style={{ color: "#1a8b9d", fontWeight: "800" }}>KIYIMLAR</span>
           <span style={{ color: "#1a8b9d", fontWeight: "800" }}>SAVAT</span>
           <span style={{ color: "#1a8b9d", fontWeight: "800" }}>AI</span>
           <span style={{ color: "#1a8b9d", fontWeight: "800" }}>PROFIL</span>
         </div>
      </div>

    </div>
  );
}
