'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/lib/supabase'
import { ProductCatalog } from '@/components/ProductCatalog'
import { OrderForm } from '@/components/OrderForm'
import { SuccessMessage } from '@/components/SuccessMessage'

// Telegram username'ni shu yerga yozing (@ belgisiz)
const TELEGRAM_USERNAME = 'samariddin_ai' 

export default function Home() {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleBuy = (product: Product) => {
    setSelectedProduct(product)
    setIsOrderFormOpen(true)
  }

  const handleOrderSuccess = () => {
    setIsOrderFormOpen(false)
    setIsSuccessOpen(true)
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#1a1a1a]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tighter text-black">
            EASYSHOP <span className="text-green-600">UZB</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Online Store</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-black mb-6 tracking-tight">
          Eksklyuziv To'plamlar
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto text-lg leading-relaxed">
          Premium sifatdagi kiyimlar. Dunyo bo'ylab yetkazib berish xizmati bilan.
        </p>
        <div className="mt-8 inline-block bg-black text-white px-6 py-2 rounded-full text-sm font-medium">
          ✅ 7-15 kunda yetkazib beriladi
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-y-10">
          <ProductCatalog
            onBuy={handleBuy}
            isBlurred={false}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-sm text-gray-500">
            © 2026 EASYSHOP UZB. Barcha huquqlar himoyalangan.
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <a href={`https://t.me/${TELEGRAM_USERNAME}`} className="text-gray-400 hover:text-black transition-colors">Telegram</a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors">Instagram</a>
          </div>
        </div>
      </footer>

      {/* Order Dialog - Bu yerda 50% to'lov haqida yoziladi */}
      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        product={selectedProduct}
        onSuccess={handleOrderSuccess}
        telegramUsername={TELEGRAM_USERNAME}
      />

      <SuccessMessage
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
      />
    </main>
  )
}
