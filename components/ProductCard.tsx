'use client'

import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
  onBuy: (product: Product) => void
  isBlurred?: boolean
}

export function ProductCard({ product, onBuy, isBlurred = false }: ProductCardProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className={`relative aspect-square rounded-lg overflow-hidden bg-secondary ${isBlurred ? 'blur-lg' : ''}`}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt="Product"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <span className="text-lg font-semibold text-foreground">
            {product.price ? `$${product.price.toFixed(2)}` : 'Price TBA'}
          </span>
        </div>
        {!isBlurred && (
          <Button
            onClick={() => onBuy(product)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-11"
          >
            Buy Now
          </Button>
        )}
      </div>
    </div>
  )
}
