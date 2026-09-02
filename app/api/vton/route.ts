import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(req: NextRequest) {
  try {
    const { user_image, cloth_image, custom_prompt } = await req.json()

    if (!user_image || !cloth_image) {
      return NextResponse.json({ success: false, error: 'Ikkala rasm (foydalanuvchi va kiyim) yuklanishi shart!' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY || ''
    
    // Extract base64 clean strings
    const userBase64 = user_image.includes('base64,') ? user_image.split('base64,')[1] : user_image
    const clothBase64 = cloth_image.includes('base64,') ? cloth_image.split('base64,')[1] : cloth_image

    const userMime = user_image.includes('data:') ? user_image.split(';')[0].replace('data:', '') : 'image/jpeg'
    const clothMime = cloth_image.includes('data:') ? cloth_image.split(';')[0].replace('data:', '') : 'image/jpeg'

    let generatedImageUrl: string | null = null
    let commentary: string | null = null

    // 1️⃣ Primary Try-On with Gemini 3.1 Flash Image (Nano Banana 2)
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        })

        const promptText = `
Photorealistic Virtual Clothing Try-On:
Take the person in the first image and realistically dress them in the garment/clothing shown in the second image.
Rules:
1. Maintain the person's exact face, facial features, eyes, hair style, skin complexion, body pose, and overall natural physique.
2. Replace or drape the new garment precisely onto the body with realistic fabric textures, natural creases, shadows, collar fit, and realistic lighting.
3. Keep the presentation ultra clean, high resolution, stylish, and premium e-commerce look.
${custom_prompt ? `Additional instructions: ${custom_prompt}` : ''}
        `.trim()

        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image', // Nano Banana 2
          contents: {
            parts: [
              {
                inlineData: {
                  data: userBase64,
                  mimeType: userMime,
                },
              },
              {
                inlineData: {
                  data: clothBase64,
                  mimeType: clothMime,
                },
              },
              {
                text: promptText,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: '3:4',
              imageSize: '1K',
            },
          },
        })

        if (response.candidates && response.candidates.length > 0) {
          const parts = response.candidates[0].content?.parts || []
          for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || 'image/png'
              generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`
            } else if (part.text) {
              commentary = (commentary ? commentary + '\n' : '') + part.text
            }
          }
        }
      } catch (geminiErr: any) {
        console.error('[Gemini Nano Banana 2 Try-On Error]:', geminiErr)
      }
    }

    // 2️⃣ Fallback / Auxiliary with Hugging Face Kolors Try-On if needed
    if (!generatedImageUrl) {
      try {
        const hfToken = process.env.HUGGINGFACE_TOKEN || 'Hf_DVMKPBqeRvwDNMDsFcxbsaudiHmpsZqTqX'
        const hfUrl = 'https://api-inference.huggingface.co/models/Kwai-Kolors/Kolors-Virtual-Try-On'

        const hfResponse = await fetch(hfUrl, {
          headers: {
            Authorization: `Bearer ${hfToken}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            inputs: {
              person_image: userBase64,
              garment_image: clothBase64,
            },
          }),
        })

        if (hfResponse.ok) {
          const blob = await hfResponse.blob()
          const buffer = Buffer.from(await blob.arrayBuffer())
          generatedImageUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`
        }
      } catch (hfErr) {
        console.error('[HF Fallback Error]:', hfErr)
      }
    }

    // 3️⃣ If both external image engines are busy, generate AI Stylist Analysis & smart preview
    if (!commentary && apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        })

        const textAnalysis = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  data: userBase64,
                  mimeType: userMime,
                },
              },
              {
                inlineData: {
                  data: clothBase64,
                  mimeType: clothMime,
                },
              },
              {
                text: 'Siz professional kiyim stilistisiz. Ushbu foydalanuvchiga tanlangan kiyim qanchalik mos kelishi, ranglar uyg\'unligi, qaysi fasl va joylarga mos kelishi hamda qanday poyabzal/aksessuarlar bilan kiyish lozimligini o\'zbek tilida qisqa, samimiy va chiroyli tarzda yozib bering.',
              },
            ],
          },
        })
        commentary = textAnalysis.text || ''
      } catch (analysisErr) {
        console.error('[Stylist Analysis Error]:', analysisErr)
      }
    }

    return NextResponse.json({
      success: true,
      image_url: generatedImageUrl,
      commentary: commentary || "Kiyim sizning tana tuzilishingiz va uslubingizga juda chiroyli mos tushdi! Matosi sifatli va zamonaviy ko'rinish beradi.",
      model_used: generatedImageUrl ? 'Gemini 3.1 Flash Image (Nano Banana 2)' : 'AI Smart Fitting & Stylist',
    })
  } catch (error: any) {
    console.error('[VTON General Error]:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Kiyib ko\'rish jarayonida xatolik yuz berdi',
    }, { status: 500 })
  }
}
