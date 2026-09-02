import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, doc, setDoc } from 'firebase/firestore'
import {
  SUPPORT_BOT_TOKEN,
  ADMIN_BOT_TOKEN,
  sendTelegramMessage,
} from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const update = await request.json()
    const botToken = SUPPORT_BOT_TOKEN || process.env.SUPPORT_BOT_TOKEN || ADMIN_BOT_TOKEN || process.env.ADMIN_BOT_TOKEN || ''

    if (!botToken) {
      return NextResponse.json({ ok: true })
    }

    if (update.message) {
      const msg = update.message
      const chatId = msg.chat.id
      const text = (msg.text || '').trim()

      // Save this chat as an active support operator in Firestore
      try {
        await setDoc(doc(db, 'support_chats', String(chatId)), {
          chatId: String(chatId),
          firstName: msg.from?.first_name || '',
          username: msg.from?.username || '',
          lastActive: new Date().toISOString(),
        }, { merge: true })
      } catch (e) {
        console.error('[Support Chat Register Error]:', e)
      }

      // 🔹 Check if this is an Admin replying to a customer message
      if (msg.reply_to_message && text) {
        const repliedText = msg.reply_to_message.text || msg.reply_to_message.caption || ''
        
        // Extract Mijoz ID: <code>user_...</code> or Mijoz ID: user_...
        const idMatch = repliedText.match(/Mijoz ID:\s*([a-zA-Z0-9_-]+)/i) || repliedText.match(/<code>([a-zA-Z0-9_-]+)<\/code>/i)
        
        if (idMatch && idMatch[1]) {
          const userId = idMatch[1].trim()

          // Save Admin reply to Firestore
          await addDoc(collection(db, 'support_messages'), {
            userId,
            sender: 'ADMIN',
            text,
            createdAt: new Date().toISOString(),
          })

          await sendTelegramMessage(
            botToken,
            chatId,
            `✅ <b>Javobingiz mijozga yetkazildi!</b>\n\n🆔 Mijoz ID: <code>${userId}</code>\n💬 Javob: <i>"${text}"</i>`,
            undefined,
            msg.message_id
          )
          return NextResponse.json({ ok: true })
        }
      }

      if (text === '/start' || text === '/help') {
        await sendTelegramMessage(
          botToken,
          chatId,
          `💬 <b>EASYSHOP_UZB Qo'llab-quvvatlash (Support) Boti faol!</b>\n\n✅ Sizning ID (${chatId}) qo'llab-quvvatlash xizmati operatori sifatida biriktirildi.\n\nSayt foydalanuvchilaridan kelgan barcha savollar ushbu botga keladi.\n\nMijozga javob berish uchun uning savoliga <b>REPLY (Javob berish)</b> qilib javobingizni yozing.`
        )
        return NextResponse.json({ ok: true })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Support Bot Webhook Error]:', error)
    return NextResponse.json({ ok: true, error: String(error) })
  }
}

