import { NextResponse } from 'next/server';

const SUPABASE_URL = "https://muwjzycdzavfmasbnsl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU";
const BOT_TOKEN = "8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const chatId = body.message?.chat?.id;

        if (body.message?.photo) {
            const photo = body.message.photo[body.message.photo.length - 1];
            
            // 1. Telegramdan rasm yo'lini olish
            const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${photo.file_id}`);
            const fileData = await fileRes.json();
            const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;

            // 2. Captionni bo'lish
            const caption = body.message.caption || "Nomsiz | 0 | -";
            const [name, price, size] = caption.split("|").map(s => s.trim());

            // 3. Supabase'ga to'g'ridan-to'g'ri FETCH orqali yozish
            const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    name: name || "Nomsiz",
                    price: price || "0",
                    size: size || "-",
                    image_url: imageUrl
                })
            });

            if (!dbRes.ok) {
                const errorText = await dbRes.text();
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text: "❌ Xato: " + errorText })
                });
                return NextResponse.json({ ok: true });
            }

            // 4. Muvaffaqiyatli javob
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: "✅ Zo'r! Mahsulot saytga qo'shildi!" })
            });
        }
        
        return NextResponse.json({ ok: true });
    } catch (err: any) {
        return NextResponse.json({ ok: true });
    }
}
