import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import {
  ADMIN_BOT_TOKEN,
  ORDER_BOT_TOKEN,
  PAYMENT_BOT_TOKEN,
  SUPPORT_BOT_TOKEN,
  LOGISTICS_BOT_TOKEN,
} from '@/lib/telegram'

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || req.headers.get('host') || 'https://ais-dev-snzd4iejfxljfyne44bndl-512622947757.asia-southeast1.run.app'
    const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`

    const results: Record<string, any> = {}

    const bots = [
      {
        name: 'Admin / Catalog Bot',
        token: ADMIN_BOT_TOKEN || process.env.ADMIN_BOT_TOKEN,
        webhookUrl: `${baseUrl}/api/webhooks/admin`,
        key: 'admin',
      },
      {
        name: 'Order Bot',
        token: ORDER_BOT_TOKEN || process.env.ORDER_BOT_TOKEN || ADMIN_BOT_TOKEN,
        webhookUrl: `${baseUrl}/api/webhooks/order`,
        key: 'order',
      },
      {
        name: 'Payment Bot',
        token: PAYMENT_BOT_TOKEN || process.env.PAYMENT_BOT_TOKEN || ADMIN_BOT_TOKEN,
        webhookUrl: `${baseUrl}/api/webhooks/payment`,
        key: 'payment',
      },
      {
        name: 'Support Bot',
        token: SUPPORT_BOT_TOKEN || process.env.SUPPORT_BOT_TOKEN || ADMIN_BOT_TOKEN,
        webhookUrl: `${baseUrl}/api/webhooks/support`,
        key: 'support',
      },
      {
        name: 'Logistics Bot',
        token: LOGISTICS_BOT_TOKEN || process.env.LOGISTICS_BOT_TOKEN || ADMIN_BOT_TOKEN,
        webhookUrl: `${baseUrl}/api/webhooks/logistics`,
        key: 'logistics',
      },
    ]

    for (const bot of bots) {
      if (!bot.token) {
        results[bot.key] = {
          name: bot.name,
          ok: false,
          description: 'Token mavjud emas (.env da kiritilmagan)',
        }
        continue
      }

      try {
        const res = await fetch(`https://api.telegram.org/bot${bot.token}/setWebhook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: bot.webhookUrl,
            drop_pending_updates: false,
            allowed_updates: ['message', 'callback_query', 'pre_checkout_query', 'channel_post'],
          }),
        })
        const data = await res.json()
        results[bot.key] = {
          name: bot.name,
          ok: data.ok,
          description: data.description || (data.ok ? 'Webhook muvaffaqiyatli ulandi' : 'Xatolik'),
          url: bot.webhookUrl,
        }
      } catch (err: any) {
        results[bot.key] = {
          name: bot.name,
          ok: false,
          description: err.message || 'Tarmoq xatosi',
        }
      }
    }

    // Save status to Firestore
    try {
      await setDoc(doc(db, 'app_settings', 'webhook_status'), {
        updatedAt: new Date().toISOString(),
        baseUrl,
        results,
      })
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      baseUrl,
      bots: results,
      message: 'Barcha Telegram bot webhooklari yangilandi!',
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return POST(req)
}
