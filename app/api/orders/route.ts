import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import {
  ORDER_BOT_TOKEN,
  ADMIN_CHAT_ID,
  sendTelegramMessage,
  sendTelegramPhoto,
} from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerPhone,
      customerAddress,
      telegramUsername,
      userId,
      items,
      totalPrice,
      paymentMethod,
    } = body

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Ism, telefon va kamida 1 ta mahsulot majburiy' },
        { status: 400 }
      )
    }

    const orderNumber = `ES-${Math.floor(10000 + Math.random() * 90000)}`
    const nowIso = new Date().toISOString()

    const orderDocData = {
      orderNumber,
      customerName,
      customerPhone,
      customerAddress: customerAddress || 'Manzil ko\'rsatilmagan',
      telegramUsername: (telegramUsername || '').replace(/^@/, ''),
      userId: userId || `user_${Date.now()}`,
      items: items.map((it: any) => ({
        productId: it.id || it.productId || '',
        name: it.name || 'Mahsulot',
        price: Number(it.price) || 0,
        quantity: Number(it.quantity) || 1,
        size: it.size || it.selectedSize || 'Standard',
        category: it.category || 'Kiyim',
        image: it.image || '',
      })),
      totalPrice: Number(totalPrice) || 0,
      paymentMethod: paymentMethod || 'CLICK',
      paymentStatus: 'PENDING',
      status: 'QABUL_QILINDI',
      statusHistory: [
        {
          status: 'QABUL_QILINDI',
          timestamp: nowIso,
          title: 'Buyurtma qabul qilindi',
          note: 'Mijoz buyurtmani rasmiylashtirdi',
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
    }

    const docRef = await addDoc(collection(db, 'orders'), orderDocData)

    // Send Telegram Notification to Order Bot & Admin
    const botToken = ORDER_BOT_TOKEN || process.env.ORDER_BOT_TOKEN || process.env.ADMIN_BOT_TOKEN || ''
    const targetChatId = ADMIN_CHAT_ID || process.env.ADMIN_CHAT_ID || ''

    if (botToken && targetChatId) {
      const itemsListText = orderDocData.items
        .map(
          (it, i) =>
            `${i + 1}. <b>${it.name}</b> (${it.size}) × ${it.quantity} ta - ${(
              it.price * it.quantity
            ).toLocaleString('uz-UZ')} so'm`
        )
        .join('\n')

      const orderCaption = `
🛍 <b>YANGI BUYURTMA QABUL QILINDI!</b>
━━━━━━━━━━━━━━━━━━━━
🆔 <b>Buyurtma raqami:</b> <code>#${orderNumber}</code>
👤 <b>Mijoz:</b> ${customerName}
📞 <b>Telefon:</b> <code>${customerPhone}</code>
📍 <b>Manzil:</b> ${orderDocData.customerAddress}
✈️ <b>Telegram:</b> ${orderDocData.telegramUsername ? `@${orderDocData.telegramUsername}` : 'Mavjud emas'}
💳 <b>To'lov turi:</b> ${paymentMethod || 'Click'} (${orderDocData.paymentStatus})
━━━━━━━━━━━━━━━━━━━━
📦 <b>Mahsulotlar:</b>
${itemsListText}
━━━━━━━━━━━━━━━━━━━━
💰 <b>Jami summa:</b> <b>${orderDocData.totalPrice.toLocaleString('uz-UZ')} so'm</b>
      `.trim()

      const inlineButtons = {
        inline_keyboard: [
          [
            { text: '🚚 Yo\'lga chiqarildi', callback_data: `ord_status___${docRef.id}___YETKAZILMOQDA` },
            { text: '✅ Yetkazildi', callback_data: `ord_status___${docRef.id}___YETKAZILDI` }
          ]
        ]
      }

      // If first item has an image, send as photo with caption
      const firstImage = orderDocData.items.find(i => i.image)?.image
      if (firstImage) {
        await sendTelegramPhoto(botToken, targetChatId, firstImage, orderCaption, inlineButtons)
      } else {
        await sendTelegramMessage(botToken, targetChatId, orderCaption, inlineButtons)
      }
    }

    return NextResponse.json({
      success: true,
      orderId: docRef.id,
      orderNumber,
      order: { id: docRef.id, ...orderDocData },
    })
  } catch (error) {
    console.error('[Orders API Error]:', error)
    return NextResponse.json(
      { error: 'Buyurtmani saqlashda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
