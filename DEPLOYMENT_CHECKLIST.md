# 🚀 EASYSHOP UZB - Deployment Checklist

Complete this checklist to launch your e-commerce platform.

## Phase 1: Supabase Setup (15 minutes)

- [ ] Create Supabase project at https://app.supabase.com
- [ ] Copy project URL and Anon Key
- [ ] Go to SQL Editor
- [ ] Create `products` table (run SQL script from setup-database.sql)
- [ ] Create `orders` table
- [ ] Verify tables exist in "Tables" section
- [ ] Create `products` Storage bucket
- [ ] Make bucket public
- [ ] Get Service Role Key from Settings → API
- [ ] Enable Row Level Security
- [ ] Enable Realtime for both tables

**Credentials to save:**
```
✓ NEXT_PUBLIC_SUPABASE_URL
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
✓ SUPABASE_SERVICE_ROLE_KEY
```

## Phase 2: Telegram Bot Setup (10 minutes)

- [ ] Have 3 Telegram bot tokens ready:
  - [ ] Admin Bot: `8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k`
  - [ ] Order Bot: `8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA`
  - [ ] Payment Bot: `8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA`
- [ ] Get your Telegram Admin ID (message @userinfobot)
- [ ] Save all tokens and ID

**Credentials to save:**
```
✓ ADMIN_BOT_TOKEN
✓ ORDER_BOT_TOKEN
✓ PAYMENT_BOT_TOKEN
✓ ADMIN_CHAT_ID
```

## Phase 3: GitHub & Version Control (5 minutes)

- [ ] Create GitHub repository
- [ ] Clone repository locally (or create new)
- [ ] Copy project files to repo
- [ ] Run: `git init`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial EASYSHOP UZB commit"`
- [ ] Add remote: `git remote add origin https://github.com/YOUR_USER/repo-name.git`
- [ ] Push: `git push -u origin main`
- [ ] Verify files on GitHub

## Phase 4: Vercel Deployment (10 minutes)

### Option A: Vercel Dashboard

- [ ] Go to https://vercel.com/new
- [ ] Click "Import Project"
- [ ] Select your GitHub repository
- [ ] Click "Import"
- [ ] Vercel creates project
- [ ] Go to Settings → Environment Variables
- [ ] Add all variables:
  ```
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  ADMIN_BOT_TOKEN
  ORDER_BOT_TOKEN
  PAYMENT_BOT_TOKEN
  ADMIN_CHAT_ID
  ```
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] **SAVE YOUR DEPLOYMENT URL** (will look like: https://easyshop-uzb.vercel.app)

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --env NEXT_PUBLIC_SUPABASE_URL=... --env NEXT_PUBLIC_SUPABASE_ANON_KEY=... ...
```

## Phase 5: Telegram Webhook Configuration (15 minutes)

Now you have your Vercel URL. Example:
```
https://easyshop-uzb.vercel.app
```

### For Each Bot, Message @BotFather:

1. **Admin Bot** (@BotFather → /setwebhook)
   - [ ] Select admin bot
   - [ ] Enter URL: `https://YOUR_DOMAIN/api/webhooks/admin/8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k`
   - [ ] Bot replies: "Webhook was set"

2. **Order Bot** (@BotFather → /setwebhook)
   - [ ] Select order bot
   - [ ] Enter URL: `https://YOUR_DOMAIN/api/webhooks/order/8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA`
   - [ ] Bot replies: "Webhook was set"

3. **Payment Bot** (@BotFather → /setwebhook)
   - [ ] Select payment bot
   - [ ] Enter URL: `https://YOUR_DOMAIN/api/webhooks/payment/8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA`
   - [ ] Bot replies: "Webhook was set"

### Verify Webhooks

```bash
# For each bot, run:
curl https://api.telegram.org/bot8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k/getWebhookInfo

# Should show: "has_custom_certificate": false, "pending_update_count": 0
```

## Phase 6: Testing (15 minutes)

### Test 1: Upload Product via Admin Bot

- [ ] Open Telegram
- [ ] Message admin bot: `/start`
- [ ] Send an image with caption: `50` or `$100`
- [ ] Bot responds: "✅ Product added successfully!"
- [ ] Go to website: `https://YOUR_DOMAIN`
- [ ] Refresh page
- [ ] [ ] **Product appears on homepage**

### Test 2: Place Order

- [ ] On website, click "Continue" button
- [ ] Fill order form:
  - [ ] Name: "Test Customer"
  - [ ] Phone: "+998901234567"
  - [ ] Address: "123 Main Street"
  - [ ] Telegram: "@yourusername"
- [ ] Click "Place Order"
- [ ] **See green ✅ checkmark** ← IMPORTANT!
- [ ] **See text "7-15 kunda yetib boradi"** ← IMPORTANT!
- [ ] Success modal appears
- [ ] Message "@yourusername" in Telegram to close modal

### Test 3: Receive Order Notification

- [ ] Go to Telegram
- [ ] Check Order Bot message
- [ ] Should show:
  ```
  📦 New Order Received!
  👤 Customer: Test Customer
  📱 Phone: +998901234567
  📍 Address: 123 Main Street
  💬 Telegram: @yourusername
  Status: Pending Payment
  ```
- [ ] **Order notification received** ← IMPORTANT!

### Test 4: Mobile Testing

- [ ] Open phone browser
- [ ] Go to: `https://YOUR_DOMAIN`
- [ ] [ ] Check: Layout is responsive
- [ ] [ ] Check: Text is readable (no zoom needed)
- [ ] [ ] Check: Buttons are clickable (44px minimum)
- [ ] [ ] Try placing order from mobile
- [ ] [ ] See success modal with ✅ on mobile

## Phase 7: Production Verification

### Database Check

- [ ] Go to Supabase dashboard
- [ ] Click "Table Editor"
- [ ] Check `products` table:
  - [ ] Has your test product
  - [ ] Image URL is valid
  - [ ] Price is correct
- [ ] Check `orders` table:
  - [ ] Has your test order
  - [ ] All fields populated
  - [ ] Created timestamp is correct

### Website Check

- [ ] Homepage loads
- [ ] Products display with images
- [ ] Images load without errors
- [ ] Payment wall appears after clicking Continue
- [ ] Order form validates inputs
- [ ] Success message shows ✅
- [ ] Success message shows "7-15 kunda yetib boradi"

### Performance Check

- [ ] Page loads in under 3 seconds
- [ ] Images are optimized
- [ ] No console errors (F12 → Console)
- [ ] Network requests successful (F12 → Network)

## Phase 8: Final Verification

### Code Quality

- [ ] No console.log debug statements
- [ ] No TODO comments
- [ ] Environment variables not hardcoded
- [ ] Sensitive keys in .env only

### Security

- [ ] No credentials in GitHub
- [ ] .env.local in .gitignore
- [ ] Supabase RLS policies set
- [ ] Admin endpoints protected
- [ ] API validates all inputs

### Documentation

- [ ] README.md updated
- [ ] DEPLOYMENT.md reviewed
- [ ] Environment variables documented
- [ ] Webhook URLs documented

## 🎯 Launch Readiness Checklist

- [ ] All tests passed
- [ ] Website accessible at public URL
- [ ] All 3 bots configured
- [ ] Admin bot can upload products
- [ ] Products appear on website
- [ ] Orders can be placed
- [ ] Green ✅ appears on success
- [ ] "7-15 kunda yetib boradi" text visible
- [ ] Order notifications received
- [ ] Mobile responsive
- [ ] No errors in console
- [ ] Database populated correctly
- [ ] Webhooks verified working

## 🚀 Launch!

When all items are checked:

```
✅ EASYSHOP UZB is LIVE!

📍 Website: https://YOUR_DOMAIN
🤖 Admin Bot: Accepting product uploads
📦 Order Bot: Receiving orders
💳 Payment Bot: Ready for payments
```

## Post-Launch Monitoring

- [ ] Monitor Vercel logs daily
- [ ] Check Supabase for new orders
- [ ] Monitor Telegram bot activity
- [ ] Respond to customer inquiries via Telegram
- [ ] Track website traffic
- [ ] Update products regularly

## Emergency Contacts

- **Supabase Status**: https://status.supabase.com
- **Vercel Status**: https://www.vercel-status.com
- **Telegram Bot Support**: @BotFather
- **Support Email**: (Add your support email)

---

**Last Updated:** 2026-03-23
**Version:** 1.0.0
**Status:** Production Ready

🎉 Congratulations on launching EASYSHOP UZB!
