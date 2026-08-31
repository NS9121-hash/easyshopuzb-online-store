'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Home,
  Shirt,
  Gem,
  Heart,
  ShoppingCart,
  Sparkles,
  User,
  Search,
  X,
  HelpCircle,
  Upload,
  CheckCircle2,
  Package,
  Send,
  Phone,
  ArrowUpDown,
  SlidersHorizontal,
  ChevronDown,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';

interface OrderRecord {
  id: string;
  orderNumber: string;
  itemName: string;
  itemCategory: string;
  price: number;
  date: string;
  status: 'YETKAZILDI' | 'YETKAZILMOQDA' | 'QABUL_QILINDI';
  address?: string;
  image?: string;
}

interface FavoriteItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
}

interface ToastNotification {
  id: string;
  type: 'success' | 'favorite-add' | 'favorite-remove' | 'info';
  title: string;
  message: string;
}

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord-101',
    orderNumber: 'ES-84920',
    itemName: 'Smart Casual Look To\'plami',
    itemCategory: 'Look',
    price: 600000,
    date: '28 Avgust 2026',
    status: 'YETKAZILDI',
    address: 'Toshkent sh., Yunusobod tumani',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ord-102',
    orderNumber: 'ES-91304',
    itemName: 'Oyoq kiyim Classic Leather',
    itemCategory: 'Oyoq kiyim',
    price: 150000,
    date: '30 Avgust 2026',
    status: 'YETKAZILMOQDA',
    address: 'Toshkent sh., Chilonzor 9',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80'
  }
];

const INITIAL_FAVORITES: FavoriteItem[] = [
  {
    id: 'fav1',
    name: 'Oyoq kiyim',
    category: 'Oyoq kiyim',
    price: 150000,
  },
  {
    id: 'fav2',
    name: 'Look',
    category: 'Look',
    price: 600000,
  }
];

const CLOTHES_PRODUCTS = [
  {
    id: 'c1',
    name: 'Oyoq kiyim Classic Leather',
    category: 'Oyoq kiyim',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    sizes: ['39', '40', '41', '42', '43']
  },
  {
    id: 'c2',
    name: 'Smart Casual Look To\'plami',
    category: 'Look',
    price: 600000,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    sizes: ['M', 'L', 'XL']
  },
  {
    id: 'c3',
    name: 'Premium Oversize Xudi',
    category: 'Xudi',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'c4',
    name: 'Qishki Bomber Kurtka',
    category: 'Kurtka',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80',
    sizes: ['M', 'L', 'XL']
  },
  {
    id: 'c5',
    name: 'Klassik Kostyum-Shim',
    category: 'Kostyum',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    sizes: ['48', '50', '52']
  },
  {
    id: 'c6',
    name: 'Basic Paxta Futbolka',
    category: 'Futbolka',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L', 'XL']
  }
];

type TabType = 'ASOSIY' | 'KIYIMLAR' | 'LOOK' | 'YOQTIRGAN' | 'SAVAT' | 'AI' | 'PROFIL';

interface FlyingItem {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  image?: string;
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabType>('ASOSIY');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startPlay = () => {
      const vid = videoRef.current;
      if (vid && activeTab === 'ASOSIY') {
        vid.muted = true;
        vid.defaultMuted = true;
        vid.playsInline = true;
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Wait for user gesture on iOS
          });
        }
      }
    };

    startPlay();

    // In case iOS Safari Low-Power mode blocks automatic playback until first touch
    const handleFirstGesture = () => {
      startPlay();
    };

    window.addEventListener('touchstart', handleFirstGesture, { passive: true });
    window.addEventListener('click', handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
    };
  }, [activeTab]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>(INITIAL_FAVORITES);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [selectedOrderFilter, setSelectedOrderFilter] = useState<'all' | 'YETKAZILDI' | 'YETKAZILMOQDA' | 'QABUL_QILINDI'>('all');
  const [cart, setCart] = useState<any[]>([]);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [isCartBumping, setIsCartBumping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'category'>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Toast notifications state
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts(prev => [...prev.slice(-2), { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  
  // Modals
  const [orderingItem, setOrderingItem] = useState<any | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [orderSent, setOrderSent] = useState(false);

  // Categories list
  const categories = useMemo(() => {
    const unique = Array.from(new Set(CLOTHES_PRODUCTS.map(p => p.category)));
    return ['all', ...unique];
  }, []);

  // Filtered & Sorted products
  const sortedAndFilteredProducts = useMemo(() => {
    let result = CLOTHES_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'category') {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const isFavorite = (id: string, name: string) => {
    return favorites.some(f => f.id === id || f.name === name);
  };

  const toggleFavorite = (item: { id: string; name: string; category: string; price: number; image?: string }) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === item.id || f.name === item.name);
      if (exists) {
        addToast({
          type: 'favorite-remove',
          title: "Sevimlilardan o'chirildi",
          message: `"${item.name}" sevimlilar ro'yxatidan olib tashlandi`
        });
        return prev.filter(f => f.id !== item.id && f.name !== item.name);
      } else {
        addToast({
          type: 'favorite-add',
          title: "Sevimlilarga qo'shildi! ❤️",
          message: `"${item.name}" saralanganlar safiga saqlandi`
        });
        return [
          ...prev,
          {
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            image: item.image
          }
        ];
      }
    });
  };

  // AI Fitting state
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedCloth, setSelectedCloth] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const formatPrice = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm";
  };

  const handleAddToCartWithAnimation = (item: any, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const cartNavButton = document.getElementById('nav-tab-savat');
    let endX = window.innerWidth / 2;
    let endY = window.innerHeight - 40;

    if (cartNavButton) {
      const cartRect = cartNavButton.getBoundingClientRect();
      endX = cartRect.left + cartRect.width / 2;
      endY = cartRect.top + cartRect.height / 2;
    }

    const flyId = Date.now() + Math.random();
    const newFlyingItem: FlyingItem = {
      id: flyId,
      startX: rect.left + rect.width / 2,
      startY: rect.top + rect.height / 2,
      endX,
      endY,
      image: item.image
    };

    setFlyingItems(prev => [...prev, newFlyingItem]);

    // Open order modal
    setOrderingItem(item);

    // Trigger cart bump and cleanup flying item
    setTimeout(() => {
      setIsCartBumping(true);
      setTimeout(() => setIsCartBumping(false), 500);
      setFlyingItems(prev => prev.filter(f => f.id !== flyId));
    }, 700);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !orderingItem) return;
    
    const orderNum = `ES-${Math.floor(10000 + Math.random() * 90000)}`;
    // Add new order record
    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      itemName: orderingItem.name,
      itemCategory: orderingItem.category || 'Kiyim',
      price: orderingItem.price,
      date: new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'QABUL_QILINDI',
      address: clientAddress || 'Manzil ko\'rsatilmagan',
      image: orderingItem.image
    };

    setOrders(prev => [newOrder, ...prev]);
    setOrderSent(true);

    addToast({
      type: 'success',
      title: 'Buyurtmangiz qabul qilindi! 🎉',
      message: `${orderingItem.name} uchun buyurtma (#${orderNum}) muvaffaqiyatli saqlandi`
    });

    setTimeout(() => {
      setOrderSent(false);
      setOrderingItem(null);
      setClientName('');
      setClientPhone('');
      setClientAddress('');
    }, 2200);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserPhoto(URL.createObjectURL(file));
    }
  };

  const handleAIGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAiResult('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80');
    }, 2000);
  };

  return (
    <>
      {/* Background Wallpaper */}
      <div className="app-bg" />

      <div className="app-container">
        
        {/* 🔹 HEADER (Exact as in all screenshots) */}
        <header className="app-header">
          <h1 className="brand-title">
            EASYSHOP<span className="gold-accent">_UZB</span>
          </h1>
          <p className="brand-subtitle">OSON ONLINE XARID</p>
        </header>

        {/* 🔹 MAIN VIEWS */}
        <main className="w-full flex-1 flex flex-col items-center relative min-h-[460px]">
          {/* 1️⃣ ASOSIY (Screenshot 1 / IMG_4787 - Pure Water Video Hero) */}
          {activeTab === 'ASOSIY' && (
            <div className="w-full flex flex-col items-center view-animate">
              <div
                className="welcome-hero-card cursor-pointer"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.play().catch(() => {});
                  }
                }}
              >
                <video
                  ref={videoRef}
                  className="hero-video pointer-events-none"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                  disablePictureInPicture
                  disableRemotePlayback
                  preload="auto"
                  poster="/water_poster.jpg"
                >
                  <source src="/water_loop.mp4" type="video/mp4" />
                  <source src="/-1880952146411559581.mp4" type="video/mp4" />
                </video>
                <div className="hero-overlay pointer-events-none" />
                <div className="hero-content pointer-events-none">
                  <h2 className="hero-title">ASSALOMU ALEYKUM</h2>
                  <p className="hero-subtext">ONLAYN KIYIM DO&apos;KONIMIZGA XUSH KELIBSIZ</p>
                </div>
              </div>
            </div>
          )}

          {/* 2️⃣ KIYIMLAR (Screenshot 2 + Sorting Dropdown) */}
          {activeTab === 'KIYIMLAR' && (
            <div className="w-full flex flex-col view-animate">
              {/* Search & Sort Row */}
              <div className="flex flex-col gap-2.5 w-full mb-3.5">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Kiyimlarni qidiring..."
                    className="w-full h-11 pl-10 pr-4 rounded-2xl liquid-input text-white text-xs placeholder:text-gray-300 focus:outline-none"
                  />
                  <Search className="absolute left-3.5 top-3 text-cyan-300/80" size={16} />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-3 text-gray-300 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Sorting & Filter Controls */}
                <div className="flex items-center gap-2 relative z-20">
                  {/* Custom Sort Dropdown */}
                  <div className="relative flex-1">
                    <button
                      type="button"
                      id="sort-dropdown-button"
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="w-full h-10 px-3.5 rounded-2xl liquid-input flex items-center justify-between text-xs font-bold text-white shadow-md transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <ArrowUpDown size={14} className="text-[#ffb703] shrink-0" />
                        <span className="truncate">
                          {sortBy === 'default' && 'Saralash: Standart'}
                          {sortBy === 'price-asc' && 'Narx: Arzondan qimmatga'}
                          {sortBy === 'price-desc' && 'Narx: Qimmatdan arzonga'}
                          {sortBy === 'category' && 'Kategoriya bo\'yicha'}
                        </span>
                      </div>
                      <ChevronDown
                        size={15}
                        className={`text-cyan-300 transition-transform duration-200 shrink-0 ${
                          isSortOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isSortOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setIsSortOpen(false)}
                        />
                        <div
                          id="sort-dropdown-menu"
                          className="absolute left-0 right-0 top-12 z-40 p-1.5 rounded-2xl glass-box border border-white/30 shadow-2xl flex flex-col gap-1 text-xs"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSortBy('default');
                              setIsSortOpen(false);
                            }}
                            className={`w-full px-3 py-2.5 rounded-xl text-left font-bold flex items-center justify-between transition-colors ${
                              sortBy === 'default'
                                ? 'bg-yellow-400/20 text-[#ffb703] border border-yellow-400/40'
                                : 'text-gray-200 hover:bg-white/15'
                            }`}
                          >
                            <span>Standart</span>
                            {sortBy === 'default' && <span className="w-1.5 h-1.5 rounded-full bg-[#ffb703]" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSortBy('price-asc');
                              setIsSortOpen(false);
                            }}
                            className={`w-full px-3 py-2.5 rounded-xl text-left font-bold flex items-center justify-between transition-colors ${
                              sortBy === 'price-asc'
                                ? 'bg-yellow-400/20 text-[#ffb703] border border-yellow-400/40'
                                : 'text-gray-200 hover:bg-white/15'
                            }`}
                          >
                            <span>Narx: Arzondan qimmatga (O&apos;sish)</span>
                            {sortBy === 'price-asc' && <span className="w-1.5 h-1.5 rounded-full bg-[#ffb703]" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSortBy('price-desc');
                              setIsSortOpen(false);
                            }}
                            className={`w-full px-3 py-2.5 rounded-xl text-left font-bold flex items-center justify-between transition-colors ${
                              sortBy === 'price-desc'
                                ? 'bg-yellow-400/20 text-[#ffb703] border border-yellow-400/40'
                                : 'text-gray-200 hover:bg-white/15'
                            }`}
                          >
                            <span>Narx: Qimmatdan arzonga (Kamayish)</span>
                            {sortBy === 'price-desc' && <span className="w-1.5 h-1.5 rounded-full bg-[#ffb703]" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSortBy('category');
                              setIsSortOpen(false);
                            }}
                            className={`w-full px-3 py-2.5 rounded-xl text-left font-bold flex items-center justify-between transition-colors ${
                              sortBy === 'category'
                                ? 'bg-yellow-400/20 text-[#ffb703] border border-yellow-400/40'
                                : 'text-gray-200 hover:bg-white/15'
                            }`}
                          >
                            <span>Kategoriya bo&apos;yicha (A-Z)</span>
                            {sortBy === 'category' && <span className="w-1.5 h-1.5 rounded-full bg-[#ffb703]" />}
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Native Category Selector Pill */}
                  <div className="relative">
                    <select
                      id="category-filter-select"
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="h-10 pl-3 pr-7 rounded-2xl liquid-input text-white text-xs font-bold focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="all" className="bg-[#071730] text-white">Barchasi</option>
                      {categories.filter(c => c !== 'all').map(cat => (
                        <option key={cat} value={cat} className="bg-[#071730] text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <SlidersHorizontal size={13} className="absolute right-2.5 top-3.5 text-cyan-300/80 pointer-events-none" />
                  </div>
                </div>

                {/* Active Filter Indicators if any */}
                {(sortBy !== 'default' || selectedCategory !== 'all' || searchQuery) && (
                  <div className="flex items-center justify-between text-[11px] px-1 text-gray-300 font-semibold">
                    <span>
                      Natijalar: <b className="text-yellow-400">{sortedAndFilteredProducts.length}</b> ta mahsulot
                    </span>
                    {(sortBy !== 'default' || selectedCategory !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setSortBy('default');
                          setSelectedCategory('all');
                        }}
                        className="text-cyan-400 hover:underline font-bold"
                      >
                        Filtrni tozalash
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Clothes Grid */}
              {sortedAndFilteredProducts.length === 0 ? (
                <div className="w-full py-12 flex flex-col items-center justify-center text-center glass-box p-6 mt-2">
                  <p className="text-gray-300 text-xs font-bold">Mos kiyimlar topilmadi</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSortBy('default');
                    }}
                    className="btn-gold px-4 py-2 mt-3 text-[10.5px]"
                  >
                    Barcha kiyimlarni ko&apos;rish
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3.5 w-full">
                  {sortedAndFilteredProducts.map(item => {
                    const favorited = isFavorite(item.id, item.name);
                    return (
                      <div key={item.id} className="glass-box p-2.5 flex flex-col justify-between relative group">
                        <div className="w-full h-40 rounded-2xl overflow-hidden bg-black/40 mb-2 relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          
                          {/* Heart Toggle Button */}
                          <button
                            type="button"
                            aria-label={favorited ? "Yoqtirganlardan o'chirish" : "Yoqtirganlarga qo'shish"}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item);
                            }}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/55 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform active:scale-75 hover:bg-black/75 shadow-lg z-10"
                          >
                            <Heart
                              size={16}
                              className={
                                favorited
                                  ? "text-[#ef4444] fill-[#ef4444] drop-shadow-[0_2px_8px_rgba(239,68,68,0.5)]"
                                  : "text-white/80 hover:text-white"
                              }
                            />
                          </button>
                        </div>

                        <div className="border-t border-white/10 pt-2 flex flex-col">
                          <p className="text-yellow-400 font-extrabold text-[13px]">{formatPrice(item.price)}</p>
                          <p className="text-gray-200 text-xs font-semibold mt-0.5 truncate">{item.category}</p>
                          <button
                            type="button"
                            onClick={(e) => handleAddToCartWithAnimation(item, e)}
                            className="btn-gold w-full py-2 mt-2.5 text-[10.5px] transition-transform active:scale-95"
                          >
                            BUYURTMA BERISH
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3️⃣ LOOK (Screenshot 3 - Exact dashed box with Liquid Glass) */}
          {activeTab === 'LOOK' && (
            <div className="w-full flex flex-col items-center justify-center pt-8 view-animate">
              <div className="w-full h-44 rounded-3xl border-2 border-dashed border-cyan-400/40 liquid-pill flex items-center justify-center p-6 text-center shadow-2xl">
                <span className="text-[#38bdf8] font-black text-sm tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(56,189,248,0.5)]">
                  HOZIRCHA LOOKLAR MAVJUD EMAS
                </span>
              </div>
            </div>
          )}

          {/* 4️⃣ YOQTIRGAN (Screenshot 4 - Liquid Glass 2-card layout) */}
          {activeTab === 'YOQTIRGAN' && (
            <div className="w-full flex flex-col view-animate">
              <h2 className="text-center text-white font-extrabold text-sm tracking-wider uppercase mb-5">
                YOQTIRGANLAR ({favorites.length})
              </h2>

              {favorites.length === 0 ? (
                <div className="w-full py-12 flex flex-col items-center justify-center text-center glass-box p-6 mt-2">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/40 flex items-center justify-center mb-3 shadow-lg">
                    <Heart size={22} className="text-red-400 fill-red-400/40" />
                  </div>
                  <p className="text-white text-xs font-bold uppercase tracking-wider">Yoqtirgan kiyimlar mavjud emas</p>
                  <p className="text-gray-300 text-[11px] mt-1">Kiyimlar bo&apos;limidan yurakcha tugmasini bosing</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('KIYIMLAR')}
                    className="btn-gold px-5 py-2.5 mt-4 text-[10.5px]"
                  >
                    KIYIMLAR BO&apos;LIMIGA O&apos;TISH
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3.5 w-full">
                  {favorites.map(item => (
                    <div
                      key={item.id}
                      className="glass-box p-3 flex flex-col justify-between relative group"
                    >
                      {/* Red Heart Top Right - Clickable to Remove */}
                      <button
                        type="button"
                        aria-label="Yoqtirganlardan o'chirish"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item);
                        }}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/55 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-75 transition-transform shadow-lg"
                      >
                        <Heart size={16} className="text-[#ef4444] fill-[#ef4444] drop-shadow-[0_2px_8px_rgba(239,68,68,0.6)]" />
                      </button>

                      {/* Card Graphic or Image */}
                      {item.image ? (
                        <div className="w-full h-44 rounded-2xl overflow-hidden bg-black/40 border border-white/15 mb-3">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-full h-44 rounded-2xl bg-gradient-to-b from-blue-600/30 to-blue-950/50 border border-blue-400/20 flex items-center justify-center mb-3">
                          <div className="w-6 h-6 border border-cyan-300/60 rounded flex items-center justify-center text-cyan-200 text-xs font-bold">
                            ?
                          </div>
                        </div>
                      )}

                      {/* Divider & Info */}
                      <div className="border-t border-white/15 pt-2 flex flex-col">
                        <p className="text-[#ffb703] font-black text-sm">
                          {formatPrice(item.price)}
                        </p>
                        <p className="text-white text-xs font-medium mt-0.5 truncate">
                          {item.name}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => handleAddToCartWithAnimation(item, e)}
                          className="btn-gold w-full py-2.5 mt-3 text-[11px] transition-transform active:scale-95"
                        >
                          BUYURTMA BERISH
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5️⃣ SAVAT (Screenshot 5 - Liquid Glass centered card) */}
          {activeTab === 'SAVAT' && (
            <div className="w-full flex flex-col items-center justify-center pt-10 view-animate">
              <div className="w-full h-40 glass-box flex items-center justify-center p-6 text-center shadow-2xl">
                <span className="text-white font-extrabold text-sm tracking-widest uppercase drop-shadow-md">
                  SAVATCHANGIZ BO&apos;SH
                </span>
              </div>
            </div>
          )}

          {/* 6️⃣ AI (Screenshot 6 - Liquid Glass AI Kiyib Ko'rish Card) */}
          {activeTab === 'AI' && (
            <div className="w-full flex flex-col items-center pt-3 view-animate">
              <div className="w-full glass-box p-5 flex flex-col items-center shadow-2xl">
                <h2 className="text-[#ffb703] font-black text-base tracking-wider uppercase mb-5 drop-shadow-[0_2px_8px_rgba(255,183,3,0.4)]">
                  AI KIYIB KO&apos;RISH
                </h2>

                <div className="grid grid-cols-2 gap-3 w-full mb-5">
                  {/* Left Box: Rasm Yuklash */}
                  <label className="h-44 rounded-2xl border-2 border-dashed border-cyan-400/45 liquid-pill flex flex-col items-center justify-center cursor-pointer p-2 text-center relative overflow-hidden transition-all hover:border-cyan-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    {userPhoto ? (
                      <img src={userPhoto} alt="Rasm" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-white font-extrabold text-[11px] tracking-wider uppercase drop-shadow">
                        RASMINGIZ
                      </span>
                    )}
                  </label>

                  {/* Right Box: Kiyim */}
                  <div
                    onClick={() => {
                      setSelectedCloth(CLOTHES_PRODUCTS[0].image);
                    }}
                    className="h-44 rounded-2xl border-2 border-dashed border-cyan-400/45 liquid-pill flex flex-col items-center justify-center cursor-pointer p-2 text-center relative overflow-hidden transition-all hover:border-cyan-300"
                  >
                    {selectedCloth ? (
                      <img src={selectedCloth} alt="Kiyim" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-white font-extrabold text-[11px] tracking-wider uppercase drop-shadow">
                        KIYIM
                      </span>
                    )}
                  </div>
                </div>

                {/* KIYIB KO'RISH Button */}
                <button
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                  className="btn-gold w-full py-3.5 text-xs font-black tracking-wider flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'KIYIB KO\'RISH'
                  )}
                </button>

                {aiResult && (
                  <div className="w-full mt-4 p-3 rounded-2xl glass-box border border-yellow-400/40 flex flex-col items-center">
                    <p className="text-xs font-bold text-yellow-400 mb-2">✨ AI Natijasi:</p>
                    <img src={aiResult} alt="AI" className="w-full h-56 object-cover rounded-xl" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7️⃣ PROFIL (Screenshot 7 + Orders History) */}
          {activeTab === 'PROFIL' && (
            <div className="w-full flex flex-col gap-3.5 pt-3 view-animate">
              {/* Profile Card */}
              <div className="glass-box p-4 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ffb703] to-amber-500 text-black flex items-center justify-center font-black text-xl shadow-[0_4px_16px_rgba(255,183,3,0.4)] shrink-0">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm drop-shadow-sm">Mijoz Profili</h3>
                  <p className="text-cyan-200 text-xs mt-0.5 font-medium">+998 (90) 123-45-67</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full liquid-pill text-[#ffb703] font-black text-[8.5px] uppercase tracking-wide">
                    Premium Foydalanuvchi
                  </span>
                </div>
              </div>

              {/* Previous Orders Section */}
                <div className="glass-box p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Package size={17} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                      <h4 className="text-white font-extrabold text-xs tracking-wider uppercase">
                        Mening Buyurtmalarim ({orders.length})
                      </h4>
                    </div>
                    <span className="text-yellow-400 font-bold text-[11px]">
                      Tarix
                    </span>
                  </div>

                  {/* Filter Badges */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setSelectedOrderFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
                        selectedOrderFilter === 'all'
                          ? 'btn-gold !py-1 text-black shadow-md'
                          : 'liquid-pill text-gray-200 hover:text-white'
                      }`}
                    >
                      Barchasi ({orders.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOrderFilter('YETKAZILDI')}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
                        selectedOrderFilter === 'YETKAZILDI'
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
                          : 'liquid-pill text-gray-200 hover:text-white'
                      }`}
                    >
                      Yetkazildi ({orders.filter(o => o.status === 'YETKAZILDI').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOrderFilter('YETKAZILMOQDA')}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
                        selectedOrderFilter === 'YETKAZILMOQDA'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md'
                          : 'liquid-pill text-gray-200 hover:text-white'
                      }`}
                    >
                      Yo&apos;lda ({orders.filter(o => o.status === 'YETKAZILMOQDA').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOrderFilter('QABUL_QILINDI')}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
                        selectedOrderFilter === 'QABUL_QILINDI'
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md'
                          : 'liquid-pill text-gray-200 hover:text-white'
                      }`}
                    >
                      Yangi ({orders.filter(o => o.status === 'QABUL_QILINDI').length})
                    </button>
                  </div>

                  {/* Orders List */}
                  {orders.filter(o => selectedOrderFilter === 'all' || o.status === selectedOrderFilter).length === 0 ? (
                    <div className="py-6 text-center flex flex-col items-center justify-center">
                      <ShoppingBag size={28} className="text-gray-400 mb-1.5" />
                      <p className="text-gray-300 text-xs font-semibold">Buyurtmalar topilmadi</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5 mt-1">
                      {orders
                        .filter(o => selectedOrderFilter === 'all' || o.status === selectedOrderFilter)
                        .map((order) => {
                          let statusColor = 'liquid-pill text-green-300 border-green-400/40';
                          let statusIcon = <CheckCircle size={12} className="text-green-400" />;
                          let statusText = 'Yetkazilgan';

                          if (order.status === 'YETKAZILMOQDA') {
                            statusColor = 'liquid-pill text-cyan-300 border-cyan-400/40';
                            statusIcon = <Truck size={12} className="text-cyan-400" />;
                            statusText = 'Yetkazilmoqda';
                          } else if (order.status === 'QABUL_QILINDI') {
                            statusColor = 'liquid-pill text-amber-300 border-amber-400/40';
                            statusIcon = <Clock size={12} className="text-amber-400" />;
                            statusText = 'Qabul qilindi';
                          }

                          return (
                            <div
                              key={order.id}
                              className="p-3 rounded-2xl liquid-pill flex flex-col gap-2 relative transition-all hover:border-cyan-300/60"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-extrabold text-cyan-300">
                                    #{order.orderNumber}
                                  </span>
                                  <span className="text-[10px] text-gray-300">
                                    • {order.date}
                                  </span>
                                </div>
                                <div className={`px-2.5 py-0.5 rounded-full border text-[9.5px] font-black flex items-center gap-1 shadow-sm ${statusColor}`}>
                                  {statusIcon}
                                  <span>{statusText}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {order.image ? (
                                  <img
                                    src={order.image}
                                    alt={order.itemName}
                                    className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0 shadow-md"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-blue-900/40 border border-blue-400/20 flex items-center justify-center text-cyan-300 shrink-0">
                                    <Package size={20} />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-xs font-bold truncate">
                                    {order.itemName}
                                  </p>
                                  <p className="text-gray-300 text-[10px] truncate">
                                    {order.itemCategory} {order.address ? `• ${order.address}` : ''}
                                  </p>
                                  <p className="text-[#ffb703] font-black text-xs mt-0.5 drop-shadow-sm">
                                    {formatPrice(order.price)}
                                  </p>
                                </div>
                              </div>

                              {/* Visual Progress Bar (Qabul qilindi -> Yetkazilmoqda -> Yetkazildi) */}
                              <div className="pt-2 border-t border-white/15 flex flex-col gap-1.5 mt-1">
                                {(() => {
                                  const step = order.status === 'QABUL_QILINDI' ? 1 : order.status === 'YETKAZILMOQDA' ? 2 : 3;
                                  const progressPercent = step === 1 ? '15%' : step === 2 ? '55%' : '100%';
                                  return (
                                    <div className="w-full flex flex-col gap-1.5">
                                      {/* Bar Track */}
                                      <div className="relative w-full h-2 bg-white/15 rounded-full overflow-hidden p-0.5">
                                        <div
                                          className={`h-full rounded-full transition-all duration-500 ${
                                            step === 3
                                              ? 'bg-gradient-to-r from-green-400 to-emerald-300 shadow-[0_0_8px_rgba(74,222,128,0.8)]'
                                              : step === 2
                                              ? 'bg-gradient-to-r from-amber-400 via-blue-400 to-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                                              : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                                          }`}
                                          style={{ width: progressPercent }}
                                        />
                                      </div>

                                      {/* Step Indicators */}
                                      <div className="flex items-center justify-between text-[9px] font-bold">
                                        {/* Step 1: Qabul qilindi */}
                                        <div className={`flex items-center gap-1 ${step >= 1 ? 'text-amber-300' : 'text-gray-400'}`}>
                                          <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-gray-600'}`} />
                                          <span>Qabul qilindi</span>
                                        </div>

                                        {/* Step 2: Yetkazilmoqda */}
                                        <div className={`flex items-center gap-1 ${step >= 2 ? 'text-cyan-300' : 'text-gray-400'}`}>
                                          <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-gray-600'}`} />
                                          <span>Yetkazilmoqda</span>
                                        </div>

                                        {/* Step 3: Yetkazildi */}
                                        <div className={`flex items-center gap-1 ${step >= 3 ? 'text-green-400' : 'text-gray-400'}`}>
                                          <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-gray-600'}`} />
                                          <span>Yetkazildi</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Quick Profile Links */}
                <div className="glass-box divide-y divide-white/15 overflow-hidden">
                  <div 
                    onClick={() => setActiveTab('YOQTIRGAN')}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Heart size={17} className="text-red-400 fill-red-400/30" />
                      <span className="text-white text-xs font-bold">Yoqtirganlar</span>
                    </div>
                    <span className="text-yellow-400 text-xs font-bold">{favorites.length} ta →</span>
                  </div>

                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Send size={17} className="text-blue-400" />
                      <span className="text-white text-xs font-bold">Telegram Bot</span>
                    </div>
                    <span className="text-[#ffb703] text-xs font-bold">@easyshopuzb_bot</span>
                  </div>

                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone size={17} className="text-green-400" />
                      <span className="text-white text-xs font-bold">Qo&apos;llab-quvvatlash</span>
                    </div>
                    <span className="text-gray-300 text-xs font-semibold">+998 90 000 00 00</span>
                  </div>
                </div>
              </div>
            )}
        </main>

        {/* 🔹 ORDER MODAL */}
        {orderingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-sm glass-box p-5 relative border border-white/35 shadow-2xl">
              <button
                onClick={() => setOrderingItem(null)}
                className="absolute top-4 right-4 text-gray-300 hover:text-white p-1"
              >
                <X size={18} />
              </button>

              {orderSent ? (
                <div className="py-6 text-center flex flex-col items-center">
                  <CheckCircle2 size={48} className="text-green-400 mb-2 drop-shadow-[0_0_12px_rgba(74,222,128,0.6)]" />
                  <h3 className="text-white font-black text-base">Buyurtmangiz Qabul Qilindi!</h3>
                  <p className="text-gray-300 text-xs mt-1">Tez orada siz bilan bog&apos;lanamiz.</p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="flex flex-col gap-3">
                  <h3 className="text-white font-black text-sm text-center tracking-wider">
                    BUYURTMA BERISH
                  </h3>

                  <div className="p-2.5 rounded-2xl liquid-pill flex items-center justify-between">
                    <span className="text-white font-bold text-xs">{orderingItem.name}</span>
                    <span className="text-[#ffb703] font-black text-xs">{formatPrice(orderingItem.price)}</span>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-300">Ismingiz *</label>
                    <input
                      required
                      type="text"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      placeholder="Ismingizni kiriting"
                      className="w-full h-10 px-3.5 mt-1 rounded-2xl liquid-input text-white text-xs placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-300">Telefon raqamingiz *</label>
                    <input
                      required
                      type="tel"
                      value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full h-10 px-3.5 mt-1 rounded-2xl liquid-input text-white text-xs placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-300">Yetkazib berish manzili</label>
                    <input
                      type="text"
                      value={clientAddress}
                      onChange={e => setClientAddress(e.target.value)}
                      placeholder="Shahar, manzil"
                      className="w-full h-10 px-3.5 mt-1 rounded-2xl liquid-input text-white text-xs placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-gold w-full py-3 text-xs mt-2 font-black"
                  >
                    TASDIQLASH VA YUBORISH
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 🔹 BOTTOM FLOATING NAVIGATION BAR (7 exact tabs matching screenshot 1-7) */}
        <div className="bottom-nav-container">
          <nav className="bottom-nav-bar">
            
            {/* 1. ASOSIY */}
            <button
              type="button"
              onClick={() => setActiveTab('ASOSIY')}
              className={`nav-tab-button ${activeTab === 'ASOSIY' ? 'active' : ''}`}
            >
              <div className="nav-tab-icon">
                <Home size={19} />
              </div>
              <span className="nav-tab-label">ASOSIY</span>
            </button>

            {/* 2. KIYIMLAR */}
            <button
              type="button"
              onClick={() => setActiveTab('KIYIMLAR')}
              className={`nav-tab-button ${activeTab === 'KIYIMLAR' ? 'active' : ''}`}
            >
              <div className="nav-tab-icon">
                <Shirt size={19} />
              </div>
              <span className="nav-tab-label">KIYIMLAR</span>
            </button>

            {/* 3. LOOK */}
            <button
              type="button"
              onClick={() => setActiveTab('LOOK')}
              className={`nav-tab-button ${activeTab === 'LOOK' ? 'active' : ''}`}
            >
              <div className="nav-tab-icon">
                <Gem size={19} />
              </div>
              <span className="nav-tab-label">LOOK</span>
            </button>

            {/* 4. YOQTIRGAN */}
            <button
              type="button"
              onClick={() => setActiveTab('YOQTIRGAN')}
              className={`nav-tab-button ${activeTab === 'YOQTIRGAN' ? 'active' : ''}`}
            >
              <div className="nav-tab-icon">
                <Heart size={19} />
              </div>
              <span className="nav-tab-label">YOQTIRGAN</span>
            </button>

            {/* 5. SAVAT */}
            <button
              type="button"
              id="nav-tab-savat"
              onClick={() => setActiveTab('SAVAT')}
              className={`nav-tab-button ${activeTab === 'SAVAT' ? 'active' : ''} ${isCartBumping ? 'scale-125' : ''} transition-all duration-300`}
            >
              <div className={`nav-tab-icon relative ${isCartBumping ? 'text-yellow-400 drop-shadow-[0_0_12px_rgba(255,183,3,0.8)]' : ''}`}>
                <ShoppingCart size={19} />
                {isCartBumping && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
                )}
              </div>
              <span className="nav-tab-label">SAVAT</span>
            </button>

            {/* 6. AI */}
            <button
              type="button"
              onClick={() => setActiveTab('AI')}
              className={`nav-tab-button ${activeTab === 'AI' ? 'active' : ''}`}
            >
              <div className="nav-tab-icon">
                <Sparkles size={19} />
              </div>
              <span className="nav-tab-label">AI</span>
            </button>

            {/* 7. PROFIL */}
            <button
              type="button"
              onClick={() => setActiveTab('PROFIL')}
              className={`nav-tab-button ${activeTab === 'PROFIL' ? 'active' : ''}`}
            >
              <div className="nav-tab-icon">
                <User size={19} />
              </div>
              <span className="nav-tab-label">PROFIL</span>
            </button>

          </nav>
        </div>

        {/* 🔹 TOAST NOTIFICATIONS OVERLAY */}
        <div className="fixed top-4 left-0 right-0 z-[120] flex flex-col items-center gap-2.5 pointer-events-none px-4 max-w-sm mx-auto">
          <AnimatePresence>
            {toasts.map(toast => {
              const isSuccess = toast.type === 'success';
              const isFavAdd = toast.type === 'favorite-add';
              const isFavRemove = toast.type === 'favorite-remove';

              return (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: -24, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className="pointer-events-auto w-full liquid-toast px-3.5 py-3 rounded-2xl flex items-center justify-between gap-3 shadow-2xl"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        isSuccess
                          ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                          : isFavAdd
                          ? 'bg-rose-500/20 border-rose-400/50 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                          : 'bg-white/10 border-white/20 text-gray-300'
                      }`}
                    >
                      {isSuccess && <CheckCircle2 size={20} />}
                      {isFavAdd && <Heart size={19} className="fill-rose-500" />}
                      {isFavRemove && <Heart size={19} className="opacity-70" />}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h4 className="text-white font-extrabold text-xs tracking-wide truncate">
                        {toast.title}
                      </h4>
                      <p className="text-cyan-100 text-[10.5px] font-medium truncate mt-0.5 opacity-90">
                        {toast.message}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    className="p-1 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0"
                  >
                    <X size={15} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* 🔹 FLYING ITEM ANIMATION OVERLAY */}
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          <AnimatePresence>
            {flyingItems.map(item => (
              <motion.div
                key={item.id}
                initial={{
                  x: item.startX - 24,
                  y: item.startY - 24,
                  scale: 1,
                  opacity: 1,
                  rotate: 0
                }}
                animate={{
                  x: [
                    item.startX - 24,
                    (item.startX + item.endX) / 2 + (Math.random() > 0.5 ? 40 : -40),
                    item.endX - 16
                  ],
                  y: [
                    item.startY - 24,
                    Math.min(item.startY, item.endY) - 60,
                    item.endY - 16
                  ],
                  scale: [1, 1.25, 0.2],
                  opacity: [1, 0.95, 0],
                  rotate: [0, -25, 45]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 0.68,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="absolute top-0 left-0 w-12 h-12 rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(255,183,3,0.7)] border-2 border-yellow-400 bg-black/80 flex items-center justify-center backdrop-blur-md"
              >
                {item.image ? (
                  <img src={item.image} alt="Flying item" className="w-full h-full object-cover" />
                ) : (
                  <ShoppingCart size={22} className="text-yellow-400" />
                )}
                {/* Glowing Trail Sparkle */}
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/30 to-transparent pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </>
  );
}
