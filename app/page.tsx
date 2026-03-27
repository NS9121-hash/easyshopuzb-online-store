"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { Water } from "three-stdlib";

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let water: Water | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let mountNode = mountRef.current;

    if (!mountNode) return;

    // --- 1. SAHNA VA KAMERA SOZLAMALARI ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mountNode.clientWidth / mountNode.clientHeight, 1, 20000);
    camera.position.set(0, 5, 25); // Suvni tomosha qilish uchun optimal burchak

    // Fonni butunlay shaffof qilish (alpha: true)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    mountNode.appendChild(renderer.domElement);

    // --- 2. YORUG'LIK VA QUVVAT ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const directionalLight = new THREE.Vector3(0, 10, 0); // Suvga tushadigan nur
    
    // --- 3. SUV YUZASI VA TO'LQINLAR ---
    const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
    
    // To'lqin shaklini (texture) internetdan ishonchli yuklab olish
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'Anonymous';
    const waterNormals = textureLoader.load(
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg',
        (texture) => { texture.wrapS = texture.wrapT = THREE.RepeatWrapping; }
    );

    const waterOptions = {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: waterNormals,
      sunDirection: directionalLight,
      sunColor: 0xffffff,
      waterColor: 0x1a8b9d, // Sayt uslubidagi firuza rang
      distortionScale: 3.7, // To'lqinlanish kuchi
      fog: scene.fog !== undefined
    };

    water = new Water(waterGeometry, waterOptions);
    water.rotation.x = -Math.PI / 2; // Suv yotishi (gorizontal)
    scene.add(water);

    // --- 4. ANIMATSIYA DASTURI ---
    function animate() {
      if (!isMounted) return;
      requestAnimationFrame(animate);
      
      if (water) {
        // Suvning to'lqinlanishi tezligi
        (water.material as any).uniforms['time'].value += 1.0 / 60.0;
      }
      
      if (renderer) {
        renderer.render(scene, camera);
      }
    }
    animate();

    setIsReady(true); // Suv tayyor bo'lgach ko'rsatish

    // --- 5. OYNA O'ZGARSA MOSLASH ---
    const handleResize = () => {
      if (!mountNode || !renderer || !camera) return;
      camera.aspect = mountNode.clientWidth / mountNode.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // --- TOZALASH (Xato bermasligi uchun) ---
    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
      if (mountNode && renderer) {
        mountNode.removeChild(renderer.domElement);
      }
      renderer?.dispose();
    };
  }, []);

  return (
    <div className="app-container">
      
      <header className="header">
        <h1 className="glass-text">EASYSHOP_<span className="gold-text">UZB</span></h1>
        <p className="subtitle">OSON ONLINE XARID</p>
      </header>

      <main className="main-content">
        <div className="welcome-glass-card">
          
          {/* THREE.JS JONLI SUV KONTEYNERI */}
          <div ref={mountRef} className="webgl-canvas-container" style={{ opacity: isReady ? 1 : 0, transition: "opacity 1s" }}></div>

          {/* SUV USTIDAGI MUZLAGAN MATNLAR */}
          <div className="welcome-text-content">
            <h2 className="welcome-heading">
              <span className="welcome-gold">ASSALOMU ALEYKUM</span>
              <br />
              ONLAYN DO'KONIMIZGA XUSH KELIBSIZ!
            </h2>
          </div>
        </div>
      </main>

      {/* PASTKI NAVIGATSIYA */}
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span className="nav-label">Profil</span>
          </Link>
        </nav>
      </div>

    </div>
  );
}
