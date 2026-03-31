import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  // Tokeningiz va Asosiy sozlamalar o'zgarmadi
  const BOT_TOKEN = "8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k";

  // ✅ RUXSAT BERILGAN ID RAQAMLAR (Siz va do'stingiz)
  const ALLOWED_IDS = [5249524506, 5212098605];

  try {
    const body = await req.json();
    const message = body.message;

    // 1. Xabar yoki yuboruvchi bo'lmasa, to'xtatamiz
    if (!message || !message.from) return NextResponse.json({ ok: true });

    // 2. 🛡️ XAVFSIZLIK FILTRI: Begona odam bo'lsa, pastdagi kodlarga o'tkazmaymiz
    if (!ALLOWED_IDS.includes(message.from.id)) {
      console.log("🚫 Ruxsatsiz kirish urinishi! ID:", message.from.id);
      return NextResponse.json({ ok: true });
    }

    // --- YANGI QO'SHILGAN O'CHIRISH QISMI (O'zgarmadi) ---
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

    // Rasmni qo'shish qismi - O'zgarmasdan qoldi
    if (!message.photo) {
      return NextResponse.json({ ok: true });
    }

    // Matn guruhdagi faqat bitta rasmda kelishi mumkin, shuning uchun bo'sh qoldiramiz
    const caption = message.caption || ""; 
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

    // 🌟 UZUM MARKET MANTIG'I: ALBUM (GURUH)NI TEKSHIRISH 🌟
    const groupId = message.media_group_id || null;

    if (groupId) {
      // Bu rasm guruhning (albumni) bir qismi bo'lsa, bazadan shu guruhni qidiramiz
      const { data: existing } = await supabase.from('Clothes').select('*').eq('media_group_id', groupId).single();

      if (existing) {
        // Avvalgi rasmga yangisini vergul bilan ulab qo'yamiz (Karusel uchun)
        const updatedImages = existing.image_url + ',' + imageUrl;
        let updateData: any = { image_url: updatedImages };
        
        // Agar matn (caption) shu rasmda kelsa, narx va nomni ham yangilaymiz
        if (caption) {
          const parts = caption.split('|').map((p: string) => p.trim());
          updateData.name = parts[0] || existing.name;
          updateData.price = parts[1] ? parseInt(parts[1].replace(/\s/g, '')) : existing.price;
          updateData.sizes = parts[2] || existing.sizes;
        }
        
        await supabase.from('Clothes').update(updateData).eq('media_group_id', groupId);
        console.log("✅ ALBUMGA RASM QO'SHILDI");
        return NextResponse.json({ ok: true });
      }
    }

    // --- 1-RASM YOKI GURUHSIR YAKKA RASM UCHUN ---
    const parts = caption.split('|').map((p: string) => p.trim());
    const name = parts[0] || "Yangi mahsulot";
    
    let price = 0;
    if (parts[1]) {
      price = parseInt(parts[1].replace(/\s/g, '')) || 0;
    }
    const sizes = parts[2] || "Standart";

    // Supabase'ga ma'lumotni yuborish (media_group_id qo'shildi)
    const { error } = await supabase
      .from('Clothes')
      .insert([{ name: name, price: price, image_url: imageUrl, sizes: sizes, media_group_id: groupId }]);

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
