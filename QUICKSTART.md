# EASYSHOP UZB - Quick Start Guide

Get up and running with EASYSHOP UZB in 10 minutes.

## 1. Clone the Project

If you don't have the code yet, clone or download it:
```bash
git clone <your-repo-url>
cd easyshop-uzb
```

## 2. Install Dependencies

```bash
pnpm install
```

## 3. Setup Environment Variables

Create `.env.local` file in the project root:

```bash
# Copy the example file as a starting point
cp .env.local.example .env.local
```

Edit `.env.local` and add:

### Supabase Keys
Go to [supabase.com](https://supabase.com):
1. Create a new project
2. Get your keys from Settings → API
3. Add them to `.env.local`

### Telegram Bot Tokens
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create 3 bots (Admin, Payment, Order)
3. Copy tokens to `.env.local`

### Admin Details
1. Open Telegram and search [@userinfobot](https://t.me/userinfobot)
2. Get your numeric user ID
3. Add your username and chat ID to `.env.local`

## 4. Setup Supabase Database

Go to your Supabase project dashboard:

### SQL Editor
Run this SQL to create tables:

```sql
-- Create Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  telegram_username TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE products;
```

## 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 6. Test Locally

### Add a Test Product

Send a photo to the Admin Bot with caption: `$99.99`

It should appear on the website instantly!

### Place a Test Order

1. Click "Unlock Catalog"
2. Click "Buy Now" on any product
3. Fill out the form
4. Submit the order
5. Check your admin Telegram chat for the notification

## 7. Deploy to Vercel

### Push to GitHub

```bash
git add .
git commit -m "Initial EASYSHOP UZB setup"
git push origin main
```

### Deploy

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your repository
4. Add environment variables from `.env.local`
5. Click "Deploy"

### Setup Webhooks

After deployment, register webhook URLs with Telegram:

```bash
# For each bot, run in your terminal or browser:
curl https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-project.vercel.app/api/webhooks/admin
curl https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-project.vercel.app/api/webhooks/payment
curl https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-project.vercel.app/api/webhooks/order
```

Replace `<TOKEN>` with actual bot tokens and `your-project` with your Vercel URL.

## 8. You're Ready!

Your EASYSHOP UZB store is now live!

- **Add products** → Send photos to Admin Bot
- **Accept orders** → Orders appear in your Telegram
- **Manage inventory** → See everything in Supabase dashboard

## Common Tasks

### Add a New Product

1. Open Telegram
2. Find the Admin Bot
3. Send a photo of the product
4. Add caption with price: `$99.99` or `100.00`
5. Done! It appears on the website instantly

### Handle Customer Orders

1. Customer orders on the website
2. You receive notification in Telegram
3. Contact customer to confirm delivery details
4. Mark order as processed

### Change Price of a Product

Currently, to update a product:
1. Go to Supabase dashboard
2. Find the product in the `products` table
3. Edit the `price` column
4. Website updates instantly

### Add More Admins

To add more people to receive notifications:

1. They get their chat ID from [@userinfobot](https://t.me/userinfobot)
2. In your project code, update `/lib/telegram.ts`
3. Redeploy

## Environment Variables Checklist

- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] ADMIN_BOT_TOKEN
- [ ] PAYMENT_BOT_TOKEN
- [ ] ORDER_BOT_TOKEN
- [ ] NEXT_PUBLIC_ADMIN_USERNAME
- [ ] ADMIN_CHAT_ID

## Need Help?

1. Check [SETUP.md](./SETUP.md) for detailed setup instructions
2. Check [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for bot integration details
3. Check Vercel logs for deployment errors
4. Test bots directly in Telegram

## Next Steps

1. Customize the design in `app/globals.css`
2. Add your logo to `public/` folder
3. Update company info in `app/page.tsx`
4. Add terms & conditions
5. Setup payment verification system

Happy selling!
