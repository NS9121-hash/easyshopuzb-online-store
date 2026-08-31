'use client'

import { useEffect, useState } from 'react'
import { Product, supabase } from '@/lib/supabase'
import { ProductCard } from './ProductCard'

interface ProductCatalogProps {
  onBuy: (product: Product) => void
  isBlurred?: boolean
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    price: 45.00,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-2',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    price: 89.99,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-3',
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
    price: 120.00,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-4',
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    price: 25.50,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-5',
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
    price: 55.00,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-6',
    image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    price: 65.00,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-7',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    price: 140.00,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-8',
    image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    price: 110.00,
    created_at: new Date().toISOString()
  }
]

export function ProductCatalog({ onBuy, isBlurred = false }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.warn('Supabase fetch notice:', error.message)
          return
        }
        if (data && data.length > 0) {
          setProducts(data)
        }
      } catch (error) {
        console.warn('Notice fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()

    // Subscribe to real-time updates
    try {
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
    } catch (e) {
      console.warn('Realtime subscription error:', e)
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
