'use client'

export default function SkeletonCard() {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', background: '#0f172a', padding: 12, boxShadow: '0 6px 18px rgba(2,6,23,0.2)' }}>
      <div style={{ width: '100%', aspectRatio: '4/5', background: '#111827', borderRadius: 12 }} />
      <div style={{ height: 12, background: '#111827', marginTop: 10, borderRadius: 6 }} />
      <div style={{ height: 10, background: '#0b1220', marginTop: 8, borderRadius: 6 }} />
      <div style={{ height: 36, background: '#0b1220', marginTop: 12, borderRadius: 10 }} />
    </div>
  )
}
