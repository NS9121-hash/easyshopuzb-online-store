'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type Props = {
  product: any
  onOpen?: () => void
  onAddToCart?: () => void
}

export default function ProductCard({ product, onOpen, onAddToCart }: Props) {
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      setLiked(favorites.includes(product.id))
    } catch (e) {
      setLiked(false)
    }
  }, [product.id])

  function toggleLike(e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      const next = favorites.includes(product.id) ? favorites.filter((f: string) => f !== product.id) : [...favorites, product.id]
      localStorage.setItem('favorites', JSON.stringify(next))
      setLiked(!liked)
    } catch (err) {
      console.error(err)
    }
  }

  const firstImage = product.poster_url || product.image_url?.split(',')[0] || '/placeholder.png'
  const isNew = product.created_at ? (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24) <= 3 : false
  const formattedPrice = (typeof product.price === 'number' ? product.price : Number(product.price || 0)).toLocaleString('ru-RU') + " so'm"

  return (
    <div onClick={onOpen} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 6px 18px rgba(2,6,23,0.2)', transform: 'translateZ(0)', transition: 'transform 0.18s ease', cursor: 'pointer' }}>
      <div style={{ padding: 10 }}>
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#f3f4f6' }}>
          <div style={{ position: 'absolute', left: 12, top: 12, zIndex: 10 }}>
            {isNew && (
              <div style={{ background: '#FEF9C3', color: '#111827', padding: '6px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                Yangi
              </div>
            )}
          </div>

          <button onClick={toggleLike} style={{ position: 'absolute', right: 12, top: 12, zIndex: 10, background: 'white', borderRadius: 999, padding: 8, border: 'none' }} aria-label="favorite">
            <span style={{ color: liked ? '#ef4444' : '#374151', fontSize: 16 }}>{liked ? '♥' : '♡'}</span>
          </button>

          <div style={{ width: '100%', aspectRatio: '4/5', position: 'relative' }}>
            <Image src={firstImage} alt={product.name || product.title || 'Product'} fill style={{ objectFit: 'cover' }} />
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{formattedPrice}</div>
          <div style={{ fontSize: 14, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name || product.title}</div>
        </div>
      </div>

      <div style={{ padding: 10 }}>
        <button onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart() }} style={{ width: '100%', background: '#5B2EFF', color: 'white', padding: '10px 12px', borderRadius: 12, border: 'none', fontWeight: 700 }}>
          Savatga
        </button>
      </div>
    </div>
  )
}
