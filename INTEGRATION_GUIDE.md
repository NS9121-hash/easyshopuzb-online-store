# EASYSHOP UZB - Telegram Bot Integration Guide

This guide explains how to integrate the three Telegram bots with your EASYSHOP UZB application.

## Overview

The application uses three separate Telegram bots:

1. **Admin Bot** - For uploading products (images + prices)
2. **Payment Bot** - For payment verification
3. **Order Bot** - For sending order notifications to admins

## Creating Telegram Bots

### Step 1: Create Bots with BotFather

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Start a conversation with BotFather
3. For each bot you need to create, send: `/newbot`
4. Follow the prompts:
   - **Bot name**: Choose a descriptive name
   - **Bot username**: Choose a unique username (must end with `_bot`)

### Step 2: Save Your Bot Tokens

After creating each bot, BotFather will give you a token in this format:
```
123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh
```

Save these tokens securely and add them to `.env.local`:
```env
ADMIN_BOT_TOKEN=your_admin_bot_token
PAYMENT_BOT_TOKEN=your_payment_bot_token
ORDER_BOT_TOKEN=your_order_bot_token
```

## Setting Up Webhook URLs

After deploying your application, you need to register webhook URLs with Telegram.

### Step 1: Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables
4. Deploy the project

### Step 2: Register Webhooks

Once deployed, your webhook URLs will be:
```
https://your-project.vercel.app/api/webhooks/admin
https://your-project.vercel.app/api/webhooks/payment
https://your-project.vercel.app/api/webhooks/order
```

To register these webhooks with Telegram, you have two options:

#### Option A: Using BotFather Commands

Send these commands to @BotFather for each bot:

```
/setwebhook
<bot_token>
https://your-project.vercel.app/api/webhooks/admin
```

Replace `<bot_token>` with the actual token and `your-project` with your Vercel project name.

#### Option B: Using Telegram Bot API

Call these URLs in your browser or with curl:

```bash
# Admin Bot
curl https://api.telegram.org/bot<ADMIN_BOT_TOKEN>/setWebhook?url=https://your-project.vercel.app/api/webhooks/admin

# Payment Bot
curl https://api.telegram.org/bot<PAYMENT_BOT_TOKEN>/setWebhook?url=https://your-project.vercel.app/api/webhooks/payment

# Order Bot
curl https://api.telegram.org/bot<ORDER_BOT_TOKEN>/setWebhook?url=https://your-project.vercel.app/api/webhooks/order
```

## Bot-Specific Workflows

### Admin Bot - Product Upload Workflow

**Purpose**: Allow admins to upload product images with prices

**Usage**:
1. Admin opens a chat with the Admin Bot
2. Sends a photo with caption containing the price
3. Caption examples: `$99.99`, `100.00`, `Price: $150`

**Flow**:
1. Bot receives the photo and caption
2. Webhook is triggered at `/api/webhooks/admin`
3. Price is extracted from the caption
4. Product is stored in Supabase `products` table
5. Frontend receives real-time update via Supabase Realtime
6. Product appears instantly on the website

**Implementation**:
```typescript
// The admin bot webhook processes:
- Photo file
- Price from caption
- Creates entry in Supabase products table
- Sends confirmation to admin
```

### Payment Bot - Payment Verification Workflow

**Purpose**: Handle payment proof submissions and verification

**Usage**:
1. Customer clicks "Unlock Catalog" on the website
2. Directed to contact admin on Telegram
3. Admin requests 50% payment
4. Customer sends payment proof to Payment Bot
5. Payment Bot notifies admin

**Flow**:
1. Customer sends payment proof (screenshot, etc.)
2. Webhook is triggered at `/api/webhooks/payment`
3. Admin reviews and verifies
4. Admin confirms payment in the app
5. Customer gets access token (or uses local storage flag)
6. Catalog is unlocked on website

**Implementation**:
```typescript
// The payment bot webhook:
- Receives payment proof from customer
- Notifies admin
- Admins can verify through the website dashboard
- Generates unlock code for customer
```

### Order Bot - Order Notification Workflow

**Purpose**: Notify admins when new orders are placed

**Usage**:
1. Customer fills out order form on website
2. Form data is submitted to `/api/webhooks/order`
3. Order Bot sends notification to admin

**Flow**:
1. Customer submits order form
2. Data is stored in Supabase `orders` table
3. Webhook calls Order Bot API
4. Admin receives notification with customer details
5. Admin contacts customer via Telegram to confirm

**Implementation**:
```typescript
// The order webhook:
- Receives order data from form
- Stores in Supabase orders table
- Sends formatted message to Order Bot
- Order Bot sends it to admin's chat
```

## Admin Chat ID Setup

The admin needs to configure their chat ID so the Order Bot knows where to send notifications:

### Getting Your Chat ID:

1. Open Telegram
2. Search for [@userinfobot](https://t.me/userinfobot)
3. Start the conversation
4. It will show you your numeric user ID
5. Add this to `.env.local`:
```env
ADMIN_CHAT_ID=123456789
```

## Environment Variables Reference

```env
# Bot Tokens
ADMIN_BOT_TOKEN=<admin_bot_token>
PAYMENT_BOT_TOKEN=<payment_bot_token>
ORDER_BOT_TOKEN=<order_bot_token>

# Admin Configuration
NEXT_PUBLIC_ADMIN_USERNAME=<your_username>
ADMIN_CHAT_ID=<your_numeric_chat_id>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=<supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<supabase_service_key>
```

## Testing Webhooks

After setting up, test each webhook:

### Test Admin Bot:
1. Send a photo with caption to Admin Bot
2. Check Supabase `products` table - new product should appear
3. Website should show the product instantly

### Test Order Bot:
1. Place an order on the website
2. Admin should receive a notification in their Telegram chat
3. Check Supabase `orders` table - order should be saved

### Test Payment Bot:
1. Send a message to Payment Bot
2. Check that webhook processes it without errors
3. Admin can verify payment in dashboard

## Troubleshooting

### Webhooks not receiving updates

**Problem**: Bot updates aren't being received

**Solutions**:
- Verify webhook URL is correct: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
- Check that your Vercel URL is accessible publicly
- Verify environment variables are set in Vercel
- Check Vercel logs for errors

### Orders not appearing in database

**Problem**: Orders are submitted but not saved

**Solutions**:
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
- Check database permissions and RLS policies
- Verify `orders` table exists in Supabase
- Check API response in browser Network tab

### Bot not sending notifications

**Problem**: Orders are saved but admin isn't notified

**Solutions**:
- Verify `ADMIN_CHAT_ID` is correct (numeric ID, not username)
- Check `ORDER_BOT_TOKEN` is correct
- Test bot manually: send message to bot directly
- Check Vercel logs for webhook errors

## Security Considerations

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Keep bot tokens secret** - Don't share or commit them
3. **Use HTTPS only** - Telegram requires HTTPS for webhooks
4. **Validate inputs** - All form data is validated server-side
5. **Use Service Role Key securely** - Only on server-side code

## Advanced Configuration

### Custom Message Format

Edit `/lib/telegram.ts` to customize notification messages:

```typescript
export const sendOrderNotification = async (
  chatId: string,
  customerName: string,
  phone: string,
  address: string,
  telegramUsername: string
) => {
  const message = `
    // Customize this message format
    <b>📦 New Order</b>
    Customer: ${customerName}
    ...
  `.trim()
  // ...
}
```

### Multiple Admin Chats

To send notifications to multiple admin chat IDs:

```typescript
const ADMIN_CHAT_IDS = [
  process.env.ADMIN_CHAT_ID_1,
  process.env.ADMIN_CHAT_ID_2,
  process.env.ADMIN_CHAT_ID_3,
]
```

## Support

For issues:
1. Check Vercel logs: Dashboard → Project → Deployments → Logs
2. Test bot commands directly in Telegram
3. Verify all environment variables are set
4. Check webhook status with BotFather `/setwebhook` command
