import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const secret = request.headers.get('x-telegram-bot-api-secret-token')
  if (process.env.WEBHOOK_SECRET && secret !== process.env.WEBHOOK_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await request.json()
  return NextResponse.json({ ok: true })
}
