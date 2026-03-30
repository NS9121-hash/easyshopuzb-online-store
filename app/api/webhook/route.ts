import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;

    // Xabar yoki rasm bo'lmasa, indamasdan yopamiz
    if (!message || !message.photo) {
      return NextResponse.json({ ok: true });
    }

    // ⚠️ ENG ASOSIY TEKSHIRUV: Token bormi?
    if (!BOT_TOKEN) {
      console.error("XATOLIK: Vercel'da TELEGRAM_BOT_TOKEN yo'q!");
      return NextResponse.json({ ok: true });
    }

    const caption = message.caption || "Nomsiz | 0 | Standart";
    const photo = message.photo; 

    // Eng sifatli rasmni olish
    const fileId = photo[photo.length - 1].file_id;

    // Telegramdan rasm linkini olish
    const fileResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileResponse.json();

    // ⚠️ TEKSHIRUV: Telegram ruxsat bermasa (token xato bo'lsa)
    if (!fileData.ok) {
      console.error("TELEGRAM API XATOSI (Token xato bo'lishi mumkin):", fileData);
      return NextResponse.json({ ok: true });
    }

    const filePath = fileData.result.file_path;
    const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    // Matnni xavfsiz bo'laklarga ajratish
    const parts = caption.split('|').map((p: string) => p.trim());
    const name = parts[0] || "Yangi mahsulot";
    
    // Narxni xavfsiz tozalash (agar | bo'lmasa, xato bermasligi uchun)
    let price = 0;
    if (parts[1]) {
      price = parseInt(parts[1].replace(/\s/g, '')) || 0;
    }
    const sizes = parts[2] || "Standart";

    // Supabase'ga yozish
    const { error } = await supabase
      .from('Clothes') // Jadval nomiga ehtiyot bo'ling
      .insert([{ name: name, price: price, image_url: imageUrl, sizes: sizes }]);

    if (error) {
      console.error("SUPABASE XATOSI:", error);
    } else {
      console.log("✅ MAHSULOT MUVAFFAQIYATLI QO'SHILDI:", name);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Agar umuman boshqa narsa bo'lsa, aniq xatoni ko'rsatadi
    console.error("Webhookning o'zida xatolik:", err);
    return NextResponse.json({ ok: true }); // Telegram botni asabiylashtirmaslik uchun ok: true qaytaramiz
  }
}
