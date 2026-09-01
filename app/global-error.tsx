'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="uz">
      <body>
        <div style={{ padding: '20px', textAlign: 'center', color: '#fff', backgroundColor: '#070b14', minHeight: '100vh' }}>
          <h2>Xatolik yuz berdi</h2>
          <button onClick={() => reset()} style={{ marginTop: '10px', padding: '8px 16px', background: '#ffb703', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Qayta urinish
          </button>
        </div>
      </body>
    </html>
  )
}
