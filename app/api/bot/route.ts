import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// KONFIGURATSIYA
const SUPABASE_URL = "https://muwjzycdzavfmasbnsl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU";
const BOT_TOKEN = "8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k";

// RUXSAT BERILGAN ID-LAR
const ALLOWED_USERS = [5249524506, 5212098605];

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const msg = body.message;
        
        if (!msg) return NextResponse.json({ ok: true });

        const userId = msg.from?.id;
        const chatId = msg.chat?.id;

        // 1. Foydalanuvchini tekshirish
        if (!ALLOWED_USERS.includes(userId)) {
            return NextResponse.json({ ok: true });
        }

        // 2. Agar rasm yuborilsa
        if (msg.photo) {
            const photo = msg.photo[msg.photo.length - 1];
            
            // Telegramdan rasm linkini olish
            const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${photo.file_id}`);
            const fileData = await fileRes.json();
            const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;

            // Captionni bo'lish (Nomi | Narxi | Razmer)
            const caption = msg.caption || "Nomsiz | 0 | -";
            const [name, price, size] = caption.split("|").map(s => s.trim());

            // Supabase'ga yozish
            const { error: dbError } = await supabase
                .from('products')
                .insert([{ 
                    name: name || "Nomsiz", 
                    price: price || "0", 
                    size: size || "-", 
                    image_url: imageUrl 
                }]);

            if (dbError) throw dbError;

            // Muvaffaqiyatli javob yuborish
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    chat_id: chatId, 
                    text: "✅ Mahsulot muvaffaqiyatli saytga qo'shildi!\n\n📦 Nomi: " + name + "\n💰 Narxi: " + price 
                })
            });
        } else {
            // Agar rasm bo'lmasa (masalan, shunchaki text yozsa)
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    chat_id: chatId, 
                    text: "Iltimos, mahsulot rasmini yuboring va tagiga ma'lumotlarni yozing." 
                })
            });
        }

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        console.error("Xato:", err);
        return NextResponse.json({ ok: true }); // Telegram qayta-qayta yubormasligi uchun
    }
}
