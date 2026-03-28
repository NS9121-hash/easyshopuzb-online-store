import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase sozlamalari
const SUPABASE_URL = "https://muwjzycdzavfmasbnsl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU";
const BOT_TOKEN = "8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k";

// Supabase mijozini yaratish (Fetch xatosini oldini olish uchun global fetch qo'shildi)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const chatId = body.message?.chat?.id;

        if (body.message?.photo) {
            const photo = body.message.photo[body.message.photo.length - 1];
            
            // 1. Telegramdan rasm yo'lini olish
            const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${photo.file_id}`);
            const fileData = await fileRes.json();
            
            if (!fileData.ok) throw new Error("Telegramdan faylni olib bo'lmadi");

            const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;

            // 2. Ma'lumotlarni ajratish
            const caption = body.message.caption || "Nomsiz | 0 | -";
            const [name, price, size] = caption.split("|").map((s: string) => s.trim());

            // 3. Supabase'ga yozish (Eng muhim joyi)
            const { error: dbError } = await supabase
                .from('products')
                .insert([{ 
                    name: name || "Nomsiz", 
                    price: price || "0", 
                    size: size || "-", 
                    image_url: imageUrl 
                }]);

            if (dbError) {
                // Agar baza xatosi bo'lsa, Telegramga yuboramiz
                await sendMessage(chatId, "❌ Baza xatosi: " + dbError.message);
                return NextResponse.json({ ok: true });
            }

            // 4. Hammasi yaxshi bo'lsa
            await sendMessage(chatId, "✅ Zo'r! Mahsulot saytga qo'shildi!\n📦 " + (name || "Nomsiz"));
        }
        
        return NextResponse.json({ ok: true });
    } catch (err: any) {
        console.error("Xato:", err);
        return NextResponse.json({ ok: true });
    }
}

// Telegramga xabar yuborish funksiyasi
async function sendMessage(chatId: number, text: string) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text })
    });
}
