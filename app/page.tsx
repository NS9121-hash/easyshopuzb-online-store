'use client'

import { useState } from 'react'
import { ProductCatalog } from '@/components/ProductCatalog'
import { OrderForm } from '@/components/OrderForm'

const TELEGRAM_USERNAME = 'samariddin_ai' 

export default function Home() {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  return (
    <main className="min-h-screen bg-[#000] text-white overflow-x-hidden">
      {/* Liquid Glass effekti uchun orqa fondagi rangli sharlar */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative z-10">
        {/* Header - Glassmorphism */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-[20px] -webkit-backdrop-blur-[20px]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
              EASYSHOP<span className="text-blue-500">UZB</span>
            </h1>
            <div className="bg-white/10 px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold">
              ONLINE STORE
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-20 text-center">
          <h2 className="text-6xl font-extrabold tracking-tighter mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic">
            PREMIUM STYLE.
          </h2>
          <p className="text-white/60 text-sm tracking-widest uppercase mb-8">Eksklyuziv to'plamlar faqat siz uchun</p>
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-2xl text-green-400 text-xs font-bold">
            <span>✅</span> 7-15 kunda yetkazib beriladi
          </div>
        </section>

        {/* Catalog Container - Shishali quti */}
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="bg-white/[0.03] border border-white/10 backdrop-blur-[30px] rounded-[40px] p-8 shadow-2xl">
            <ProductCatalog
              onBuy={(p: any) => { setSelectedProduct(p); setIsOrderFormOpen(true); }}
              isBlurred={false}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t border-white/5 text-center">
          <div className="flex justify-center gap-8 mb-4">
            <a href={`https://t.me/${TELEGRAM_USERNAME}`} className="text-xs text-white/40 hover:text-white">Telegram</a>
            <a href="#" className="text-xs text-white/40 hover:text-white">Instagram</a>
          </div>
          <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">© 2026 EasyShop Uzb</p>
        </footer>
      </div>

      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        product={selectedProduct}
        onSuccess={() => setIsOrderFormOpen(false)}
        telegramUsername={TELEGRAM_USERNAME}
      />
    </main>
  )
 // Buni <main> tegidan keyin darrov qo'shing
<div className="fixed inset-0 z-0 overflow-hidden">
  {/* Harakatlanuvchi rangli sharlar */}
  <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-[pulse_8s_infinite]"></div>
  <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] animate-[pulse_10s_infinite]"></div>
  <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[80px] animate-bounce" style={{ animationDuration: '15s' }}></div>
</div>
 
}
