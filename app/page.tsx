'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/lib/supabase'
import { ProductCatalog } from '@/components/ProductCatalog'
import { PaymentWall } from '@/components/PaymentWall'
import { OrderForm } from '@/components/OrderForm'
import { SuccessMessage } from '@/components/SuccessMessage'

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin_user'

export default function Home() {
  const [isPaymentWallOpen, setIsPaymentWallOpen] = useState(true)
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    // Check if user has already unlocked the catalog
    const unlocked = localStorage.getItem('catalog-unlocked')
    if (unlocked === 'true') {
      setIsPaymentWallOpen(false)
      setIsUnlocked(true)
    }
  }, [])

  const handlePaymentVerified = () => {
    localStorage.setItem('catalog-unlocked', 'true')
    setIsUnlocked(true)
    setIsPaymentWallOpen(false)
  }

  const handleBuy = (product: Product) => {
    setSelectedProduct(product)
    setIsOrderFormOpen(true)
  }

  const handleOrderSuccess = () => {
    setIsOrderFormOpen(false)
    setIsSuccessOpen(true)
  }

  const handleSuccessClose = () => {
    setIsSuccessOpen(false)
    setSelectedProduct(null)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-serif font-semibold text-primary">
              EASYSHOP UZB
            </h1>
            <p className="text-sm text-muted-foreground">Premium Clothing</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border bg-secondary">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            Discover Our Collection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Elegant and stylish clothing with direct shipping worldwide. Browse our latest designs and place your order today.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative">
          <ProductCatalog
            onBuy={handleBuy}
            isBlurred={!isUnlocked}
          />
          
          {/* Blur overlay message */}
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg backdrop-blur-sm">
              <button
                onClick={() => setIsPaymentWallOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Unlock Catalog
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 EASYSHOP UZB. All rights reserved. Follow us on Telegram for updates.
          </p>
        </div>
      </footer>

      {/* Dialogs */}
      <PaymentWall
        isOpen={isPaymentWallOpen}
        onClose={() => {
          setIsPaymentWallOpen(false)
          // In production, this would be verified by the payment bot
          handlePaymentVerified()
        }}
        adminUsername={ADMIN_USERNAME}
      />

      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        product={selectedProduct}
        onSuccess={handleOrderSuccess}
      />

      <SuccessMessage
        isOpen={isSuccessOpen}
        onClose={handleSuccessClose}
      />
    </main>
  )
}
