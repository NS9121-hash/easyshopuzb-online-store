'use client';

import { 
  useEffect, 
  useState, 
  useRef 
} from 'react';

/**
 * FIREBASE ASOSIY IMPORTLARI
 * Firebase tizimi bilan ishlash uchun kerakli barcha modullar
 */
import { 
  initializeApp, 
  getApps, 
  getApp 
} from 'firebase/app';

import { 
  getFirestore, 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  getDoc,
  where,
  limit
} from 'firebase/firestore';

/**
 * FIREBASE CONFIGURATION
 * Ushbu ma'lumotlarni Firebase Console-dan olishingiz mumkin
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

/**
 * APP INITIALIZATION
 * Firebase ilovasini bir marta ishga tushirish mantiqi
 */
const app = getApps().length > 0 
  ? getApp() 
  : initializeApp(firebaseConfig);

const db = getFirestore(app);

export default function Home() {
  /**
   * STATE MANAGEMENT
   * Loyihaning holatlarini boshqarish uchun barcha o'zgaruvchilar
   */
  const [activeTab, setActiveTab] = useState('Home');
  const [items, setItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]); 
  const [favorites, setFavorites] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Mahsulot tanlash bilan bog'liq holatlar
  const [count, setCount] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // AI va Rasmlar bilan ishlash holatlari
  const [userImage, setUserImage] = useState<string | null>(null);
  const [clothImage, setClothImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // Video elementiga havola
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * INITIAL LOAD EFFECT
   * LocalStorage ma'lumotlarini yuklash
   */
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('user_favs');
      const savedCart = localStorage.getItem('user_cart');
      
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
      
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("LocalStorage-dan ma'lumot yuklashda xato:", error);
    }
  }, []);

  /**
   * DATA STORAGE EFFECT
   * O'zgarishlarni LocalStorage-ga yozish
   */
  useEffect(() => {
    localStorage.setItem('user_favs', JSON.stringify(favorites));
    localStorage.setItem('user_cart', JSON.stringify(cart));
  }, [favorites, cart]);

  /**
   * FIREBASE REAL-TIME SYNC
   * Supabase Realtime-ning Firebase muqobili (onSnapshot)
   */
  useEffect(() => {
    // "Clothes" kolleksiyasidan vaqt bo'yicha saralangan ma'lumotlarni olish
    const q = query(
      collection(db, "Clothes"), 
      orderBy("created_at", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dataList: any[] = [];
      querySnapshot.forEach((doc) => {
        dataList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setItems(dataList);
    }, (error) => {
      console.error("Firebase Snapshot-da xato:", error);
    });

    // Tozalash funksiyasi
    return () => unsubscribe();
  }, []);

  /**
   * CART LOGIC
   * Savatga qo'shish funksiyasi
   */
  const handleAddToCart = (product: any, imgIndex: number = 0) => {
    const chosenSize = selectedSize || 
      (product.sizes ? product.sizes.split(',')[0].trim() : 'Standart');
      
    const chosenColor = selectedColor || 
      (product.colors ? product.colors.split(',')[0].trim() : 'Asosiy');
      
    const allImages = product.image_url 
      ? product.image_url.split(',') 
      : [];
      
    const chosenImage = allImages[imgIndex] || allImages[0];

    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => 
          item.id === product.id && 
          item.chosenSize === chosenSize && 
          item.chosenColor === chosenColor && 
          item.chosenImage === chosenImage
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex].qty += count;
        return updatedCart;
      }

      return [
        ...prev, 
        { 
          ...product, 
          qty: count, 
          chosenSize, 
          chosenColor, 
          chosenImage, 
          addedAt: new Date().toISOString() 
        }
      ];
    });

    // Resetlash
    setSelectedProduct(null);
    setCount(1);
    setSelectedSize('');
    setSelectedColor('');
  };

  /**
   * UPDATE QUANTITY
   * Savatdagi mahsulotlar sonini o'zgartirish
   */
  const updateCartQty = (index: number, delta: number) => {
    setCart((prev) => {
      const newCart = [...prev];
      const newQty = newCart[index].qty + delta;
      
      if (newQty > 0) {
        newCart[index].qty = newQty;
        return newCart;
      }
      
      return prev.filter((_, i) => i !== index);
    });
  };

  /**
   * FAVORITE TOGGLE
   * Yoqtirganlar ro'yxatiga qo'shish/o'chirish
   */
  const toggleFavorite = (e: React.MouseEvent, product: any) => {
    e.stopPropagation(); 
    setFavorites((prev) => {
      const isExist = prev.find((fav) => fav.id === product.id);
      if (isExist) {
        return prev.filter((fav) => fav.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  /**
   * IMAGE PROCESSING
   * Rasmlarni yuklash va o'qish
   */
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    type: 'user' | 'cloth'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'user') {
          setUserImage(base64String);
        } else {
          setClothImage(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * AI GENERATION
   * VTON (Virtual Try-On) Api bilan ishlash
   */
  const handleAIGeneration = async () => {
    if (!userImage || !clothImage) {
      return alert("Iltimos, ikkala rasmni ham yuklang!");
    }
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/vton', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          user_image: userImage, 
          cloth_image: clothImage 
        }),
      });
      
      const result = await response.json();
      
      if (result.success && result.image_url) {
        setAiResult(result.image_url);
      } else {
        alert(result.error || "AI ishlov berishda xatolik yuz berdi.");
      }
    } catch (error) {
      console.error("AI API xatosi:", error);
      alert("Server bilan bog'lanishda xatolik!");
    } finally {
      setIsProcessing(false);
    }
  };

  // Hisob-kitoblar
  const totalCartItems = cart.reduce((total, item) => total + item.qty, 0);
  const totalCartPrice = cart.reduce((total, item) => total + (item.price * item.qty), 0);

  return (
    <main 
      style={{ 
        position: 'relative', 
        minHeight: '100dvh', 
        width: '100dvw', 
        overflowX: 'hidden', 
        backgroundColor: '#050b14', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
        padding: '40px 0 120px 0', 
        boxSizing: 'border-box' 
      }}
    >
      {/* BACKGROUND IMAGE LAYER */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundImage: "url('/IMG_2933.jpeg')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          zIndex: 0,
          opacity: 0.8
        }}
      ></div>

      {/* HEADER SECTION */}
      <header 
        style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          zIndex: 10,
          position: 'relative'
        }}
      >
        <h1 
          style={{ 
            fontSize: '32px', 
            fontWeight: '900', 
            color: 'white', 
            margin: 0, 
            textShadow: '0 4px 15px rgba(0,0,0,0.8)',
            letterSpacing: '1px'
          }}
        >
          EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span>
        </h1>
        <p 
          style={{ 
            fontSize: '11px', 
            fontWeight: '700', 
            color: '#e2e8f0', 
            letterSpacing: '4px', 
            marginTop: '5px',
            textTransform: 'uppercase'
          }}
        >
          OSON ONLINE XARID
        </p>
      </header>

      {/* CONTENT WRAPPER */}
      <div 
        style={{ 
          width: '90%', 
          maxWidth: '500px', 
          zIndex: 10, 
          position: 'relative' 
        }}
      >
        
        {/* HOME TAB - VIDEO HERO */}
        {activeTab === 'Home' && (
          <div 
            style={{ 
              width: '100%', 
              aspectRatio: '4/5', 
              borderRadius: '35px', 
              position: 'relative', 
              overflow: 'hidden', 
              border: '1.5px solid rgba(255,255,255,0.2)', 
              boxShadow: '0 25px 50px rgba(0,0,0,0.6)', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
          >
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              loop 
              playsInline 
              preload="auto"
              style={{ 
                position: 'absolute', 
                inset: 0, 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }}
            >
              <source src="/-1880952146411559581.mp4" type="video/mp4" />
            </video>
            
            <div 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                backgroundColor: 'rgba(0,0,0,0.2)', 
                zIndex: 1 
              }}
            ></div>

            <h2 
              style={{ 
                position: 'relative', 
                zIndex: 2, 
                color: '#fbbf24', 
                fontSize: '28px', 
                fontWeight: '900', 
                textAlign: 'center', 
                textShadow: '2px 2px 20px black', 
                margin: 0 
              }}
            >
              ASSALOMU ALEYKUM
            </h2>
            <p 
              style={{ 
                position: 'relative', 
                zIndex: 2, 
                color: 'white', 
                fontSize: '11px', 
                fontWeight: '700', 
                textAlign: 'center', 
                marginTop: '10px', 
                textShadow: '2px 2px 15px black', 
                letterSpacing: '1px' 
              }}
            >
              YANGI TO'PLAMLARNI KO'ZDAN KECHIRING
            </p>
          </div>
        )}

        {/* PRODUCTS GRID - CLOTHING */}
        {activeTab === 'Kiyimlar' && (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '15px', 
              animation: 'fadeIn 0.4s ease' 
            }}
          >
            {items
              .filter(item => item.type === 'clothing' || !item.type) 
              .map((item) => {
              const firstImage = item.image_url ? item.image_url.split(',')[0] : '';
              const isLiked = favorites.some((fav) => fav.id === item.id);
              
              return (
                <div 
                  key={item.id} 
                  onClick={() => { 
                    setSelectedProduct(item); 
                    setCount(1); 
                    setSelectedImageIndex(0); 
                    setSelectedSize(item.sizes ? item.sizes.split(',')[0].trim() : ''); 
                    setSelectedColor(item.colors ? item.colors.split(',')[0].trim() : ''); 
                  }} 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    backdropFilter: 'blur(15px) saturate(180%)', 
                    borderRadius: '18px', 
                    border: '1px solid rgba(255,255,255,0.15)', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxShadow: '0 15px 35px rgba(0,0,0,0.4)', 
                    cursor: 'pointer', 
                    position: 'relative' 
                  }}
                >
                  <div 
                    onClick={(e) => toggleFavorite(e, item)} 
                    style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      right: '10px', 
                      zIndex: 20, 
                      width: '32px', 
                      height: '32px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderRadius: '50%'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "#ef4444" : "none"} stroke={isLiked ? "#ef4444" : "white"} strokeWidth="2.5">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden' }}>
                    <img 
                      src={firstImage} 
                      alt={item.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }} 
                    />
                  </div>
                  
                  <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '800' }}>
                      {item.price?.toLocaleString()} 
                      <span style={{fontSize: '10px', marginLeft: '4px'}}>UZS</span>
                    </div>
                    <p style={{ color: 'white', fontSize: '12px', margin: '6px 0', height: '2.8em', overflow: 'hidden', opacity: 0.9 }}>
                      {item.name}
                    </p>
                    <button 
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', 
                        color: '#050b14', 
                        border: 'none', 
                        borderRadius: '12px', 
                        fontSize: '11px', 
                        fontWeight: '900',
                        textTransform: 'uppercase'
                      }}
                    >
                      BATAFSIL
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LOOKBOOK SECTION */}
        {activeTab === 'Look' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', animation: 'fadeIn 0.4s ease' }}>
            {items
              .filter(item => item.type === 'look') 
              .map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedProduct(item)}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: '25px', 
                    overflow: 'hidden', 
                    border: '1px solid rgba(255,255,255,0.1)' 
                  }}
                >
                  <img 
                    src={item.image_url?.split(',')[0]} 
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }} 
                  />
                  <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ color: 'white', margin: 0 }}>{item.name}</h4>
                      <div style={{ color: '#fbbf24', fontWeight: '800' }}>{item.price?.toLocaleString()} UZS</div>
                    </div>
                    <button style={{ background: '#fbbf24', padding: '10px 20px', borderRadius: '15px', border: 'none', fontWeight: '900' }}>
                      KO'RISH
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* SAVAT BO'LIMI */}
        {activeTab === 'Savat' && (
          <div style={{ color: 'white', animation: 'fadeIn 0.3s ease' }}>
             {cart.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '100px 20px', color: 'rgba(255,255,255,0.5)' }}>
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '20px' }}>
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  <p>SAVATCHANGIZ HOZIRCHA BO'SH</p>
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 {cart.map((c, i) => (
                   <div 
                    key={i} 
                    style={{ 
                      display: 'flex', 
                      gap: '15px', 
                      background: 'rgba(255, 255, 255, 0.07)', 
                      padding: '15px', 
                      borderRadius: '18px', 
                      border: '1px solid rgba(255,255,255,0.15)', 
                      alignItems: 'center' 
                    }}
                   >
                     <img 
                      src={c.chosenImage} 
                      style={{ width: '70px', height: '90px', borderRadius: '12px', objectFit: 'cover' }} 
                     />
                     <div style={{ flex: 1 }}>
                       <div style={{ fontSize: '15px', fontWeight: '700' }}>{c.name}</div>
                       <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '4px 0' }}>
                        {c.chosenColor} / {c.chosenSize}
                       </div>
                       <div style={{ fontSize: '14px', color: '#fbbf24', fontWeight: '800' }}>
                        {c.price.toLocaleString()} UZS
                       </div>
                       
                       <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                            <button 
                              onClick={() => updateCartQty(i, -1)}
                              style={{ padding: '5px 12px', color: 'white', background: 'none', border: 'none' }}
                            >-</button>
                            <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '13px' }}>{c.qty}</span>
                            <button 
                              onClick={() => updateCartQty(i, 1)}
                              style={{ padding: '5px 12px', color: 'white', background: 'none', border: 'none' }}
                            >+</button>
                          </div>
                          
                          <button 
                            onClick={() => updateCartQty(i, -c.qty)}
                            style={{ color: '#ef4444', background: 'none', border: 'none', fontSize: '11px', fontWeight: '700' }}
                          >
                            O'CHIRISH
                          </button>
                       </div>
                     </div>
                   </div>
                 ))}
                 
                 {/* TO'LOV PANEL */}
                 <div 
                  style={{ 
                    position: 'fixed', 
                    bottom: '110px', 
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%', 
                    maxWidth: '460px', 
                    background: 'rgba(15, 23, 42, 0.95)', 
                    backdropFilter: 'blur(20px)',
                    padding: '20px', 
                    borderRadius: '25px', 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '15px',
                    boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
                    zIndex: 101 
                  }}
                 >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>UMUMIY SUMMA:</span>
                      <div style={{ color: '#fbbf24', fontWeight: '900', fontSize: '20px' }}>
                        {totalCartPrice.toLocaleString()} UZS
                      </div>
                    </div>
                    <button 
                      style={{ 
                        background: '#fbbf24', 
                        border: 'none', 
                        padding: '16px', 
                        borderRadius: '18px', 
                        fontWeight: '900',
                        fontSize: '14px',
                        color: '#050b14',
                        boxShadow: '0 10px 20px rgba(251, 191, 36, 0.2)'
                      }}
                    >
                      BUYURTMANI TASDIQLASH ({totalCartItems})
                    </button>
                 </div>
               </div>
             )}
          </div>
        )}

        {/* AI KIYIB KO'RISH BO'LIMI */}
        {activeTab === 'AI' && (
          <div 
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '30px', 
              padding: '25px', 
              border: '1px solid rgba(255,255,255,0.15)',
              animation: 'fadeIn 0.3s ease'
            }}
          >
            <h3 style={{ color: '#fbbf24', textAlign: 'center', margin: '0 0 20px 0' }}>VIRTUAL KIYIB KO'RISH (AI)</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textAlign: 'center', marginBottom: '25px' }}>
              O'zingizning rasmingizni va kiyim rasmini yuklang, AI sizga uni kiyib beradi!
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', margin: '20px 0' }}>
              {/* Foydalanuvchi rasmi */}
              <div 
                style={{ 
                  background: 'rgba(255,255,255,0.07)', 
                  aspectRatio: '3/4', 
                  borderRadius: '20px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  position: 'relative',
                  border: '1px dashed rgba(255,255,255,0.3)',
                  overflow: 'hidden'
                }}
              >
                {userImage ? (
                  <img src={userImage} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '5px' }}>👤</div>
                    <span style={{fontSize:'9px', color:'white', opacity: 0.7}}>SIZNING RASMINGIZ</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, 'user')} 
                  style={{position:'absolute', inset:0, opacity:0, cursor: 'pointer'}} 
                />
              </div>

              {/* Kiyim rasmi */}
              <div 
                style={{ 
                  background: 'rgba(255,255,255,0.07)', 
                  aspectRatio: '3/4', 
                  borderRadius: '20px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  position: 'relative',
                  border: '1px dashed rgba(255,255,255,0.3)',
                  overflow: 'hidden'
                }}
              >
                {clothImage ? (
                  <img src={clothImage} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '5px' }}>👕</div>
                    <span style={{fontSize:'9px', color:'white', opacity: 0.7}}>KIYIM RASMI</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, 'cloth')} 
                  style={{position:'absolute', inset:0, opacity:0, cursor: 'pointer'}} 
                />
              </div>
            </div>

            <button 
              onClick={handleAIGeneration} 
              disabled={isProcessing}
              style={{ 
                width: '100%', 
                padding: '18px', 
                background: isProcessing ? 'rgba(251, 191, 36, 0.5)' : '#fbbf24', 
                borderRadius: '18px', 
                fontWeight: '900', 
                border: 'none',
                color: '#050b14',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                marginTop: '10px'
              }}
            >
              {isProcessing ? "AI ISHLAMOQDA..." : "HISOBLASH"}
            </button>

            {aiResult && (
              <div style={{ marginTop: '30px', animation: 'fadeIn 0.5s ease' }}>
                <h4 style={{ color: 'white', fontSize: '13px', textAlign: 'center', marginBottom: '15px' }}>NATIJA:</h4>
                <div style={{ borderRadius: '25px', overflow: 'hidden', border: '2px solid #fbbf24' }}>
                  <img src={aiResult} style={{ width: '100%', display: 'block' }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PRODUCT DETAILS MODAL (FULL SCREEN OVERLAY) */}
      {selectedProduct && (() => {
        const productImages = selectedProduct.image_url ? selectedProduct.image_url.split(',') : [];
        const productSizes = selectedProduct.sizes ? selectedProduct.sizes.split(',').map((s:any) => s.trim()) : [];
        const productColors = selectedProduct.colors ? selectedProduct.colors.split(',').map((c:any) => c.trim()) : [];
        
        return (
          <div 
            style={{ 
              position: 'fixed', 
              inset: 0, 
              zIndex: 1000, 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'center', 
              backgroundColor: 'rgba(0,0,0,0.7)', 
              backdropFilter: 'blur(10px)' 
            }}
          >
            <div 
              style={{ 
                width: '100%', 
                maxWidth: '500px', 
                height: '92dvh', 
                background: '#0f172a', 
                borderRadius: '35px 35px 0 0', 
                border: '1.5px solid rgba(255,255,255,0.1)', 
                overflowY: 'auto', 
                padding: '25px',
                position: 'relative'
              }}
            >
              {/* Close handle */}
              <div 
                onClick={() => setSelectedProduct(null)} 
                style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', margin: '0 auto 20px', cursor: 'pointer' }}
              ></div>

              {/* Product Gallery */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#f1f5f9', borderRadius: '25px', overflow: 'hidden' }}>
                <img 
                  src={productImages[selectedImageIndex]} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                />
              </div>

              {/* Details */}
              <div style={{ marginTop: '25px' }}>
                <h2 style={{ color: 'white', fontSize: '22px', margin: '0 0 10px 0' }}>{selectedProduct.name}</h2>
                <div style={{ color: '#fbbf24', fontSize: '28px', fontWeight: '900', marginBottom: '20px' }}>
                  {selectedProduct.price?.toLocaleString()} UZS
                </div>

                {/* Image selector thumbnails */}
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
                  {productImages.map((img: string, idx: number) => (
                    <img 
                      key={idx} 
                      src={img} 
                      onClick={() => setSelectedImageIndex(idx)} 
                      style={{ 
                        width: '60px', 
                        height: '75px', 
                        borderRadius: '12px', 
                        objectFit: 'cover',
                        border: selectedImageIndex === idx ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer'
                      }} 
                    />
                  ))}
                </div>

                {/* Size selection */}
                {productSizes.length > 0 && (
                  <div style={{ marginTop: '25px' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginBottom: '10px' }}>O'LCHAM TANLANING:</div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {productSizes.map((s: string) => (
                        <button 
                          key={s} 
                          onClick={() => setSelectedSize(s)}
                          style={{ 
                            padding: '12px 20px', 
                            borderRadius: '12px', 
                            background: selectedSize === s ? '#fbbf24' : 'rgba(255,255,255,0.05)', 
                            color: selectedSize === s ? '#050b14' : 'white', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            fontSize: '13px',
                            fontWeight: '700'
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color selection */}
                {productColors.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginBottom: '10px' }}>RANG TANLANING:</div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {productColors.map((c: string) => (
                        <button 
                          key={c} 
                          onClick={() => setSelectedColor(c)}
                          style={{ 
                            padding: '8px 15px', 
                            borderRadius: '12px', 
                            background: selectedColor === c ? 'white' : 'rgba(255,255,255,0.05)', 
                            color: selectedColor === c ? 'black' : 'white', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            fontSize: '12px'
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Purchase buttons */}
                <div style={{ marginTop: '35px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <button 
                      onClick={() => count > 1 && setCount(count-1)} 
                      style={{ padding: '15px 20px', color: 'white', background: 'none', border: 'none', fontSize: '20px' }}
                    >-</button>
                    <span style={{ fontSize: '18px', fontWeight: '700', minWidth: '30px', textAlign: 'center' }}>{count}</span>
                    <button 
                      onClick={() => setCount(count+1)} 
                      style={{ padding: '15px 20px', color: 'white', background: 'none', border: 'none', fontSize: '20px' }}
                    >+</button>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(selectedProduct, selectedImageIndex)} 
                    style={{ 
                      flex: 1, 
                      background: '#fbbf24', 
                      height: '55px',
                      borderRadius: '18px', 
                      border: 'none', 
                      fontWeight: '900',
                      color: '#050b14',
                      fontSize: '14px'
                    }}
                  >
                    SAVATGA QO'SHISH
                  </button>
                </div>
                
                <div style={{ height: '40px' }}></div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* BOTTOM NAVIGATION BAR */}
      <nav 
        style={{ 
          position: 'fixed', 
          bottom: '30px', 
          width: '95%', 
          maxWidth: '440px', 
          height: '75px', 
          borderRadius: '38px', 
          background: 'rgba(255, 255, 255, 0.08)', 
          backdropFilter: 'blur(30px)', 
          border: '1px solid rgba(255, 255, 255, 0.15)', 
          display: 'flex', 
          justifyContent: 'space-around', 
          alignItems: 'center', 
          zIndex: 100,
          boxShadow: '0 15px 35px rgba(0,0,0,0.5)'
        }}
      >
        {[
          { id: 'Home', name: 'ASOSIY', icon: <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/> },
          { id: 'Kiyimlar', name: 'DO\'KON', icon: <path d="M20.38 3.46 16 2a8.5 8.5 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/> },
          { id: 'Look', name: 'LOOK', icon: <path d="M6 3h12l4 6-10 13L2 9Z" /> }, 
          { id: 'Yoqtirganlar', name: 'SEVIMLI', icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /> },
          { id: 'Savat', name: 'SAVAT', icon: <path d="M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /> },
          { id: 'AI', name: 'AI', icon: <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /> }
        ].map((tab) => (
          <div 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              flex: 1, 
              position: 'relative',
              transition: 'transform 0.2s ease'
            }}
          >
            {tab.id === 'Savat' && totalCartItems > 0 && (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '-5px', 
                  right: '15px', 
                  background: '#ef4444', 
                  borderRadius: '50%', 
                  width: '16px', 
                  height: '16px', 
                  color: 'white', 
                  fontSize: '9px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: '900',
                  border: '2px solid rgba(255,255,255,0.1)'
                }}
              >
                {totalCartItems}
              </div>
            )}
            
            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={activeTab === tab.id ? '#fbbf24' : 'white'} 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ filter: activeTab === tab.id ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))' : 'none' }}
            >
              {tab.icon}
            </svg>
            
            <span 
              style={{ 
                fontSize: '8px', 
                color: activeTab === tab.id ? '#fbbf24' : 'white', 
                fontWeight: '800', 
                marginTop: '5px' 
              }}
            >
              {tab.name}
            </span>
          </div>
        ))}
      </nav>

      {/* GLOBAL ANIMATIONS AND STYLES */}
      <style jsx global>{`
        * { 
          -webkit-tap-highlight-color: transparent; 
          outline: none; 
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          background-color: #050b14;
        }

        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }

        ::-webkit-scrollbar {
          width: 0px;
        }

        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
        }
      `}</style>
    </main>
  );
}

// EOF - Loyiha yakuni
