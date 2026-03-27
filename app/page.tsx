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
      try {
        const THREE = await import("three");
        const { Water } = await import("three-stdlib");

        if (!isMounted || !mountRef.current) return;

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, width / height, 1, 1000);
        camera.position.set(0, 0, 300); 

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
        const water = new Water(waterGeometry, {
          textureWidth: 512,
          textureHeight: 512,
          waterNormals: new THREE.TextureLoader().load(
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg',
            (t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
          ),
          sunDirection: new THREE.Vector3(0, 0, 1),
          sunColor: 0xffffff,
          waterColor: 0x1a8b9d,
          distortionScale: 4.0,
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
      } catch (e) {
        console.error("Suv yuklanmadi:", e);
      }
    };

    init3D();

    return () => {
      isMounted = false;
      cancelAnimationFrame(frameId);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="glass-text">EASYSHOP_<span className="gold-text">UZB</span></h1>
        <p className="subtitle">OSON ONLINE XARID</p>
      </header>

      <main className="main-content">
        <div className={`welcome-glass-card ${isReady ? 'fade-in' : 'hidden'}`}>
          <div ref={mountRef} className="webgl-canvas-container"></div>
          <div className="welcome-text-content">
            <h2 className="welcome-heading">
              <span className="welcome-gold">ASSALOMU ALEYKUM</span>
              <br />
              ONLAYN DO'KONIMIZGA XUSH KELIBSIZ!
            </h2>
          </div>
        </div>
      </main>

      <div className="bottom-nav-wrapper">
        <nav className="glass-bottom-nav">
          <Link href="/products" className="glass-nav-item">
            <div className="glass-nav-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab351" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>
            </div>
            <span className="nav-label">Kiyimlar</span>
          </Link>
          <Link href="/cart" className="glass-nav-item">
            <div className="glass-nav-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab351" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 002 1.58h9.78a2 2 0 001.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <span className="nav-label">Savat</span>
          </Link>
          <Link href="/ai-stylist" className="glass-nav-item">
            <div className="glass-nav-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab351" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.91 5.81L20 10.75l-6.09 1.94L12 18.5l-1.91-5.81L4 10.75l6.09-1.94z"/><path d="M5 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/><path d="M19 17l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/></svg>
            </div>
            <span className="nav-label">AI</span>
          </Link>
          <Link href="/profile" className="glass-nav-item">
            <div className="glass-nav-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab351" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span className="nav-label">Profil</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
