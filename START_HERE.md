# 🎉 EASYSHOP UZB - START HERE

Assalomu alaykum! Your complete e-commerce platform is ready. Follow these steps to launch.

## ✅ What You Have

A full-stack e-commerce platform with:

- **Website** - Modern responsive design (white & brown theme)
- **Product Catalog** - Real-time updates
- **Payment Wall** - 50% upfront payment required
- **Order Form** - Customer information collection
- **Success Screen** - **Green ✅ checkmark + "7-15 kunda yetib boradi"**
- **3 Telegram Bots** - Admin, Orders, Payments
- **Database** - Supabase PostgreSQL
- **Hosting** - Ready for Vercel

## 🚀 Launch in 4 Steps (30 minutes)

### Step 1: Setup Supabase Database (5 min)

1. Go to https://app.supabase.com
2. Open SQL Editor
3. Copy-paste this SQL:

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  telegram_username TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON orders FOR INSERT WITH CHECK (true);

ALTER TABLE products REPLICA IDENTITY FULL;
ALTER TABLE orders REPLICA IDENTITY FULL;
```

4. Click **Run**
5. ✅ Done!

### Step 2: Create Storage Bucket (2 min)

1. Go to **Storage** → **Buckets**
2. Click **Create a new bucket**
3. Name: `products`
4. Check **Make it public**
5. Click **Create bucket**
6. ✅ Done!

### Step 3: Deploy to Vercel (10 min)

**Option A: GitHub (Recommended)**

```bash
git init
git add .
git commit -m "EASYSHOP UZB"
git remote add origin https://github.com/YOUR_USER/easyshop-uzb.git
git branch -M main
git push -u origin main
```

Then:
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Click **Import**

**Option B: Vercel CLI**

```bash
npm i -g vercel
vercel
# Follow prompts
```

### Step 4: Add Environment Variables (5 min)

In Vercel Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://muwjzycdzavfmasbnsbl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU
SUPABASE_SERVICE_ROLE_KEY=GET_FROM_SUPABASE
ADMIN_BOT_TOKEN=8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k
ORDER_BOT_TOKEN=8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA
PAYMENT_BOT_TOKEN=8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA
ADMIN_CHAT_ID=YOUR_TELEGRAM_ID
```

**To get missing values:**

- **Service Role Key**: Supabase → Settings → API → Service Role (Copy)
- **Admin Chat ID**: Message @userinfobot in Telegram → /start (Get your ID)

✅ Deploy!

## 🔗 Configure Telegram Webhooks (5 min)

After Vercel deployment, you'll have a URL like:
```
https://easyshop-uzb.vercel.app
```

**For each bot**, message @BotFather and set webhook:

**Admin Bot:**
```
/setwebhook
Select admin bot (8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k)
Webhook: https://easyshop-uzb.vercel.app/api/webhooks/admin/8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k
```

**Order Bot:**
```
/setwebhook
Select order bot (8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA)
Webhook: https://easyshop-uzb.vercel.app/api/webhooks/order/8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA
```

**Payment Bot:**
```
/setwebhook
Select payment bot (8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA)
Webhook: https://easyshop-uzb.vercel.app/api/webhooks/payment/8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA
```

## 🧪 Test Everything

### Test 1: Upload Product

1. Message **admin bot**: `/start`
2. Send an **image** with caption: `50` (or `$100`)
3. Bot says: "✅ Product added successfully!"
4. Go to your website
5. **Refresh page** → Product should appear!

### Test 2: Place Order

1. On website, click **"Continue"**
2. Fill form:
   - Name: John
   - Phone: +998901234567
   - Address: My Address
   - Telegram: @myusername
3. Click **"Place Order"**
4. **You should see:**
   - ✅ Green checkmark (BIG and GREEN)
   - **"7-15 kunda yetib boradi"** (Delivered in 7-15 days)

### Test 3: Check Order Bot

1. Go to Telegram
2. Check **order bot** messages
3. Should show order details received!

## 📊 How It Works

```
Admin Bot (You)
   ↓ [Send image + price]
   ↓
Admin Webhook
   ↓ [Download from Telegram, upload to Supabase]
   ↓
Database (Products)
   ↓ [Real-time update]
   ↓
Website (Shows products)
   ↓
Customer (Sees products)
   ↓ [Fills order form]
   ↓
Order API
   ↓ [Saves to database]
   ↓
Order Bot (You receive notification)
   ↓
Customer gets ✅ confirmation with "7-15 kunda yetib boradi"
```

## 📋 Quick Commands

**Check webhook status:**
```bash
curl https://api.telegram.org/bot8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k/getWebhookInfo
```

**View Vercel logs:**
```bash
vercel logs
```

**Redeploy:**
```bash
vercel --prod
```

## 📚 Documentation

- **FINAL_SETUP.md** - Detailed O'zbekcha setup
- **DEPLOYMENT.md** - Full deployment guide
- **DEPLOYMENT_CHECKLIST.md** - Verification checklist
- **WEBHOOK_URLS.md** - Webhook reference
- **COMPLETE_GUIDE.md** - Complete reference

## 🎯 Verification Checklist

Before launching:

- [ ] Supabase tables created
- [ ] Storage bucket created
- [ ] Vercel deployment successful
- [ ] Environment variables added
- [ ] Telegram webhooks configured
- [ ] Admin bot can upload products
- [ ] Products appear on website
- [ ] Order form works
- [ ] ✅ Shows on success (GREEN!)
- [ ] "7-15 kunda yetib boradi" shows on success
- [ ] Order bot receives notifications

## 🚀 Launch!

When all ✅ items are done:

```
EASYSHOP UZB is LIVE! 🎉

📍 Website: https://YOUR_DOMAIN
🤖 Admin Bot: Accepting uploads
📦 Order Bot: Receiving orders
💳 Payment Bot: Configured
```

## 💬 Need Help?

Check these first:

1. **Products not showing?**
   - Did you create tables in Supabase?
   - Did you upload a test product?
   - Refresh the website

2. **Bot not receiving messages?**
   - Check webhook URL is correct
   - Use @BotFather /getwebhookinfo
   - Is Vercel deployed?

3. **Success message not showing?**
   - Check browser console (F12)
   - Is order API working?
   - Check Vercel logs

## 🎁 Bonus Features Included

✅ Real-time product updates
✅ Mobile responsive design
✅ Form validation
✅ Dark mode support
✅ Error handling
✅ Image optimization
✅ Telegram notifications
✅ Database with RLS
✅ Webhook security
✅ Production ready

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure webhooks
3. ✅ Test everything
4. ✅ Launch website
5. ✅ Start selling!

---

**Status:** ✅ Production Ready  
**Created:** 2026-03-23  
**Version:** 1.0.0

**Good luck! You've got this! 🚀**

For detailed setup, see: `FINAL_SETUP.md` (O'zbekcha) or `DEPLOYMENT.md` (English)
