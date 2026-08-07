import { NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { db } from '@/lib/firebase-admin'
import { botConfig, sendTelegramMessage } from '@/lib/telegram'

function validPhone(value: string) { return /^\+?[0-9\s()-]{7,}$/.test(value) }

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer_name, phone, address, telegram_username, product_id, product_name, quantity = 1, size, color } = body
    if (!customer_name || !phone || !address || !telegram_username || !product_name) return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 })
    if (!validPhone(phone)) return NextResponse.json({ error: 'Invalid phone format' }, { status: 400 })
    const ref = await db.collection('orders').add({ customer_name, phone, address, telegram_username, product_id: product_id || null, product_name, quantity, size: size || null, color: color || null, payment_status: 'pending', order_status: 'new', createdAt: FieldValue.serverTimestamp() })
    const { admin } = botConfig('order')
    if (admin) await sendTelegramMessage('order', admin, `<b>Yangi buyurtma #${ref.id}</b>\n\n<b>Mijoz:</b> ${customer_name}\n<b>Telefon:</b> ${phone}\n<b>Manzil:</b> ${address}\n<b>Telegram:</b> ${telegram_username}\n<b>Tovar:</b> ${product_name}\n<b>Soni:</b> ${quantity}\n<b>O‘lcham:</b> ${size || '-'}\n<b>Rang:</b> ${color || '-'}`)
    return NextResponse.json({ success: true, order: { id: ref.id, product_name, customer_name, payment_status: 'pending' } }, { status: 201 })
  } catch (error) {
    console.error('[orders:post]', error)
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const status = new URL(request.url).searchParams.get('status')
    let query: FirebaseFirestore.Query = db.collection('orders').orderBy('createdAt', 'desc')
    if (status) query = query.where('order_status', '==', status)
    const snapshot = await query.get()
    return NextResponse.json({ orders: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) })
  } catch (error) {
    console.error('[orders:get]', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
