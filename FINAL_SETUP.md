# EASYSHOP UZB - Final Setup Instructions (O'zbekcha)

Assalomu alaykum! Sizning EASYSHOP UZB loyihasi tayyor! Bu faylda barcha setup qadamlarini topasiz.

## 📋 Supabase ma'lumotlar

```
URL: https://muwjzycdzavfmasbnsbl.supabase.co
Anon Key: EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU
```

## 🤖 Telegram Botlar

```
Admin Bot Token:   8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k
Order Bot Token:   8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA
Payment Bot Token: 8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA
```

## ⚙️ 1-qadam: Supabase Database Setup

### Jadvallari yaratish:

1. Supabase dashboardiga o'ting: https://app.supabase.com
2. Loyihangizni tanlang
3. "SQL Editor"ga klik qiling
4. "New query" tugmasini bosing
5. Quyidagi SQL kodini copy-paste qiling:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  telegram_username TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read
CREATE POLICY "Allow public read products" ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert orders" ON orders
  FOR INSERT
  WITH CHECK (true);

-- Enable realtime
ALTER TABLE products REPLICA IDENTITY FULL;
ALTER TABLE orders REPLICA IDENTITY FULL;
```

6. "Run" tugmasini bosing
7. Jadvallat yaratildi!

### Storage Bucket yaratish (rasm yuklash uchun):

1. "Storage" → "Buckets"ga klik qiling
2. "Create a new bucket" tugmasini bosing
3. Nomi: `products`
4. "Make it public" checkboxini belgilang
5. "Create bucket" bosing

## 🔗 2-qadam: Vercel Deploy

### GitHub orqali deploy (tavsiya etiladi):

```bash
# 1. GitHub'ga login qiling va yangi repo yarating
# 2. Kod papkasiga kiring va:

git init
git add .
git commit -m "EASYSHOP UZB - Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/easyshop-uzb.git
git branch -M main
git push -u origin main
```

### Vercel'da deploy:

1. https://vercel.com/new ni oching
2. GitHub reposini tanlang
3. "Import" bosing
4. Environment variables qo'shing (oxirida ko'rsatiladi)
5. "Deploy" bosing

## 🔐 3-qadam: Environment Variables

Vercelda yoki `.env.local` faylda qo'shing:

```
NEXT_PUBLIC_SUPABASE_URL=https://muwjzycdzavfmasbnsbl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
ADMIN_BOT_TOKEN=8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k
ORDER_BOT_TOKEN=8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA
PAYMENT_BOT_TOKEN=8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA
ADMIN_CHAT_ID=YOUR_TELEGRAM_ID
```

**Service Role Key olish:**
1. Supabase Settings → API
2. "Service Role" keysini copy qiling

**Admin Chat ID olish:**
1. @userinfobot ga /start yozing
2. Sizning ID raqamingizni olib, `.env.local`ga qo'shing

## 📡 4-qadam: Telegram Webhook Configure

Deploymentdan keyin sizda link bo'ladi. Masalan:
```
https://easyshop-uzb.vercel.app
```

### Admin Bot Webhook:

1. Telegram da @BotFather ga /setwebhook yozing
2. Admin botni tanlang
3. Webhook URL sifatida kiriting:
```
https://easyshop-uzb.vercel.app/api/webhooks/admin/8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k
```

### Order Bot Webhook:

1. @BotFather ga /setwebhook yozing
2. Order botni tanlang
3. Webhook URL:
```
https://easyshop-uzb.vercel.app/api/webhooks/order/8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA
```

### Payment Bot Webhook:

1. @BotFather ga /setwebhook yozing
2. Payment botni tanlang
3. Webhook URL:
```
https://easyshop-uzb.vercel.app/api/webhooks/payment/8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA
```

## ✅ 5-qadam: Test qiling

### Rasm yuklash (Admin Bot):

1. Admin botga rasm yuboring va caption sifatida narxi yozing:
   ```
   50
   ```
   yoki
   ```
   $100
   ```

2. Bot javob beradi: "✅ Product added successfully!"
3. Saytni refresh qiling - mahsulot ko'rinadi

### Buyurtma berish:

1. Saytga kiring
2. "Continue" tugmasini bosing
3. Formani to'ldiring:
   - Ism: Sizning isming
   - Telefon: +998901234567
   - Manzil: Sizning manzilingiz
   - Telegram: @yourusername

4. "Place Order" bosing
5. **Buyuk yashil ✅ belgisini ko'rasiz**
6. **"7-15 kunda yetib boradi" yozuvini ko'rasiz** ← Bu asosiy!

## 📊 Admin Dashboard (Ixtiyoriy)

Barcha buyurtmalarni ko'rish uchun:
```
https://easyshop-uzb.vercel.app/admin/orders
```

## 🐛 Muammolar hal qilish

### Mahsulotlar ko'rinmaydi?
- Supabase'da jadvallat borligini tekshiring
- Rasm shu bot orqali yuklandi?
- Network tab'da errors bormi (F12)?

### Bot xabar olmaydi?
- Webhook URL to'g'rimi?
- @BotFather /getwebhookinfo yozing

### Rasmlarni yuklob bo'lmaydi?
- Storage bucket public ekanini tekshiring
- Bucket nomi "products" ekanini tekshiring

## 📱 Saytni Mobile da Test qiling

1. Telefonda Telegramga o'ting
2. Admin botga rasm yuklang (narxi bilan)
3. Brauzerga kiring: https://YOUR_DEPLOYED_URL
4. Mahsulotni ko'rish kerak
5. Buyurtma berish va ✅ ko'rish kerak

## 🎯 Tugallash uchun Checklist

- [ ] Supabase jadvallari yaratildi
- [ ] Storage bucket yaratildi
- [ ] Vercel'da deployed
- [ ] Environment variables qo'shildi
- [ ] Telegram webhooks configured
- [ ] Admin bot sinus rasm yukladi
- [ ] Mahsulot saytda ko'rinadi
- [ ] Buyurtma formasi ishlaydi
- [ ] ✅ va "7-15 kunda yetib boradi" ko'rinadi

## 🚀 Boshlash

Endi tayyor! Qadamlarni bajaring:

1. SQL jadvallati yaratish ✅
2. Vercel'da deploy qilish ✅
3. Webhooks configure qilish ✅
4. Test qilish ✅

Tayyor! 🎉

## Savollari bo'lsa?

- Supabase docs: https://supabase.com/docs
- Vercel docs: https://vercel.com/docs
- Telegram Bot docs: https://core.telegram.org/bots
