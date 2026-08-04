'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import ProductCard from './components/ProductCard'
import SkeletonCard from './components/SkeletonCard'

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  startAfter,
  limit as fbLimit,
  where,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('Home')
  const [items, setItems] = useState<any[]>([])
  const [visibleItems, setVisibleItems] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const [count, setCount] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  const [userImage, setUserImage] = useState<string | null>(null)
  const [clothImage, setClothImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiResult, setAiResult] = useState<string | null>(null)
  // vtonStatus: idle | loading | model_loading | failed
  const [vtonStatus, setVtonStatus] = useState<'idle' | 'loading' | 'model_loading' | 'failed'>('idle')
  const [vtonRetryCount, setVtonRetryCount] = useState(0)

  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const lastDocRef = useRef<any>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const [search, setSearch] = useState('')
  const searchRef = useRef<number | null>(null)

  // load saved favorites/cart
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('favorites')
      const savedCart = localStorage.getItem('user_cart')
      if (savedFavs) setFavorites(JSON.parse(savedFavs))
      if (savedCart) setCart(JSON.parse(savedCart))
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
    localStorage.setItem('user_cart', JSON.stringify(cart))
  }, [favorites, cart])

  // Fetch first page
  const fetchFirst = useCallback(async () => {
    setLoading(true)
    try {
      const q = query(collection(db, 'products'), orderBy('created_at', 'desc'), fbLimit(50))
      const snap = await getDocs(q)
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setItems(docs)
      setVisibleItems(docs)
      lastDocRef.current = snap.docs[snap.docs.length - 1]
      setHasMore(snap.docs.length === 50)
    } catch (err) {
      console.error('Fetch first products error', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch next page
  const fetchNext = useCallback(async () => {
    if (!lastDocRef.current) return
    if (!hasMore) return
    setLoadingMore(true)
    try {
      const q = query(
        collection(db, 'products'),
        orderBy('created_at', 'desc'),
        startAfter(lastDocRef.current),
        fbLimit(50)
      )
      const snap = await getDocs(q)
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setItems((p) => [...p, ...docs])
      setVisibleItems((p) => [...p, ...docs])
      lastDocRef.current = snap.docs[snap.docs.length - 1] ?? lastDocRef.current
      setHasMore(snap.docs.length === 50)
    } catch (err) {
      console.error('Fetch next products error', err)
    } finally {
      setLoadingMore(false)
    }
  }, [hasMore])

  useEffect(() => {
    fetchFirst()
  }, [fetchFirst])

  // infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        fetchNext()
      }
    })
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current)
    return () => observerRef.current?.disconnect()
  }, [fetchNext, hasMore, loadingMore])

  // debounce search
  useEffect(() => {
    if (searchRef.current) window.clearTimeout(searchRef.current)
    searchRef.current = window.setTimeout(() => {
      if (!search) {
        setVisibleItems(items)
        return
      }
      const q = search.toLowerCase()
      setVisibleItems(items.filter((it) => (it.name || it.title || '').toLowerCase().includes(q)))
    }, 250)
    return () => {
      if (searchRef.current) window.clearTimeout(searchRef.current)
    }
  }, [search, items])

  const handleAddToCart = (product: any) => {
    setCart((prev) => [...prev, { ...product, qty: 1 }])
  }

  const toggleFavorite = (e: React.MouseEvent, product: any) => {
    e.stopPropagation()
    setFavorites((prev) => {
      const exists = prev.find((p) => p.id === product.id)
      if (exists) return prev.filter((p) => p.id !== product.id)
      return [...prev, product]
    })
  }

  const totalCartItems = cart.reduce((t, i) => t + (i.qty || 1), 0)
  const totalCartPrice = cart.reduce((t, i) => t + (Number(i.price || 0) * (i.qty || 1)), 0)

  // VTON handler with 1 automatic retry on 503 (20s delay)
  const handleAIGeneration = useCallback(async () => {
    if (!userImage || !clothImage) {
      alert("Iltimos, ikkala rasmni ham yuklang!")
      return
    }

    setIsProcessing(true)
    setVtonStatus('loading')
    setVtonRetryCount(0)
    setAiResult(null)

    const callVton = async () => {
      try {
        const res = await fetch('/api/vton', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_image: userImage, cloth_image: clothImage }),
        })

        if (res.status === 503) {
          return { status: 503 }
        }

        if (!res.ok) {
          const text = await res.text().catch(() => '')
          console.error('VTON upstream error', res.status, text)
          return { status: res.status }
        }

        const data = await res.json()
        return { status: 200, data }
      } catch (err) {
        console.error('VTON fetch error', err)
        return { status: 500 }
      }
    }

    // first attempt
    const first = await callVton()
    if (first.status === 200 && first.data?.image_url) {
      setAiResult(first.data.image_url)
      setVtonStatus('idle')
      setIsProcessing(false)
      return
    }

    if (first.status === 503) {
      // model loading - automatic one retry after 20s
      setVtonStatus('model_loading')
      setVtonRetryCount(1)

      // wait 20s then retry
      await sleep(20000)
      const second = await callVton()
      if (second.status === 200 && second.data?.image_url) {
        setAiResult(second.data.image_url)
        setVtonStatus('idle')
        setIsProcessing(false)
        return
      }

      // still failing
      setVtonStatus('failed')
      setIsProcessing(false)
      return
    }

    // other failures
    setVtonStatus('failed')
    setIsProcessing(false)
  }, [userImage, clothImage])

  const manualRetry = async () => {
    setVtonStatus('loading')
    setIsProcessing(true)
    setVtonRetryCount((c) => c + 1)
    const res = await fetch('/api/vton', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_image: userImage, cloth_image: clothImage }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data?.image_url) setAiResult(data.image_url)
      setVtonStatus('idle')
    } else if (res.status === 503) {
      setVtonStatus('model_loading')
    } else {
      setVtonStatus('failed')
    }
    setIsProcessing(false)
  }

  return (
    <main style={{ position: 'relative', minHeight: '100dvh', width: '100dvw', overflowX: 'hidden', backgroundColor: '#050b14', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '40px 0 120px 0', boxSizing: 'border-box' }}>

      <header style={{ textAlign: 'center', marginBottom: 20, zIndex: 10, position: 'relative' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: 0 }}>EASYSHOP_<span style={{ color: '#fbbf24' }}>UZB</span></h1>
      </header>

      <div style={{ width: '100%', maxWidth: 1100, padding: '0 16px', boxSizing: 'border-box' }}>
        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <input aria-label="search" placeholder="Mahsulot nomi bo'yicha qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: '#0b1220', color: 'white' }} />
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            <button onClick={() => setVisibleItems(items)} style={{ padding: '8px 12px', borderRadius: 999, background: '#111827', color: 'white', border: 'none' }}>Barchasi</button>
            {/* simple category extraction */}
            {Array.from(new Set(items.map((it) => it.type || 'Boshqa'))).slice(0, 6).map((cat) => (
              <button key={cat} onClick={() => setVisibleItems(items.filter((i) => (i.type || 'Boshqa') === cat))} style={{ padding: '8px 12px', borderRadius: 999, background: '#0b1220', color: 'white', border: '1px solid rgba(255,255,255,0.04)' }}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

          {!loading && visibleItems.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={() => { setSelectedProduct(p) }} onAddToCart={() => handleAddToCart(p)} />
          ))}

          {loadingMore && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`m-${i}`} />)}
        </div>

        <div ref={loadMoreRef} style={{ height: 24 }} />

        {/* AI panel - improved VTON UX */}
        <div style={{ marginTop: 18 }}>
          <h3 style={{ color: '#fbbf24' }}>Virtual kiyib ko'rish (AI)</h3>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <div style={{ width: 180, height: 240, background: '#0b1220', borderRadius: 12, position: 'relative', overflow: 'hidden' }}>
              {userImage ? <img src={userImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Sizning rasm</div>}
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0]; if (file) { const r = new FileReader(); r.onloadend = () => setUserImage(r.result as string); r.readAsDataURL(file) }
              }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
            </div>

            <div style={{ width: 180, height: 240, background: '#0b1220', borderRadius: 12, position: 'relative', overflow: 'hidden' }}>
              {clothImage ? <img src={clothImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Kiyim rasm</div>}
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0]; if (file) { const r = new FileReader(); r.onloadend = () => setClothImage(r.result as string); r.readAsDataURL(file) }
              }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleAIGeneration} disabled={isProcessing} style={{ padding: 12, background: '#fbbf24', borderRadius: 12, border: 'none', fontWeight: 800 }}>{isProcessing ? 'AI ishlamoqda...' : 'Hisoblash'}</button>
                {vtonStatus === 'model_loading' && <div style={{ padding: 12, background: '#111827', borderRadius: 12, color: '#f59e0b' }}>Model yuklanmoqda — avtomatik 20s keyin qayta uriniladi...</div>}
                {vtonStatus === 'failed' && <button onClick={manualRetry} style={{ padding: 12, background: '#ef4444', borderRadius: 12, border: 'none', color: 'white', fontWeight: 800 }}>Qayta urinib ko'rish</button>}
              </div>

              <div style={{ marginTop: 12 }}>
                {isProcessing && vtonStatus === 'loading' && <div style={{ color: 'white' }}>AI ishlayapti — sabr qiling...</div>}
                {vtonStatus === 'model_loading' && <div style={{ color: '#fbbf24' }}>Model hali yuklanmoqda. Bir necha soniyadan keyin avtomatik qayta uriniladi.</div>}
                {vtonStatus === 'failed' && <div style={{ color: '#ef4444' }}>AI xizmatiga ulanishda xato yuz berdi. Iltimos qayta urinib ko'ring.</div>}
                {aiResult && (
                  <div style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', width: 360 }}>
                    <img src={aiResult} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* product modal kept simple */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}>
          <div style={{ width: '100%', maxWidth: 560, height: '92dvh', background: '#0f172a', borderRadius: 20, padding: 20, overflowY: 'auto' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ marginBottom: 12 }}>Close</button>
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#f1f5f9' }}>
              <Image src={(selectedProduct.poster_url || selectedProduct.image_url?.split(',')[0] || '/placeholder.png')} alt={selectedProduct.name} fill style={{ objectFit: 'contain' }} />
            </div>
            <h2 style={{ color: 'white' }}>{selectedProduct.name}</h2>
            <div style={{ color: '#fbbf24', fontWeight: 900, fontSize: 24 }}>{Number(selectedProduct.price || 0).toLocaleString()} so'm</div>
            {/* sizes/colors and add to cart */}
            <div style={{ marginTop: 16 }}>
              <button onClick={() => handleAddToCart(selectedProduct)} style={{ width: '100%', padding: 12, background: '#5B2EFF', color: 'white', borderRadius: 12, border: 'none', fontWeight: 800 }}>Savatga qo'shish</button>
            </div>
          </div>
        </div>
      )}

      <nav style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000 }}>
        <div style={{ background: '#0b1220', padding: 10, borderRadius: 12, color: 'white' }}>{totalCartItems} ta mahsulot — {totalCartPrice.toLocaleString()} so'm</div>
      </nav>

    </main>
  )
}
