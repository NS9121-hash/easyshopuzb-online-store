import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendOrderNotification } from '@/lib/telegram'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_name, phone, address, telegram_username, product_id } = body

    // Validate required fields
    if (!customer_name || !phone || !address || !telegram_username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Store order in Supabase
    const { data, error } = await supabase.from('orders').insert({
      customer_name,
      phone,
      address,
      telegram_username,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save order' },
        { status: 500 }
      )
    }

    // Send notification to Telegram admin
    if (ADMIN_CHAT_ID) {
      await sendOrderNotification(ADMIN_CHAT_ID, customer_name, phone, address, telegram_username)
    }

    return NextResponse.json(
      { success: true, message: 'Order placed successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Order webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
