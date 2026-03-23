import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const ADMIN_BOT_TOKEN = process.env.ADMIN_BOT_TOKEN || ''

interface TelegramUpdate {
  update_id: number
  message?: {
    chat: { id: number }
    photo?: Array<{ file_id: string; file_unique_id: string }>
    caption?: string
    text?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json()

    // Verify token (basic security check)
    const path = request.nextUrl.pathname
    const token = path.split('/').pop()
    if (token !== ADMIN_BOT_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!update.message) {
      return NextResponse.json({ ok: true })
    }

    const { photo, caption, text, chat } = update.message

    // Handle product image + price upload
    if (photo && caption) {
      try {
        const priceMatch = caption.match(/\$?(\d+(?:\.\d{2})?)/)
        const price = priceMatch ? parseFloat(priceMatch[1]) : 0

        // In production, you would:
        // 1. Download the photo from Telegram
        // 2. Upload to Supabase Storage
        // 3. Get the URL
        // For now, we'll use a placeholder

        const imageUrl = `https://via.placeholder.com/300?text=Product+$${price}`

        // Store product in database
        const { error } = await supabase.from('products').insert({
          image_url: imageUrl,
          price,
          created_at: new Date().toISOString(),
        })

        if (error) {
          console.error('Error inserting product:', error)
          return NextResponse.json({ ok: false })
        }

        // Send confirmation to admin
        await sendTelegramMessage(
          chat.id,
          `✓ Product added: $${price}`
        )
      } catch (error) {
        console.error('Error processing product:', error)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin webhook error:', error)
    return NextResponse.json({ ok: true }) // Always return 200 for Telegram
  }
}

async function sendTelegramMessage(chatId: number, text: string) {
  try {
    await fetch(`https://api.telegram.org/bot${ADMIN_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    })
  } catch (error) {
    console.error('Error sending message:', error)
  }
}
