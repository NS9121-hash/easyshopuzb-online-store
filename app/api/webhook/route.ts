import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  // Tokeningiz xavfsiz joyda turibdi
  const BOT_TOKEN = "8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k";

  try {
    const body = await req.json();
    const message = body.message;

    if (!message) return NextResponse.json({ ok: true });

    // --- YANGI QO'SHILGAN O'CHIRISH QISMI ---
    if (message.reply_to_message && message.text && message.text.toLowerCase() === 'del') {
      const originalCaption = message.reply_to_message.caption || "";
      const nameToDelete = originalCaption.split('|')[0].trim(); 
      
      if (nameToDelete) {
        const { error } = await supabase.from('Clothes').delete().eq('name', nameToDelete);
        if (!error) console.log("🗑️ MAHSULOT O'CHIRILDI:", nameToDelete);
      }
      return NextResponse.json({ ok: true });
    }
    // ---------------------------------------

    // Eski kodingiz - Rasmni qo'shish qismi o'zgarmasdan qoldi
    if (!message.photo) {
      return NextResponse.json({ ok: true });
    }

    const caption = message.caption || "Nomsiz | 0 | Standart";
    const photo = message.photo; 
    const fileId = photo[photo.length - 1].file_id;

    const fileResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileResponse.json();

    if (!fileData.ok) {
      console.error("TELEGRAM API XATOSI:", fileData);
      return NextResponse.json({ ok: true });
    }

    const filePath = fileData.result.file_path;
    const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    const parts = caption.split('|').map((p: string) => p.trim());
    const name = parts[0] || "Yangi mahsulot";
    
    let price = 0;
    if (parts[1]) {
      price = parseInt(parts[1].replace(/\s/g, '')) || 0;
    }
    const sizes = parts[2] || "Standart";

    // Supabase'ga ma'lumotni tiqamiz
    const { error } = await supabase
      .from('Clothes')
      .insert([{ name: name, price: price, image_url: imageUrl, sizes: sizes }]);

    if (error) {
      console.error("SUPABASE XATOSI:", error);
    } else {
      console.log("✅ G'ALABA! MAHSULOT BAZAGA TUSHDI:", name);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook xatosi:", err);
    return NextResponse.json({ ok: true }); 
  }
}
