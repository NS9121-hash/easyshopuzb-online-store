import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body.message?.from?.id;
    const text = body.message?.text || body.message?.caption;

    // DIQQAT: Logs-da ko'rish uchun:
    console.log("----------------------------");
    console.log("BOTDAN XABAR KELDI!");
    console.log("FOYDALANUVCHI ID:", userId);
    console.log("XABAR MATNI:", text);
    console.log("----------------------------");

    return NextResponse.json({ ok: true, your_id: userId });
  } catch (err) {
    console.error("LOGS ERROR:", err);
    return NextResponse.json({ ok: false });
  }
}
