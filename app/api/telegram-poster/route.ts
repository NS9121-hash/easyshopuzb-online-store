export const runtime = 'edge'

import { ImageResponse } from '@vercel/og'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get('title') || 'Mahsulot'
    const price = searchParams.get('price') || "0 so'm"
    const imageUrl = searchParams.get('imageUrl') || null

    const width = 1200
    const height = 1400

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#f8fafc',
            fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
          }}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="product"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 28,
                }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#e2e8f0', borderRadius: 28 }} />
            )}
          </div>

          <div
            style={{
              padding: 48,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.75) 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              borderRadius: '0 0 28px 28px',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.05 }}>{title}</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: '#FFD54F' }}>{price}</div>
          </div>
        </div>
      ),
      {
        width,
        height,
        emoji: 'fluent',
      }
    )
  } catch (err) {
    console.error('OG render error', err)
    return new Response('Failed to render', { status: 500 })
  }
}
