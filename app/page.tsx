/* RESET & BASE */
* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
body { background-image: url('/IMG_2788.jpeg'); background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed; min-height: 100vh; display: flex; justify-content: center; overflow-x: hidden; }
.app-container { width: 100%; max-width: 1200px; min-height: 100vh; display: flex; flex-direction: column; padding: 20px 20px 140px 20px; position: relative; }

/* HEADER */
.header { text-align: center; margin-top: 10px; padding-top: env(safe-area-inset-top); z-index: 10; }
.glass-text { font-size: clamp(32px, 6vw, 54px); font-weight: 900; letter-spacing: 2px; color: rgba(30, 40, 50, 0.4); text-shadow: -1px -2px 2px rgba(255, 255, 255, 0.8), 1px 2px 3px rgba(0, 0, 0, 0.5), 0px 8px 15px rgba(0, 0, 0, 0.2); }
.gold-text { color: rgba(180, 140, 40, 0.7); text-shadow: -1px -2px 1px rgba(255, 255, 255, 0.8), 1px 2px 2px rgba(80, 50, 0, 0.6); }
.subtitle { font-size: 10px; letter-spacing: 4px; color: rgba(0, 0, 0, 0.6); font-weight: 700; margin-top: 5px; }

/* MAIN */
.main-content { flex: 1; display: flex; justify-content: center; align-items: center; }

/* --------------------------------------------------- */
/* HAQIQIY TINIQ LIQUID GLASS (Oqartirib yubormaslik uchun) */
/* --------------------------------------------------- */
.welcome-glass-card {
    /* Fonni deyarli 100% tiniq qildik */
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
    backdrop-filter: blur(6px) saturate(120%);
    -webkit-backdrop-filter: blur(6px) saturate(120%);
    border-radius: 40px; padding: 50px 30px; text-align: center;
    /* Qirralarni judayam qattiq va aniq qildik */
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-top: 2px solid rgba(255, 255, 255, 0.9);
    border-left: 2px solid rgba(255, 255, 255, 0.7);
    box-shadow: 15px 20px 40px rgba(0, 0, 0, 0.15), inset 2px 2px 6px rgba(255, 255, 255, 0.8);
    position: relative; overflow: hidden; width: 100%; max-width: 600px;
}

/* KESKIN SHISHA PORLASHI (Diagonal Glare) - Oynadek aks etishi uchun */
.welcome-glass-card::after {
    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(105deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.05) 25%, transparent 26%, transparent 100%);
    pointer-events: none; z-index: 0;
}

.welcome-heading { position: relative; z-index: 1; font-size: clamp(16px, 4.5vw, 22px); font-weight: 800; color: rgba(20, 30, 40, 0.8); line-height: 1.6; text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.8); }
.welcome-gold { display: block; font-size: clamp(28px, 8vw, 38px); color: #cca450; margin-bottom: 20px; text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.8); }

/* BOTTOM NAVIGATION (Tiniqroq fon) */
.bottom-nav-wrapper { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 95%; max-width: 480px; z-index: 100; }
.glass-bottom-nav {
    display: flex; justify-content: space-around; align-items: flex-end; padding: 10px 5px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.02) 100%);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border-radius: 40px;
    border: 1px solid rgba(255, 255, 255, 0.2); border-top: 1.5px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 15px 35px rgba(0,0,0,0.15), inset 1px 1px 4px rgba(255,255,255,0.5);
}

.glass-nav-item { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: 0.3s; }

/* TINIQ PUFAKCHALAR */
.glass-nav-bubble {
    width: 50px; height: 50px; border-radius: 50%;
    display: flex; justify-content: center; align-items: center;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
    border: 1px solid rgba(255, 255, 255, 0.3); border-top: 1.5px solid rgba(255, 255, 255, 1); border-left: 1.5px solid rgba(255, 255, 255, 0.8);
    box-shadow: 3px 5px 10px rgba(0,0,0,0.1), inset 1px 1px 4px rgba(255,255,255,0.8);
    transition: 0.3s; position: relative; overflow: hidden;
}

/* Pufakchaning o'ziga ham keskin porlash qo'shdik */
.glass-nav-bubble::after {
    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(105deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.05) 35%, transparent 36%);
    pointer-events: none;
}

/* --------------------------------------------------- */
/* IKONKALARGA TILLARANG BERISH */
/* --------------------------------------------------- */
.glass-nav-bubble svg {
    color: #dfbb6c; /* O'tkir tillarang */
    stroke-width: 2.2px;
    position: relative; z-index: 1;
    filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1));
}

.nav-label { font-size: 10px; font-weight: 800; color: rgba(30, 40, 50, 0.7); text-transform: uppercase; letter-spacing: 1px; }

.glass-nav-item:hover .glass-nav-bubble { transform: translateY(-3px); box-shadow: 5px 10px 15px rgba(0,0,0,0.15), inset 1px 1px 5px rgba(255,255,255,1); }
.glass-nav-item:hover .glass-nav-bubble svg { color: #cca450; }
.glass-nav-item:hover .nav-label { color: #cca450; }
.glass-nav-item:active { transform: scale(0.9); }
