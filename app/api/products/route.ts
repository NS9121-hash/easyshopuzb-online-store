import admin from 'firebase-admin'
import { NextRequest, NextResponse } from 'next/server'

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT && JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  })
}

export async function GET(request: NextRequest) {
  try {
    const db = admin.firestore()
    const snap = await db.collection('products').orderBy('created_at', 'desc').get()
    const products: any[] = []
    snap.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() })
    })

    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
