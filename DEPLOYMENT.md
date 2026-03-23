# EASYSHOP UZB - Deployment Guide

This guide will help you deploy the EASYSHOP UZB platform to Vercel and configure all necessary integrations.

## Prerequisites

- GitHub account
- Vercel account
- Telegram bots already created (3 bots)
- Supabase project with credentials

## Step 1: Database Setup

### Option A: Using Supabase Dashboard (Recommended for first time)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to "SQL Editor"
4. Click "New query"
5. Copy and paste the content of `scripts/setup-database.sql`
6. Click "Run"

### Option B: Using the Setup Script (if using Node.js)

```bash
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
node scripts/setup-db.js
```

### Verify Database Setup

1. Go to Supabase Dashboard
2. Click "Tables" in the left sidebar
3. You should see two tables:
   - `products` - stores product images and prices
   - `orders` - stores customer orders

## Step 2: Create Supabase Storage Bucket

For admin bot to upload product images:

1. Go to Supabase Dashboard
2. Click "Storage" → "Buckets"
3. Click "Create a new bucket"
4. Name it: `products`
5. Make it public (checkbox)
6. Click "Create bucket"

### Set Bucket Policies

1. Click on the `products` bucket
2. Click "Policies" tab
3. Add these policies:

**Allow public read:**
```sql
SELECT 1 FROM storage.objects
WHERE bucket_id = 'products'
```

**Allow authenticated upload:**
```sql
INSERT INTO storage.objects (bucket_id, name, owner, owner_id, metadata, file_name)
VALUES ('products', *, auth.uid(), auth.uid(), null, *)
```

## Step 3: Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial EASYSHOP UZB project"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/easyshop-uzb.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

### Option A: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the project
5. Click "Import"

### Configure Environment Variables

In the "Environment Variables" section, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://muwjzycdzavfmasbnsbl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_BOT_TOKEN=8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k
ORDER_BOT_TOKEN=8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA
PAYMENT_BOT_TOKEN=8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA
ADMIN_CHAT_ID=YOUR_ADMIN_TELEGRAM_ID
```

6. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to configure
```

## Step 5: Get Deployed URL

After deployment, Vercel will provide you with a URL like:
```
https://easyshop-uzb.vercel.app
```

This is your website URL.

## Step 6: Configure Telegram Bot Webhooks

### For Admin Bot (Image Uploads)

1. Open Telegram
2. Message @BotFather
3. Send: `/setwebhook`
4. Select your admin bot
5. Enter webhook URL:
   ```
   https://easyshop-uzb.vercel.app/api/webhooks/admin/8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k
   ```

### For Order Bot (Order Notifications)

1. Message @BotFather
2. Send: `/setwebhook`
3. Select your order bot
4. Enter webhook URL:
   ```
   https://easyshop-uzb.vercel.app/api/webhooks/order/8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA
   ```

### For Payment Bot (Payment Confirmations)

1. Message @BotFather
2. Send: `/setwebhook`
3. Select your payment bot
4. Enter webhook URL:
   ```
   https://easyshop-uzb.vercel.app/api/webhooks/payment/8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA
   ```

## Step 7: Verify Deployment

1. Open your deployed website: `https://easyshop-uzb.vercel.app`
2. You should see the product catalog (currently empty)
3. Try uploading a product via the admin bot
4. Refresh the website - product should appear

## Step 8: Test Each Feature

### Test Admin Bot
1. Message your admin bot with:
   ```
   [Send an image with caption: "50" or "$50"]
   ```
2. Bot should respond with "✅ Product added successfully"
3. Product should appear on the website

### Test Order Placement
1. Click "Continue" in the payment modal
2. Fill in the order form:
   - Name: Test Name
   - Phone: +998901234567
   - Address: Test Address
   - Telegram: @yourusername
3. Click "Place Order"
4. You should see the green checkmark "✅" confirmation
5. You should see "7-15 kunda yetib boradi" (Delivered in 7-15 days)

### Test Payment Bot
Orders status will show "pending" until payment is confirmed via payment bot

## Troubleshooting

### Products not appearing?
1. Check Supabase dashboard - are products in the database?
2. Check browser console (F12) for errors
3. Verify webhook URL is correct

### Bot not receiving updates?
1. Verify bot token is correct
2. Check webhook URL is accessible from internet
3. Look at bot logs: `https://api.telegram.org/botTOKEN/getWebhookInfo`

### Storage errors on image upload?
1. Verify `products` bucket exists in Supabase Storage
2. Check bucket is public
3. Verify IAM policies are set correctly

## Production Checklist

- [ ] Database tables created
- [ ] Storage bucket created
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables configured
- [ ] Telegram webhooks configured
- [ ] Admin bot webhook verified
- [ ] Order bot webhook verified
- [ ] Payment bot webhook verified
- [ ] Website accessible at public URL
- [ ] Products can be uploaded via admin bot
- [ ] Orders can be placed
- [ ] Success message shows green checkmark
- [ ] Success message shows "7-15 kunda yetib boradi"

## Monitoring

### View Recent Deployments
```bash
vercel list
```

### View Logs
```bash
vercel logs
```

### Check Bot Webhooks
```bash
curl https://api.telegram.org/botTOKEN/getWebhookInfo
```

## Support

For issues or questions:
1. Check [Supabase Docs](https://supabase.com/docs)
2. Check [Vercel Docs](https://vercel.com/docs)
3. Check [Telegram Bot API Docs](https://core.telegram.org/bots/api)
