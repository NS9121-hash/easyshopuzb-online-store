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

        if (price === 0) {
          await sendTelegramMessage(
            chat.id,
            '❌ Invalid price format. Use: image with caption like "$50" or "100"'
          )
          return NextResponse.json({ ok: true })
        }

        // Get the largest photo file
        const largestPhoto = photo[photo.length - 1]
        if (!largestPhoto) {
          await sendTelegramMessage(chat.id, '❌ No photo found')
          return NextResponse.json({ ok: true })
        }

        // Get file info from Telegram
        const fileResponse = await fetch(
          `https://api.telegram.org/bot${ADMIN_BOT_TOKEN}/getFile?file_id=${largestPhoto.file_id}`
        )
        const fileData = await fileResponse.json()

        if (!fileData.ok || !fileData.result.file_path) {
          console.error('Error getting file from Telegram:', fileData)
          await sendTelegramMessage(chat.id, '❌ Error processing image')
          return NextResponse.json({ ok: true })
        }

        // Download file from Telegram
        const fileUrl = `https://api.telegram.org/file/bot${ADMIN_BOT_TOKEN}/${fileData.result.file_path}`
        const imageResponse = await fetch(fileUrl)
        const imageBuffer = await imageResponse.arrayBuffer()

        // Upload to Supabase Storage
        const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, imageBuffer, {
            contentType: 'image/jpeg',
          })

        if (uploadError) {
          console.error('Error uploading to Supabase:', uploadError)
          await sendTelegramMessage(chat.id, '❌ Error uploading image')
          return NextResponse.json({ ok: true })
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(fileName)

        const publicUrl = publicUrlData.publicUrl

        // Store product in database
        const { data: productData, error: dbError } = await supabase
          .from('products')
          .insert({
            image_url: publicUrl,
            price,
          })
          .select()

        if (dbError) {
          console.error('Error inserting product:', dbError)
          await sendTelegramMessage(chat.id, '❌ Error saving product')
          return NextResponse.json({ ok: true })
        }

        // Send confirmation to admin
        await sendTelegramMessage(
          chat.id,
          `✅ Product added successfully!\n\nPrice: $${price}\nImage: ${publicUrl}\n\nTotal products: Check dashboard`
        )
      } catch (error) {
        console.error('Error processing product:', error)
        await sendTelegramMessage(chat.id, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
