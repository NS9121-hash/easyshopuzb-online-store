import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  query,
  where,
  getDoc,
  setDoc
} from 'firebase/firestore'
import {
  ADMIN_BOT_TOKEN,
  sendTelegramMessage,
  sendTelegramPhoto,
  answerCallbackQuery,
  editMessageText,
  getTelegramFileUrl,
} from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const update = await request.json()
    const botToken = ADMIN_BOT_TOKEN || process.env.ADMIN_BOT_TOKEN || ''

    if (!botToken) {
      console.warn('[Admin Bot] ADMIN_BOT_TOKEN is not configured')
      return NextResponse.json({ ok: true, message: 'Bot token not set' })
    }

    // 1️⃣ Handle Callback Queries (Button Clicks for Kiyimlar vs Look)
    if (update.callback_query) {
      const cb = update.callback_query
      const chatId = cb.message?.chat?.id
      const messageId = cb.message?.message_id
      const data = cb.data as string

      await answerCallbackQuery(botToken, cb.id)

      if (data.startsWith('save_prod_')) {
        const parts = data.split('___')
        const actionType = parts[0] // e.g. save_prod_clothing or save_prod_look
        const tempId = parts[1]

        const isLook = actionType.includes('look')
        const type = isLook ? 'look' : 'clothing'
        const defaultCategory = isLook ? 'Look' : 'Kiyimlar'

        // Retrieve temp session from Firestore
        let prodData: any = null
        if (tempId) {
          const sessionRef = doc(db, 'bot_sessions', tempId)
          const sessionSnap = await getDoc(sessionRef)
          if (sessionSnap.exists()) {
            prodData = sessionSnap.data()
            // clean up session
            await deleteDoc(sessionRef)
          }
        }

        if (prodData) {
          const newDoc = {
            name: prodData.name || (isLook ? 'EASYSHOP Yangi Look' : 'EASYSHOP Kiyim'),
            category: prodData.category || defaultCategory,
            type: type,
            price: Number(prodData.price) || 250000,
            image: prodData.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
            images: prodData.image ? [prodData.image] : [],
            sizes: prodData.sizes && prodData.sizes.length > 0 ? prodData.sizes : (isLook ? ['M', 'L', 'XL'] : ['S', 'M', 'L', 'XL']),
            description: prodData.description || '',
            telegramMessageId: String(messageId || ''),
            telegramChatId: String(chatId || ''),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          const docRef = await addDoc(collection(db, 'products'), newDoc)

          const confirmText = `
✅ <b>Mahsulot muvaffaqiyatli saqlandi!</b>

📌 <b>Nomi:</b> ${newDoc.name}
📂 <b>Bo'lim:</b> ${isLook ? '✨ Look' : '👕 Kiyimlar'} (${newDoc.category})
💰 <b>Narxi:</b> ${newDoc.price.toLocaleString('uz-UZ')} so'm
📏 <b>Razmerlar:</b> ${newDoc.sizes.join(', ')}
🆔 <b>ID:</b> <code>${docRef.id}</code>

⚡️ <i>Mahsulot saytning pastki menyusidagi <b>${isLook ? '✨ LOOK' : '👕 KIYIMLAR'}</b> bo'limiga darhol (realtime) qo'shildi!</i>
🗑 <i>O'chirish uchun ushbu xabarga reply qilib <code>/del</code> yuboring.</i>
          `.trim()

          if (chatId && messageId) {
            await editMessageText(botToken, chatId, messageId, confirmText)
          }
        } else {
          if (chatId) {
            await sendTelegramMessage(botToken, chatId, '⚠️ Mahsulot ma\'lumotlari topilmadi yoki eskirgan. Iltimos qaytadan yuboring.')
          }
        }
      }

      return NextResponse.json({ ok: true })
    }

    // 2️⃣ Handle Messages
    if (update.message) {
      const msg = update.message
      const chatId = msg.chat.id
      const text = (msg.text || msg.caption || '').trim()
      const messageId = msg.message_id

      // 🔹 Check for /del command (Reply or direct /del <id>)
      if (text.startsWith('/del') || text === 'o\'chirish' || text === "O'chirish") {
        let targetId = ''

        // Check if replied to a bot message
        if (msg.reply_to_message) {
          const replyText = msg.reply_to_message.text || msg.reply_to_message.caption || ''
          // Try extract ID: <code>...</code> or ID: ...
          const idMatch = replyText.match(/ID:\s*([a-zA-Z0-9_-]+)/i) || replyText.match(/<code>([a-zA-Z0-9_-]+)<\/code>/i)
          if (idMatch && idMatch[1]) {
            targetId = idMatch[1].trim()
          } else {
            // Lookup by telegramMessageId
            const q = query(
              collection(db, 'products'),
              where('telegramMessageId', '==', String(msg.reply_to_message.message_id))
            )
            const snap = await getDocs(q)
            if (!snap.empty) {
              targetId = snap.docs[0].id
            }
          }
        }

        // Direct /del <id>
        if (!targetId && text.includes(' ')) {
          targetId = text.split(' ')[1].trim()
        }

        if (targetId) {
          const prodRef = doc(db, 'products', targetId)
          const prodSnap = await getDoc(prodRef)
          if (prodSnap.exists()) {
            const data = prodSnap.data()
            await deleteDoc(prodRef)
            await sendTelegramMessage(
              botToken,
              chatId,
              `🗑 <b>Mahsulot saytdan va bazadan o'chirildi!</b>\n\n📌 <b>Nomi:</b> ${data.name || 'Noma\'lum'}\n🆔 <b>ID:</b> <code>${targetId}</code>\n\n⚡️ <i>Saytdan realtime o'chirildi.</i>`,
              undefined,
              messageId
            )
          } else {
            await sendTelegramMessage(botToken, chatId, `⚠️ <code>${targetId}</code> ID ga ega mahsulot topilmadi.`, undefined, messageId)
          }
        } else {
          await sendTelegramMessage(
            botToken,
            chatId,
            `ℹ️ <b>Mahsulotni o'chirish uchun:</b>\n1) Mahsulot e'loniga reply qilib <code>/del</code> yozing\n2) Yoki <code>/del MAHSULOT_ID</code> ko'rinishida yuboring.`,
            undefined,
            messageId
          )
        }
        return NextResponse.json({ ok: true })
      }

      // 🔹 Check /start or /help
      if (text === '/start' || text === '/help') {
        const welcome = `
🛍 <b>EASYSHOP_UZB Catalog & Admin Botiga xush kelibsiz!</b>

Ushbu bot orqali saytga mahsulotlar (Kiyimlar yoki Look) yuklaysiz va boshqarasiz.

<b>Qanday mahsulot qo'shiladi?</b>
📸 Kiyim rasmini yuboring va izohiga quyidagicha yozing:
<code>Nomi: Klassik Qora Kostyum
Narxi: 450000
Razmer: M, L, XL
Kategoriya: Kostyum</code>

Bot sizdan <b>👕 Kiyimlar</b> yoki <b>✨ Look</b> bo'limini tanlashni so'raydi. Tanlashingiz bilan mahsulot <b>darhol (realtime)</b> saytda paydo bo'ladi!

<b>Buyruqlar:</b>
• <code>/list</code> - Mavjud mahsulotlar ro'yxati
• <code>/del &lt;ID&gt;</code> - Mahsulotni o'chirish (yoki rasmiga reply qilib <code>/del</code> yuborish)
        `.trim()

        await sendTelegramMessage(botToken, chatId, welcome)
        return NextResponse.json({ ok: true })
      }

      // 🔹 Check /list
      if (text === '/list') {
        const snap = await getDocs(collection(db, 'products'))
        if (snap.empty) {
          await sendTelegramMessage(botToken, chatId, '📭 Hozircha saytda mahsulotlar mavjud emas.')
        } else {
          let listText = `📦 <b>Mavjud mahsulotlar (${snap.size} ta):</b>\n\n`
          snap.docs.forEach((docSnap, idx) => {
            const p = docSnap.data()
            listText += `${idx + 1}. <b>${p.name}</b> (${p.type === 'look' ? '✨ Look' : '👕 Kiyim'})\n`
            listText += `   💰 ${Number(p.price || 0).toLocaleString('uz-UZ')} so'm | 🆔 <code>${docSnap.id}</code>\n\n`
          })
          listText += `<i>O'chirish uchun: <code>/del ID</code></i>`
          await sendTelegramMessage(botToken, chatId, listText)
        }
        return NextResponse.json({ ok: true })
      }

      // 🔹 Handle Photo Upload (Product creation flow)
      if (msg.photo && msg.photo.length > 0) {
        const photo = msg.photo[msg.photo.length - 1] // highest resolution
        const fileUrl = await getTelegramFileUrl(botToken, photo.file_id)

        // Parse Caption
        const caption = msg.caption || ''
        let name = ''
        let price = 0
        let category = 'Kiyimlar'
        let sizes: string[] = ['S', 'M', 'L', 'XL']

        // Simple line parser
        const lines = caption.split('\n')
        for (const line of lines) {
          const lower = line.toLowerCase()
          if (lower.startsWith('nomi:') || lower.startsWith('name:') || lower.startsWith('nom:')) {
            name = line.split(':')[1]?.trim() || ''
          } else if (lower.startsWith('narxi:') || lower.startsWith('narx:') || lower.startsWith('price:')) {
            const rawPrice = line.split(':')[1]?.replace(/[^\d]/g, '') || ''
            price = parseInt(rawPrice, 10) || 0
          } else if (lower.startsWith('razmer:') || lower.startsWith('o\'lcham:') || lower.startsWith('size:')) {
            sizes = line.split(':')[1]?.split(',').map(s => s.trim()).filter(Boolean) || []
          } else if (lower.startsWith('kategoriya:') || lower.startsWith('kat:') || lower.startsWith('tur:')) {
            category = line.split(':')[1]?.trim() || category
          }
        }

        // If not parsed by prefix, use first line as name, numbers as price
        if (!name && lines.length > 0 && lines[0].trim()) {
          name = lines[0].trim()
        }
        if (!name) {
          name = 'EASYSHOP Yangi Mahsulot'
        }
        if (!price && lines.length > 1) {
          const numMatch = caption.match(/(\d[\d\s.,]{3,}\d|\d{4,})/)
          if (numMatch) {
            price = parseInt(numMatch[1].replace(/[^\d]/g, ''), 10) || 200000
          }
        }
        if (!price) {
          price = 250000
        }

        // Save temporary session in Firestore
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
        await setDoc(doc(db, 'bot_sessions', tempId), {
          name,
          price,
          category,
          sizes,
          image: fileUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
          createdAt: new Date().toISOString(),
        })

        const promptText = `
🆕 <b>Yangi mahsulot ma'lumotlari qabul qilindi:</b>

📌 <b>Nomi:</b> ${name}
💰 <b>Narxi:</b> ${price.toLocaleString('uz-UZ')} so'm
📏 <b>Razmerlar:</b> ${sizes.join(', ')}
📂 <b>Kategoriya:</b> ${category}

👉 <b>Qaysi bo'limga joylashtirilsin?</b>
        `.trim()

        const replyMarkup = {
          inline_keyboard: [
            [
              { text: '👕 Kiyimlar', callback_data: `save_prod_clothing___${tempId}` },
              { text: '✨ Look', callback_data: `save_prod_look___${tempId}` }
            ]
          ]
        }

        await sendTelegramMessage(botToken, chatId, promptText, replyMarkup, messageId)
        return NextResponse.json({ ok: true })
      }

      // If text only without photo
      if (text) {
        await sendTelegramMessage(
          botToken,
          chatId,
          `💡 Mahsulot qo'shish uchun rasmini yuboring va izohiga nomi, narxi hamda razmerlarini yozing.\n\nYordam uchun: /help`
        )
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Admin Bot Webhook Error]:', error)
    return NextResponse.json({ ok: true, error: String(error) })
  }
}
