# EASYSHOP UZB - Premium Online Clothing Store

A modern, full-stack e-commerce platform for selling clothes with **real-time product updates**, **Telegram bot integration**, and **secure order management**. Built with Next.js 16, React 19, Supabase, and Telegram Bot API.

## Features

- **Real-time Catalog**: Products update instantly across all connected clients using Supabase Realtime
- **Payment Wall**: 50% payment requirement to unlock the full catalog
- **Telegram Bot Integration**: 
  - Admin Bot: Upload products with images and prices
  - Payment Bot: Verify customer payments
  - Order Bot: Receive order notifications
- **Secure Order Management**: Customer orders stored in Supabase with validation
- **Mobile-First Design**: Fully responsive design optimized for all devices
- **Beautiful UI**: Elegant white and brown color scheme using shadcn/ui components
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Form Validation**: Robust validation using React Hook Form and Zod

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React version
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality React components
- **React Hook Form** - Efficient form handling
- **Zod** - Schema validation

### Backend
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Telegram Bot API** - Integration with 3 Telegram bots
- **Next.js API Routes** - Serverless functions for webhooks

### Deployment
- **Vercel** - Edge computing platform for Next.js apps

## Project Structure

```
easyshop-uzb/
├── app/
│   ├── api/
│   │   └── webhooks/
│   │       ├── admin.ts      # Admin bot webhook
│   │       ├── payment.ts    # Payment bot webhook
│   │       └── order.ts      # Order bot webhook
│   ├── page.tsx              # Main landing page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Design system tokens
├── components/
│   ├── ProductCard.tsx       # Individual product card
│   ├── ProductCatalog.tsx    # Product grid with real-time updates
│   ├── PaymentWall.tsx       # Payment requirement modal
│   ├── OrderForm.tsx         # Customer order form
│   ├── SuccessMessage.tsx    # Order confirmation
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── supabase.ts           # Supabase client & types
│   ├── telegram.ts           # Telegram helper functions
│   └── form-schema.ts        # Zod validation schemas
├── public/                   # Static assets
├── QUICKSTART.md             # 10-minute setup guide
├── SETUP.md                  # Detailed setup instructions
└── INTEGRATION_GUIDE.md      # Telegram bot integration details
```

## Quick Start

Get up and running in 10 minutes:

```bash
# 1. Clone repository
git clone <your-repo-url>
cd easyshop-uzb

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# 4. Create database tables (see SETUP.md)

# 5. Run development server
pnpm dev

# 6. Open http://localhost:3000
```

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

## Configuration

### Environment Variables

Create `.env.local` with the following:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Telegram Bot Tokens
ADMIN_BOT_TOKEN=123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh
PAYMENT_BOT_TOKEN=987654321:XYZabcdefghijklmnopqrstuvwxyzABCDEF
ORDER_BOT_TOKEN=555666777:qwertyuiopasdfghjklzxcvbnmQWERTYUI

# Admin Configuration
NEXT_PUBLIC_ADMIN_USERNAME=your_telegram_username
ADMIN_CHAT_ID=123456789
```

See `.env.local.example` for all available options.

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  telegram_username TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Telegram Bot Workflows

### Admin Bot - Add Products

```
Admin: Sends photo with caption "$99.99"
  ↓
Bot receives webhook
  ↓
Product stored in Supabase
  ↓
Website updates in real-time
```

### Order Bot - Receive Orders

```
Customer: Fills order form and submits
  ↓
Data stored in Supabase
  ↓
Order Bot sends notification to admin
  ↓
Admin contacts customer to confirm
```

### Payment Bot - Verify Payments

```
Customer: Sends payment proof to Payment Bot
  ↓
Admin verifies payment
  ↓
Customer unlocks catalog access
  ↓
Can browse and order products
```

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for complete bot setup.

## API Endpoints

### POST /api/webhooks/order
Receives order submissions from the website.

**Request:**
```json
{
  "customer_name": "John Doe",
  "phone": "+998901234567",
  "address": "Tashkent, Uzbekistan",
  "telegram_username": "johndoe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully"
}
```

### POST /api/webhooks/admin
Telegram webhook for product uploads. Automatically triggered when admin sends a photo to the bot.

### POST /api/webhooks/payment
Telegram webhook for payment verification. Automatically triggered when customer sends payment proof.

## Design System

### Colors
- **Primary**: Warm brown (#8b6f47) - elegant brand color
- **Background**: Soft cream (#faf8f5) - warm, inviting
- **Text**: Dark charcoal (#1a1a1a) - excellent readability
- **Accents**: Medium brown (#a0826d) - balanced highlights

### Typography
- **Font**: Geist - clean, modern, professional
- **Headings**: Serif styling for elegance
- **Body**: Sans-serif for readability

### Layout
- **Mobile-first**: Optimized for all screen sizes
- **Responsive**: Breakpoints at 768px and 1024px
- **Touch-friendly**: 44px minimum touch targets

## Development

### Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

### File Structure for Development

When adding features:
1. **UI Components** → `components/`
2. **API Routes** → `app/api/`
3. **Utilities** → `lib/`
4. **Styles** → `app/globals.css` (design tokens)
5. **Pages** → `app/` (file-based routing)

### Key Files to Modify

- **Brand colors**: `app/globals.css` (color variables)
- **Main page**: `app/page.tsx`
- **Product display**: `components/ProductCatalog.tsx`
- **Form validation**: `lib/form-schema.ts`
- **Telegram messages**: `lib/telegram.ts`

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Click "Deploy"

### Post-Deployment Setup

After deployment, register webhook URLs with Telegram:

```bash
curl https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-project.vercel.app/api/webhooks/admin
curl https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-project.vercel.app/api/webhooks/payment
curl https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-project.vercel.app/api/webhooks/order
```

Replace `<TOKEN>` with actual bot tokens.

## Security

- ✅ Server-side validation for all inputs
- ✅ HTTPS required for production
- ✅ Service role key kept secure on server
- ✅ Form validation with Zod schemas
- ✅ Webhook verification with bot tokens
- ✅ Database access through Supabase RLS

## Troubleshooting

### Products not appearing?
- Check Supabase URL and keys
- Verify `products` table exists
- Check browser console for errors

### Orders not saving?
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check `orders` table permissions
- Review Vercel logs for errors

### Bots not responding?
- Verify bot tokens in `.env.local`
- Check webhook URLs are accessible
- Confirm bots were created with @BotFather

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed troubleshooting.

## Customization

### Change Colors

Edit `app/globals.css` and update the CSS variables:

```css
:root {
  --primary: #your-color;
  --background: #your-color;
  /* ... */
}
```

### Add New Products

Admin sends photo with caption containing price to Admin Bot.

### Modify Order Form

Edit `components/OrderForm.tsx` and `lib/form-schema.ts` to add/remove fields.

### Custom Telegram Messages

Edit `lib/telegram.ts` to customize notification formatting.

## Performance

- **Real-time Updates**: Supabase Realtime subscriptions for instant product updates
- **Image Optimization**: Next.js Image component for automatic optimization
- **Responsive Design**: Mobile-first CSS with Tailwind
- **Code Splitting**: Automatic with Next.js App Router

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS 12+, Android 8+

## License

EASYSHOP UZB © 2024. All rights reserved.

## Support

For questions or issues:
1. Check the [QUICKSTART.md](./QUICKSTART.md) guide
2. Review [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for bot setup
3. Check [SETUP.md](./SETUP.md) for detailed instructions
4. Review Vercel logs for deployment errors

## Credits

Built with:
- Next.js 16 & React 19
- Supabase PostgreSQL
- Telegram Bot API
- shadcn/ui components
- Vercel deployment

---

Ready to launch? Start with [QUICKSTART.md](./QUICKSTART.md)!
