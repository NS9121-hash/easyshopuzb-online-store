import { NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { db, bucket } from '@/lib/firebase-admin'
import { botConfig, sendTelegramMessage, telegram } from '@/lib/telegram'

async function analyzeReceipt(imageUrl: string) {
  const key = process.env.AI_GATEWAY_API_KEY
  if (!key) return { verdict: 'manual_review', reason: 'AI Gateway kaliti sozlanmagan' }
  const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
    method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'google/gemini-3.5-flash', messages: [{ role: 'user', content: [{ type: 'text', text: 'Bu to‘lov cheki. Rasmni tahlil qiling. JSON formatida faqat verdict (likely_valid yoki suspicious), amount, transaction_time va reason qaytaring. Haqiqiyligini yakuniy tasdiqlamang, faqat admin uchun tavsiya bering.' }, { type: 'image_url', image_url: { url: imageUrl } }] }], response_format: { type: 'json_object' } }),
  })
  if (!response.ok) return { verdict: 'manual_review', reason: 'AI tahlili muvaffaqiyatsiz' }
  const data = await response.json()
  try { return JSON.parse(data.choices?.[0]?.message?.content || '{}') } catch { return { verdict: 'manual_review', reason: 'AI javobi o‘qilmadi' } }
}

export async function POST(request: Request) {
  try {
    const update = await request.json()
    const callback = update.callback_query
    if (callback) {
      const [action, paymentId] = String(callback.data || '').split(':')
      if (['approve', 'reject'].includes(action) && paymentId) {
        await db.collection('payments').doc(paymentId).update({ status: action === 'approve' ? 'approved' : 'rejected', reviewedBy: callback.from.id, reviewedAt: FieldValue.serverTimestamp() })
        await telegram('payment', 'answerCallbackQuery', { callback_query_id: callback.id, text: action === 'approve' ? 'To‘lov tasdiqlandi' : 'To‘lov rad etildi' })
        await telegram('payment', 'editMessageReplyMarkup', { chat_id: callback.message.chat.id, message_id: callback.message.message_id, reply_markup: { inline_keyboard: [] } })
      }
      return NextResponse.json({ ok: true })
    }
    const message = update.message
    if (!message?.photo) return NextResponse.json({ ok: true })
    const { token, admin } = botConfig('payment')
    const file = await telegram('payment', 'getFile', { file_id: message.photo.at(-1).file_id })
    const imageResponse = await fetch(`https://api.telegram.org/file/bot${token}/${file.result.file_path}`)
    const buffer = Buffer.from(await imageResponse.arrayBuffer())
    const paymentRef = db.collection('payments').doc()
    const fileName = `payments/${paymentRef.id}.jpg`
    const fileRef = bucket.file(fileName)
    await fileRef.save(buffer, { metadata: { contentType: 'image/jpeg' } }); await fileRef.makePublic()
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
    const ai = await analyzeReceipt(imageUrl)
    await paymentRef.set({ userChatId: message.chat.id, imageUrl, caption: message.caption || '', ai, status: 'manual_review', createdAt: FieldValue.serverTimestamp() })
    if (admin) await sendTelegramMessage('payment', admin, `<b>Yangi to‘lov cheki</b>\n\nAI tavsiyasi: ${ai.verdict}\nSabab: ${ai.reason || '-'}\nRasm: ${imageUrl}\n\nYakuniy qarorni admin beradi.`, { inline_keyboard: [[{ text: 'TASDIQLASH', callback_data: `approve:${paymentRef.id}` }, { text: 'RAD ETISH', callback_data: `reject:${paymentRef.id}` }]] })
    await sendTelegramMessage('payment', message.chat.id, 'Chekingiz qabul qilindi. AI tekshiruvi va admin tasdig‘idan so‘ng javob yuboriladi.')
    return NextResponse.json({ ok: true })
  } catch (error) { console.error('[payment-webhook]', error); return NextResponse.json({ ok: true }) }
}
