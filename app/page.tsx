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
  ShoppingBag,
  MessageCircle,
  CreditCard,
  Trash2,
  Plus,
  Minus,
  Check,
  RefreshCw,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { db } from '@/lib/firebase';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  addDoc,
  setDoc,
  getDocs
} from 'firebase/firestore';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  type: 'clothing' | 'look';
  price: number;
  image?: string;
  images?: string[];
  sizes?: string[];
  description?: string;
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  category?: string;
  image?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  telegramUsername?: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  paymentStatus: 'PENDING' | 'PAID' | 'TEST_PAID';
  paymentMethod?: string;
  status: 'QABUL_QILINDI' | 'YETKAZILMOQDA' | 'YETKAZILDI' | 'BEKOR_QILINDI';
  statusHistory?: Array<{ status: string; timestamp: string; title: string; note?: string }>;
  createdAt: string;
}

export interface SupportMessage {
  id: string;
  userId: string;
  userName?: string;
  userPhone?: string;
  sender: 'USER' | 'ADMIN';
  text: string;
  createdAt: string;
}

interface FavoriteItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  sizes?: string[];
}

interface CartItem {
  id: string; // product id + size
  productId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  size: string;
  image?: string;
}

interface ToastNotification {
  id: string;
  type: 'success' | 'favorite-add' | 'favorite-remove' | 'info' | 'error';
  title: string;
  message: string;
}

interface FlyingItem {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  image?: string;
}

type TabType = 'ASOSIY' | 'KIYIMLAR' | 'LOOK' | 'YOQTIRGAN' | 'SAVAT' | 'AI' | 'PROFIL';

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabType>('ASOSIY');

  // Customer identity
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');
  const [userTelegram, setUserTelegram] = useState<string>('');

  // Products from Firestore (Realtime)
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Favorites & Cart
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [isCartBumping, setIsCartBumping] = useState(false);

  // Filter & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'category'>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Orders from Firestore (Realtime for this user)
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrderFilter, setSelectedOrderFilter] = useState<'all' | 'YETKAZILDI' | 'YETKAZILMOQDA' | 'QABUL_QILINDI'>('all');

  // Support Messages (Realtime for this user)
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [newSupportText, setNewSupportText] = useState('');
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const supportChatEndRef = useRef<HTMLDivElement>(null);

  // Profile Active Tab (Orders vs Support vs Edit)
  const [profileSection, setProfileSection] = useState<'orders' | 'support' | 'profile'>('orders');

  // Toast notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Checkout / Order Modal Flow
  const [orderingItem, setOrderingItem] = useState<ProductItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Payment Modal state
  const [activePaymentOrder, setActivePaymentOrder] = useState<OrderRecord | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderSuccessModal, setOrderSuccessModal] = useState<OrderRecord | null>(null);

  // AI Fitting state
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedCloth, setSelectedCloth] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // Hero Video Ref & Dynamic Water Animation Watchdog
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const playHeroVideo = () => {
      if (heroVideoRef.current) {
        heroVideoRef.current.muted = true;
        heroVideoRef.current.playsInline = true;
        const playPromise = heroVideoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay policy fallback: re-trigger on user interaction
          });
        }
      }
    };

    if (activeTab === 'ASOSIY') {
      playHeroVideo();
      const t1 = setTimeout(playHeroVideo, 150);
      const t2 = setTimeout(playHeroVideo, 600);
      const t3 = setTimeout(playHeroVideo, 1200);

      const handleUserInteraction = () => {
        playHeroVideo();
      };

      const handleVisibilityChange = () => {
        if (!document.hidden && activeTab === 'ASOSIY') {
          playHeroVideo();
        }
      };

      window.addEventListener('touchstart', handleUserInteraction, { once: true, passive: true });
      window.addEventListener('click', handleUserInteraction, { once: true, passive: true });
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [activeTab]);

  // Initialize User Identity & LocalStorage Data
  useEffect(() => {
    try {
      let storedUid = localStorage.getItem('easyshop_uid');
      if (!storedUid) {
        storedUid = `user_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
        localStorage.setItem('easyshop_uid', storedUid);
      }
      setUserId(storedUid);

      const storedName = localStorage.getItem('easyshop_user_name') || '';
      const storedPhone = localStorage.getItem('easyshop_user_phone') || '';
      const storedAddress = localStorage.getItem('easyshop_user_address') || '';
      const storedTelegram = localStorage.getItem('easyshop_user_telegram') || '';

      setUserName(storedName);
      setUserPhone(storedPhone);
      setUserAddress(storedAddress);
      setUserTelegram(storedTelegram);

      const storedFavs = localStorage.getItem('easyshop_favorites');
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }

      const storedCart = localStorage.getItem('easyshop_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error('Error loading localStorage:', e);
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('easyshop_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('easyshop_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // 1️⃣ REALTIME FIRESTORE LISTENER: Products (Added/Deleted by Admin Bot)
  useEffect(() => {
    setProductsLoading(true);
    const prodRef = collection(db, 'products');

    const unsubscribe = onSnapshot(
      prodRef,
      (snapshot) => {
        const loaded: ProductItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loaded.push({
            id: docSnap.id,
            name: data.name || "Nomsiz Mahsulot",
            category: data.category || (data.type === 'look' ? 'Look' : 'Kiyimlar'),
            type: data.type || (data.category === 'Look' ? 'look' : 'clothing'),
            price: Number(data.price) || 0,
            image: data.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
            images: data.images || [],
            sizes: data.sizes || ['S', 'M', 'L', 'XL'],
            description: data.description || '',
            createdAt: data.createdAt || '',
          });
        });

        // Sort descending by date if available
        loaded.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        setProducts(loaded);
        setProductsLoading(false);
      },
      (error) => {
        console.error('Error listening to products:', error);
        setProductsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2️⃣ REALTIME FIRESTORE LISTENER: User Orders (Tracking & Logistics)
  useEffect(() => {
    if (!userId) return;

    const ordersQuery = query(collection(db, 'orders'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const loadedOrders: OrderRecord[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedOrders.push({
            id: docSnap.id,
            orderNumber: data.orderNumber || docSnap.id.substring(0, 8),
            customerName: data.customerName || '',
            customerPhone: data.customerPhone || '',
            customerAddress: data.customerAddress || '',
            telegramUsername: data.telegramUsername || '',
            userId: data.userId || userId,
            items: data.items || [],
            totalPrice: Number(data.totalPrice) || 0,
            paymentStatus: data.paymentStatus || 'PENDING',
            paymentMethod: data.paymentMethod || 'CLICK',
            status: data.status || 'QABUL_QILINDI',
            statusHistory: data.statusHistory || [],
            createdAt: data.createdAt || new Date().toISOString(),
          });
        });

        loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(loadedOrders);

        // Auto check if active payment order is marked as PAID
        if (activePaymentOrder) {
          const updatedActive = loadedOrders.find(o => o.id === activePaymentOrder.id);
          if (updatedActive && updatedActive.paymentStatus === 'PAID' && activePaymentOrder.paymentStatus !== 'PAID') {
            setActivePaymentOrder(null);
            setOrderSuccessModal(updatedActive);
            addToast({
              type: 'success',
              title: "To'lov qabul qilindi! 🎉",
              message: `#${updatedActive.orderNumber} raqamli buyurtmangiz muvaffaqiyatli qabul qilindi!`
            });
          }
        }
      },
      (error) => {
        console.error('Error listening to orders:', error);
      }
    );

    return () => unsubscribe();
  }, [userId, activePaymentOrder]);

  // 3️⃣ REALTIME FIRESTORE LISTENER: Support Messages for this User
  useEffect(() => {
    if (!userId) return;

    const supportQuery = query(
      collection(db, 'support_messages'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      supportQuery,
      (snapshot) => {
        const loadedMsgs: SupportMessage[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedMsgs.push({
            id: docSnap.id,
            userId: data.userId,
            userName: data.userName,
            userPhone: data.userPhone,
            sender: data.sender || 'USER',
            text: data.text || '',
            createdAt: data.createdAt || new Date().toISOString(),
          });
        });

        loadedMsgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setSupportMessages(loadedMsgs);

        // Auto scroll to bottom
        setTimeout(() => {
          supportChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      (error) => {
        console.error('Error listening to support messages:', error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
  };

  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev.slice(-2), { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatPrice = (val: number) => {
    return (val || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm";
  };

  // Categories list from real-time products
  const clothingProducts = useMemo(() => {
    return products.filter((p) => p.type === 'clothing');
  }, [products]);

  const lookProducts = useMemo(() => {
    return products.filter((p) => p.type === 'look');
  }, [products]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(clothingProducts.map((p) => p.category)));
    return ['all', ...unique];
  }, [clothingProducts]);

  // Filtered & Sorted products for Kiyimlar
  const sortedAndFilteredClothing = useMemo(() => {
    let result = clothingProducts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
  }, [clothingProducts, searchQuery, selectedCategory, sortBy]);

  // Favorites logic
  const isFavorite = (id: string) => {
    return favorites.some((f) => f.id === id);
  };

  const toggleFavorite = (item: ProductItem) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      if (exists) {
        addToast({
          type: 'favorite-remove',
          title: "Sevimlilardan o'chirildi",
          message: `"${item.name}" saralanganlar ro'yxatidan olib tashlandi`,
        });
        return prev.filter((f) => f.id !== item.id);
      } else {
        addToast({
          type: 'favorite-add',
          title: "Sevimlilarga qo'shildi! ❤️",
          message: `"${item.name}" saralanganlar safiga saqlandi`,
        });
        return [
          ...prev,
          {
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            image: item.image,
            sizes: item.sizes,
          },
        ];
      }
    });
  };

  // Cart operations
  const addToCart = (product: ProductItem, size: string, quantity: number = 1) => {
    const cartItemId = `${product.id}_${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: quantity,
            size: size,
            image: product.image,
          },
        ];
      }
    });

    addToast({
      type: 'success',
      title: "Savatchaga qo'shildi! 🛍",
      message: `${product.name} (${size}) savatga joylandi`,
    });
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  // Handle single item order button with animation
  const handleOpenOrderModal = (item: ProductItem, event: React.MouseEvent<HTMLButtonElement>) => {
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
      image: item.image,
    };

    setFlyingItems((prev) => [...prev, newFlyingItem]);
    setOrderingItem(item);
    setSelectedSize(item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'M');
    setOrderQuantity(1);

    setTimeout(() => {
      setIsCartBumping(true);
      setTimeout(() => setIsCartBumping(false), 500);
      setFlyingItems((prev) => prev.filter((f) => f.id !== flyId));
    }, 700);
  };

  // Submit Order from Single Product Modal or Cart
  const handleProcessOrder = async (isFromCart: boolean = false) => {
    if (!userName.trim()) {
      addToast({ type: 'error', title: 'Xatolik', message: 'Iltimos ismingizni kiriting' });
      return;
    }
    if (!userPhone.trim()) {
      addToast({ type: 'error', title: 'Xatolik', message: 'Iltimos telefon raqamingizni kiriting' });
      return;
    }

    // Save profile locally
    try {
      localStorage.setItem('easyshop_user_name', userName);
      localStorage.setItem('easyshop_user_phone', userPhone);
      localStorage.setItem('easyshop_user_address', userAddress);
      localStorage.setItem('easyshop_user_telegram', userTelegram);
    } catch {}

    setIsSubmittingOrder(true);

    const orderItems: OrderItem[] = isFromCart
      ? cart.map((c) => ({
          productId: c.productId,
          name: c.name,
          price: c.price,
          quantity: c.quantity,
          size: c.size,
          category: c.category,
          image: c.image,
        }))
      : orderingItem
      ? [
          {
            productId: orderingItem.id,
            name: orderingItem.name,
            price: orderingItem.price,
            quantity: orderQuantity,
            size: selectedSize,
            category: orderingItem.category,
            image: orderingItem.image,
          },
        ]
      : [];

    if (orderItems.length === 0) {
      setIsSubmittingOrder(false);
      return;
    }

    const calculatedTotal = orderItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: userName,
          customerPhone: userPhone,
          customerAddress: userAddress,
          telegramUsername: userTelegram,
          userId: userId,
          items: orderItems,
          totalPrice: calculatedTotal,
          paymentMethod: 'CLICK',
        }),
      });

      const data = await response.json();

      if (data.success && data.order) {
        setIsSubmittingOrder(false);
        setOrderingItem(null);

        if (isFromCart) {
          setCart([]);
        }

        // Open Click Payment Checkout modal
        setActivePaymentOrder(data.order);
      } else {
        throw new Error(data.error || 'Buyurtma yaratishda xatolik');
      }
    } catch (err: any) {
      console.error('Order submission error:', err);
      setIsSubmittingOrder(false);
      addToast({
        type: 'error',
        title: 'Xatolik',
        message: err.message || "Buyurtmani yuborishda xatolik yuz berdi",
      });
    }
  };

  // Complete Payment (Click Test mode / simulation)
  const handleConfirmClickPayment = async () => {
    if (!activePaymentOrder) return;
    setIsProcessingPayment(true);

    try {
      const res = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: activePaymentOrder.id }),
      });
      const data = await res.json();

      if (data.success) {
        const completedOrder: OrderRecord = {
          ...activePaymentOrder,
          paymentStatus: 'PAID',
        };
        setActivePaymentOrder(null);
        setOrderSuccessModal(completedOrder);
        setIsProcessingPayment(false);

        addToast({
          type: 'success',
          title: "To'lov muvaffaqiyatli!",
          message: `#${completedOrder.orderNumber} raqamli buyurtma qabul qilindi`,
        });
      } else {
        throw new Error(data.error || 'To\'lovni tasdiqlab bo\'lmadi');
      }
    } catch (err: any) {
      setIsProcessingPayment(false);
      addToast({
        type: 'error',
        title: 'Xatolik',
        message: err.message || "To'lovni amalga oshirishda xatolik",
      });
    }
  };

  // Support Message Submission
  const handleSendSupportMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupportText.trim()) return;

    if (!userName.trim() || !userPhone.trim()) {
      addToast({
        type: 'info',
        title: 'Profil ma\'lumotlari',
        message: 'Iltimos, avval ismingiz va telefon raqamingizni kiriting',
      });
      setProfileSection('profile');
      return;
    }

    const textToSend = newSupportText.trim();
    setNewSupportText('');
    setIsSendingSupport(true);

    try {
      await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName,
          userPhone,
          text: textToSend,
        }),
      });
      setIsSendingSupport(false);
    } catch (error) {
      console.error('Support send error:', error);
      setIsSendingSupport(false);
      addToast({
        type: 'error',
        title: 'Xatolik',
        message: 'Xabarni yuborishda xatolik yuz berdi',
      });
    }
  };

  // AI Photo Upload & Fitting
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
      setAiResult(
        selectedCloth ||
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'
      );
    }, 2000);
  };

  return (
    <>
      {/* Background Wallpaper */}
      <div className="app-bg" />

      <div className="app-container">
        {/* 🔹 HEADER */}
        <header className="app-header">
          <h1 className="brand-title text-white-glow">
            EASYSHOP<span className="gold-accent text-amber-glow">_UZB</span>
          </h1>
          <p className="brand-subtitle text-azure-glow">OSON ONLINE XARID</p>
        </header>

        {/* 🔹 MAIN VIEWS */}
        <main className="w-full flex-1 flex flex-col items-center relative min-h-[480px]">
          <AnimatePresence initial={false} mode="wait">
            {/* 1️⃣ ASOSIY (Hero Pure Water Video Card - 60 FPS Ping-Pong Seamless Loop) */}
            {activeTab === 'ASOSIY' && (
              <motion.div
                key="tab-asosiy"
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col items-center"
              >
                <div className="welcome-hero-card">
                  {/* Layer 1: 100% Guaranteed Animated Water WebP (Always moving, works on iOS Low Power Mode without blocking) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/water_seamless.webp"
                    alt="Suv animatsiyasi"
                    className="hero-video pointer-events-none object-cover w-full h-full absolute inset-0 select-none z-0"
                  />

                  {/* Layer 2: 60 FPS Ping-Pong Seamless Video Loop */}
                  <video
                    ref={heroVideoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    webkit-playsinline="true"
                    x5-playsinline="true"
                    disablePictureInPicture
                    disableRemotePlayback
                    preload="auto"
                    poster="/water_poster.jpg"
                    onLoadedData={(e) => {
                      e.currentTarget.play().catch(() => {});
                    }}
                    onCanPlay={(e) => {
                      e.currentTarget.play().catch(() => {});
                    }}
                    onEnded={(e) => {
                      e.currentTarget.currentTime = 0;
                      e.currentTarget.play().catch(() => {});
                    }}
                    onPause={(e) => {
                      if (activeTab === 'ASOSIY') {
                        e.currentTarget.play().catch(() => {});
                      }
                    }}
                    className="hero-video pointer-events-none object-cover w-full h-full absolute inset-0 select-none z-1"
                  >
                    <source src="/water_pingpong_opt.mp4" type="video/mp4" />
                    <source src="/water_pingpong_60fps.mp4" type="video/mp4" />
                    <source src="/water_seamless_smooth.mp4" type="video/mp4" />
                    <source src="/water_seamless_60fps_opt.mp4" type="video/mp4" />
                    <source src="/seamless_water.mp4" type="video/mp4" />
                  </video>
                  <div className="hero-overlay pointer-events-none z-2" />
                  <div className="hero-content pointer-events-none z-10">
                    <h2 className="hero-title text-amber-glow animate-glow-pulse">ASSALOMU ALEYKUM</h2>
                    <p className="hero-subtext text-white-glow">ONLAYN KIYIM DO&apos;KONIMIZGA XUSH KELIBSIZ</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2️⃣ KIYIMLAR (Realtime Firestore Catalog) */}
            {activeTab === 'KIYIMLAR' && (
              <motion.div
                key="tab-kiyimlar"
                initial={{ opacity: 0, y: 14, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.985 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col"
              >
                {/* Search & Sort Row */}
                <div className="flex flex-col gap-2.5 w-full mb-3.5">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Kiyimlarni qidiring..."
                      className="w-full h-11 pl-10 pr-4 rounded-2xl liquid-input text-white text-xs placeholder:text-gray-300 focus:outline-none transition-all focus:border-yellow-400/70"
                    />
                    <Search className="absolute left-3.5 top-3 text-cyan-300/80" size={16} />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 top-3 text-gray-300 hover:text-white transition-transform active:scale-90"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Sorting Controls */}
                  <div className="flex items-center gap-2 relative z-20">
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
                            {sortBy === 'category' && "Kategoriya bo'yicha"}
                          </span>
                        </div>
                        <ChevronDown
                          size={15}
                          className={`text-cyan-300 transition-transform duration-200 shrink-0 ${
                            isSortOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isSortOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.95 }}
                          className="absolute top-12 left-0 w-full glass-box p-2 z-50 flex flex-col gap-1 border border-cyan-400/40 shadow-2xl backdrop-blur-xl"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSortBy('default');
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                              sortBy === 'default' ? 'btn-gold !py-1.5' : 'text-white hover:bg-white/10'
                            }`}
                          >
                            Standart
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSortBy('price-asc');
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                              sortBy === 'price-asc' ? 'btn-gold !py-1.5' : 'text-white hover:bg-white/10'
                            }`}
                          >
                            Narx: Arzondan qimmatga
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSortBy('price-desc');
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                              sortBy === 'price-desc' ? 'btn-gold !py-1.5' : 'text-white hover:bg-white/10'
                            }`}
                          >
                            Narx: Qimmatdan arzonga
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSortBy('category');
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                              sortBy === 'category' ? 'btn-gold !py-1.5' : 'text-white hover:bg-white/10'
                            }`}
                          >
                            Kategoriya bo&apos;yicha
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Category Chips (if categories exist) */}
                  {categories.length > 2 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {categories.map((cat) => (
                        <motion.button
                          key={cat}
                          whileTap={{ scale: 0.92 }}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-[10.5px] font-bold transition-all whitespace-nowrap ${
                            selectedCategory === cat
                              ? 'btn-gold !py-1 text-black shadow-md'
                              : 'liquid-pill text-gray-200 hover:text-white'
                          }`}
                        >
                          {cat === 'all' ? 'Barchasi' : cat}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Products List / Empty State */}
                {productsLoading ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 border-2 border-[#ffb703] border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-gray-300 text-xs font-bold animate-pulse">Katalog yuklanmoqda...</p>
                  </div>
                ) : sortedAndFilteredClothing.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full py-12 flex flex-col items-center justify-center text-center glass-box p-6 mt-2"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-400/35 flex items-center justify-center mb-3 shadow-lg animate-float">
                      <Shirt size={28} className="text-cyan-300" />
                    </div>
                    <span className="text-[#38bdf8] font-black text-sm tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(56,189,248,0.5)]">
                      HOZIRCHA KIYIMLAR MAVJUD EMAS
                    </span>
                    <p className="text-gray-300 text-xs mt-1 max-w-xs">
                      Yangi kiyimlar tez orada katalogga yuklanadi.
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-2 gap-3.5 w-full">
                    {sortedAndFilteredClothing.map((item, index) => {
                      const favorited = isFavorite(item.id);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 16, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.28, delay: Math.min(index * 0.04, 0.3) }}
                          whileHover={{ y: -4, scale: 1.015 }}
                          className="glass-box p-2.5 flex flex-col justify-between relative group card-interactive"
                        >
                          {/* Image Container */}
                          <div className="w-full h-44 rounded-2xl overflow-hidden bg-black/40 border border-white/10 mb-2 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />

                            {/* Heart Button */}
                            <motion.button
                              type="button"
                              aria-label={favorited ? "Yoqtirganlardan o'chirish" : "Yoqtirganlarga qo'shish"}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.75 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(item);
                              }}
                              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform hover:bg-black/80 shadow-lg z-10"
                            >
                              <Heart
                                size={16}
                                className={
                                  favorited
                                    ? 'text-[#ef4444] fill-[#ef4444] drop-shadow-[0_2px_8px_rgba(239,68,68,0.6)]'
                                    : 'text-white/80 hover:text-white'
                                }
                              />
                            </motion.button>
                          </div>

                          {/* Product Info */}
                          <div className="border-t border-white/10 pt-2 flex flex-col">
                            <p className="text-yellow-400 font-extrabold text-[13px]">{formatPrice(item.price)}</p>
                            <p className="text-white text-xs font-bold mt-0.5 truncate">{item.name}</p>
                            <p className="text-gray-300 text-[10px] font-medium truncate">{item.category}</p>

                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.94 }}
                              onClick={(e) => handleOpenOrderModal(item, e)}
                              className="btn-gold w-full py-2 mt-2.5 text-[10.5px] font-black btn-bounce"
                            >
                              BUYURTMA BERISH
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* 3️⃣ LOOK (Realtime Look Collection from Firestore) */}
            {activeTab === 'LOOK' && (
              <motion.div
                key="tab-look"
                initial={{ opacity: 0, y: 14, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.985 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col"
              >
                {productsLoading ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 border-2 border-[#ffb703] border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-gray-300 text-xs font-bold animate-pulse">Looklar yuklanmoqda...</p>
                  </div>
                ) : lookProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full flex flex-col items-center justify-center pt-8"
                  >
                    <div className="w-full h-44 rounded-3xl border-2 border-dashed border-cyan-400/40 liquid-pill flex flex-col items-center justify-center p-6 text-center shadow-2xl">
                      <Gem size={28} className="text-[#38bdf8] mb-2 animate-float" />
                      <span className="text-[#38bdf8] font-black text-sm tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(56,189,248,0.5)]">
                        HOZIRCHA LOOKLAR MAVJUD EMAS
                      </span>
                      <p className="text-gray-300 text-xs mt-1">Yangi look to&apos;plamlari tez orada qo&apos;shiladi</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-2 gap-3.5 w-full">
                    {lookProducts.map((item, index) => {
                      const favorited = isFavorite(item.id);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 16, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.28, delay: Math.min(index * 0.04, 0.3) }}
                          whileHover={{ y: -4, scale: 1.015 }}
                          className="glass-box p-2.5 flex flex-col justify-between relative group card-interactive"
                        >
                          <div className="w-full h-44 rounded-2xl overflow-hidden bg-black/40 border border-white/10 mb-2 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <motion.button
                              type="button"
                              aria-label={favorited ? "Yoqtirganlardan o'chirish" : "Yoqtirganlarga qo'shish"}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.75 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(item);
                              }}
                              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform hover:bg-black/80 shadow-lg z-10"
                            >
                              <Heart
                                size={16}
                                className={
                                  favorited
                                    ? 'text-[#ef4444] fill-[#ef4444] drop-shadow-[0_2px_8px_rgba(239,68,68,0.6)]'
                                    : 'text-white/80 hover:text-white'
                                }
                              />
                            </motion.button>
                          </div>

                          <div className="border-t border-white/10 pt-2 flex flex-col">
                            <p className="text-yellow-400 font-extrabold text-[13px]">{formatPrice(item.price)}</p>
                            <p className="text-white text-xs font-bold mt-0.5 truncate">{item.name}</p>
                            <span className="text-cyan-300 text-[10px] font-semibold mt-0.5">✨ Look to&apos;plami</span>
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.94 }}
                              onClick={(e) => handleOpenOrderModal(item, e)}
                              className="btn-gold w-full py-2 mt-2.5 text-[10.5px] font-black btn-bounce"
                            >
                              BUYURTMA BERISH
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* 4️⃣ YOQTIRGAN (Favorites) */}
            {activeTab === 'YOQTIRGAN' && (
              <motion.div
                key="tab-yoqtirgan"
                initial={{ opacity: 0, y: 14, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.985 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col"
              >
                <h2 className="text-center text-white font-extrabold text-sm tracking-wider uppercase mb-4 text-white-glow">
                  YOQTIRGANLAR ({favorites.length})
                </h2>

                {favorites.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full py-12 flex flex-col items-center justify-center text-center glass-box p-6 mt-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/40 flex items-center justify-center mb-3 shadow-lg animate-float">
                      <Heart size={22} className="text-red-400 fill-red-400/40" />
                    </div>
                    <p className="text-white text-xs font-bold uppercase tracking-wider">
                      Yoqtirgan kiyimlar mavjud emas
                    </p>
                    <p className="text-gray-300 text-[11px] mt-1">
                      Kiyimlar bo&apos;limidagi yurakcha tugmasini bosing
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      type="button"
                      onClick={() => handleTabChange('KIYIMLAR')}
                      className="btn-gold px-5 py-2.5 mt-4 text-[10.5px] font-black btn-bounce"
                    >
                      KIYIMLAR BO&apos;LIMIGA O&apos;TISH
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-2 gap-3.5 w-full">
                    {favorites.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 16, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.28, delay: Math.min(index * 0.04, 0.3) }}
                        whileHover={{ y: -4, scale: 1.015 }}
                        className="glass-box p-3 flex flex-col justify-between relative group card-interactive"
                      >
                        <motion.button
                          type="button"
                          aria-label="Yoqtirganlardan o'chirish"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.75 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item as any);
                          }}
                          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/80 shadow-lg"
                        >
                          <Heart
                            size={16}
                            className="text-[#ef4444] fill-[#ef4444] drop-shadow-[0_2px_8px_rgba(239,68,68,0.6)]"
                          />
                        </motion.button>

                        <div className="w-full h-44 rounded-2xl overflow-hidden bg-black/40 border border-white/15 mb-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="border-t border-white/15 pt-2 flex flex-col">
                          <p className="text-[#ffb703] font-black text-sm">{formatPrice(item.price)}</p>
                          <p className="text-white text-xs font-medium mt-0.5 truncate">{item.name}</p>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.94 }}
                            onClick={(e) => handleOpenOrderModal(item as any, e)}
                            className="btn-gold w-full py-2.5 mt-3 text-[11px] font-black btn-bounce"
                          >
                            BUYURTMA BERISH
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 5️⃣ SAVAT (Cart View) */}
            {activeTab === 'SAVAT' && (
              <motion.div
                key="tab-savat"
                initial={{ opacity: 0, y: 14, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.985 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col"
              >
                <h2 className="text-center text-white font-extrabold text-sm tracking-wider uppercase mb-4 text-white-glow">
                  SAVATCHA ({cart.length})
                </h2>

                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full py-12 flex flex-col items-center justify-center text-center glass-box p-6 mt-2 shadow-2xl"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-400/35 flex items-center justify-center mb-3 animate-float">
                      <ShoppingCart size={28} className="text-cyan-300" />
                    </div>
                    <span className="text-white font-extrabold text-sm tracking-widest uppercase drop-shadow-md">
                      SAVATCHANGIZ BO&apos;SH
                    </span>
                    <p className="text-gray-300 text-xs mt-1">
                      Katalogdan o&apos;zingizga ma&apos;qul kiyimlarni tanlang
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      type="button"
                      onClick={() => handleTabChange('KIYIMLAR')}
                      className="btn-gold px-6 py-2.5 mt-4 text-xs font-black btn-bounce"
                    >
                      XARID QILISH
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex flex-col gap-2.5">
                      {cart.map((c) => (
                        <motion.div
                          key={c.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="glass-box p-3 flex items-center justify-between gap-3 relative card-interactive"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/15 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={c.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'}
                              alt={c.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-bold truncate">{c.name}</p>
                            <p className="text-gray-300 text-[10px]">O&apos;lcham: <span className="text-cyan-300 font-bold">{c.size}</span></p>
                            <p className="text-[#ffb703] font-black text-xs mt-0.5">{formatPrice(c.price)}</p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              type="button"
                              onClick={() => updateCartQuantity(c.id, -1)}
                              className="w-7 h-7 rounded-lg liquid-pill flex items-center justify-center text-white"
                            >
                              <Minus size={13} />
                            </motion.button>
                            <span className="text-xs font-black text-white px-1.5">{c.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              type="button"
                              onClick={() => updateCartQuantity(c.id, 1)}
                              className="w-7 h-7 rounded-lg liquid-pill flex items-center justify-center text-white"
                            >
                              <Plus size={13} />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              type="button"
                              onClick={() => removeFromCart(c.id)}
                              className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 ml-1"
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Cart Total & Order Button */}
                    <div className="glass-box p-4 flex flex-col gap-3 mt-2">
                      <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                        <span className="text-gray-300">Jami mahsulotlar:</span>
                        <span className="text-white font-bold">{cart.reduce((a, b) => a + b.quantity, 0)} ta</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-black text-sm">Umumiy summa:</span>
                        <span className="text-[#ffb703] font-black text-base drop-shadow-sm">{formatPrice(cartTotal)}</span>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setOrderingItem({ id: 'cart_bundle', name: "Savatdagi barcha tovarlar", category: 'To\'plam', price: cartTotal, type: 'clothing', sizes: [] })}
                        className="btn-gold w-full py-3 text-xs font-black tracking-wider flex items-center justify-center gap-2 btn-bounce"
                      >
                        <CheckCircle2 size={16} />
                        RASMIYLASHTIRISH VA TO&apos;LOV
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 6️⃣ AI (Virtual Try-on) */}
            {activeTab === 'AI' && (
              <motion.div
                key="tab-ai"
                initial={{ opacity: 0, y: 14, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.985 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col items-center pt-2"
              >
                <div className="w-full glass-box p-5 flex flex-col items-center shadow-2xl">
                  <h2 className="text-[#ffb703] font-black text-base tracking-wider uppercase mb-4 text-amber-glow animate-glow-pulse">
                    AI KIYIB KO&apos;RISH
                  </h2>

                  <div className="grid grid-cols-2 gap-3 w-full mb-4">
                    {/* Left Box: Photo Upload */}
                    <label className="h-44 rounded-2xl border-2 border-dashed border-cyan-400/45 liquid-pill flex flex-col items-center justify-center cursor-pointer p-2 text-center relative overflow-hidden transition-all hover:border-cyan-300 hover:scale-[1.02] active:scale-95">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      {userPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={userPhoto} alt="Rasm" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="flex flex-col items-center gap-1.5">
                          <Upload size={22} className="text-cyan-300 mb-1 animate-float" />
                          <span className="text-white font-extrabold text-[11px] tracking-wider uppercase drop-shadow">
                            RASMINGIZ
                          </span>
                          <span className="text-gray-400 text-[9px]">Yuklash uchun bosing</span>
                        </div>
                      )}
                    </label>

                    {/* Right Box: Selected Cloth */}
                    <div
                      onClick={() => {
                        if (clothingProducts.length > 0) {
                          setSelectedCloth(clothingProducts[0].image || null);
                        }
                      }}
                      className="h-44 rounded-2xl border-2 border-dashed border-cyan-400/45 liquid-pill flex flex-col items-center justify-center cursor-pointer p-2 text-center relative overflow-hidden transition-all hover:border-cyan-300 hover:scale-[1.02] active:scale-95"
                    >
                      {selectedCloth ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={selectedCloth} alt="Kiyim" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="flex flex-col items-center gap-1.5">
                          <Shirt size={22} className="text-cyan-300 mb-1 animate-float" />
                          <span className="text-white font-extrabold text-[11px] tracking-wider uppercase drop-shadow">
                            KIYIM
                          </span>
                          <span className="text-gray-400 text-[9px]">Tanlash uchun bosing</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className="btn-gold w-full py-3.5 text-xs font-black tracking-wider flex items-center justify-center gap-2 btn-bounce"
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'KIYIB KO\'RISH'
                    )}
                  </motion.button>

                  {aiResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full mt-4 p-3 rounded-2xl glass-box border border-yellow-400/40 flex flex-col items-center"
                    >
                      <p className="text-xs font-bold text-yellow-400 mb-2">✨ AI Natijasi:</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={aiResult} alt="AI" className="w-full h-56 object-cover rounded-xl" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 7️⃣ PROFIL (User Info, Orders Tracking & Support Chat) */}
            {activeTab === 'PROFIL' && (
              <motion.div
                key="tab-profil"
                initial={{ opacity: 0, y: 14, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.985 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col gap-3.5 pt-2"
              >
                {/* Profile Header Card */}
                <div className="glass-box p-4 flex items-center justify-between gap-3.5 card-interactive">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ffb703] to-amber-500 text-black flex items-center justify-center font-black text-xl shadow-[0_4px_16px_rgba(255,183,3,0.4)] shrink-0 animate-glow-pulse">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-sm drop-shadow-sm">
                        {userName || 'Mijoz Profili'}
                      </h3>
                      <p className="text-cyan-200 text-xs mt-0.5 font-medium">
                        {userPhone || 'Telefon kiritilmagan'}
                      </p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full liquid-pill text-[#ffb703] font-black text-[8.5px] uppercase tracking-wide">
                        ID: {userId ? userId.substring(0, 12) : 'Yangi'}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => setProfileSection(profileSection === 'profile' ? 'orders' : 'profile')}
                    className="px-3 py-1.5 rounded-xl liquid-pill text-[10.5px] font-bold text-cyan-300 hover:text-white"
                  >
                    {profileSection === 'profile' ? 'Yopish' : 'Tahrirlash'}
                  </motion.button>
                </div>

                {/* Profile Edit Drawer / Form */}
                <AnimatePresence>
                  {profileSection === 'profile' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass-box p-4 flex flex-col gap-3 border border-cyan-400/40 overflow-hidden"
                    >
                      <h4 className="text-white font-black text-xs tracking-wider uppercase text-cyan-glow">
                        Shaxsiy Ma&apos;lumotlar
                      </h4>
                      <div>
                        <label className="text-[10px] font-bold text-gray-300">Ism-familiyangiz</label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Ismingizni kiriting"
                          className="w-full h-9 px-3 mt-1 rounded-xl liquid-input text-white text-xs placeholder:text-gray-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-300">Telefon raqamingiz</label>
                        <input
                          type="tel"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          placeholder="+998 90 123 45 67"
                          className="w-full h-9 px-3 mt-1 rounded-xl liquid-input text-white text-xs placeholder:text-gray-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-300">Yetkazib berish manzili</label>
                        <input
                          type="text"
                          value={userAddress}
                          onChange={(e) => setUserAddress(e.target.value)}
                          placeholder="Toshkent sh., Chilonzor..."
                          className="w-full h-9 px-3 mt-1 rounded-xl liquid-input text-white text-xs placeholder:text-gray-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-300">Telegram Username</label>
                        <input
                          type="text"
                          value={userTelegram}
                          onChange={(e) => setUserTelegram(e.target.value)}
                          placeholder="@username"
                          className="w-full h-9 px-3 mt-1 rounded-xl liquid-input text-white text-xs placeholder:text-gray-400 focus:outline-none"
                        />
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        type="button"
                        onClick={() => {
                          localStorage.setItem('easyshop_user_name', userName);
                          localStorage.setItem('easyshop_user_phone', userPhone);
                          localStorage.setItem('easyshop_user_address', userAddress);
                          localStorage.setItem('easyshop_user_telegram', userTelegram);
                          addToast({ type: 'success', title: 'Saqlandi', message: 'Ma\'lumotlaringiz yangilandi' });
                          setProfileSection('orders');
                        }}
                        className="btn-gold w-full py-2.5 text-xs font-black mt-1 btn-bounce"
                      >
                        SAQLASH
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sub Navigation: Buyurtmalarim vs Qo'llab-quvvatlash */}
                <div className="grid grid-cols-2 gap-2 w-full">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setProfileSection('orders')}
                    className={`py-2.5 px-3 rounded-2xl font-black text-xs tracking-wider flex items-center justify-center gap-2 transition-all ${
                      profileSection === 'orders'
                        ? 'btn-gold text-black shadow-lg'
                        : 'glass-box text-gray-200 hover:text-white'
                    }`}
                  >
                    <Package size={15} />
                    BUYURTMALARIM ({orders.length})
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setProfileSection('support')}
                    className={`py-2.5 px-3 rounded-2xl font-black text-xs tracking-wider flex items-center justify-center gap-2 transition-all ${
                      profileSection === 'support'
                        ? 'btn-gold text-black shadow-lg'
                        : 'glass-box text-gray-200 hover:text-white'
                    }`}
                  >
                    <MessageCircle size={15} />
                    SUPPORT CHAT ({supportMessages.length})
                  </motion.button>
                </div>

                {/* SECTION 1: MENING BUYURTMALARIM (Orders & Realtime Logistics Tracking) */}
                {profileSection === 'orders' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-box p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Package size={17} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                        <h4 className="text-white font-extrabold text-xs tracking-wider uppercase">
                          Logistika va Buyurtmalar
                        </h4>
                      </div>
                      <span className="text-yellow-400 font-bold text-[11px] animate-pulse">Realtime</span>
                    </div>

                    {/* Filter Badges */}
                    {orders.length > 0 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderFilter('all')}
                          className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
                            selectedOrderFilter === 'all'
                              ? 'btn-gold text-black shadow-md'
                              : 'liquid-pill text-gray-200 hover:text-white'
                          }`}
                        >
                          Barchasi ({orders.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedOrderFilter('QABUL_QILINDI')}
                          className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
                            selectedOrderFilter === 'QABUL_QILINDI'
                              ? 'bg-amber-400 text-black shadow-md'
                              : 'liquid-pill text-gray-200 hover:text-white'
                          }`}
                        >
                          Qabul qilindi ({orders.filter((o) => o.status === 'QABUL_QILINDI').length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedOrderFilter('YETKAZILMOQDA')}
                          className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
                            selectedOrderFilter === 'YETKAZILMOQDA'
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'liquid-pill text-gray-200 hover:text-white'
                          }`}
                        >
                          Yo&apos;lda ({orders.filter((o) => o.status === 'YETKAZILMOQDA').length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedOrderFilter('YETKAZILDI')}
                          className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
                            selectedOrderFilter === 'YETKAZILDI'
                              ? 'bg-emerald-500 text-white shadow-md'
                              : 'liquid-pill text-gray-200 hover:text-white'
                          }`}
                        >
                          Yetkazildi ({orders.filter((o) => o.status === 'YETKAZILDI').length})
                        </button>
                      </div>
                    )}

                    {/* Orders List */}
                    {orders.length === 0 ? (
                      <div className="py-8 text-center flex flex-col items-center justify-center">
                        <ShoppingBag size={32} className="text-gray-400 mb-2 animate-float" />
                        <p className="text-white text-xs font-bold">Hozircha buyurtmalaringiz yo&apos;q</p>
                        <p className="text-gray-400 text-[11px] mt-0.5">Xarid qilingan tovarlar holati shu yerda ko&apos;rinadi</p>
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          type="button"
                          onClick={() => handleTabChange('KIYIMLAR')}
                          className="btn-gold px-5 py-2 mt-3 text-[10.5px] font-black btn-bounce"
                        >
                          KATALOGGA O&apos;TISH
                        </motion.button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 mt-1">
                        {orders
                          .filter((o) => selectedOrderFilter === 'all' || o.status === selectedOrderFilter)
                          .map((order) => {
                            const isDelivered = order.status === 'YETKAZILDI';
                            const isTransit = order.status === 'YETKAZILMOQDA';
                            const step = isDelivered ? 3 : isTransit ? 2 : 1;
                            const progressPercent = step === 1 ? '15%' : step === 2 ? '55%' : '100%';

                            return (
                              <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3.5 rounded-2xl liquid-pill flex flex-col gap-2.5 relative transition-all hover:border-cyan-300/60 card-interactive"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-extrabold text-cyan-300 text-cyan-glow">
                                      #{order.orderNumber}
                                    </span>
                                    <span className="text-[10px] text-gray-300">
                                      • {new Date(order.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })}
                                    </span>
                                  </div>
                                  <div
                                    className={`px-2.5 py-0.5 rounded-full border text-[9.5px] font-black flex items-center gap-1 shadow-sm ${
                                      isDelivered
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 text-emerald-glow'
                                        : isTransit
                                        ? 'bg-blue-500/20 text-cyan-300 border-cyan-400/40 text-azure-glow'
                                        : 'bg-amber-500/20 text-amber-300 border-amber-400/40 text-amber-glow'
                                    }`}
                                  >
                                    {isDelivered ? (
                                      <CheckCircle size={11} className="text-emerald-400" />
                                    ) : isTransit ? (
                                      <Truck size={11} className="text-cyan-400 animate-pulse" />
                                    ) : (
                                      <Clock size={11} className="text-amber-400" />
                                    )}
                                    <span>
                                      {isDelivered ? 'Yetkazildi' : isTransit ? 'Yo\'lda (Yetkazilmoqda)' : 'Qabul qilindi'}
                                    </span>
                                  </div>
                                </div>

                                {/* Items list in order */}
                                <div className="flex flex-col gap-1.5">
                                  {order.items.map((it, idx) => (
                                    <div key={idx} className="flex items-center gap-2.5">
                                      {it.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          src={it.image}
                                          alt={it.name}
                                          className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
                                        />
                                      ) : (
                                        <div className="w-10 h-10 rounded-xl bg-blue-900/40 border border-blue-400/20 flex items-center justify-center text-cyan-300 shrink-0">
                                          <Package size={16} />
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-white text-xs font-bold truncate">{it.name}</p>
                                        <p className="text-gray-300 text-[10px]">
                                          O&apos;lcham: {it.size} × {it.quantity} ta
                                        </p>
                                      </div>
                                      <span className="text-[#ffb703] font-bold text-xs">
                                        {formatPrice(it.price * it.quantity)}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                {/* Delivery Address */}
                                <div className="text-[10px] text-gray-300 flex items-center gap-1 mt-0.5">
                                  <MapPin size={12} className="text-cyan-400 shrink-0" />
                                  <span className="truncate">{order.customerAddress || 'Manzil ko\'rsatilmagan'}</span>
                                </div>

                                {/* 3-Step Logistics Timeline */}
                                <div className="pt-2 border-t border-white/15 flex flex-col gap-1.5 mt-1">
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

                                  <div className="flex items-center justify-between text-[9px] font-bold">
                                    <div className={`flex items-center gap-1 ${step >= 1 ? 'text-amber-300' : 'text-gray-400'}`}>
                                      <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]' : 'bg-gray-600'}`} />
                                      <span>Qabul qilindi</span>
                                    </div>

                                    <div className={`flex items-center gap-1 ${step >= 2 ? 'text-cyan-300' : 'text-gray-400'}`}>
                                      <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]' : 'bg-gray-600'}`} />
                                      <span>Yo&apos;lda</span>
                                    </div>

                                    <div className={`flex items-center gap-1 ${step >= 3 ? 'text-green-400' : 'text-gray-400'}`}>
                                      <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]' : 'bg-gray-600'}`} />
                                      <span>Yetkazildi</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* SECTION 2: SHAXSIY SUPPORT CHAT (Realtime Telegram Bot Reply Integration) */}
                {profileSection === 'support' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-box p-4 flex flex-col gap-3 shadow-2xl"
                  >
                    <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                      <div className="flex items-center gap-2">
                        <MessageCircle size={17} className="text-cyan-400" />
                        <h4 className="text-white font-extrabold text-xs tracking-wider uppercase">
                          Qo&apos;llab-quvvatlash Xizmati
                        </h4>
                      </div>
                      <span className="inline-flex items-center gap-1 text-green-400 text-[10px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                        Onlayn
                      </span>
                    </div>

                    {/* Chat Messages List */}
                    <div className="w-full h-64 overflow-y-auto flex flex-col gap-2 p-2 rounded-2xl liquid-pill no-scrollbar">
                      {supportMessages.length === 0 ? (
                        <div className="m-auto text-center flex flex-col items-center p-4">
                          <MessageCircle size={28} className="text-cyan-400/60 mb-2 animate-float" />
                          <p className="text-white text-xs font-bold">Savolingiz bormi?</p>
                          <p className="text-gray-400 text-[10.5px] mt-0.5 max-w-xs">
                            Xabar yozing, operatorlarimiz sizga tez orada javob berishadi.
                          </p>
                        </div>
                      ) : (
                        supportMessages.map((msg) => {
                          const isMe = msg.sender === 'USER';
                          return (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 8, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              className={`flex flex-col max-w-[82%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                            >
                              <div
                                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                                  isMe
                                    ? 'bg-[#ffb703] text-black font-bold rounded-tr-none shadow-md'
                                    : 'bg-white/15 text-white backdrop-blur-md border border-cyan-400/30 rounded-tl-none shadow-md'
                                }`}
                              >
                                {!isMe && (
                                  <span className="block text-[9px] font-black text-cyan-300 uppercase mb-1">
                                    👑 Operator / Admin
                                  </span>
                                )}
                                <p className="break-words">{msg.text}</p>
                              </div>
                              <span className="text-[8.5px] text-gray-400 mt-0.5 px-1">
                                {new Date(msg.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </motion.div>
                          );
                        })
                      )}
                      <div ref={supportChatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendSupportMessage} className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={newSupportText}
                        onChange={(e) => setNewSupportText(e.target.value)}
                        placeholder="Savolingizni yozing..."
                        disabled={isSendingSupport}
                        className="flex-1 h-10 px-3.5 rounded-xl liquid-input text-white text-xs placeholder:text-gray-400 focus:outline-none"
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        disabled={isSendingSupport || !newSupportText.trim()}
                        className="h-10 px-4 rounded-xl btn-gold text-xs font-black flex items-center justify-center disabled:opacity-50 btn-bounce"
                      >
                        {isSendingSupport ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <Send size={14} />
                        )}
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {/* Quick Links */}
                <div className="glass-box divide-y divide-white/15 overflow-hidden card-interactive">
                  <div
                    onClick={() => handleTabChange('YOQTIRGAN')}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Heart size={17} className="text-red-400 fill-red-400/30" />
                      <span className="text-white text-xs font-bold">Yoqtirganlar</span>
                    </div>
                    <span className="text-yellow-400 text-xs font-bold">{favorites.length} ta →</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* 🔹 ORDER MODAL (Customer Details Form) */}
        <AnimatePresence>
          {orderingItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="w-full max-w-sm glass-box p-5 relative border border-white/35 shadow-2xl"
              >
                <button
                  type="button"
                  onClick={() => setOrderingItem(null)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-white p-1 transition-transform active:scale-75"
                >
                  <X size={18} />
                </button>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleProcessOrder(orderingItem.id === 'cart_bundle');
                  }}
                  className="flex flex-col gap-3"
                >
                  <h3 className="text-white font-black text-sm text-center tracking-wider uppercase text-white-glow">
                    BUYURTMA BERISH
                  </h3>

                  <div className="p-3 rounded-2xl liquid-pill flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <p className="text-white font-bold text-xs truncate">{orderingItem.name}</p>
                      <p className="text-gray-300 text-[10px]">{orderingItem.category}</p>
                    </div>
                    <span className="text-[#ffb703] font-black text-sm shrink-0">
                      {formatPrice(orderingItem.price * orderQuantity)}
                    </span>
                  </div>

                  {/* Size selection if sizes available */}
                  {orderingItem.sizes && orderingItem.sizes.length > 0 && (
                    <div>
                      <label className="text-[10px] font-bold text-gray-300">O&apos;lchamni tanlang (Razmer)</label>
                      <div className="flex items-center gap-1.5 mt-1 overflow-x-auto pb-1 no-scrollbar">
                        {orderingItem.sizes.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSize(s)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              selectedSize === s
                                ? 'btn-gold text-black shadow-md scale-105'
                                : 'liquid-pill text-white hover:border-cyan-300'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  {orderingItem.id !== 'cart_bundle' && (
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-gray-300">Miqdori:</label>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          type="button"
                          onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                          className="w-7 h-7 rounded-lg liquid-pill flex items-center justify-center text-white"
                        >
                          <Minus size={13} />
                        </motion.button>
                        <span className="text-xs font-black text-white px-2">{orderQuantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          type="button"
                          onClick={() => setOrderQuantity(orderQuantity + 1)}
                          className="w-7 h-7 rounded-lg liquid-pill flex items-center justify-center text-white"
                        >
                          <Plus size={13} />
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* Form Fields */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-300">Ismingiz *</label>
                    <input
                      required
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Ismingizni kiriting"
                      className="w-full h-10 px-3.5 mt-1 rounded-2xl liquid-input text-white text-xs placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-300">Telefon raqamingiz *</label>
                    <input
                      required
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full h-10 px-3.5 mt-1 rounded-2xl liquid-input text-white text-xs placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-300">Yetkazib berish manzili *</label>
                    <input
                      required
                      type="text"
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                      placeholder="Shahar, tuman, ko'cha, xonadon"
                      className="w-full h-10 px-3.5 mt-1 rounded-2xl liquid-input text-white text-xs placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-300">Telegram Username (ixtiyoriy)</label>
                    <input
                      type="text"
                      value={userTelegram}
                      onChange={(e) => setUserTelegram(e.target.value)}
                      placeholder="@username"
                      className="w-full h-10 px-3.5 mt-1 rounded-2xl liquid-input text-white text-xs placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmittingOrder}
                    className="btn-gold w-full py-3.5 text-xs mt-2 font-black tracking-wider flex items-center justify-center gap-2 btn-bounce"
                  >
                    {isSubmittingOrder ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'TO\'LOVGA O\'TISH (CLICK)'
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🔹 CLICK TEST PAYMENT MODAL */}
        <AnimatePresence>
          {activePaymentOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="w-full max-w-sm glass-box p-5 relative border border-cyan-400/50 shadow-2xl"
              >
                <button
                  type="button"
                  onClick={() => setActivePaymentOrder(null)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-white p-1 transition-transform active:scale-75"
                >
                  <X size={18} />
                </button>

                <div className="flex flex-col items-center text-center">
                  {/* Click Logo Header */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white mb-3 shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-glow-pulse">
                    <CreditCard size={28} />
                  </div>

                  <h3 className="text-white font-black text-base text-azure-glow">CLICK TO&apos;LOV TIZIMI</h3>
                  <p className="text-cyan-300 text-xs mt-0.5 font-semibold">Sinov (Test) Rejimi</p>

                  <div className="w-full my-4 p-3.5 rounded-2xl liquid-pill text-left flex flex-col gap-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-300">Buyurtma:</span>
                      <span className="text-white font-bold">#{activePaymentOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-300">Mijoz:</span>
                      <span className="text-white font-bold">{activePaymentOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-white/10 pt-2">
                      <span className="text-gray-300">To&apos;lov summasi:</span>
                      <span className="text-[#ffb703] font-black text-sm">
                        {formatPrice(activePaymentOrder.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-[11px] mb-4 text-center">
                    To&apos;lovni amalga oshirish uchun quyidagi tugmani bosing. To&apos;lov muvaffaqiyatli bo&apos;lgach, avtomatik keyingi oyna ochiladi.
                  </p>

                  <div className="flex flex-col gap-2.5 w-full">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleConfirmClickPayment}
                      disabled={isProcessingPayment}
                      className="btn-gold w-full py-3.5 text-xs font-black tracking-wider flex items-center justify-center gap-2 shadow-lg btn-bounce"
                    >
                      {isProcessingPayment ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'TO\'LOVNI TASDIQLASH (CLICK TEST)'
                      )}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setActivePaymentOrder(null);
                        setOrderSuccessModal(activePaymentOrder);
                      }}
                      className="w-full py-2.5 rounded-2xl liquid-pill text-xs font-bold text-gray-300 hover:text-white"
                    >
                      Keyinroq to&apos;lash
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🔹 ORDER SUCCESS MODAL */}
        <AnimatePresence>
          {orderSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm glass-box p-6 relative border border-emerald-400/50 shadow-2xl text-center flex flex-col items-center"
              >
                {/* Subtle Animated Checkmark Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.1
                  }}
                  className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400/80 flex items-center justify-center text-emerald-400 mb-3.5 shadow-[0_0_30px_rgba(52,211,153,0.55)] relative"
                >
                  {/* Glowing subtle ripple pulse behind */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.35, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                    className="absolute inset-0 rounded-full bg-emerald-400/30 -z-10"
                  />

                  <svg
                    className="w-10 h-10 text-emerald-400"
                    viewBox="0 0 52 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="23"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                    <motion.path
                      d="M15 27.5L22.5 35L37 19"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.35,
                        ease: [0.65, 0, 0.35, 1]
                      }}
                    />
                  </svg>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                  className="text-white font-black text-lg text-white-glow"
                >
                  BUYURTMANGIZ QABUL QILINDI! 🎉
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                  className="text-cyan-200 text-xs mt-1 font-semibold"
                >
                  Buyurtma raqami: <span className="text-[#ffb703] font-black">#{orderSuccessModal.orderNumber}</span>
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="w-full my-4 p-3.5 rounded-2xl liquid-pill text-left flex flex-col gap-1.5 text-xs"
                >
                  <p className="text-gray-300">Mijoz: <b className="text-white">{orderSuccessModal.customerName}</b></p>
                  <p className="text-gray-300">Telefon: <b className="text-white">{orderSuccessModal.customerPhone}</b></p>
                  <p className="text-gray-300">Manzil: <b className="text-white">{orderSuccessModal.customerAddress}</b></p>
                  <p className="text-gray-300">Holat: <b className="text-emerald-400">Qabul qilindi</b></p>
                </motion.div>

                <p className="text-gray-300 text-xs mb-4">
                  Buyurtmangiz holatini Profilingizdagi <b>Logistika</b> bo&apos;limidan real-vaqt rejimida kuzatib borishingiz mumkin.
                </p>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setOrderSuccessModal(null);
                    setActiveTab('PROFIL');
                    setProfileSection('orders');
                  }}
                  className="btn-gold w-full py-3.5 text-xs font-black tracking-wider btn-bounce"
                >
                  BUYURTMANI KUZATISH (PROFIL)
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🔹 BOTTOM FLOATING NAVIGATION BAR (7 exact tabs) */}
      <div className="bottom-nav-container" id="bottom-nav-root">
        <nav className="bottom-nav-bar" role="navigation" aria-label="Asosiy menyu">
          {/* 1. ASOSIY */}
          <motion.button
            whileTap={{ scale: 0.84 }}
            type="button"
            id="nav-tab-asosiy"
            aria-label="Asosiy sahifa"
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('ASOSIY');
            }}
            className={`nav-tab-button ${activeTab === 'ASOSIY' ? 'active' : ''}`}
          >
            <div className="nav-tab-icon">
              <Home size={19} />
            </div>
            <span className="nav-tab-label">ASOSIY</span>
          </motion.button>

          {/* 2. KIYIMLAR */}
          <motion.button
            whileTap={{ scale: 0.84 }}
            type="button"
            id="nav-tab-kiyimlar"
            aria-label="Kiyimlar katalogi"
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('KIYIMLAR');
            }}
            className={`nav-tab-button ${activeTab === 'KIYIMLAR' ? 'active' : ''}`}
          >
            <div className="nav-tab-icon">
              <Shirt size={19} />
            </div>
            <span className="nav-tab-label">KIYIMLAR</span>
          </motion.button>

          {/* 3. LOOK */}
          <motion.button
            whileTap={{ scale: 0.84 }}
            type="button"
            id="nav-tab-look"
            aria-label="Look to'plamlari"
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('LOOK');
            }}
            className={`nav-tab-button ${activeTab === 'LOOK' ? 'active' : ''}`}
          >
            <div className="nav-tab-icon">
              <Gem size={19} />
            </div>
            <span className="nav-tab-label">LOOK</span>
          </motion.button>

          {/* 4. YOQTIRGAN */}
          <motion.button
            whileTap={{ scale: 0.84 }}
            type="button"
            id="nav-tab-yoqtirgan"
            aria-label="Yoqtirganlar"
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('YOQTIRGAN');
            }}
            className={`nav-tab-button ${activeTab === 'YOQTIRGAN' ? 'active' : ''}`}
          >
            <div className="nav-tab-icon relative">
              <Heart size={19} />
              {favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow">
                  {favorites.length}
                </span>
              )}
            </div>
            <span className="nav-tab-label">YOQTIRGAN</span>
          </motion.button>

          {/* 5. SAVAT */}
          <motion.button
            whileTap={{ scale: 0.84 }}
            type="button"
            id="nav-tab-savat"
            aria-label="Savatcha"
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('SAVAT');
            }}
            className={`nav-tab-button ${activeTab === 'SAVAT' ? 'active' : ''} ${
              isCartBumping ? 'scale-125' : ''
            }`}
          >
            <div className="nav-tab-icon relative">
              <ShoppingCart size={19} />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#ffb703] text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </div>
            <span className="nav-tab-label">SAVAT</span>
          </motion.button>

          {/* 6. AI */}
          <motion.button
            whileTap={{ scale: 0.84 }}
            type="button"
            id="nav-tab-ai"
            aria-label="AI Kiyib ko'rish"
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('AI');
            }}
            className={`nav-tab-button ${activeTab === 'AI' ? 'active' : ''}`}
          >
            <div className="nav-tab-icon">
              <Sparkles size={19} />
            </div>
            <span className="nav-tab-label">AI</span>
          </motion.button>

          {/* 7. PROFIL */}
          <motion.button
            whileTap={{ scale: 0.84 }}
            type="button"
            id="nav-tab-profil"
            aria-label="Foydalanuvchi profili"
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('PROFIL');
            }}
            className={`nav-tab-button ${activeTab === 'PROFIL' ? 'active' : ''}`}
          >
            <div className="nav-tab-icon relative">
              <User size={19} />
              {orders.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-cyan-400 text-black text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </div>
            <span className="nav-tab-label">PROFIL</span>
          </motion.button>
        </nav>
      </div>

      {/* 🔹 TOAST NOTIFICATIONS */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-xs px-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.92 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`p-3 rounded-2xl glass-box border shadow-2xl flex items-center justify-between gap-3 pointer-events-auto transition-all ${
                toast.type === 'success' || toast.type === 'favorite-add'
                  ? 'border-emerald-400/50 text-white'
                  : toast.type === 'favorite-remove'
                  ? 'border-red-400/50 text-white'
                  : toast.type === 'error'
                  ? 'border-red-500/70 text-white'
                  : 'border-cyan-400/50 text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
                {toast.type === 'favorite-add' && <Heart size={18} className="text-red-400 fill-red-400 shrink-0" />}
                {toast.type === 'favorite-remove' && <Heart size={18} className="text-gray-400 shrink-0" />}
                {toast.type === 'error' && <AlertCircle size={18} className="text-red-400 shrink-0" />}
                {toast.type === 'info' && <HelpCircle size={18} className="text-cyan-400 shrink-0" />}
                <div>
                  <p className="text-xs font-bold leading-tight">{toast.title}</p>
                  <p className="text-[10.5px] text-gray-300 mt-0.5 leading-tight">{toast.message}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white p-1 transition-transform active:scale-75"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 🔹 FLYING ANIMATED ITEMS */}
      {flyingItems.map((item) => (
        <div
          key={item.id}
          className="fixed z-50 pointer-events-none rounded-xl overflow-hidden shadow-2xl border border-yellow-400"
          style={{
            left: item.startX,
            top: item.startY,
            width: 44,
            height: 44,
            animation: 'flyToCart 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'}
            alt="Fly"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </>
  );
}
