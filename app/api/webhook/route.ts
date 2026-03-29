import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ALLOWED_USERS = [5249524506, 5212098605]; // Siz va do'stingiz

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body.message?.from?.id;

    if (!ALLOWED_USERS.includes(userId)) return NextResponse.json({ ok: false });

    // --- ADMIN BO'LIMI: MAHSULOT QO'SHISH ---
    if (body.message?.photo && body.message?.caption) {
      const caption = body.message.caption; 
      const [name, price, sizes] = caption.split('|').map((s: string) => s.trim());
      
      const fileId = body.message.photo[body.message.photo.length - 1].file_id;
      
      const fileRes = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${fileId}`);
      const fileData = await fileRes.json();
      const imageUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${fileData.result.file_path}`;

      await supabase.from('clothes').insert([{ 
        name, 
        price: parseInt(price.replace(/\D/g, '')), 
        sizes, 
        image_url: imageUrl 
      }]);
      
      return NextResponse.json({ ok: true, message: 'Mahsulot bazaga qo\'shildi!' });
    }

    // --- ORDER BO'LIMI (Kelajakda shu yerga yozamiz) ---
    if (body.callback_query) {
       // Bu yerda zakazlarni qabul qilamiz...
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false });
  }
}

