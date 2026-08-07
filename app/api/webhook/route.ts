import { NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { db, bucket } from '@/lib/firebase-admin'
import { botConfig, sendTelegramMessage, telegram } from '@/lib/telegram'

export async function POST(request: Request) {
  try {
    const update = await request.json()
    const message = update.message
    const callback = update.callback_query
    if (callback) {
      const [action, id] = String(callback.data || '').split(':')
      if (['clothing', 'look'].includes(action) && id) await db.collection('products').doc(id).update({ type: action, updatedAt: FieldValue.serverTimestamp() })
      await telegram('catalog', 'answerCallbackQuery', { callback_query_id: callback.id })
      await telegram('catalog', 'editMessageReplyMarkup', { chat_id: callback.message.chat.id, message_id: callback.message.message_id, reply_markup: { inline_keyboard: [] } })
      return NextResponse.json({ ok: true })
    }
    if (!message?.photo) return NextResponse.json({ ok: true })
    const { token } = botConfig('catalog')
    const file = await telegram('catalog', 'getFile', { file_id: message.photo.at(-1).file_id })
    const imageResponse = await fetch(`https://api.telegram.org/file/bot${token}/${file.result.file_path}`)
    const buffer = Buffer.from(await imageResponse.arrayBuffer())
    const parts = String(message.caption || '').split('|').map((item) => item.trim())
    const name = parts[0] || 'Yangi mahsulot'
    const doc = await db.collection('products').add({ name, price: Number(parts[1]?.replace(/\s/g, '')) || 0, sizes: parts[2] || 'Standart', colors: parts[3] || '', type: 'pending', createdAt: FieldValue.serverTimestamp() })
    const fileName = `products/${doc.id}.jpg`
    const fileRef = bucket.file(fileName)
    await fileRef.save(buffer, { metadata: { contentType: 'image/jpeg' } })
    await fileRef.makePublic()
    const image_url = `https://storage.googleapis.com/${bucket.name}/${fileName}`
    await doc.update({ image_url })
    await sendTelegramMessage('catalog', message.chat.id, `<b>${name}</b> saqlandi. Qaysi bo‘limga qo‘shilsin?`, { inline_keyboard: [[{ text: 'KIYIMLAR', callback_data: `clothing:${doc.id}` }, { text: 'LOOK', callback_data: `look:${doc.id}` }]] })
    return NextResponse.json({ ok: true })
  } catch (error) { console.error('[catalog-webhook]', error); return NextResponse.json({ ok: true }) }
}
