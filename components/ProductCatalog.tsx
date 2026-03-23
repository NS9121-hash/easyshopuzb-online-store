'use client'

import { useEffect, useState } from 'react'
import { Product, supabase } from '@/lib/supabase'
import { ProductCard } from './ProductCard'
import { Empty } from '@/components/ui/empty'

interface ProductCatalogProps {
  onBuy: (product: Product) => void
  isBlurred?: boolean
}

export function ProductCatalog({ onBuy, isBlurred = false }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setProducts((prev) => [payload.new as Product, ...prev])
        } else if (payload.eventType === 'DELETE') {
          setProducts((prev) => prev.filter((p) => p.id !== payload.old.id))
        } else if (payload.eventType === 'UPDATE') {
          setProducts((prev) =>
            prev.map((p) => (p.id === payload.new.id ? (payload.new as Product) : p))
          )
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (isLoading && !isBlurred) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-muted rounded-lg" />
            <div className="mt-3 h-4 bg-muted rounded w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0 && !isBlurred) {
    return (
      <Empty
        title="No products yet"
        description="Check back soon for our latest collection"
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onBuy={onBuy}
          isBlurred={isBlurred}
        />
      ))}
    </div>
  )
}
