# EASYSHOP UZB - Quick Reference Card

## 🚀 Quick Start (5 minutes)

```bash
# 1. Install
pnpm install

# 2. Configure
cp .env.local.example .env.local
# Edit .env.local with your keys

# 3. Run
pnpm dev

# 4. Open browser
http://localhost:3000
```

## 📝 Essential Environment Variables

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Telegram Bots (Required)
ADMIN_BOT_TOKEN=your_admin_token
PAYMENT_BOT_TOKEN=your_payment_token
ORDER_BOT_TOKEN=your_order_token

# Admin (Required)
NEXT_PUBLIC_ADMIN_USERNAME=your_username
ADMIN_CHAT_ID=your_numeric_id
```

## 🗄️ Database Setup

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

-- Enable Real-time for Products
ALTER PUBLICATION supabase_realtime ADD TABLE products;
```

## 🤖 Create Telegram Bots

1. Message [@BotFather](https://t.me/botfather)
2. Send: `/newbot`
3. Name your bot
4. Get the token
5. Repeat 3 times (one for each bot)

**What each bot does:**
- **Admin Bot**: Upload products with photos + prices
- **Payment Bot**: Verify customer payments  
- **Order Bot**: Get notified of new orders

## 🔗 Webhook Setup (After Deploy)

```bash
# Replace <TOKEN> and <URL>
curl https://api.telegram.org/bot<ADMIN_BOT_TOKEN>/setWebhook?url=https://your-domain.vercel.app/api/webhooks/admin
curl https://api.telegram.org/bot<PAYMENT_BOT_TOKEN>/setWebhook?url=https://your-domain.vercel.app/api/webhooks/payment
curl https://api.telegram.org/bot<ORDER_BOT_TOKEN>/setWebhook?url=https://your-domain.vercel.app/api/webhooks/order
```

## 📁 Project File Structure

```
easyshop-uzb/
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout  
│   ├── globals.css           # Colors & fonts
│   └── api/webhooks/
│       ├── admin.ts          # Product uploads
│       ├── payment.ts        # Payments
│       └── order.ts          # Orders
├── components/
│   ├── ProductCatalog.tsx    # Product grid
│   ├── ProductCard.tsx       # Product item
│   ├── PaymentWall.tsx       # Payment modal
│   ├── OrderForm.tsx         # Order form
│   └── SuccessMessage.tsx    # Confirmation
├── lib/
│   ├── supabase.ts           # Database client
│   ├── telegram.ts           # Bot helpers
│   └── form-schema.ts        # Validation
└── public/                   # Images & assets
```

## 💻 Common Commands

```bash
# Development
pnpm dev              # Start dev server

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Quality
pnpm lint             # Run linter
```

## 🎨 Customize Colors

Edit `app/globals.css`:

```css
:root {
  --primary: #8b6f47;        /* Brand color */
  --background: #faf8f5;     /* Background */
  --foreground: #1a1a1a;     /* Text */
  --accent: #a0826d;         /* Accent */
  /* ... more colors ... */
}
```

## 🔐 Security Checklist

- [ ] `.env.local` in `.gitignore`
- [ ] No tokens in code
- [ ] Service key only server-side
- [ ] Environment vars in Vercel
- [ ] HTTPS enabled (Vercel does this)
- [ ] Input validation enabled

## 📊 Database Operations

### Add a Product

Option 1: Via Admin Bot (recommended)
```
Send photo to Admin Bot
Caption: "$99.99"
```

Option 2: Via Supabase Dashboard
1. Go to Supabase
2. Products table
3. Click "Insert"
4. Fill in image_url and price

### View Orders

```
Supabase Dashboard → Tables → orders
```

### Backup Database

```
Supabase Dashboard → Backups → Download
```

## 🧪 Testing Webhooks

```bash
# Test order webhook
curl -X POST http://localhost:3000/api/webhooks/order \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test",
    "phone": "+998901234567",
    "address": "Test Address",
    "telegram_username": "testuser"
  }'
```

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Products not showing | Check Supabase URL & keys |
| Orders not saving | Verify SERVICE_ROLE_KEY |
| Bots not responding | Check bot tokens are correct |
| Webhooks not working | Verify webhook URLs are set |
| Forms not validating | Check browser console |

## 📚 Full Documentation

- [README.md](./README.md) - Overview
- [QUICKSTART.md](./QUICKSTART.md) - Setup guide
- [SETUP.md](./SETUP.md) - Detailed setup
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Bot integration
- [CONFIG.md](./CONFIG.md) - Configuration reference
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical details

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## 👤 Get Your Telegram IDs

1. Username: Check your Telegram profile
2. Chat ID: Message [@userinfobot](https://t.me/userinfobot)

## 📦 Deploy to Vercel

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial setup"
git push

# 2. Go to vercel.com
# 3. Click "New Project"
# 4. Select your repo
# 5. Add environment variables
# 6. Click "Deploy"
# 7. Setup webhooks (see above)
```

## 💡 Tips & Tricks

1. **Dark mode testing**: Use browser DevTools → Toggle device theme
2. **Mobile testing**: Use DevTools → Toggle device toolbar (Ctrl+Shift+M)
3. **Real-time testing**: Open website in 2 browser windows, upload product in one
4. **Form testing**: Use browser DevTools → Network to see API calls
5. **Database testing**: Open Supabase dashboard in separate tab

## 🎯 User Workflows

### For Admin
```
Send Photo to Admin Bot 
→ Bot stores in database
→ Website shows instantly
→ Get order notifications in Telegram
```

### For Customer
```
See blurred products
→ Click "Unlock Catalog"
→ Contact admin for payment
→ Pay 50%
→ Browse products
→ Fill order form
→ Get confirmation
```

## 📞 Support Resources

1. Check the relevant documentation file
2. Review [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for bot issues
3. Check Vercel logs: Dashboard → Deployments → Logs
4. Test in browser console (F12)
5. Verify environment variables in Vercel

---

**Start here:** [QUICKSTART.md](./QUICKSTART.md)

**Need more help?** Check the relevant documentation file above.
