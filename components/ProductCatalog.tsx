'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/lib/types'
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
    fetch('/api/products')
      .then((response) => response.json())
      .then((payload) => setProducts(payload.products || []))
      .catch((error) => console.error('Error fetching products:', error))
      .finally(() => setIsLoading(false))
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
      <Empty>
        <p className="text-lg font-medium">No products yet</p>
        <p className="text-sm text-muted-foreground">Check back soon for our latest collection</p>
      </Empty>
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
