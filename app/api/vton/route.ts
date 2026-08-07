import { NextResponse } from 'next/server'

const DEFAULT_MODEL = 'Kwai-Kolors/Kolors-Virtual-Try-On'

export async function POST(request: Request) {
  try {
    const { user_image, cloth_image } = await request.json()
    if (!user_image || !cloth_image) return NextResponse.json({ success: false, error: 'Ikkala rasm ham yuklanishi shart' }, { status: 400 })
    const token = process.env.HUGGINGFACE_API_KEY
    if (!token) return NextResponse.json({ success: false, error: 'Hugging Face sozlanmagan' }, { status: 503 })
    const model = process.env.HUGGINGFACE_MODEL_ID || DEFAULT_MODEL
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: { person_image: user_image.split(',').pop(), garment_image: cloth_image.split(',').pop() } }),
    })
    if (!response.ok) return NextResponse.json({ success: false, error: 'Hugging Face modeli hozircha tayyor emas' }, { status: 502 })
    const result = Buffer.from(await response.arrayBuffer()).toString('base64')
    return NextResponse.json({ success: true, image_url: `data:image/png;base64,${result}` })
  } catch (error) {
    console.error('[vton]', error)
    return NextResponse.json({ success: false, error: 'Virtual kiyib ko‘rishda xatolik' }, { status: 500 })
  }
}
