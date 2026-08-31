import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://muwjzycdzavfmasbnsl.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  const BOT_TOKEN = process.env.ADMIN_BOT_TOKEN || process.env.ORDER_BOT_TOKEN || "8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k";
  const ALLOWED_IDS = [5249524506, 5212098605];

  try {
    const body = await req.json();

    // --- 1. TUGMA BOSILGANDA (CALLBACK QUERY) ---
    // Bu qism kiyim yoki look tugmasi bosilganda ishlaydi
    if (body.callback_query) {
      const callbackData = body.callback_query.data;
      const chatId = body.callback_query.message.chat.id;
      const messageId = body.callback_query.message.message_id;

      const [typeAction, productId] = callbackData.split(':');
      const finalType = typeAction === 'type_look' ? 'look' : 'clothing';

      // Supabase-da mahsulotning 'type' ustunini yangilaymiz
      const { error } = await supabase
        .from('Clothes')
        .update({ type: finalType })
        .eq('id', productId);

      if (!error) {
        // Botda tugmalarni o'chirib, tasdiq xabarini chiqaramiz
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            text: `✅ Mahsulot muvaffaqiyatli **${finalType === 'look' ? 'LOOK' : 'KIYIMLAR'}** bo'limiga biriktirildi!`,
            parse_mode: 'Markdown'
          }),
        });
      }
      return NextResponse.json({ ok: true });
    }

    const message = body.message;
    if (!message || !message.from) return NextResponse.json({ ok: true });

    if (!ALLOWED_IDS.includes(message.from.id)) {
      console.log("🚫 Ruxsatsiz kirish urinishi! ID:", message.from.id);
      return NextResponse.json({ ok: true });
    }

    // --- DEL KOMANDASI (O'ZGARMADI) ---
    if (message.reply_to_message && message.text && message.text.toLowerCase() === 'del') {
      const originalCaption = message.reply_to_message.caption || "";
      const nameToDelete = originalCaption.split('|')[0].trim(); 
      
      if (nameToDelete) {
        const { error } = await supabase.from('Clothes').delete().eq('name', nameToDelete);
        if (!error) console.log("🗑️ MAHSULOT O'CHIRILDI:", nameToDelete);
      }
      return NextResponse.json({ ok: true });
    }

    if (!message.photo) return NextResponse.json({ ok: true });

    const caption = message.caption || ""; 
    const photo = message.photo; 
    const fileId = photo[photo.length - 1].file_id;

    const fileResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileResponse.json();

    if (!fileData.ok) return NextResponse.json({ ok: true });

    const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;
    const groupId = message.media_group_id || null;

    // --- ALBUM (GURUH) MANTIG'I (O'ZGARMADI) ---
    if (groupId) {
      const { data: existing } = await supabase.from('Clothes').select('*').eq('media_group_id', groupId).single();

      if (existing) {
        const updatedImages = existing.image_url + ',' + imageUrl;
        let updateData: any = { image_url: updatedImages };
        
        if (caption) {
          const parts = caption.split('|').map((p: string) => p.trim());
          updateData.name = parts[0] || existing.name;
          updateData.price = parts[1] ? parseInt(parts[1].replace(/\s/g, '')) : existing.price;
          updateData.sizes = parts[2] || existing.sizes;
          updateData.colors = parts[3] || existing.colors;
        }
        
        await supabase.from('Clothes').update(updateData).eq('media_group_id', groupId);
        return NextResponse.json({ ok: true });
      }
    }

    // --- YANGI MAHSULOT QO'SHISH (COLORS BILAN) ---
    const parts = caption.split('|').map((p: string) => p.trim());
    const name = parts[0] || "Yangi mahsulot";
    const price = parts[1] ? parseInt(parts[1].replace(/\s/g, '')) : 0;
    const sizes = parts[2] || "Standart";
    const colors = parts[3] || "";

    const { data: insertedData, error } = await supabase
      .from('Clothes')
      .insert([{ 
        name, 
        price, 
        image_url: imageUrl, 
        sizes, 
        colors, 
        media_group_id: groupId,
        type: 'clothing' // Default holatda kiyim
      }])
      .select()
      .single();

    if (error) {
      console.error("SUPABASE XATOSI:", error);
    } else if (insertedData) {
      // ✅ TUGMALARNI YUBORISH (FAQAT YANGI MAHSULOT UCHUN)
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: `📦 *${name}* bazaga saqlandi.\n\nUshbu mahsulot qaysi bo'limga tushsin?`,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: "👕 KIYIMLAR", callback_data: `type_clothing:${insertedData.id}` },
                { text: "✨ LOOK", callback_data: `type_look:${insertedData.id}` }
              ]
            ]
          }
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook xatosi:", err);
    return NextResponse.json({ ok: true }); 
  }
}
