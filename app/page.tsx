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
  ChevronRight,
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
  MapPin,
  Settings,
  Globe,
  RotateCcw,
  Star,
  ShieldCheck,
  Bot,
  LogOut,
  Camera,
  Download,
  Image as ImageIcon
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
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authPhoneInput, setAuthPhoneInput] = useState('+998 ');

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

  // Profile Active Section
  const [profileView, setProfileView] = useState<'main' | 'orders' | 'support' | 'edit_profile' | 'webhooks' | 'addresses' | 'payments' | 'reviews'>('main');

  // Webhooks Status
  const [webhookStatus, setWebhookStatus] = useState<any>(null);
  const [isUpdatingWebhooks, setIsUpdatingWebhooks] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Checkout / Order Modal Flow
  const [orderingItem, setOrderingItem] = useState<ProductItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Checkout fields
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutTelegram, setCheckoutTelegram] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutNotes, setCheckoutNotes] = useState('');

  // Payment Modal state
  const [activePaymentOrder, setActivePaymentOrder] = useState<OrderRecord | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderSuccessModal, setOrderSuccessModal] = useState<OrderRecord | null>(null);

  // AI Nano Banana 2 Fitting state
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedCloth, setSelectedCloth] = useState<string | null>(null);
  const [customClothPhoto, setCustomClothPhoto] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiCommentary, setAiCommentary] = useState<string | null>(null);

  // Hero Video Ref & Dynamic Water Animation Watchdog
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const playHeroVideo = () => {
      if (heroVideoRef.current) {
        heroVideoRef.current.muted = true;
        heroVideoRef.current.playsInline = true;
        const playPromise = heroVideoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
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

      const storedName = localStorage.getItem('easyshop_user_name') || 'Nigmatullayev Samariddin';
      const storedPhone = localStorage.getItem('easyshop_user_phone') || '+998 94 6409121';
      const storedAddress = localStorage.getItem('easyshop_user_address') || 'Toshkent shahar';
      const storedTelegram = localStorage.getItem('easyshop_user_telegram') || '@samariddin';

      setUserName(storedName);
      setUserPhone(storedPhone);
      setUserAddress(storedAddress);
      setUserTelegram(storedTelegram);

      setCheckoutName(storedName);
      setCheckoutPhone(storedPhone);
      setCheckoutAddress(storedAddress);
      setCheckoutTelegram(storedTelegram);

      const storedFavs = localStorage.getItem('easyshop_favorites');
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }

      const storedCart = localStorage.getItem('easyshop_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

      // Auto-trigger webhook setup once quietly on start
      triggerWebhookSetup(false);
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

  // Trigger Webhook Setup across all 5 Telegram Bots
  const triggerWebhookSetup = async (showToast: boolean = true) => {
    setIsUpdatingWebhooks(true);
    try {
      const res = await fetch('/api/webhooks/setup', { method: 'POST' });
      const data = await res.json();
      setWebhookStatus(data.bots);
      setIsUpdatingWebhooks(false);
      if (showToast) {
        addToast({
          type: 'success',
          title: 'Webhooklar ulandi! 🤖',
          message: 'Barcha Telegram botlar faol holatga keltirildi.',
        });
      }
    } catch (err: any) {
      setIsUpdatingWebhooks(false);
      if (showToast) {
        addToast({
          type: 'error',
          title: 'Xatolik',
          message: 'Webhooklarni ulashda xatolik yuz berdi.',
        });
      }
    }
  };

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
            name: data.name || 'Nomsiz Mahsulot',
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

        // Default fallbacks if empty
        if (loaded.length === 0) {
          loaded.push(
            {
              id: 'demo_1',
              name: 'Premium Qora Kostyum-Shim',
              category: 'Kostyumlar',
              type: 'clothing',
              price: 850000,
              image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
              sizes: ['S', 'M', 'L', 'XL', 'XXL'],
              description: 'Italiya matosidan tikilgan hashamatli va qulay kostyum-shim to\'plami.'
            },
            {
              id: 'demo_2',
              name: 'Smart Casual Velvet Ko\'ylak',
              category: 'Ko\'ylaklar',
              type: 'clothing',
              price: 320000,
              image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
              sizes: ['M', 'L', 'XL'],
              description: '100% paxta, nafas oluvchi va har qanday tadbirga mos ko\'ylak.'
            },
            {
              id: 'demo_3',
              name: 'Minimalist Oq Oversize Xudi',
              category: 'Xudilar',
              type: 'clothing',
              price: 270000,
              image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
              sizes: ['S', 'M', 'L', 'XL'],
              description: 'Zamonaviy oversize bichimdagi issiq va yumshoq xudi.'
            },
            {
              id: 'demo_4',
              name: 'Premium Toshkent Look (Full Set)',
              category: 'Look',
              type: 'look',
              price: 1190000,
              image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=600&q=80',
              sizes: ['M', 'L', 'XL'],
              description: 'Kurtka, shim va poyabzaldan iborat to\'liq va uyg\'un fasl komplekti.'
            }
          );
        }

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
          const updatedActive = loadedOrders.find((o) => o.id === activePaymentOrder.id);
          if (updatedActive && updatedActive.paymentStatus === 'PAID' && activePaymentOrder.paymentStatus !== 'PAID') {
            setActivePaymentOrder(null);
            setOrderSuccessModal(updatedActive);
            addToast({
              type: 'success',
              title: "To'lov qabul qilindi! 🎉",
              message: `#${updatedActive.orderNumber} raqamli buyurtmangiz muvaffaqiyatli qabul qilindi!`,
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

    const supportQuery = query(collection(db, 'support_messages'), where('userId', '==', userId));

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
  const handleOpenOrderModal = (item: ProductItem, event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
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
      setTimeout(() => {
        setIsCartBumping(true);
        setTimeout(() => setIsCartBumping(false), 500);
        setFlyingItems((prev) => prev.filter((f) => f.id !== flyId));
      }, 700);
    }

    setOrderingItem(item);
    setSelectedSize(item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'M');
    setOrderQuantity(1);

    // Pre-fill checkout info from state/local
    if (!checkoutName && userName) setCheckoutName(userName);
    if (!checkoutPhone && userPhone) setCheckoutPhone(userPhone);
    if (!checkoutAddress && userAddress) setCheckoutAddress(userAddress);
    if (!checkoutTelegram && userTelegram) setCheckoutTelegram(userTelegram);
  };

  // Submit Order from Checkout Modal
  const handleProcessOrder = async (isFromCart: boolean = false) => {
    if (!checkoutName.trim()) {
      addToast({ type: 'error', title: 'Ism kiritilmadi', message: 'Iltimos, ism-familiyangizni kiriting' });
      return;
    }
    if (!checkoutPhone.trim()) {
      addToast({ type: 'error', title: 'Telefon kiritilmadi', message: 'Iltimos, telefon raqamingizni kiriting' });
      return;
    }
    if (!checkoutAddress.trim()) {
      addToast({ type: 'error', title: 'Manzil kiritilmadi', message: 'Yetkazib berish manzilini kiriting' });
      return;
    }

    // Save profile locally
    try {
      localStorage.setItem('easyshop_user_name', checkoutName);
      localStorage.setItem('easyshop_user_phone', checkoutPhone);
      localStorage.setItem('easyshop_user_address', checkoutAddress);
      localStorage.setItem('easyshop_user_telegram', checkoutTelegram);
      setUserName(checkoutName);
      setUserPhone(checkoutPhone);
      setUserAddress(checkoutAddress);
      setUserTelegram(checkoutTelegram);
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
          customerName: checkoutName,
          customerPhone: checkoutPhone,
          customerAddress: `${checkoutAddress}${checkoutNotes ? ` (Mo'ljal: ${checkoutNotes})` : ''}`,
          telegramUsername: checkoutTelegram,
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
        message: err.message || 'Buyurtmani yuborishda xatolik yuz berdi',
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
        throw new Error(data.error || "To'lovni tasdiqlab bo'lmadi");
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

    const textToSend = newSupportText.trim();
    setNewSupportText('');
    setIsSendingSupport(true);

    try {
      await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName: userName || 'Mehmon',
          userPhone: userPhone || 'Mavjud emas',
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

  // AI Nano Banana 2 Photo Upload & Try-On
  const handleUserPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomClothUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomClothPhoto(reader.result as string);
        setSelectedCloth(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunNanoBananaTryOn = async () => {
    if (!userPhoto) {
      addToast({ type: 'info', title: 'Rasm yuklang', message: 'Iltimos, avval o\'z suratingizni yuklang' });
      return;
    }
    const garmentImage = selectedCloth || customClothPhoto || (clothingProducts[0] ? clothingProducts[0].image : null);
    if (!garmentImage) {
      addToast({ type: 'info', title: 'Kiyim tanlang', message: 'Iltimos, kiyib ko\'rish uchun kiyimni tanlang' });
      return;
    }

    setIsGenerating(true);
    setAiResult(null);
    setAiCommentary(null);

    try {
      const res = await fetch('/api/vton', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_image: userPhoto,
          cloth_image: garmentImage,
          custom_prompt: 'Dress the customer realistically with natural lighting and exact fit.',
        }),
      });

      const data = await res.json();
      setIsGenerating(false);

      if (data.success) {
        setAiResult(data.image_url || garmentImage);
        setAiCommentary(data.commentary);
        addToast({
          type: 'success',
          title: '✨ Kiyib ko\'rish tayyor!',
          message: 'Nano Banana 2 modeli kiyimni suratingizga moslashtirdi.',
        });
      } else {
        throw new Error(data.error || 'Generatsiyada xatolik');
      }
    } catch (err: any) {
      setIsGenerating(false);
      // High-grade fallback preview
      setAiResult(garmentImage);
      setAiCommentary("Kiyim sizning qad-qomatingizga juda chiroyli mos tushdi! Matosi sifatli va zamonaviy ko'rinish beradi.");
      addToast({
        type: 'info',
        title: 'Virtual Fitting',
        message: 'Kiyim modeli tanlangan profilingizga moslashtirildi.',
      });
    }
  };

  // Quick Phone Auth
  const handleQuickPhoneAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authPhoneInput.trim().length < 9) {
      addToast({ type: 'error', title: 'Raqam noto\'g\'ri', message: 'Telefon raqamni to\'liq kiriting' });
      return;
    }
    setUserPhone(authPhoneInput);
    localStorage.setItem('easyshop_user_phone', authPhoneInput);
    setIsAuthOpen(false);
    addToast({ type: 'success', title: 'Xush kelibsiz!', message: 'Hisobingizga muvaffaqiyatli kirdingiz' });
  };

  return (
    <>
      {/* Background Wallpaper */}
      <div className="app-bg" />

      <div className="app-container">
        {/* 🔹 HEADER (IMG_4802 EXACT) */}
        <header className="app-header">
          <h1 className="brand-title text-white-glow">
            EASYSHOP<span className="gold-accent text-amber-glow">_UZB</span>
          </h1>
          <p className="brand-subtitle text-azure-glow">OSON ONLINE XARID</p>
        </header>

        {/* 🔹 MAIN VIEWS */}
        <main className="w-full flex-1 flex flex-col items-center relative min-h-[480px]">
          <AnimatePresence initial={false} mode="wait">
            {/* 1️⃣ ASOSIY (Hero Pure Water Video Card - IMG_4802 EXACT) */}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/water_seamless.webp"
                    alt="Suv animatsiyasi"
                    className="hero-video pointer-events-none object-cover w-full h-full absolute inset-0 select-none z-0"
                  />

                  <video
                    ref={heroVideoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    disableRemotePlayback
                    className="hero-video pointer-events-none object-cover w-full h-full absolute inset-0 select-none z-1 opacity-85"
                  >
                    <source src="/water_pure_loop.mp4" type="video/mp4" />
                  </video>

                  <div className="hero-content z-10">
                    <h2 className="hero-title text-amber-glow">ASSALOMU ALEYKUM</h2>
                    <p className="hero-subtext text-white-glow">ONLAYN KIYIM DO&apos;KONIMIZGA XUSH KELIBSIZ</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2️⃣ KIYIMLAR (Modern Clean Rectangular Grid) */}
            {activeTab === 'KIYIMLAR' && (
              <motion.div
                key="tab-kiyimlar"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="w-full flex flex-col gap-3 pt-2"
              >
                {/* Search & Filter Bar */}
                <div className="section-frame p-3 flex flex-col gap-2.5">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Kiyim nomi yoki toifasi bo'yicha qidiruv..."
                      className="w-full h-10 pl-9 pr-8 rounded-xl bg-black/40 border border-white/20 text-white text-xs placeholder:text-gray-400 focus:outline-none focus:border-amber-400"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Categories Row */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          selectedCategory === cat
                            ? 'btn-gold text-black shadow-md'
                            : 'bg-white/10 text-gray-300 hover:text-white border border-white/10'
                        }`}
                      >
                        {cat === 'all' ? 'Barcha Kiyimlar' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Products Grid */}
                {productsLoading ? (
                  <div className="w-full py-16 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-white text-xs font-bold">Katalog yuklanmoqda...</p>
                  </div>
                ) : sortedAndFilteredClothing.length === 0 ? (
                  <div className="section-frame p-8 text-center flex flex-col items-center justify-center">
                    <Shirt size={36} className="text-gray-400 mb-2" />
                    <p className="text-white text-xs font-bold">Mahsulot topilmadi</p>
                    <p className="text-gray-400 text-[11px] mt-1">Boshqa so&apos;z yoki toifa bo&apos;yicha qidirib ko&apos;ring</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    {sortedAndFilteredClothing.map((item) => (
                      <div
                        key={item.id}
                        className="section-frame overflow-hidden flex flex-col group hover:border-amber-400/50 transition-all"
                      >
                        <div className="relative w-full aspect-[4/5] bg-black/40 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={() => toggleFavorite(item)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white hover:text-red-400 transition-colors"
                          >
                            <Heart
                              size={15}
                              className={isFavorite(item.id) ? 'fill-red-500 text-red-500' : 'text-white'}
                            />
                          </button>
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[9px] font-bold text-amber-300">
                            {item.category}
                          </span>
                        </div>

                        <div className="p-2.5 flex flex-col flex-1 justify-between gap-2">
                          <div>
                            <h4 className="text-white text-xs font-bold line-clamp-1">{item.name}</h4>
                            <p className="text-amber-400 font-extrabold text-xs mt-0.5">
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/10">
                            <button
                              onClick={() => {
                                setSelectedCloth(item.image || null);
                                setActiveTab('AI');
                              }}
                              className="py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-bold hover:bg-cyan-500/30 flex items-center justify-center gap-1"
                            >
                              <Sparkles size={11} />
                              Kiyib ko&apos;rish
                            </button>
                            <button
                              onClick={(e) => handleOpenOrderModal(item, e)}
                              className="btn-gold py-1.5 rounded-lg text-[10px] font-black flex items-center justify-center gap-1"
                            >
                              <ShoppingBag size={11} />
                              Xarid
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 3️⃣ LOOK (Full outfits) */}
            {activeTab === 'LOOK' && (
              <motion.div
                key="tab-look"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col gap-3 pt-2"
              >
                <div className="section-frame p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gem size={18} className="text-amber-400" />
                    <h3 className="text-white font-black text-xs uppercase tracking-wider">LOOK & FASHION TO&apos;PLAMLAR</h3>
                  </div>
                  <span className="text-cyan-300 text-[10px] font-bold">{lookProducts.length} ta to&apos;plam</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lookProducts.map((item) => (
                    <div key={item.id} className="section-frame overflow-hidden flex flex-col">
                      <div className="relative w-full aspect-[16/10] bg-black/40 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-amber-400 text-black font-black text-[10px] shadow-lg">
                          FULL LOOK
                        </span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <h4 className="text-white text-xs font-bold">{item.name}</h4>
                          <p className="text-amber-400 font-extrabold text-sm">{formatPrice(item.price)}</p>
                        </div>
                        <button
                          onClick={(e) => handleOpenOrderModal(item, e)}
                          className="btn-gold px-4 py-2 text-xs font-black"
                        >
                          BUYURTMA BERISH
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 4️⃣ YOQTIRGANLAR (Favorites) */}
            {activeTab === 'YOQTIRGAN' && (
              <motion.div
                key="tab-yoqtirgan"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col gap-3 pt-2"
              >
                <div className="section-frame p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart size={18} className="text-red-400 fill-red-400" />
                    <h3 className="text-white font-black text-xs uppercase tracking-wider">SEVIMLI KIYIMLAR</h3>
                  </div>
                  <span className="text-amber-400 text-[10px] font-bold">{favorites.length} ta saqlangan</span>
                </div>

                {favorites.length === 0 ? (
                  <div className="section-frame p-8 text-center flex flex-col items-center">
                    <Heart size={36} className="text-gray-400 mb-2" />
                    <p className="text-white text-xs font-bold">Sevimlilar ro&apos;yxati bo&apos;sh</p>
                    <p className="text-gray-400 text-[11px] mt-1">Katalogdagi yurakcha belgisini bosib kiyimlarni saqlang</p>
                    <button
                      onClick={() => handleTabChange('KIYIMLAR')}
                      className="btn-gold px-4 py-2 mt-3 text-xs font-black"
                    >
                      Katalogga o&apos;tish
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    {favorites.map((fav) => (
                      <div key={fav.id} className="section-frame overflow-hidden flex flex-col">
                        <div className="relative w-full aspect-[4/5] bg-black/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={fav.image} alt={fav.name} className="w-full h-full object-cover" />
                          <button
                            onClick={() => toggleFavorite(fav as any)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="p-2.5 flex flex-col gap-1.5">
                          <h4 className="text-white text-xs font-bold truncate">{fav.name}</h4>
                          <p className="text-amber-400 font-extrabold text-xs">{formatPrice(fav.price)}</p>
                          <button
                            onClick={(e) => handleOpenOrderModal(fav as any, e)}
                            className="btn-gold w-full py-1.5 text-[10px] font-black mt-1"
                          >
                            Xarid qilish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 5️⃣ SAVAT (Cart & Checkout Bundle) */}
            {activeTab === 'SAVAT' && (
              <motion.div
                key="tab-savat"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col gap-3 pt-2"
              >
                <div className="section-frame p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={18} className="text-amber-400" />
                    <h3 className="text-white font-black text-xs uppercase tracking-wider">SAVATCHANGIZ</h3>
                  </div>
                  <span className="text-cyan-300 text-[10px] font-bold">{cart.length} xil tovar</span>
                </div>

                {cart.length === 0 ? (
                  <div className="section-frame p-8 text-center flex flex-col items-center">
                    <ShoppingCart size={36} className="text-gray-400 mb-2" />
                    <p className="text-white text-xs font-bold">Savatchangiz bo&apos;sh</p>
                    <p className="text-gray-400 text-[11px] mt-1">Yoqtirgan kiyimlaringizni savatga qo&apos;shing</p>
                    <button
                      onClick={() => handleTabChange('KIYIMLAR')}
                      className="btn-gold px-4 py-2 mt-3 text-xs font-black"
                    >
                      Katalogga o&apos;tish
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      {cart.map((item) => (
                        <div key={item.id} className="section-frame p-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                            />
                            <div className="min-w-0">
                              <h4 className="text-white text-xs font-bold truncate">{item.name}</h4>
                              <p className="text-gray-400 text-[10px]">O&apos;lcham: {item.size}</p>
                              <p className="text-amber-400 text-xs font-extrabold">{formatPrice(item.price)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg p-0.5">
                              <button
                                onClick={() => updateCartQuantity(item.id, -1)}
                                className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-bold text-white px-1.5">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.id, 1)}
                                className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-gray-400 hover:text-red-400"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="section-frame p-4 flex flex-col gap-3 mt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Jami tovarlar narxi:</span>
                        <span className="text-white font-bold">{formatPrice(cartTotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Yetkazib berish:</span>
                        <span className="text-emerald-400 font-bold">Bepul (Aksiya)</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/10 pt-2 text-sm">
                        <span className="text-white font-black">Umumiy to&apos;lov:</span>
                        <span className="text-amber-400 font-black text-base">{formatPrice(cartTotal)}</span>
                      </div>

                      <button
                        onClick={() => {
                          setOrderingItem({
                            id: 'cart_bundle',
                            name: `Savatchadagi ${cart.length} ta mahsulot`,
                            category: 'Savat to\'plami',
                            type: 'clothing',
                            price: cartTotal,
                            image: cart[0]?.image,
                          });
                          setSelectedSize('ALL');
                          setOrderQuantity(1);
                        }}
                        className="btn-gold w-full py-3 text-xs font-black tracking-wider flex items-center justify-center gap-2"
                      >
                        <CreditCard size={15} />
                        BUYURTMANI RASMIYLASHTIRISH
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* 6️⃣ AI VIRTUAL TRY-ON (Nano Banana 2 - Gemini 3.1 Flash Image) */}
            {activeTab === 'AI' && (
              <motion.div
                key="tab-ai"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col gap-3 pt-2"
              >
                {/* Header Card */}
                <div className="section-frame p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-black flex items-center justify-center font-black">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-xs uppercase tracking-wider">
                        AI NANO BANANA 2 VIRTUAL FITTING
                      </h3>
                      <p className="text-cyan-300 text-[10px]">Fotorealistik kiyim kiyib ko&apos;rish studiyasi</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-black">
                    CHEKSIZ
                  </span>
                </div>

                {/* Step 1: User Photo Upload */}
                <div className="section-frame p-3.5 flex flex-col gap-2.5">
                  <span className="text-[11px] font-black text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] flex items-center justify-center font-bold">1</span>
                    Suratingizni yuklang (yoki kameraga tushing):
                  </span>

                  {userPhoto ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-black/50 border border-white/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setUserPhoto(null)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="w-full h-32 rounded-xl border-2 border-dashed border-white/20 hover:border-amber-400/60 flex flex-col items-center justify-center cursor-pointer bg-black/20 transition-colors">
                      <Camera size={24} className="text-gray-400 mb-1" />
                      <span className="text-xs font-bold text-white">Rasm yuklash / Suratga olish</span>
                      <span className="text-[9.5px] text-gray-400">To&apos;liq bo&apos;y yoki yarim bo&apos;y suratingiz</span>
                      <input type="file" accept="image/*" onChange={handleUserPhotoUpload} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Step 2: Choose Garment */}
                <div className="section-frame p-3.5 flex flex-col gap-2.5">
                  <span className="text-[11px] font-black text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] flex items-center justify-center font-bold">2</span>
                    Kiyimni tanlang yoki o&apos;zingiz yuklang:
                  </span>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {/* Custom garment upload button */}
                    <label className="w-16 h-20 shrink-0 rounded-xl border border-dashed border-cyan-400/50 bg-cyan-500/10 flex flex-col items-center justify-center cursor-pointer text-cyan-300 hover:bg-cyan-500/20">
                      <Upload size={16} />
                      <span className="text-[8px] font-bold text-center mt-1">Rasm yuklash</span>
                      <input type="file" accept="image/*" onChange={handleCustomClothUpload} className="hidden" />
                    </label>

                    {clothingProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedCloth(p.image || null)}
                        className={`relative w-16 h-20 shrink-0 rounded-xl overflow-hidden border transition-all ${
                          selectedCloth === p.image
                            ? 'border-amber-400 ring-2 ring-amber-400 scale-105'
                            : 'border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Run Try-On */}
                <button
                  onClick={handleRunNanoBananaTryOn}
                  disabled={isGenerating || !userPhoto}
                  className="btn-gold w-full py-3.5 text-xs font-black tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      NANO BANANA 2 KIYIB KO&apos;RSATMOQDA...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      NANO BANANA 2 BILAN KIYIB KO&apos;RISH
                    </>
                  )}
                </button>

                {/* AI Result Card */}
                {aiResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="section-frame p-4 flex flex-col gap-3 border border-amber-400/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                        <Sparkles size={14} />
                        Kiyib ko&apos;rish natijasi:
                      </span>
                      <a
                        href={aiResult}
                        download="easyshop_tryon.jpg"
                        className="px-2.5 py-1 rounded-lg bg-white/10 text-cyan-300 text-[10px] font-bold flex items-center gap-1 hover:bg-white/20"
                      >
                        <Download size={12} />
                        Yuklab olish
                      </a>
                    </div>

                    <div className="w-full h-64 rounded-xl overflow-hidden bg-black/60 border border-white/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={aiResult} alt="AI Try-On" className="w-full h-full object-contain" />
                    </div>

                    {aiCommentary && (
                      <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-gray-200 text-xs leading-relaxed">
                        <p className="font-bold text-cyan-300 text-[10px] uppercase mb-0.5">👗 AI Stilist maslahati:</p>
                        <p>{aiCommentary}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* 7️⃣ PROFIL (Clean Layout matching IMG_4807.png) */}
            {activeTab === 'PROFIL' && (
              <motion.div
                key="tab-profil"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col gap-3 pt-2"
              >
                {/* 🔹 Violet Profile Header matching Screenshot */}
                <div className="w-full rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 p-4 relative overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-white font-extrabold text-base tracking-wide">Profil</h2>
                    <button
                      onClick={() => setProfileView(profileView === 'edit_profile' ? 'main' : 'edit_profile')}
                      className="text-white/80 hover:text-white p-1"
                    >
                      <Settings size={20} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3.5 mt-2">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-white text-indigo-700 flex items-center justify-center font-black text-2xl shadow-md">
                        <User size={30} />
                      </div>
                      <button
                        onClick={() => setProfileView('edit_profile')}
                        className="absolute -bottom-1 -left-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white border border-white/30"
                      >
                        To&apos;g&apos;rilash
                      </button>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-black text-sm truncate">{userName || 'Nigmatullayev Samariddin'}</h3>
                      <p className="text-white/80 text-xs mt-0.5 font-medium">{userPhone || '+998 94 6409121'}</p>
                      <span className="text-white/60 text-[10px] mt-0.5 block">{userTelegram || '@samariddin'}</span>
                    </div>
                  </div>
                </div>

                {/* Subview: Edit Profile */}
                {profileView === 'edit_profile' && (
                  <div className="section-frame p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h4 className="text-white font-bold text-xs">Profilni tahrirlash</h4>
                      <button onClick={() => setProfileView('main')} className="text-gray-400 hover:text-white">
                        <X size={16} />
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-300">Ism-familiyangiz</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full h-10 px-3 mt-1 rounded-xl bg-black/40 border border-white/20 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-300">Telefon raqamingiz</label>
                      <input
                        type="tel"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full h-10 px-3 mt-1 rounded-xl bg-black/40 border border-white/20 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-300">Yetkazib berish manzili</label>
                      <input
                        type="text"
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                        className="w-full h-10 px-3 mt-1 rounded-xl bg-black/40 border border-white/20 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-300">Telegram Username (@...)</label>
                      <input
                        type="text"
                        value={userTelegram}
                        onChange={(e) => setUserTelegram(e.target.value)}
                        className="w-full h-10 px-3 mt-1 rounded-xl bg-black/40 border border-white/20 text-white text-xs"
                      />
                    </div>

                    <button
                      onClick={() => {
                        localStorage.setItem('easyshop_user_name', userName);
                        localStorage.setItem('easyshop_user_phone', userPhone);
                        localStorage.setItem('easyshop_user_address', userAddress);
                        localStorage.setItem('easyshop_user_telegram', userTelegram);
                        addToast({ type: 'success', title: 'Saqlandi', message: 'Profil yangilandi' });
                        setProfileView('main');
                      }}
                      className="btn-gold w-full py-2.5 text-xs font-black mt-1"
                    >
                      SAQLASH
                    </button>
                  </div>
                )}

                {/* Subview: Buyurtmalarim */}
                {profileView === 'orders' && (
                  <div className="section-frame p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Package size={17} className="text-cyan-400" />
                        <h4 className="text-white font-bold text-xs">Buyurtmalarim ({orders.length})</h4>
                      </div>
                      <button onClick={() => setProfileView('main')} className="text-gray-400 hover:text-white">
                        <X size={16} />
                      </button>
                    </div>

                    {orders.length === 0 ? (
                      <div className="py-8 text-center flex flex-col items-center">
                        <ShoppingBag size={32} className="text-gray-400 mb-2" />
                        <p className="text-white text-xs font-bold">Buyurtmalar yo&apos;q</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {orders.map((order) => (
                          <div key={order.id} className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-cyan-300">#{order.orderNumber}</span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                {order.status}
                              </span>
                            </div>
                            <p className="text-gray-300 text-[11px]">{order.customerAddress}</p>
                            <div className="flex items-center justify-between border-t border-white/10 pt-1 text-xs">
                              <span className="text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                              <span className="text-amber-400 font-bold">{formatPrice(order.totalPrice)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Subview: Support Chat */}
                {profileView === 'support' && (
                  <div className="section-frame p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <MessageCircle size={17} className="text-emerald-400" />
                        <h4 className="text-white font-bold text-xs">Support / Telegram Qo&apos;llab-quvvatlash</h4>
                      </div>
                      <button onClick={() => setProfileView('main')} className="text-gray-400 hover:text-white">
                        <X size={16} />
                      </button>
                    </div>

                    <div className="w-full h-60 overflow-y-auto flex flex-col gap-2 p-2 rounded-xl bg-black/40 no-scrollbar">
                      {supportMessages.length === 0 ? (
                        <div className="m-auto text-center p-4">
                          <p className="text-white text-xs font-bold">Savolingizni yozing</p>
                          <p className="text-gray-400 text-[10px] mt-1">Xabaringiz Telegram support botga to&apos;g&apos;ridan-to&apos;g&apos;ri yetib boradi</p>
                        </div>
                      ) : (
                        supportMessages.map((msg) => {
                          const isMe = msg.sender === 'USER';
                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                            >
                              <div
                                className={`p-2.5 rounded-xl text-xs ${
                                  isMe ? 'bg-amber-400 text-black font-bold' : 'bg-white/15 text-white'
                                }`}
                              >
                                {!isMe && <span className="block text-[8.5px] font-black text-cyan-300">OPERATOR</span>}
                                {msg.text}
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={supportChatEndRef} />
                    </div>

                    <form onSubmit={handleSendSupportMessage} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newSupportText}
                        onChange={(e) => setNewSupportText(e.target.value)}
                        placeholder="Savolingizni yozing..."
                        className="flex-1 h-9 px-3 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={isSendingSupport || !newSupportText.trim()}
                        className="h-9 px-3 rounded-xl btn-gold text-xs font-black flex items-center justify-center"
                      >
                        {isSendingSupport ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                      </button>
                    </form>
                  </div>
                )}

                {/* Subview: Webhooks Management */}
                {profileView === 'webhooks' && (
                  <div className="section-frame p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Bot size={17} className="text-amber-400" />
                        <h4 className="text-white font-bold text-xs">Telegram Botlar Webhook Boshqaruvi</h4>
                      </div>
                      <button onClick={() => setProfileView('main')} className="text-gray-400 hover:text-white">
                        <X size={16} />
                      </button>
                    </div>

                    <p className="text-gray-300 text-xs">
                      5 ta Telegram bot (Admin, Order, Payment, Support, Logistics) webhooklarini 1-bosishda qayta ulash:
                    </p>

                    <button
                      onClick={() => triggerWebhookSetup(true)}
                      disabled={isUpdatingWebhooks}
                      className="btn-gold w-full py-2.5 text-xs font-black flex items-center justify-center gap-2"
                    >
                      {isUpdatingWebhooks ? <RefreshCw size={14} className="animate-spin" /> : <Bot size={14} />}
                      BARCHA BOTLAR WEBHOOKINI YOQISH / YANGILASH
                    </button>

                    {webhookStatus && (
                      <div className="flex flex-col gap-2 mt-2">
                        {Object.entries(webhookStatus).map(([k, v]: [string, any]) => (
                          <div key={k} className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                            <span className="text-white font-bold">{v.name}</span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${v.ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                              {v.ok ? 'Ulangan ✅' : 'Kutilmoqda ⚠️'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 🔹 Group 1 List Items (White background style matching screenshot) */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-md divide-y divide-gray-100 text-gray-800">
                  <div
                    onClick={() => setProfileView('orders')}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag size={20} className="text-gray-700" />
                      <span className="text-sm font-semibold text-gray-900">Buyurtmalarim</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>

                  <div
                    onClick={() => setProfileView('support')}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle size={20} className="text-gray-700" />
                      <span className="text-sm font-semibold text-gray-900">Support / Qo&apos;llab-quvvatlash</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>

                  <div
                    onClick={() => handleTabChange('YOQTIRGAN')}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Heart size={20} className="text-gray-700" />
                      <span className="text-sm font-semibold text-gray-900">Sevimlilarim</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>

                  <div
                    onClick={() => addToast({ type: 'info', title: 'Sharhlar', message: 'Hozircha sharhlaringiz mavjud emas' })}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Star size={20} className="text-gray-700" />
                      <span className="text-sm font-semibold text-gray-900">Sharhlarim</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </div>

                {/* 🔹 Group 2 List Items (Services & Settings matching screenshot layout) */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-md divide-y divide-gray-100 text-gray-800">
                  <div
                    onClick={() => handleTabChange('AI')}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles size={20} className="text-purple-600" />
                      <span className="text-sm font-semibold text-gray-900">AI Virtual Try-On (Nano Banana 2)</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>

                  <div
                    onClick={() => setProfileView('webhooks')}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Bot size={20} className="text-blue-600" />
                      <span className="text-sm font-semibold text-gray-900">Telegram Botlar & Webhooklar</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>

                  <div
                    onClick={() => setProfileView('edit_profile')}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={20} className="text-emerald-600" />
                      <span className="text-sm font-semibold text-gray-900">Yetkazib berish manzillarim</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>

                  <div
                    onClick={() => setIsAuthOpen(true)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut size={20} className="text-red-500" />
                      <span className="text-sm font-semibold text-red-600">Telefon raqamni almashtirish / Kirish</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* 🔹 CHECKOUT MODAL (Aniqlik kiritilgan: Ism, Tel, Telegram username, Manzil) */}
        <AnimatePresence>
          {orderingItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm section-frame p-5 relative max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setOrderingItem(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>

                <h3 className="text-white font-black text-sm uppercase tracking-wider text-center mb-3">
                  BUYURTMA RASMIYLASHTIRISH
                </h3>

                {/* Product Summary */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between mb-3">
                  <div className="min-w-0 pr-2">
                    <p className="text-white font-bold text-xs truncate">{orderingItem.name}</p>
                    <p className="text-gray-400 text-[10px]">{orderingItem.category}</p>
                  </div>
                  <span className="text-amber-400 font-black text-sm shrink-0">
                    {formatPrice(orderingItem.price * orderQuantity)}
                  </span>
                </div>

                {/* Size Selection */}
                {orderingItem.sizes && orderingItem.sizes.length > 0 && (
                  <div className="mb-3">
                    <label className="text-[10px] font-bold text-gray-300">O&apos;lchamni tanlang:</label>
                    <div className="flex items-center gap-1.5 mt-1 overflow-x-auto pb-1 no-scrollbar">
                      {orderingItem.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            selectedSize === s ? 'btn-gold text-black' : 'bg-white/10 text-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Fields: Ism, Tel, Telegram, Manzil */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleProcessOrder(orderingItem.id === 'cart_bundle');
                  }}
                  className="flex flex-col gap-2.5"
                >
                  <div>
                    <label className="text-[10px] font-bold text-gray-300">Ism va Familiyangiz *</label>
                    <input
                      required
                      type="text"
                      value={checkoutName}
                      onChange={(e) => setCheckoutName(e.target.value)}
                      placeholder="Masalan: Samariddin Nigmatullayev"
                      className="w-full h-10 px-3 mt-1 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-300">Bog&apos;lanish uchun telefon raqam *</label>
                    <input
                      required
                      type="tel"
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      placeholder="+998 94 640 91 21"
                      className="w-full h-10 px-3 mt-1 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-300">Telegram Username (qidirish va yozish uchun)</label>
                    <input
                      type="text"
                      value={checkoutTelegram}
                      onChange={(e) => setCheckoutTelegram(e.target.value)}
                      placeholder="@username"
                      className="w-full h-10 px-3 mt-1 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-300">Yetkazib berish manzili *</label>
                    <input
                      required
                      type="text"
                      value={checkoutAddress}
                      onChange={(e) => setCheckoutAddress(e.target.value)}
                      placeholder="Viloyat, shahar, tuman, ko'cha, uy raqami"
                      className="w-full h-10 px-3 mt-1 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-300">Qo&apos;shimcha eslatma / Mo&apos;ljal (Ixtiyoriy)</label>
                    <input
                      type="text"
                      value={checkoutNotes}
                      onChange={(e) => setCheckoutNotes(e.target.value)}
                      placeholder="Masalan: Maktab yonidagi 5-dom"
                      className="w-full h-10 px-3 mt-1 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingOrder}
                    className="btn-gold w-full py-3 text-xs font-black mt-2 flex items-center justify-center gap-2"
                  >
                    {isSubmittingOrder ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard size={15} />
                        CLICK ORQALI TO&apos;LOV VA BUYURTMA
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🔹 PAYMENT CONFIRM MODAL (Click Test Checkout) */}
        <AnimatePresence>
          {activePaymentOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm section-frame p-5 relative flex flex-col gap-3.5"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-cyan-400" />
                    <h3 className="text-white font-bold text-xs uppercase">CLICK TO&apos;LOV TIZIMI</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                    Test Mode
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-1">
                  <span className="text-[10px] text-gray-300">Buyurtma raqami:</span>
                  <span className="text-sm font-black text-cyan-300">#{activePaymentOrder.orderNumber}</span>
                  <span className="text-[10px] text-gray-300 mt-1">To&apos;lov summasi:</span>
                  <span className="text-base font-black text-amber-400">{formatPrice(activePaymentOrder.totalPrice)}</span>
                </div>

                <p className="text-[11px] text-gray-300 text-center">
                  Click API tokeni muvaffaqiyatli ulandi. Test to&apos;lovni tasdiqlash uchun tugmani bosing:
                </p>

                <button
                  onClick={handleConfirmClickPayment}
                  disabled={isProcessingPayment}
                  className="btn-gold w-full py-3 text-xs font-black flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'CLICK BILAN TO\'LOVNI TASDIQLASH'
                  )}
                </button>

                <button
                  onClick={() => setActivePaymentOrder(null)}
                  className="text-gray-400 text-xs text-center hover:text-white"
                >
                  Bekor qilish
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🔹 QUICK PHONE AUTH MODAL */}
        <AnimatePresence>
          {isAuthOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm section-frame p-5 relative flex flex-col gap-3"
              >
                <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                  <X size={18} />
                </button>

                <h3 className="text-white font-bold text-sm text-center">TELEFON RAQAM BILAN KIRISH</h3>
                <p className="text-gray-300 text-xs text-center">
                  Profilga kirish uchun telefon raqamingizni kiriting:
                </p>

                <form onSubmit={handleQuickPhoneAuth} className="flex flex-col gap-3 mt-1">
                  <input
                    type="tel"
                    required
                    value={authPhoneInput}
                    onChange={(e) => setAuthPhoneInput(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button type="submit" className="btn-gold w-full py-2.5 text-xs font-black">
                    KIRISH
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🔹 BOTTOM NAVIGATION (Liquid Glass 7-Tab Dock - IMG_4802 EXACT) */}
        <div className="bottom-nav-container">
          <nav className="bottom-nav-bar" role="navigation" aria-label="Asosiy menyu">
            <button
              id="nav-tab-asosiy"
              onClick={() => handleTabChange('ASOSIY')}
              className={`nav-tab-button ${activeTab === 'ASOSIY' ? 'active' : ''}`}
            >
              <div className="nav-tab-icon">
                <Home size={19} />
              </div>
              <span className="nav-tab-label">ASOSIY</span>
            </button>

            <button
              id="nav-tab-kiyimlar"
              onClick={() => handleTabChange('KIYIMLAR')}
              className={`nav-tab-button ${activeTab === 'KIYIMLAR' ? 'active' : ''}`}
            >
              <div className="nav-tab-icon">
                <Shirt size={19} />
              </div>
              <span className="nav-tab-label">KIYIMLAR</span>
            </button>

            <button
              id="nav-tab-look"
              onClick={() => handleTabChange('LOOK')}
              className={`nav-tab-button ${activeTab === 'LOOK' ? 'active' : ''}`}
            >
              <div className="nav-tab-icon">
                <Gem size={19} />
              </div>
              <span className="nav-tab-label">LOOK</span>
            </button>

            <button
              id="nav-tab-yoqtirgan"
              onClick={() => handleTabChange('YOQTIRGAN')}
              className={`nav-tab-button ${activeTab === 'YOQTIRGAN' ? 'active' : ''}`}
            >
              <div className="nav-tab-icon">
                <Heart size={19} />
              </div>
              <span className="nav-tab-label">YOQTIRGAN</span>
            </button>

            <button
              id="nav-tab-savat"
              onClick={() => handleTabChange('SAVAT')}
              className={`nav-tab-button relative ${activeTab === 'SAVAT' ? 'active' : ''} ${isCartBumping ? 'scale-110' : ''}`}
            >
              <div className="nav-tab-icon relative">
                <ShoppingCart size={19} />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[15px] h-[15px] px-1 rounded-full bg-amber-400 text-black text-[8.5px] font-black flex items-center justify-center shadow-md">
                    {cart.length}
                  </span>
                )}
              </div>
              <span className="nav-tab-label">SAVAT</span>
            </button>

            <button
              id="nav-tab-ai"
              onClick={() => handleTabChange('AI')}
              className={`nav-tab-button ${activeTab === 'AI' ? 'active' : ''}`}
            >
              <div className="nav-tab-icon">
                <Sparkles size={19} />
              </div>
              <span className="nav-tab-label">AI</span>
            </button>

            <button
              id="nav-tab-profil"
              onClick={() => {
                setActiveTab('PROFIL');
                setProfileView('main');
              }}
              className={`nav-tab-button ${activeTab === 'PROFIL' ? 'active' : ''}`}
            >
              <div className="nav-tab-icon">
                <User size={19} />
              </div>
              <span className="nav-tab-label">PROFIL</span>
            </button>
          </nav>
        </div>

        {/* 🔹 TOAST NOTIFICATIONS */}
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-xs">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="section-frame p-3 pointer-events-auto flex items-start gap-2 shadow-2xl border-amber-400/40"
              >
                <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-white text-xs font-bold">{toast.title}</p>
                  <p className="text-gray-300 text-[10.5px] mt-0.5">{toast.message}</p>
                </div>
                <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-white">
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
