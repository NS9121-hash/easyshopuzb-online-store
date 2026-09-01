import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore'
import {
  LOGISTICS_BOT_TOKEN,
  sendTelegramMessage,
  answerCallbackQuery,
  editMessageText,
} from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const update = await request.json()
    const botToken = LOGISTICS_BOT_TOKEN || process.env.LOGISTICS_BOT_TOKEN || process.env.ADMIN_BOT_TOKEN || ''

    if (!botToken) {
      return NextResponse.json({ ok: true })
    }

    // 1️⃣ Handle Inline Button Status Clicks
    if (update.callback_query) {
      const cb = update.callback_query
      const chatId = cb.message?.chat?.id
      const messageId = cb.message?.message_id
      const data = cb.data as string

      await answerCallbackQuery(botToken, cb.id)

      if (data.startsWith('log_set_')) {
        const parts = data.replace('log_set_', '').split('___')
        const orderId = parts[0]
        const newStatus = parts[1] // QABUL_QILINDI | YETKAZILMOQDA | YETKAZILDI

        const orderRef = doc(db, 'orders', orderId)
        const orderSnap = await getDoc(orderRef)

        if (orderSnap.exists()) {
          const order = orderSnap.data()
          const statusHistory = order.statusHistory || []
          
          let statusLabel = 'Qabul qilindi'
          if (newStatus === 'YETKAZILMOQDA') statusLabel = '🚚 Yetkazilmoqda (Yo\'lda)'
          if (newStatus === 'YETKAZILDI') statusLabel = '✅ Yetib keldi (Yetkazildi)'

          statusHistory.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            title: statusLabel,
            note: 'Logistika boti orqali yangilandi',
          })

          await updateDoc(orderRef, {
            status: newStatus,
            statusHistory,
            updatedAt: new Date().toISOString(),
          })

          const updatedText = `
🚚 <b>Logistika holati yangilandi!</b>
━━━━━━━━━━━━━━━━━━━━
🆔 <b>Buyurtma:</b> <code>#${order.orderNumber}</code>
👤 <b>Mijoz:</b> ${order.customerName} (${order.customerPhone})
📍 <b>Manzil:</b> ${order.customerAddress || 'Kiritilmagan'}
📦 <b>Yangi holat:</b> <b>${statusLabel}</b>
⏰ <b>Vaqt:</b> ${new Date().toLocaleTimeString('uz-UZ')}
━━━━━━━━━━━━━━━━━━━━
⚡️ <i>Saytda mijoz profilida darhol (realtime) aks etdi!</i>
          `.trim()

          if (chatId && messageId) {
            await editMessageText(botToken, chatId, messageId, updatedText)
          }
        }
      }
      return NextResponse.json({ ok: true })
    }

    // 2️⃣ Handle Text Messages
    if (update.message) {
      const msg = update.message
      const chatId = msg.chat.id
      const text = (msg.text || '').trim()

      if (text === '/start' || text === '/help') {
        await sendTelegramMessage(
          botToken,
          chatId,
          `🚚 <b>EASYSHOP_UZB Logistika va Yetkazib berish Boti</b>\n\nBuyurtma holatini yangilash uchun uning <b>Buyurtma Raqami</b> yoki <b>ID</b> sini yuboring (Masalan: <code>ES-84920</code>).\n\nBot sizga holatni o'zgartirish tugmalarini chiqaradi.`
        )
        return NextResponse.json({ ok: true })
      }

      // Check if user entered order number (e.g. ES-12345 or 12345 or orderId)
      const cleanNum = text.replace(/^[#\s]+/, '').trim()
      let orderDoc: any = null
      let orderDocId = ''

      // Try search by orderNumber
      let q = query(collection(db, 'orders'), where('orderNumber', '==', cleanNum.toUpperCase()))
      let snap = await getDocs(q)

      if (snap.empty && !cleanNum.startsWith('ES-')) {
        q = query(collection(db, 'orders'), where('orderNumber', '==', `ES-${cleanNum}`))
        snap = await getDocs(q)
      }

      if (snap.empty) {
        // Try direct docId
        try {
          const directRef = doc(db, 'orders', cleanNum)
          const directSnap = await getDoc(directRef)
          if (directSnap.exists()) {
            orderDoc = directSnap.data()
            orderDocId = directSnap.id
          }
        } catch {
          // ignore
        }
      } else {
        orderDoc = snap.docs[0].data()
        orderDocId = snap.docs[0].id
      }

      if (orderDoc) {
        let currentStatusLabel = 'Qabul qilindi'
        if (orderDoc.status === 'YETKAZILMOQDA') currentStatusLabel = '🚚 Yetkazilmoqda (Yo\'lda)'
        if (orderDoc.status === 'YETKAZILDI') currentStatusLabel = '✅ Yetib keldi'

        const infoText = `
📦 <b>Buyurtma topildi:</b>
━━━━━━━━━━━━━━━━━━━━
🆔 <b>Raqami:</b> <code>#${orderDoc.orderNumber}</code>
👤 <b>Mijoz:</b> ${orderDoc.customerName}
📞 <b>Telefon:</b> <code>${orderDoc.customerPhone}</code>
📍 <b>Manzil:</b> ${orderDoc.customerAddress || 'Kiritilmagan'}
💰 <b>Summa:</b> ${Number(orderDoc.totalPrice || 0).toLocaleString('uz-UZ')} so'm
📊 <b>Hozirgi holat:</b> <b>${currentStatusLabel}</b>
━━━━━━━━━━━━━━━━━━━━
👉 <b>Yangi holatni tanlang:</b>
        `.trim()

        const replyMarkup = {
          inline_keyboard: [
            [
              { text: '⏳ Qabul qilindi', callback_data: `log_set_${orderDocId}___QABUL_QILINDI` },
              { text: '🚚 Yetkazilmoqda (Yo\'lda)', callback_data: `log_set_${orderDocId}___YETKAZILMOQDA` }
            ],
            [
              { text: '✅ Yetib keldi (Yetkazildi)', callback_data: `log_set_${orderDocId}___YETKAZILDI` }
            ]
          ]
        }

        await sendTelegramMessage(botToken, chatId, infoText, replyMarkup)
      } else {
        await sendTelegramMessage(
          botToken,
          chatId,
          `⚠️ <code>${text}</code> raqamli buyurtma topilmadi. Iltimos tekshirib qayta yuboring (Masalan: <code>ES-12345</code>).`
        )
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Logistics Bot Error]:', error)
    return NextResponse.json({ ok: true, error: String(error) })
  }
}
