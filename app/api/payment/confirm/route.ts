import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import {
  PAYMENT_BOT_TOKEN,
  ADMIN_CHAT_ID,
  sendTelegramMessage,
} from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'orderId majburiy' }, { status: 400 })
    }

    const orderRef = doc(db, 'orders', orderId)
    const snap = await getDoc(orderRef)

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Buyurtma topilmadi' }, { status: 404 })
    }

    const orderData = snap.data()

    await updateDoc(orderRef, {
      paymentStatus: 'PAID',
      updatedAt: new Date().toISOString(),
    })

    // Notify Telegram Payment Bot
    const botToken = PAYMENT_BOT_TOKEN || process.env.PAYMENT_BOT_TOKEN || process.env.ADMIN_BOT_TOKEN || ''
    const targetChatId = ADMIN_CHAT_ID || process.env.ADMIN_CHAT_ID || ''

    if (botToken && targetChatId) {
      await sendTelegramMessage(
        botToken,
        targetChatId,
        `💳 <b>CLICK TO'LOVI MUVAFFAQIYATLI AMALGA OSHIRILDI!</b>\n\n🆔 Buyurtma: <code>#${orderData.orderNumber}</code>\n👤 Mijoz: ${orderData.customerName}\n💰 Summa: <b>${Number(orderData.totalPrice || 0).toLocaleString('uz-UZ')} so'm</b>\n\n✅ <i>Saytda buyurtma qabul qilinganligi tasdiqlandi.</i>`
      )
    }

    return NextResponse.json({ success: true, orderNumber: orderData.orderNumber })
  } catch (error) {
    console.error('Payment confirm error:', error)
    return NextResponse.json({ error: 'To\'lovni tasdiqlashda xatolik' }, { status: 500 })
  }
}
