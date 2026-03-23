const ADMIN_BOT_TOKEN = process.env.ADMIN_BOT_TOKEN || ''
const PAYMENT_BOT_TOKEN = process.env.PAYMENT_BOT_TOKEN || ''
const ORDER_BOT_TOKEN = process.env.ORDER_BOT_TOKEN || ''

export const sendTelegramMessage = async (botToken: string, chatId: string, text: string) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    })
    return response.ok
  } catch (error) {
    console.error('Error sending Telegram message:', error)
    return false
  }
}

export const sendOrderNotification = async (
  chatId: string,
  customerName: string,
  phone: string,
  address: string,
  telegramUsername: string
) => {
  const message = `
<b>📦 New Order Received</b>

<b>Customer:</b> ${customerName}
<b>Phone:</b> ${phone}
<b>Address:</b> ${address}
<b>Telegram:</b> @${telegramUsername}

Please process this order.
  `.trim()

  return sendTelegramMessage(ORDER_BOT_TOKEN, chatId, message)
}

export const getTelegramLoginUrl = (username: string) => {
  return `https://t.me/${username}`
}
