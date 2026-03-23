# EASYSHOP UZB - Setup Guide

This guide walks you through setting up the EASYSHOP UZB clothing store application with Telegram bot integration.

## Prerequisites

- Node.js 18+ and pnpm
- Telegram Bot API tokens (3 bots)
- Supabase account (for database)
- Environment variables configured

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Create Telegram Bots

You'll need to create 3 Telegram bots. Contact [@BotFather](https://t.me/botfather) on Telegram:

### Bot 1: Admin Bot (for product uploads)
1. Message `/newbot` to @BotFather
2. Name: "EASYSHOP Admin Bot"
3. Username: "easyshop_admin_bot"
4. Copy the token → `ADMIN_BOT_TOKEN`

### Bot 2: Payment Bot (for payment verification)
1. Repeat the process
2. Name: "EASYSHOP Payment Bot"
3. Username: "easyshop_payment_bot"
4. Copy the token → `PAYMENT_BOT_TOKEN`

### Bot 3: Order Bot (for order notifications)
1. Repeat the process
2. Name: "EASYSHOP Order Bot"
3. Username: "easyshop_order_bot"
4. Copy the token → `ORDER_BOT_TOKEN`

## Step 3: Setup Supabase Database

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and create these tables:

```sql
-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  telegram_username TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Realtime for products
ALTER PUBLICATION supabase_realtime ADD TABLE products;
```

## Step 4: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase (from your Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx

# Service role key (for backend operations)
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx

# Telegram Bot Tokens
ADMIN_BOT_TOKEN=8581890098:AAH4P8sovYinYqjMRVMpfQSHecfp7km6O0k
PAYMENT_BOT_TOKEN=8635062547:AAG4hxNLVdQDFeliec7uPQHSeQcHclnaMmA
ORDER_BOT_TOKEN=8644998956:AAF5sVFnhdF-MOSWhHKi3QzOqdi5T1FLxrA

# Admin settings
NEXT_PUBLIC_ADMIN_USERNAME=your_telegram_username
ADMIN_CHAT_ID=123456789
```

## Step 5: Setup Webhook URLs for Telegram Bots

After deploying to Vercel, set up webhooks for your bots. Replace `YOUR_DOMAIN` with your Vercel domain:

For each bot, message @BotFather:
```
/setwebhook
<bot_token>
https://YOUR_DOMAIN/api/webhooks/admin
https://YOUR_DOMAIN/api/webhooks/payment
https://YOUR_DOMAIN/api/webhooks/order
```

## Step 6: Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your store.

## Step 7: Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel Settings
4. Deploy

## Usage

### Adding Products (Admin)

Send to the Admin Bot:
- Photo with caption containing price: `$99.99` or just `99.99`
- Product will appear in the catalog within seconds

### Payment Processing

1. Customers see "Unlock Catalog" button
2. Click to open payment modal
3. Contact admin via Telegram
4. Send payment proof to Payment Bot
5. Admin verifies and allows customer access

### Receiving Orders

1. Customer fills order form
2. Order data is stored in Supabase
3. Order Bot notifies admin with customer details
4. Admin contacts customer to confirm

## API Endpoints

### POST /api/webhooks/order
Receives order submissions from the website and stores them in the database.

**Body:**
```json
{
  "customer_name": "John Doe",
  "phone": "+998901234567",
  "address": "Tashkent, Uzbekistan",
  "telegram_username": "johndoe"
}
```

### POST /api/webhooks/admin
Telegram webhook for receiving product uploads from admin.

### POST /api/webhooks/payment
Telegram webhook for receiving payment confirmations.

## Design System

- **Colors**: White background with warm brown accents (#8b6f47)
- **Typography**: Geist font (elegant, clean)
- **Layout**: Mobile-first responsive design
- **Components**: shadcn/ui components

## Features

- Real-time product catalog with Supabase Realtime
- Payment wall with 50% payment requirement
- Order form with validation
- Telegram bot integration for orders and uploads
- Responsive design for mobile and desktop
- Dark mode support
- Toast notifications

## Troubleshooting

### Products not appearing?
- Check Supabase URL and keys in `.env.local`
- Verify database tables are created
- Check browser console for errors

### Telegram bots not working?
- Verify bot tokens in `.env.local`
- Check webhook URLs are correctly set
- Test with a simple message to the bot

### Orders not saving?
- Check SUPABASE_SERVICE_ROLE_KEY is set
- Verify orders table exists in database
- Check API response in browser Network tab

## Support

For issues or questions, create an issue in the GitHub repository or contact the admin team.
