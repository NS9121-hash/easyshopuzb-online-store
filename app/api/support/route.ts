import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import {
  SUPPORT_BOT_TOKEN,
  ADMIN_CHAT_ID,
  sendTelegramMessage,
} from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const { userId, userName, userPhone, text } = await request.json()

    if (!userId || !text) {
      return NextResponse.json({ error: 'UserId va matn kiritilishi shart' }, { status: 400 })
    }

    const nowIso = new Date().toISOString()

    // 1️⃣ Save to Firestore
    const docRef = await addDoc(collection(db, 'support_messages'), {
      userId,
      userName: userName || 'Mijoz',
      userPhone: userPhone || 'Kiritilmagan',
      sender: 'USER',
      text,
      createdAt: nowIso,
    })

    // 2️⃣ Forward to Telegram Support Bot
    const botToken = SUPPORT_BOT_TOKEN || process.env.SUPPORT_BOT_TOKEN || process.env.ADMIN_BOT_TOKEN || ''
    const targetChatId = ADMIN_CHAT_ID || process.env.ADMIN_CHAT_ID || ''

    if (botToken && targetChatId) {
      const msgText = `
💬 <b>YANGI SAVOL / MUROJAAT</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz:</b> ${userName || 'Noma\'lum'}
📞 <b>Telefon:</b> <code>${userPhone || 'Mavjud emas'}</code>
🆔 <b>Mijoz ID:</b> <code>${userId}</code>
━━━━━━━━━━━━━━━━━━━━
📝 <b>Savol:</b>
${text}
━━━━━━━━━━━━━━━━━━━━
👉 <i>Ushbu xabarga <b>REPLY (Javob berish)</b> qilib yozsangiz, javobingiz avtomatik tarzda mijozning saytdagi chatiga yetib boradi!</i>
      `.trim()

      await sendTelegramMessage(botToken, targetChatId, msgText)
    }

    return NextResponse.json({ success: true, messageId: docRef.id })
  } catch (error) {
    console.error('[Support API Error]:', error)
    return NextResponse.json({ error: 'Xabarni yuborishda xatolik' }, { status: 500 })
  }
}
