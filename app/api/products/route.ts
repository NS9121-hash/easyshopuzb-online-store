import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const { data, error } = await createServerSupabaseClient().from('products').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ products: data ?? [] })
  } catch (error) {
    console.error('[products]', error)
    return NextResponse.json({ error: 'Mahsulotlarni olishda xatolik' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const body = await request.json()
  if (!body.id || !['kiyimlar', 'look'].includes(body.section)) return NextResponse.json({ error: 'Noto‘g‘ri ma’lumot' }, { status: 400 })
  const { error } = await createServerSupabaseClient().from('products').update({ section: body.section }).eq('id', body.id)
  if (error) return NextResponse.json({ error: 'Mahsulotni yangilab bo‘lmadi' }, { status: 500 })
  return NextResponse.json({ success: true })
}
