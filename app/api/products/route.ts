import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get()
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json({ products })
  } catch (error) {
    console.error('[products]', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const { id, type } = await request.json()
  if (!id || !['clothing', 'look'].includes(type)) return NextResponse.json({ error: 'Invalid product update' }, { status: 400 })
  await db.collection('products').doc(id).update({ type, updatedAt: new Date() })
  return NextResponse.json({ success: true })
}
