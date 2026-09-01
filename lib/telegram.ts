export const ADMIN_BOT_TOKEN = process.env.ADMIN_BOT_TOKEN || ''
export const ORDER_BOT_TOKEN = process.env.ORDER_BOT_TOKEN || process.env.ADMIN_BOT_TOKEN || ''
export const PAYMENT_BOT_TOKEN = process.env.PAYMENT_BOT_TOKEN || process.env.ADMIN_BOT_TOKEN || ''
export const SUPPORT_BOT_TOKEN = process.env.SUPPORT_BOT_TOKEN || process.env.ADMIN_BOT_TOKEN || ''
export const LOGISTICS_BOT_TOKEN = process.env.LOGISTICS_BOT_TOKEN || process.env.ADMIN_BOT_TOKEN || ''
export const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || ''

export interface InlineKeyboardButton {
  text: string
  callback_data?: string
  url?: string
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][]
}

export interface ReplyKeyboardMarkup {
  keyboard: { text: string }[][]
  resize_keyboard?: boolean
  one_time_keyboard?: boolean
}

/**
 * Send a text message to a Telegram chat
 */
export async function sendTelegramMessage(
  botToken: string,
  chatId: string | number,
  text: string,
  replyMarkup?: InlineKeyboardMarkup | ReplyKeyboardMarkup,
  replyToMessageId?: number
) {
  if (!botToken || !chatId) {
    console.warn('[Telegram] Missing bot token or chatId', { hasToken: !!botToken, chatId })
    return null
  }

  try {
    const payload: Record<string, any> = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }

    if (replyMarkup) {
      payload.reply_markup = replyMarkup
    }
    if (replyToMessageId) {
      payload.reply_to_message_id = replyToMessageId
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!data.ok) {
      console.error('[Telegram] Error sendMessage:', data)
    }
    return data
  } catch (error) {
    console.error('[Telegram] Fetch error sendMessage:', error)
    return null
  }
}

/**
 * Send a photo to a Telegram chat
 */
export async function sendTelegramPhoto(
  botToken: string,
  chatId: string | number,
  photoUrl: string,
  caption?: string,
  replyMarkup?: InlineKeyboardMarkup | ReplyKeyboardMarkup
) {
  if (!botToken || !chatId) return null

  try {
    const payload: Record<string, any> = {
      chat_id: chatId,
      photo: photoUrl,
      parse_mode: 'HTML',
    }

    if (caption) {
      payload.caption = caption
    }
    if (replyMarkup) {
      payload.reply_markup = replyMarkup
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!data.ok) {
      console.error('[Telegram] Error sendPhoto:', data)
      // Fallback to text message if photo URL failed
      if (caption) {
        return sendTelegramMessage(botToken, chatId, `${caption}\n\n🖼 Rasm: ${photoUrl}`, replyMarkup)
      }
    }
    return data
  } catch (error) {
    console.error('[Telegram] Fetch error sendPhoto:', error)
    return null
  }
}

/**
 * Answer a callback query from an inline button
 */
export async function answerCallbackQuery(botToken: string, callbackQueryId: string, text?: string) {
  if (!botToken || !callbackQueryId) return null

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
      }),
    })
    return await response.json()
  } catch (error) {
    console.error('[Telegram] Error answerCallbackQuery:', error)
    return null
  }
}

/**
 * Edit message text
 */
export async function editMessageText(
  botToken: string,
  chatId: string | number,
  messageId: number,
  text: string,
  replyMarkup?: InlineKeyboardMarkup
) {
  if (!botToken || !chatId || !messageId) return null

  try {
    const payload: Record<string, any> = {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
    }
    if (replyMarkup) {
      payload.reply_markup = replyMarkup
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return await response.json()
  } catch (error) {
    console.error('[Telegram] Error editMessageText:', error)
    return null
  }
}

/**
 * Get direct download URL for a Telegram File
 */
export async function getTelegramFileUrl(botToken: string, fileId: string): Promise<string | null> {
  if (!botToken || !fileId) return null

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`)
    const data = await res.json()
    if (data.ok && data.result?.file_path) {
      return `https://api.telegram.org/file/bot${botToken}/${data.result.file_path}`
    }
  } catch (error) {
    console.error('[Telegram] Error getting file path:', error)
  }
  return null
}
