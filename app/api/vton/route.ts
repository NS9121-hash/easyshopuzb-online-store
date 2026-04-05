import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Frontend'dan yuborilgan rasmlarni qabul qilamiz
    const { user_image, cloth_image } = await req.json();

    if (!user_image || !cloth_image) {
      return NextResponse.json({ success: false, error: "Ikkala rasm ham yuklanishi shart!" });
    }

    // --- HUGGING FACE INTEGRATSIYASI (YANGI QO'SHILGAN QISM) ---
    // Bu qism kiyimni haqiqatdan almashtirib, rasm qaytaradi
    const hfToken = "Hf_DVMKPBqeRvwDNMDsFcxbsaudiHmpsZqTqX";
    const hfUrl = "https://api-inference.huggingface.co/models/Kwai-Kolors/Kolors-Virtual-Try-On";

    const hfResponse = await fetch(hfUrl, {
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: {
          person_image: user_image.split(",")[1],
          garment_image: cloth_image.split(",")[1],
        }
      }),
    });

    let generatedImageBase64 = null;
    if (hfResponse.ok) {
      const blob = await hfResponse.blob();
      const buffer = Buffer.from(await blob.arrayBuffer());
      generatedImageBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }
    // -------------------------------------------------------

    // 2. Sizning Gemini API kalitingiz (O'zgartirilmagan)
    const apiKey = "AIzaSyCtiwB1m3mMpvjjp-scLZCImkoF0RTqR_k";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    // 3. AI uchun aniq ko'rsatma (O'zgartirilmagan)
    const promptText = `
      TASK: High-Fidelity Virtual Try-On.
      INSTRUCTIONS:
      - Replace ONLY the clothing on the person in 'user_image' with the garment from 'cloth_image'.
      - KEEP the face, skin, hair, and pose of the person EXACTLY as they are.
      - KEEP the original background. Do not change any pixels outside the clothing area.
      - Match the lighting, shadows, and texture of the new garment to the person's body.
      NEGATIVE: change face, blurry, distorted body, extra limbs, cartoon, low resolution, face swap.
    `;

    // 4. Gemini API ga so'rov yuborish (O'zgartirilmagan)
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
                data: user_image.split(",")[1] 
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

    // 5. Natijani qaytarish (Batafsil va birlashtirilgan holatda)
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return NextResponse.json({ 
        success: true, 
        data: data, // Gemini'dan kelgan matnli tahlil
        image_url: generatedImageBase64 // Hugging Face'dan kelgan haqiqiy rasm
      });
    } else if (generatedImageBase64) {
      // Agar Gemini'dan xato kelsa-yu, rasm tayyor bo'lsa, baribir natijani qaytaramiz
      return NextResponse.json({ 
        success: true, 
        image_url: generatedImageBase64 
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
