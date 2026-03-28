import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://muwjzycdzavfmasbnsl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU";
const BOT_TOKEN = "8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k";

const ALLOWED_USERS = [5249524506, 5212098605];

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const senderId = body.message?.from?.id;

        if (!ALLOWED_USERS.includes(senderId)) return NextResponse.json({ ok: true });

        if (body.message?.photo) {
            const photo = body.message.photo[body.message.photo.length - 1];
            
            // Rasmni olish
            const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${photo.file_id}`);
            const fileData = await fileRes.json();
            const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;

            // Captionni bo'lish
            const caption = body.message.caption || "Nomsiz | 0 | -";
            const parts = caption.split("|").map(s => s.trim());
            const name = parts[0] || "Nomsiz";
            const price = parts[1] || "0";
            const size = parts[2] || "-";

            // BAZAGA YOZISH (Xatolikni tekshirish bilan)
            const { error: dbError } = await supabase
                .from('products')
                .insert([{ name, price, size, image_url: imageUrl }]);

            if (dbError) {
                console.error("Supabase xatosi:", dbError);
                throw dbError;
            }

            // JAVOB YUBORISH
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    chat_id: body.message.chat.id, 
                    text: "✅ Mahsulot muvaffaqiyatli saytga qo'shildi!" 
                })
            });
        }
        return NextResponse.json({ ok: true });
    } catch (err: any) {
        // Xatoni aniq log qilish
        console.error("To'liq xato:", err.message || err);
        return NextResponse.json({ ok: false, error: err.message });
    }
}
