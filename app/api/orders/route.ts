import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { botConfig, sendTelegramMessage } from '@/lib/telegram'

function validPhone(value: string) { return /^\+?[0-9\s()-]{7,}$/.test(value) }

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.customer_name || !body.phone || !body.product_name || !validPhone(body.phone)) return NextResponse.json({ error: 'Ma’lumotlar to‘liq emas' }, { status: 400 })
    const items = [{ product_id: body.product_id ?? null, title: body.product_name, quantity: Number(body.quantity || 1), size: body.size ?? null, color: body.color ?? null }]
    const total = Number(body.total || 0)
    const { data, error } = await createServerSupabaseClient().from('orders').insert({ items, total, status: 'pending' }).select('id, status, items, total').single()
    if (error) throw error
    const { admin } = botConfig('order')
    if (admin) await sendTelegramMessage('order', admin, `<b>Yangi buyurtma #${data.id}</b>\n\n<b>Mijoz:</b> ${body.customer_name}\n<b>Telefon:</b> ${body.phone}\n<b>Tovar:</b> ${body.product_name}`)
    return NextResponse.json({ success: true, order: data }, { status: 201 })
  } catch (error) {
    console.error('[orders:post]', error)
    return NextResponse.json({ error: 'Buyurtmani saqlab bo‘lmadi' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const status = new URL(request.url).searchParams.get('status')
  const query = createServerSupabaseClient().from('orders').select('id, user_id, items, total, status, receipt_url, created_at').order('created_at', { ascending: false })
  const { data, error } = status ? await query.eq('status', status) : await query
  if (error) return NextResponse.json({ error: 'Buyurtmalarni olishda xatolik' }, { status: 500 })
  return NextResponse.json({ orders: data ?? [] })
}
