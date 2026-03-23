# EASYSHOP UZB - Loyihani Yakunlash uchun To'liq Qo'llanma

## 🎯 Nima Yaratildi?

Siz uchun to'liq e-commerce platform yaratildi:

### ✅ Frontend (Foydalanuvchi interfeysi)
- Elegant sayt (oq va jigarrang ranglar)
- Mahsulot katalogi
- To'lov devoari (50% to'lovni talab qiladi)
- Buyurtma formasi
- **Yashil ✅ belgisi va "7-15 kunda yetib boradi" xabari**

### ✅ Backend (Serverlar va API)
- Admin Bot Webhook - rasmlar yuklash
- Order Bot Webhook - buyurtmalar qabul qilish
- Payment Bot Webhook - to'lovni tekshirish
- Products API - mahsulotlarni yuklash
- Orders API - buyurtmalarni saqlab olish

### ✅ Database (Supabase)
- Products jadavali - rasmlar va narxlar
- Orders jadavali - asosiy buyurtma ma'lumotlari
- Real-time o'zgarishlar

## 🚀 Deployment - 4 Ta'lim Qadami

### 1️⃣ SQL Jadvallati Yaratish (5 min)

Supabase dashboardiga o'ting: https://app.supabase.com

1. SQL Editor → New query
2. Quyidagi kodini copy-paste qiling:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Enable realtime
ALTER TABLE products REPLICA IDENTITY FULL;
ALTER TABLE orders REPLICA IDENTITY FULL;
```

3. **Run** tugmasini bosing

### 2️⃣ Vercel'da Deploy (10 min)

**Variant A: GitHub orqali (Tavsiya qilinadi)**

```bash
# 1. GitHub'ga yangi repo yarating
# 2. Projectni push qiling:

git init
git add .
git commit -m "EASYSHOP UZB"
git remote add origin https://github.com/YOUR_USER/easyshop-uzb.git
git branch -M main
git push -u origin main
```

**Variant B: Vercel CLI orqali**

```bash
npm i -g vercel
vercel login
vercel
# Follow prompts
```

### 3️⃣ Environment Variables (5 min)

Vercel Settings → Environment Variables'da qo'shing:

```
NEXT_PUBLIC_SUPABASE_URL=https://muwjzycdzavfmasbnsbl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Supabase Settings → API dan oling)
ADMIN_BOT_TOKEN=8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k
ORDER_BOT_TOKEN=8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA
PAYMENT_BOT_TOKEN=8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA
ADMIN_CHAT_ID=YOUR_TELEGRAM_ID (Ya'ni @userinfobot /start yozing)
```

4️⃣ Telegram Webhooks (5 min)

Deploymentdan keyin Vercel sizga URLni beradi. Masalan:
```
https://easyshop-uzb.vercel.app
```

Telegram @BotFather ga qo'ng'iroq qiling va har bir bot uchun webhook configure qiling:

**Admin Bot:**
```
https://easyshop-uzb.vercel.app/api/webhooks/admin/8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k
```

**Order Bot:**
```
https://easyshop-uzb.vercel.app/api/webhooks/order/8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA
```

**Payment Bot:**
```
https://easyshop-uzb.vercel.app/api/webhooks/payment/8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA
```

## 📖 Loyihaning Tuzilishi

```
easyshop-uzb/
├── app/
│   ├── api/
│   │   ├── products/
│   │   │   └── route.ts          (Mahsulotlarni yuklash)
│   │   ├── orders/
│   │   │   └── route.ts          (Buyurtmalarni saqlash)
│   │   └── webhooks/
│   │       ├── admin.ts          (Rasm yuklash)
│   │       ├── order.ts          (Buyurtma qabul)
│   │       └── payment.ts        (To'lov tekshirish)
│   ├── page.tsx                  (Asosiy sahifa)
│   ├── layout.tsx                (Asosiy layout)
│   └── globals.css               (Uslublar)
├── components/
│   ├── ProductCatalog.tsx        (Mahsulot ro'yxati)
│   ├── ProductCard.tsx           (Bir mahsulot)
│   ├── PaymentWall.tsx           (To'lov devoari)
│   ├── OrderForm.tsx             (Buyurtma formasi)
│   └── SuccessMessage.tsx        (✅ Xabar)
├── lib/
│   ├── supabase.ts              (Supabase ulanish)
│   ├── telegram.ts              (Telegram API)
│   └── form-schema.ts           (Forma validatsiyasi)
├── scripts/
│   └── setup-database.sql       (SQL jadvallari)
└── [Documentation files]

```

## 🔄 Ishlash Jarayoni

```
Admin Bot (Rasm + Narx)
        ↓
    Admin Webhook
        ↓
   Supabase (Save)
        ↓
   Website (Real-time Update)
        ↓
    User (Ko'radi)
        ↓
   Order Form
        ↓
    Order API
        ↓
    Supabase (Save)
        ↓
    Order Bot (Admin bildiriladi)
```

## 🧪 Test Qilish

### 1. Rasm Yuklash (Admin)

```
Admin Bot → /start
Admin Bot'a rasm yuboring
Caption: "50" yoki "$100"
Bot: "✅ Product added successfully!"
Website: Mahsulot ko'rinadi
```

### 2. Buyurtma Berish

```
Website → "Continue" tugmasi
Form to'ldiring:
  - Ism: Sizning isming
  - Telefon: +998901234567
  - Manzil: Sizning manzilingiz
  - Telegram: @yourusername

"Place Order" bosing
Result: 
  ✅ YASHIL BELGISI
  "7-15 kunda yetib boradi" yozuvi
```

### 3. Order Bot Xabari

```
Order Bot: 
  📦 New Order Received!
  👤 Customer: [Name]
  📱 Phone: [Number]
  📍 Address: [Address]
  💬 Telegram: [@username]
```

## 💾 Important Credentials

Quyidagi ma'lumotlarni ehtiyot bilan saqlang:

```
Supabase:
- URL: https://muwjzycdzavfmasbnsbl.supabase.co
- Anon Key: EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- Service Role: (Supabase Settings da)

Telegram Bots:
- Admin: 8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k
- Order: 8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA
- Payment: 8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA

Admin Chat ID: (Siz)
```

## 📱 O'zbekcha Foydalanuvchi Xabari

Success Screen:

```
┌─────────────────────┐
│        ✅           │
│  Order Accepted!    │
├─────────────────────┤
│ Buyurtmangiz qabul  │
│ qilindi. 24 soat    │
│ ichida aloqa qilamiz│
├─────────────────────┤
│ 7-15 kunda          │
│ yetib boradi        │
├─────────────────────┤
│ Telegram'da update  │
│ yuboriladi          │
└─────────────────────┘
```

## 🐛 Muammolarni Hal Qilish

### Problem: Mahsulotlar ko'rinmaydi

**Buning sabablari:**
1. Supabase jadvallari yaratilmagan
2. Bot rasmni yuklmagan
3. API keylar to'g'ri kiritilmagan

**Hal:**
```
1. Supabase dashboard → Tables (jadvallat borligini tekshiring)
2. Admin Bot'a rasm yuklang
3. Console (F12) → Network → errors?
```

### Problem: Bot xabar olmaydi

**Sababi:** Webhook noto'g'ri

**Hal:**
```
@BotFather → /getwebhookinfo
Webhook URL to'g'rimi?
```

### Problem: Buyurtma sohifasi xato

**Sababi:** Order API xato

**Hal:**
```
1. Environment variables to'g'rimi?
2. Network tab'da error bo'lsa, API keysni tekshiring
```

## ✅ Yakunlash Checklist

- [ ] Supabase SQL script run qildi
- [ ] Vercel'da deployed
- [ ] Environment variables qo'shildi
- [ ] Telegram webhooks configured
- [ ] Admin bot rasm yukladi
- [ ] Mahsulot saytda ko'rinadi
- [ ] Buyurtma formasi ishlaydi
- [ ] ✅ belgisi ko'rinadi
- [ ] "7-15 kunda yetib boradi" ko'rinadi
- [ ] Order bot xabar oldi

## 📞 Tugallash

Agar barchasi bajarilsa - **TAYYOR!**

```
🎉 EASYSHOP UZB Online!
📍 Website: https://easyshop-uzb.vercel.app
🤖 Admin Bot: @YourAdminBot
📦 Order Bot: @YourOrderBot
💳 Payment Bot: @YourPaymentBot
```

## 📚 Qo'shimcha Dokumentlar

- `FINAL_SETUP.md` - O'zbekcha Setup
- `DEPLOYMENT.md` - Vercel Deployment
- `QUICKSTART.md` - Tez Boshlash
- `CONFIG.md` - Konfiguratsiya
- `ARCHITECTURE.md` - Texnik Tuzilish

Hamasi tayyor! 🚀
