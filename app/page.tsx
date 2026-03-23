'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/lib/supabase'
import { ProductCatalog } from '@/components/ProductCatalog'
import { OrderForm } from '@/components/OrderForm'
import { SuccessMessage } from '@/components/SuccessMessage'

const TELEGRAM_USERNAME = 'samariddin_ai' 

export default function Home() {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      {/* Orqa fon uchun animatsion doiralar (Apple style) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[50%] bg-purple-600/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Header - Glassmorphism */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tighter italic">
            EASYSHOP<span className="text-blue-500">.UZB</span>
          </h1>
          <a 
            href={`https://t.me/${TELEGRAM_USERNAME}`}
            className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium backdrop-blur-md hover:bg-white hover:text-black transition-all"
          >
            ADMIN
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold">
          Premium Collection 2026
        </div>
        <h2 className="text-5xl sm:text-7xl font-bold mb-8 tracking-tight bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          Kelajak kiyimlari.
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          Sifat va innovatsiya uyg'unligi. Har bir detalda mukammallik.
        </p>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl">
          <ProductCatalog
            onBuy={(p) => { setSelectedProduct(p); setIsOrderFormOpen(true); }}
            isBlurred={false}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-white/5 mt-20">
        <p className="text-gray-600 text-sm font-light">
          © 2026 EASYSHOP UZB. Designed for perfection.
        </p>
      </footer>

      {/* Dialogs */}
      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        product={selectedProduct}
        onSuccess={() => { setIsOrderFormOpen(false); setIsSuccessOpen(true); }}
        telegramUsername={TELEGRAM_USERNAME}
      />

      <SuccessMessage isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
    </main>
  )
}
