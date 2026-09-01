import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    console.error('Products API error:', error)
    // Fallback: simple fetch without order if index not ready
    try {
      const snapshot = await getDocs(collection(db, 'products'))
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      return NextResponse.json({ products }, { status: 200 })
    } catch (err2) {
      return NextResponse.json({ products: [] }, { status: 200 })
    }
  }
}
