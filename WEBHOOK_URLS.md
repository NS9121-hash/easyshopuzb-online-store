# EASYSHOP UZB - Webhook URLs & Configuration

## 🔗 Webhook URLs (Ready to Use)

Replace `YOUR_DOMAIN` with your actual Vercel domain (e.g., `easyshop-uzb.vercel.app`)

### Admin Bot Webhook (Image Uploads)
```
https://YOUR_DOMAIN/api/webhooks/admin/8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k
```

**Token:** `8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k`

**Purpose:** Upload product images with prices

**How to set:**
1. Message @BotFather in Telegram
2. Send: `/setwebhook`
3. Select this bot
4. Paste the full URL above

### Order Bot Webhook (Order Notifications)
```
https://YOUR_DOMAIN/api/webhooks/order/8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA
```

**Token:** `8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA`

**Purpose:** Receive customer order notifications

**How to set:**
1. Message @BotFather in Telegram
2. Send: `/setwebhook`
3. Select this bot
4. Paste the full URL above

### Payment Bot Webhook (Payment Verification)
```
https://YOUR_DOMAIN/api/webhooks/payment/8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA
```

**Token:** `8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA`

**Purpose:** Verify payment confirmations

**How to set:**
1. Message @BotFather in Telegram
2. Send: `/setwebhook`
3. Select this bot
4. Paste the full URL above

---

## 🔐 Environment Variables

Add these to Vercel (Settings → Environment Variables):

```env
NEXT_PUBLIC_SUPABASE_URL=https://muwjzycdzavfmasbnsbl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d2p6eWNkemF2Zm1hc2Juc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjI5MDMsImV4cCI6MjA4OTgzODkwM30.z-TZQXxK_ERd3c9e7U4jCes_bwMOFVM8g5kJ1RejZQU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Get from Supabase Settings → API)
ADMIN_BOT_TOKEN=8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k
ORDER_BOT_TOKEN=8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA
PAYMENT_BOT_TOKEN=8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA
ADMIN_CHAT_ID=YOUR_TELEGRAM_ID (Get by messaging @userinfobot)
```

---

## 📍 API Endpoints

### Public Endpoints (No Auth)

**GET Products**
```
https://YOUR_DOMAIN/api/products
```
Returns: All products with images and prices

**POST Order**
```
https://YOUR_DOMAIN/api/orders
```
Request body:
```json
{
  "customer_name": "John Doe",
  "phone": "+998901234567",
  "address": "123 Main Street",
  "telegram_username": "@johndoe"
}
```

### Webhook Endpoints (Telegram Only)

**POST Admin Webhook**
```
https://YOUR_DOMAIN/api/webhooks/admin/TOKEN
```

**POST Order Webhook**
```
https://YOUR_DOMAIN/api/webhooks/order/TOKEN
```

**POST Payment Webhook**
```
https://YOUR_DOMAIN/api/webhooks/payment/TOKEN
```

---

## ✅ Testing Webhooks

### Test Admin Bot Webhook

```bash
# Check webhook status
curl https://api.telegram.org/bot8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k/getWebhookInfo

# Expected response includes:
# "url": "https://YOUR_DOMAIN/api/webhooks/admin/..."
# "pending_update_count": 0
# "last_error_date": 0
```

### Test Order Bot Webhook

```bash
# Check webhook status
curl https://api.telegram.org/bot8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA/getWebhookInfo
```

### Test Payment Bot Webhook

```bash
# Check webhook status
curl https://api.telegram.org/bot8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA/getWebhookInfo
```

---

## 🔄 Complete Setup Flow

```
1. Deploy to Vercel
   ↓
2. Get deployment URL
   ↓
3. Set webhook URLs above
   ↓
4. Verify webhooks with @BotFather
   ↓
5. Test admin bot upload
   ↓
6. Test order placement
   ↓
7. Monitor Telegram notifications
```

---

## 🧪 Manual Testing

### Test 1: Upload Product

```bash
# Message admin bot with:
/start
# Then send an image with caption: "50"

# Bot should respond:
✅ Product added successfully!
```

### Test 2: Check Product API

```bash
curl https://YOUR_DOMAIN/api/products

# Response:
{
  "products": [
    {
      "id": "uuid",
      "image_url": "https://...",
      "price": 50,
      "created_at": "2026-03-23..."
    }
  ]
}
```

### Test 3: Place Order

```bash
curl -X POST https://YOUR_DOMAIN/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test User",
    "phone": "+998901234567",
    "address": "Test Address",
    "telegram_username": "@testuser"
  }'

# Response:
{
  "success": true,
  "message": "Order placed successfully"
}
```

---

## 📊 Webhook Request/Response Format

### Admin Bot Receives:

```json
{
  "update_id": 123456789,
  "message": {
    "message_id": 1,
    "date": 1234567890,
    "chat": {
      "id": -987654321,
      "type": "private"
    },
    "photo": [
      {
        "file_id": "AgAC...",
        "file_unique_id": "AQAD..."
      }
    ],
    "caption": "50"
  }
}
```

### Admin Bot Sends:

```json
{
  "ok": true
}
```

---

## 🛠️ Troubleshooting Webhooks

### Issue: "Webhook was not set"

**Solution:**
1. Check token is correct
2. Check URL is HTTPS (not HTTP)
3. Check URL is publicly accessible
4. Wait 30 seconds and try again

### Issue: "Webhook was deleted"

**Solution:**
1. Vercel deployment might have failed
2. Check Vercel logs: `vercel logs`
3. Re-deploy if needed

### Issue: No updates from bot

**Solution:**
```bash
# Check webhook info
curl https://api.telegram.org/botTOKEN/getWebhookInfo

# If has_custom_certificate is false and pending_update_count is 0:
# - Webhook is set correctly
# - Messages are being processed
# - Check your code for bugs
```

---

## 📋 Configuration Summary

| Item | Value |
|------|-------|
| **Supabase URL** | `https://muwjzycdzavfmasbnsbl.supabase.co` |
| **Admin Bot Token** | `8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k` |
| **Order Bot Token** | `8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA` |
| **Payment Bot Token** | `8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA` |
| **Database** | PostgreSQL via Supabase |
| **Hosting** | Vercel |
| **Real-time Updates** | Supabase Realtime |

---

## 🎯 Next Steps

1. Replace `YOUR_DOMAIN` in webhook URLs with your actual Vercel domain
2. Add webhook URLs to each bot via @BotFather
3. Test each webhook
4. Monitor Vercel logs
5. Start receiving orders!

---

**Version:** 1.0.0  
**Last Updated:** 2026-03-23  
**Status:** Production Ready
