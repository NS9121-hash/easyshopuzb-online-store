import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase ulanishi
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // .env-ga qo'shib qo'ying

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) return NextResponse.json({ ok: true });

    // 1. Rasm va Matnni olish
    const caption = message.caption || ""; // Botga yozilgan matn
    const photo = message.photo; // Rasm massivi

    if (photo && caption) {
      // Eng sifatli rasmni olish
      const fileId = photo[photo.length - 1].file_id;

      // Telegramdan rasmning linkini olish
      const fileResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
      const fileData = await fileResponse.json();
      const filePath = fileData.result.file_path;
      const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

      // 2. Matnni qismlarga ajratish (Format: Nomi | Narxi | O'lchami)
      // Masalan: Chiroyli Kurtka | 550000 | M, L, XL
      const parts = caption.split('|').map((p: string) => p.trim());
      
      if (parts.length >= 2) {
        const name = parts[0];
        const price = parseInt(parts[1].replace(/\s/g, '')); // Probellarni olib tashlab songa aylantiradi
        const sizes = parts[2] || "Standart";

        // 3. Supabase-ga ma'lumotni yuklash
        const { error } = await supabase
          .from('Clothes') // JADVAL NOMI (Supabase-da qanday bo'lsa shunday yozing)
          .insert([
            { 
              name: name, 
              price: price, 
              image_url: imageUrl, 
              sizes: sizes 
            }
          ]);

        if (error) {
          console.error("Supabase Error:", error);
        } else {
          console.log("✅ MAHSULOT SAYTGA QO'SHILDI!");
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return NextResponse.json({ ok: false });
  }
}
