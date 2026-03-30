import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase-ga ulanish
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;

    // Agar xabar yoki rasm bo'lmasa, to'xtatish
    if (!message || !message.photo) {
      return NextResponse.json({ ok: true });
    }

    const caption = message.caption || ""; // Botga yozilgan matn
    const photo = message.photo; 

    // Eng sifatli rasmni olish
    const fileId = photo[photo.length - 1].file_id;

    // Telegramdan rasmning manzilini (URL) olish
    const fileResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileResponse.json();
    const filePath = fileData.result.file_path;
    const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    // Matnni qismlarga ajratish. Masalan: "Kurtka | 550000 | M, L, XL"
    const parts = caption.split('|').map((p: string) => p.trim());
    
    const name = parts[0] || "Yangi mahsulot";
    const price = parseInt(parts[1]?.replace(/\s/g, '') || "0"); // Probellarni olib tashlaydi
    const sizes = parts[2] || "Standart";

    // 🚀 SUPABASE BAZASIGA QO'SHISH (Aynan shu qism o'chib ketgan edi)
    const { error } = await supabase
      .from('Clothes')
      .insert([
        { 
          name: name, 
          price: price, 
          image_url: imageUrl, 
          sizes: sizes 
        }
      ]);

    if (error) {
      console.error("Baza xatosi:", error);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook xatosi:", err);
    return NextResponse.json({ ok: false });
  }
}
