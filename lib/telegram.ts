export type BotKind = 'catalog' | 'order' | 'payment'

const config = {
  catalog: { token: process.env.CATALOG_BOT_TOKEN, admin: process.env.CATALOG_ADMIN_CHAT_ID },
  order: { token: process.env.ORDER_BOT_TOKEN, admin: process.env.ORDER_ADMIN_CHAT_ID },
  payment: { token: process.env.PAYMENT_BOT_TOKEN, admin: process.env.PAYMENT_ADMIN_CHAT_ID },
} as const

export function botConfig(kind: BotKind) {
  const value = config[kind]
  if (!value.token) throw new Error(`${kind} Telegram bot token is not configured`)
  return value
}

export async function telegram(kind: BotKind, method: string, body: Record<string, unknown>) {
  const { token } = botConfig(kind)
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  return response.json()
}

export async function sendTelegramMessage(kind: BotKind, chatId: string | number, text: string, replyMarkup?: unknown) {
  return telegram(kind, 'sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', ...(replyMarkup ? { reply_markup: replyMarkup } : {}) })
}

export const getTelegramLoginUrl = (username: string) => `https://t.me/${username.replace(/^@/, '')}`
