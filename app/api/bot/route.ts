import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://muwjzycdzavfmasbnsl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU";
const BOT_TOKEN = "8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function POST(req: Request) {
    let chatId: any;
    try {
        const body = await req.json();
        chatId = body.message?.chat?.id;

        if (body.message?.photo) {
            const photo = body.message.photo[body.message.photo.length - 1];
            
            // 1. Rasm linkini olish
            const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${photo.file_id}`);
            const fileData = await fileRes.json();
            const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;

            const caption = body.message.caption || "Nomsiz | 0 | -";
            const [name, price, size] = caption.split("|").map((s: string) => s.trim());

            // 2. Bazaga yozishga urinish
            const { error: dbError } = await supabase
                .from('products')
                .insert([{ 
                    name: name || "Nomsiz", 
                    price: price || "0", 
                    size: size || "-", 
                    image_url: imageUrl 
                }]);

            // 3. AGAR BAZADA XATO BO'LSA - SIZGA AYTADI
            if (dbError) {
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text: "❌ Baza xatosi: " + dbError.message })
                });
                return NextResponse.json({ ok: true });
            }

            // 4. MUVAFFAQIYATLI BO'LSA
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: "✅ Zo'r! Saytga qo'shildi!" })
            });
        }
        return NextResponse.json({ ok: true });
    } catch (err: any) {
        if (chatId) {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: "⚠️ Tizim xatosi: " + err.message })
            });
        }
        return NextResponse.json({ ok: true });
    }
}
