import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const ORDER_BOT_TOKEN = process.env.ORDER_BOT_TOKEN || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_name, phone, address, telegram_username } = body

    // Validate required fields
    if (!customer_name || !phone || !address || !telegram_username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate phone format (basic check)
    if (!phone.match(/^\+?[0-9]{6,}$/)) {
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      )
    }

    // Validate telegram username
    if (!telegram_username.match(/^@?[a-zA-Z0-9_]{5,}$/)) {
      return NextResponse.json(
        { error: 'Invalid Telegram username' },
        { status: 400 }
      )
    }

    // Store order in Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name,
        phone,
        address,
        telegram_username,
        payment_status: 'pending',
        order_status: 'new',
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save order' },
        { status: 500 }
      )
    }

    // Send notification to Telegram admin
    if (ORDER_BOT_TOKEN) {
      try {
        const message = `
📦 New Order Received!

👤 Customer: ${customer_name}
📱 Phone: ${phone}
📍 Address: ${address}
💬 Telegram: ${telegram_username}

Status: Pending Payment
`.trim()

        await fetch(`https://api.telegram.org/bot${ORDER_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.ADMIN_CHAT_ID,
            text: message,
            parse_mode: 'HTML',
          }),
        })
      } catch (notifyError) {
        console.error('Error sending notification:', notifyError)
        // Don't fail the order if notification fails
      }
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Order placed successfully',
        order: data ? data[0] : null
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase.from('orders').select('*')

    if (status) {
      query = query.eq('order_status', status)
    }

    const { data: orders, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    return NextResponse.json({ orders }, { status: 200 })
  } catch (error) {
    console.error('Orders GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
