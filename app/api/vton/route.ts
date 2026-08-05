import { NextResponse } from 'next/server'

// VTON proxy route
// NOTE: Do NOT hardcode any credentials in source. Use environment variables in deployment.
// Required env vars:
// - VTON_API_URL          (string) - upstream AI inference URL
// - VTON_API_TOKEN        (optional) - bearer token for upstream AI
// - HF_API_TOKEN          (optional) - Hugging Face token if using HF
// - GOOGLE_API_KEY        (optional) - Google/API key (do NOT commit it)

export async function POST(req: Request) {
  try {
    const { user_image, cloth_image } = await req.json()

    if (!user_image || !cloth_image) {
      return NextResponse.json({ success: false, error: 'missing_images' }, { status: 400 })
    }

    const apiUrl = process.env.VTON_API_URL
    if (!apiUrl) {
      console.error('VTON_API_URL is not configured')
      return NextResponse.json({ success: false, error: 'server_not_configured' }, { status: 500 })
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (process.env.VTON_API_TOKEN) headers['Authorization'] = `Bearer ${process.env.VTON_API_TOKEN}`

    // Forward to upstream AI service
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ user_image, cloth_image }),
    })

    if (res.status === 503) {
      // Model is loading on the remote side - propagate 503 so frontend can retry
      return NextResponse.json({ success: false, error: 'model_loading' }, { status: 503 })
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('VTON upstream error', res.status, text)
      return NextResponse.json({ success: false, error: 'upstream_error' }, { status: 502 })
    }

    const result = await res.json()
    if (result.image_url) {
      return NextResponse.json({ success: true, image_url: result.image_url })
    }

    return NextResponse.json({ success: false, error: 'no_image' }, { status: 500 })
  } catch (err: any) {
    console.error('VTON route error', err)
    return NextResponse.json({ success: false, error: 'server_error', details: err?.message || null }, { status: 500 })
  }
}
