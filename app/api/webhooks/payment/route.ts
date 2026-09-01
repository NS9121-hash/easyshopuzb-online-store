import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'
import {
  PAYMENT_BOT_TOKEN,
  ADMIN_CHAT_ID,
  sendTelegramMessage,
} from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const update = await request.json()
    const botToken = PAYMENT_BOT_TOKEN || process.env.PAYMENT_BOT_TOKEN || process.env.ADMIN_BOT_TOKEN || ''

    // 1️⃣ Handle Telegram Pre-Checkout Query (Click / Telegram Payment)
    if (update.pre_checkout_query) {
      const pcq = update.pre_checkout_query
      // Answer pre_checkout_query OK
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/answerPreCheckoutQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pre_checkout_query_id: pcq.id,
            ok: true,
          }),
        })
      } catch (err) {
        console.error('Error answering preCheckoutQuery:', err)
      }
      return NextResponse.json({ ok: true })
    }

    // 2️⃣ Handle Successful Payment via Telegram
    if (update.message?.successful_payment) {
      const payment = update.message.successful_payment
      const payload = payment.invoice_payload // e.g. orderId or orderNumber
      const chatId = update.message.chat.id

      // Find order and mark as PAID
      if (payload) {
        let orderRef = doc(db, 'orders', payload)
        let orderSnap = await getDoc(orderRef)

        if (!orderSnap.exists()) {
          const q = query(collection(db, 'orders'), where('orderNumber', '==', payload))
          const qSnap = await getDocs(q)
          if (!qSnap.empty) {
            orderRef = doc(db, 'orders', qSnap.docs[0].id)
            orderSnap = qSnap.docs[0]
          }
        }

        if (orderSnap.exists()) {
          const orderData = orderSnap.data()
          await updateDoc(orderRef, {
            paymentStatus: 'PAID',
            updatedAt: new Date().toISOString(),
          })

          await sendTelegramMessage(
            botToken,
            chatId,
            `🎉 <b>To'lovingiz muvaffaqiyatli qabul qilindi!</b>\n\n🆔 Buyurtma: <code>#${orderData.orderNumber}</code>\n💰 Summa: ${(payment.total_amount / 100).toLocaleString('uz-UZ')} so'm\n\n<i>EASYSHOP_UZB do'konimizdan xarid qilganingiz uchun rahmat!</i>`
          )
        }
      }
      return NextResponse.json({ ok: true })
    }

    // 3️⃣ Direct command handling (/start pay_...)
    if (update.message) {
      const msg = update.message
      const chatId = msg.chat.id
      const text = (msg.text || '').trim()

      if (text.startsWith('/start pay_')) {
        const orderId = text.replace('/start pay_', '').trim()
        const orderRef = doc(db, 'orders', orderId)
        const snap = await getDoc(orderRef)

        if (snap.exists()) {
          const order = snap.data()
          const payMsg = `
💳 <b>Click Test To'lov Botiga xush kelibsiz!</b>
━━━━━━━━━━━━━━━━━━━━
🆔 <b>Buyurtma raqami:</b> <code>#${order.orderNumber}</code>
👤 <b>Mijoz:</b> ${order.customerName}
💰 <b>To'lov summasi:</b> <b>${Number(order.totalPrice || 0).toLocaleString('uz-UZ')} so'm</b>
━━━━━━━━━━━━━━━━━━━━
<i>Sinov rejimida to'lovni tasdiqlash uchun quyidagi tugmani bosing:</i>
          `.trim()

          const replyMarkup = {
            inline_keyboard: [
              [
                { text: '✅ To\'lovni tasdiqlash (Click Test)', callback_data: `pay_confirm___${orderId}` }
              ]
            ]
          }

          await sendTelegramMessage(botToken, chatId, payMsg, replyMarkup)
        } else {
          await sendTelegramMessage(botToken, chatId, '⚠️ Buyurtma ma\'lumotlari topilmadi.')
        }
        return NextResponse.json({ ok: true })
      }

      if (text === '/start') {
        await sendTelegramMessage(
          botToken,
          chatId,
          `💳 <b>EASYSHOP_UZB To'lov Boti (Click Integratsiyasi)</b>\n\nSaytda to'lov qilish tugmasi bosilganda mijoz to'g'ridan-to'g'ri Click to'lov tizimiga yoki ushbu botga yo'naltiriladi.`
        )
      }
    }

    // 4️⃣ Handle Callback Queries
    if (update.callback_query) {
      const cb = update.callback_query
      const chatId = cb.message?.chat?.id
      const messageId = cb.message?.message_id
      const data = cb.data as string

      if (data.startsWith('pay_confirm___')) {
        const orderId = data.replace('pay_confirm___', '')
        const orderRef = doc(db, 'orders', orderId)
        const snap = await getDoc(orderRef)

        if (snap.exists()) {
          const order = snap.data()
          await updateDoc(orderRef, {
            paymentStatus: 'PAID',
            updatedAt: new Date().toISOString(),
          })

          await sendTelegramMessage(
            botToken,
            chatId,
            `✅ <b>To'lov muvaffaqiyatli qabul qilindi!</b>\n\n🆔 Buyurtma: <code>#${order.orderNumber}</code>\n\nSaytda mijoz ekranida avtomatik tarzda <i>"Buyurtmangiz muvaffaqiyatli qabul qilindi!"</i> oynasi ochildi!`
          )
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Payment Bot Error]:', error)
    return NextResponse.json({ ok: true, error: String(error) })
  }
}
