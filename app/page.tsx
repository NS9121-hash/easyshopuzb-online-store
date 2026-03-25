"use client";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/examples/jsm/objects/Water";
import { Sky } from "three/examples/jsm/objects/Sky";

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined" || !mountRef.current) return;

    // SCENE, CAMERA, RENDERER sozlamalari
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mountRef.current.clientWidth / mountRef.current.clientHeight, 1, 20000);
    camera.position.set(0, 10, 40);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true shaffoflik uchun
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    mountRef.current.appendChild(renderer.domElement);

    // YORUG'LIK - Suvning yaltirashi uchun juda muhim
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // REALISTIK SUV (WATER) - Three.js Water shaderi
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    const waterOptions: any = {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load('/water_normals.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }),
      sunDirection: directionalLight.position,
      sunColor: 0xffffff,
      waterColor: 0x12353a, // Suyuqlik rangi
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    };

    const water = new Water(waterGeometry, waterOptions);
    water.rotation.x = -Math.PI / 2; // Suvni gorizontal qilish
    scene.add(water);

    // OSMON (SKY) - Suvda aks etishi uchun
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    const parameters = { elevation: 2, azimuth: 180 };
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    function updateSun() {
      const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
      const theta = THREE.MathUtils.degToRad(parameters.azimuth);
      directionalLight.position.setFromSphericalCoords(1, phi, theta);
      skyUniforms['sunPosition'].value.copy(directionalLight.position);
      water.material.uniforms['sunDirection'].value.copy(directionalLight.position);
      scene.environment = pmremGenerator.fromScene(sky as any).texture;
    }
    updateSun();

    // ORBIT CONTROLS - Suyuqlikni qimirlatish uchun (Faqat test uchun)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false; // Zoom o'chirilgan
    controls.minPolarAngle = Math.PI * 0.4;
    controls.maxPolarAngle = Math.PI * 0.55;

    // GIROSKOP (DEVICE ORIENTATION) - Telefonni burganda suvni harakatlantirish
    function handleOrientation(event: DeviceOrientationEvent) {
      let x = event.gamma || 0; // Chapga-o'ngga egilish
      let y = event.beta || 0;  // Oldinga-orqaga egilish

      // Suyuqlik to'kilib ketmasligi uchun egilish burchagini cheklaymiz
      if (x > 30) x = 30; if (x < -30) x = -30;
      if (y > 40) y = 40; if (y < 0) y = 0; 

      setTilt({ x, y });
    }
    window.addEventListener("deviceorientation", handleOrientation);

    // ANIMATION LOOP - WebGL-ni doimiy yangilab turish
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Suvning to'lqinlanish harakati
      (water.material as any).uniforms['time'].value += 1.0 / 60.0;
      
      // Giroskop orqali suvni harakatlantirish
      water.position.x = tilt.x * 0.2;
      water.position.y = (y + tilt.y * 0.3) * -1; // Suyuqlik pastga egilganda ishlaydi

      renderer.render(scene, camera);
    };
    animate();

    // WINDOW RESIZE - Ekranni o'zgartirganda moslashish
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // CLEANUP - Sahifadan chiqib ketganda resurslarni bo'shatish
    return () => {
      if (!mountRef.current) return;
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("deviceorientation", handleOrientation);
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="app-container">
      
      {/* 1. LOGOTIP - Eng tepada va markazda */}
      <header className="header">
        <h1 className="glass-text">EASYSHOP_<span className="gold-text">UZB</span></h1>
        <p className="subtitle">OSON ONLINE XARID</p>
      </header>

      {/* 2. ASOSIY QISM - Markazdagi Realistik Suyuqlik Karti */}
      <main className="main-content">
        <div className="welcome-glass-card">
          
          {/* THREE.JS WebGL KANVAS (Suv simulyatsiyasi) */}
          <div ref={mountRef} className="webgl-canvas-container"></div>

          {/* MATNLAR */}
          <div className="welcome-text-content">
            <h2 className="welcome-heading">
              <span className="welcome-gold">ASSALOMU ALEYKUM</span>
              <br />
              ONLAYN DO'KONIMIZGA XUSH KELIBSIZ!
            </h2>
          </div>
        </div>
      </main>

      {/* 3. NAVIGATSIYA - Pastdagi Tiniq Oyna Ikonkalar */}
      <div className="bottom-nav-wrapper">
        <nav className="glass-bottom-nav">
          <button className="glass-nav-item">
            <div className="glass-nav-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>
            </div>
            <span className="nav-label">Kiyimlar</span>
          </button>
          
          <button className="glass-nav-item">
            <div className="glass-nav-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 002 1.58h9.78a2 2 0 001.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <span className="nav-label">Savat</span>
          </button>
          
          <button className="glass-nav-item">
            <div className="glass-nav-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.91 5.81L20 10.75l-6.09 1.94L12 18.5l-1.91-5.81L4 10.75l6.09-1.94z"/><path d="M5 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/><path d="M19 17l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/></svg>
            </div>
            <span className="nav-label">AI</span>
          </button>
          
          <button className="glass-nav-item">
            <div className="glass-nav-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span className="nav-label">Profil</span>
          </button>
        </nav>
      </div>

    </div>
  );
}
