import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.from('products').select('id').limit(1)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[cron:keepalive]', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
