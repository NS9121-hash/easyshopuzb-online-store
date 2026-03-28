import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://muwjzycdzavfmasbnsl.supabase.co";
const SUPABASE_ANON_KEY = "EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU";
const BOT_TOKEN = "8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k";

// 🔐 FAQAT SIZ VA DO'STINGIZ UCHUN RUXSAT (ID RAQAMLAR)
const ALLOWED_USERS = [
    5249524506, // Sizning ID raqamingiz
    5212098605  // Do'stingizning ID raqami
];

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // 🆔 Xabar yuborgan odamning ID raqamini aniqlaymiz
        const senderId = body.message?.from?.id;

        // 🛑 TEKSHIRUV: Agar ID ro'yxatda bo'lmasa, kod bu yerda to'xtaydi
        if (!senderId || !ALLOWED_USERS.includes(senderId)) {
            console.log("Ruxsatsiz foydalanuvchi:", senderId);
            return NextResponse.json({ ok: true }); 
        }

        // 📸 Agar ruxsat berilgan odam rasm yuborsa
        if (body.message?.photo) {
            const photo = body.message.photo[body.message.photo.length - 1];
            const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${photo.file_id}`);
            const fileData = await fileRes.json();
            const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;

            // Caption format: "Nomi | Narxi | Razmer"
            const [name, price, size] = (body.message.caption || "Nomsiz | 0 | -").split("|").map((s: string) => s.trim());

            const { error } = await supabase.from('products').insert([{ 
                name, 
                price, 
                size, 
                image_url: imageUrl 
            }]);

            if (error) throw error;

            // Tasdiqlash xabari
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
    } catch (err) {
        console.error("Xato yuz berdi:", err);
        return NextResponse.json({ ok: false });
    }
}
