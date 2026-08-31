export async function POST(req: Request) {
    const BOT_TOKEN = process.env.ADMIN_BOT_TOKEN || process.env.ORDER_BOT_TOKEN || "8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k";
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://muwjzycdzavfmasbnsl.supabase.co";
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU";

    try {
        const body = await req.json();
        const chatId = body.message?.chat?.id;

        if (body.message?.photo) {
            const photo = body.message.photo[body.message.photo.length - 1];
            
            // 1. Telegramdan fayl yo'lini olish
            const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${photo.file_id}`);
            const fileData = await fileRes.json();
            const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;

            // 2. Ma'lumotlarni ajratish
            const caption = body.message.caption || "Nomsiz | 0 | -";
            const parts = caption.split("|").map(s => s.trim());

            // 3. Supabase'ga to'g'ridan-to'g'ri yozish
            const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: parts[0] || "Nomsiz",
                    price: parts[1] || "0",
                    size: parts[2] || "-",
                    image_url: imageUrl
                })
            });

            // 4. Javob qaytarish
            let text = dbRes.ok ? "✅ Saytga qo'shildi!" : "❌ Baza qabul qilmadi.";
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: text })
            });
        }

        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }
}
