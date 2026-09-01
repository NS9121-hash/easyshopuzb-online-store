import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'
import {
  ORDER_BOT_TOKEN,
  sendTelegramMessage,
  answerCallbackQuery,
  editMessageText,
} from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const update = await request.json()
    const botToken = ORDER_BOT_TOKEN || process.env.ORDER_BOT_TOKEN || process.env.ADMIN_BOT_TOKEN || ''

    if (!botToken) {
      return NextResponse.json({ ok: true })
    }

    // 1️⃣ Inline callbacks from order message
    if (update.callback_query) {
      const cb = update.callback_query
      const chatId = cb.message?.chat?.id
      const messageId = cb.message?.message_id
      const data = cb.data as string

      await answerCallbackQuery(botToken, cb.id)

      if (data.startsWith('ord_status___')) {
        const parts = data.split('___')
        const orderId = parts[1]
        const newStatus = parts[2]

        const orderRef = doc(db, 'orders', orderId)
        const orderSnap = await getDoc(orderRef)

        if (orderSnap.exists()) {
          const prevData = orderSnap.data()
          const statusHistory = prevData.statusHistory || []
          const statusText = newStatus === 'YETKAZILMOQDA' ? 'Yo\'lda (Yetkazilmoqda)' : 'Yetkazildi'

          statusHistory.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            title: statusText,
            note: 'Order Bot orqali yangilandi',
          })

          await updateDoc(orderRef, {
            status: newStatus,
            statusHistory,
            updatedAt: new Date().toISOString(),
          })

          if (chatId) {
            await sendTelegramMessage(
              botToken,
              chatId,
              `✅ <b>Buyurtma holati yangilandi!</b>\n\n🆔 Buyurtma: <code>#${prevData.orderNumber}</code>\n📦 Yangi holat: <b>${statusText}</b>\n\n⚡️ <i>Mijoz profilida real-vaqt rejimida aks etdi.</i>`
            )
          }
        }
      }
      return NextResponse.json({ ok: true })
    }

    // 2️⃣ Text messages
    if (update.message) {
      const msg = update.message
      const chatId = msg.chat.id
      const text = (msg.text || '').trim()

      if (text === '/start' || text === '/help') {
        await sendTelegramMessage(
          botToken,
          chatId,
          `📦 <b>EASYSHOP_UZB Buyurtmalar Boti</b>\n\nSayt orqali tushgan barcha yangi buyurtmalar avtomatik tarzda ushbu botga kelib tushadi.\n\nBuyruqlar:\n• <code>/orders</code> - Oxirgi buyurtmalar ro'yxati\n• <code>/find ES-12345</code> - Buyurtmani qidirish`
        )
      } else if (text === '/orders') {
        const snap = await getDocs(collection(db, 'orders'))
        if (snap.empty) {
          await sendTelegramMessage(botToken, chatId, '📭 Hozircha buyurtmalar yo\'q.')
        } else {
          let list = `📋 <b>Oxirgi buyurtmalar:</b>\n\n`
          snap.docs.slice(0, 10).forEach(d => {
            const o = d.data()
            list += `• <b>#${o.orderNumber}</b> - ${o.customerName} (${o.customerPhone})\n  Holat: <b>${o.status}</b> | Summa: ${Number(o.totalPrice || 0).toLocaleString('uz-UZ')} so'm\n\n`
          })
          await sendTelegramMessage(botToken, chatId, list)
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Order Bot Webhook Error]:', error)
    return NextResponse.json({ ok: true, error: String(error) })
  }
}
