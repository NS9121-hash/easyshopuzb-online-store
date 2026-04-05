import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Frontend'dan yuborilgan rasmlarni qabul qilamiz
    const { user_image, cloth_image } = await req.json();

    if (!user_image || !cloth_image) {
      return NextResponse.json({ success: false, error: "Ikkala rasm ham yuklanishi shart!" });
    }

    // 2. Sizning Gemini API kalitingiz
    const apiKey = "AIzaSyCtiwB1m3mMpvjjp-scLZCImkoF0RTqR_k";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    // 3. AI uchun aniq ko'rsatma (Siz aytgan yuz va fonga tegmaslik sharti bilan)
    const promptText = `
      TASK: High-Fidelity Virtual Try-On.
      INSTRUCTIONS:
      - Replace ONLY the clothing on the person in 'user_image' with the garment from 'cloth_image'.
      - KEEP the face, skin, hair, and pose of the person EXACTLY as they are.
      - KEEP the original background. Do not change any pixels outside the clothing area.
      - Match the lighting, shadows, and texture of the new garment to the person's body.
      NEGATIVE: change face, blurry, distorted body, extra limbs, cartoon, low resolution, face swap.
    `;

    // 4. Gemini API ga so'rov yuborish
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: promptText },
            { 
              inlineData: { 
                mimeType: "image/jpeg", 
                data: user_image.split(",")[1] // Base64'dan faqat ma'lumot qismini olamiz
              } 
            },
            { 
              inlineData: { 
                mimeType: "image/jpeg", 
                data: cloth_image.split(",")[1] 
              } 
            }
          ]
        }]
      })
    });

    const data = await response.json();

    // 5. Natijani qaytarish
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return NextResponse.json({ 
        success: true, 
        data: data 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: "AI natija qaytarmadi. API limitini yoki rasmlarni tekshiring." 
      });
    }

  } catch (error: any) {
    console.error("VTON Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Serverda xatolik yuz berdi" 
    });
  }
}

