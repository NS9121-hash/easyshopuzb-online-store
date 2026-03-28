import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const chatId = body.message?.chat?.id;
        const BOT_TOKEN = "8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k";

        // HAR QANDAY xabarga javob qaytarish
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: chatId, 
                text: "Alo! Men sizni eshityapman. Sayt manzili: " + req.url 
            })
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json({ ok: true });
    }
}
