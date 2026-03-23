import { NextRequest, NextResponse } from 'next/server'

const PAYMENT_BOT_TOKEN = process.env.PAYMENT_BOT_TOKEN || ''

interface TelegramUpdate {
  update_id: number
  message?: {
    chat: { id: number }
    text?: string
  }
  callback_query?: {
    id: string
    from: { id: number }
    data?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json()

    // Verify token (basic security check)
    const path = request.nextUrl.pathname
    const token = path.split('/').pop()
    if (token !== PAYMENT_BOT_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!update.message && !update.callback_query) {
      return NextResponse.json({ ok: true })
    }

    // Handle payment verification
    // This is where you would verify payment status
    // For now, we'll accept any message as a potential payment proof

    if (update.message) {
      const { chat, text } = update.message

      // Send confirmation to user
      await sendTelegramMessage(
        chat.id,
        'Thank you for your payment! Your catalog access will be verified within 24 hours. You will receive a confirmation message.'
      )

      // In production, you would:
      // 1. Verify the payment with a payment provider
      // 2. Generate a unique unlock code
      // 3. Send it back to the user
      // 4. Have the user enter the code on the website to unlock
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Payment webhook error:', error)
    return NextResponse.json({ ok: true }) // Always return 200 for Telegram
  }
}

async function sendTelegramMessage(chatId: number, text: string) {
  try {
    await fetch(`https://api.telegram.org/bot${PAYMENT_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    })
  } catch (error) {
    console.error('Error sending message:', error)
  }
}
