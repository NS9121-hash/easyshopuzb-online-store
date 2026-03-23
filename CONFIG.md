# EASYSHOP UZB - Configuration Reference

Complete reference for all configuration options.

## Environment Variables

### Supabase Configuration

**NEXT_PUBLIC_SUPABASE_URL**
- Type: `string`
- Required: `true`
- Description: Your Supabase project URL
- Example: `https://abc123def456.supabase.co`
- Where to get: Supabase Dashboard → Settings → API → Project URL

**NEXT_PUBLIC_SUPABASE_ANON_KEY**
- Type: `string`
- Required: `true`
- Description: Supabase anonymous key for client-side operations
- Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Where to get: Supabase Dashboard → Settings → API → anon key
- Note: This is safe to expose in client-side code (used in browser)

**SUPABASE_SERVICE_ROLE_KEY**
- Type: `string`
- Required: `true`
- Description: Supabase service role key for server-side operations
- Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Where to get: Supabase Dashboard → Settings → API → service_role key
- Warning: Keep this secret! Never expose in client-side code

### Telegram Bot Tokens

**ADMIN_BOT_TOKEN**
- Type: `string`
- Required: `true`
- Description: Token for the Admin Bot (product uploads)
- Example: `123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh`
- Where to get: Message @BotFather on Telegram, create a bot, copy the token
- Usage: Admins send product photos with prices

**PAYMENT_BOT_TOKEN**
- Type: `string`
- Required: `true`
- Description: Token for the Payment Bot (payment verification)
- Example: `987654321:XYZabcdefghijklmnopqrstuvwxyzABCDEF`
- Where to get: Message @BotFather on Telegram, create a bot, copy the token
- Usage: Customers send payment proof

**ORDER_BOT_TOKEN**
- Type: `string`
- Required: `true`
- Description: Token for the Order Bot (order notifications)
- Example: `555666777:qwertyuiopasdfghjklzxcvbnmQWERTYUI`
- Where to get: Message @BotFather on Telegram, create a bot, copy the token
- Usage: Send order notifications to admins

### Admin Configuration

**NEXT_PUBLIC_ADMIN_USERNAME**
- Type: `string`
- Required: `true`
- Description: Your Telegram username (without the @)
- Example: `john_doe_admin`
- Where to get: Your Telegram profile → Username
- Usage: Used to generate payment contact links on the website

**ADMIN_CHAT_ID**
- Type: `number`
- Required: `true`
- Description: Your numeric Telegram chat ID (where to send order notifications)
- Example: `123456789`
- Where to get: Message @userinfobot on Telegram, it will show your ID
- Usage: Order Bot sends notifications to this chat

## Optional Configuration

**NEXT_PUBLIC_WEBHOOK_URL**
- Type: `string`
- Required: `false`
- Description: Your deployment URL (for reference)
- Example: `https://easyshop-uzb.vercel.app`
- Note: Usually auto-configured on Vercel

## Design Tokens

### Colors (in globals.css)

```css
/* Primary Colors */
--primary: #8b6f47           /* Brand brown */
--primary-foreground: #ffffff /* Text on brand color */

/* Neutral Colors */
--background: #faf8f5        /* Main background */
--foreground: #1a1a1a        /* Main text */
--card: #ffffff              /* Card background */
--card-foreground: #1a1a1a   /* Card text */

/* Secondary */
--secondary: #f5f0e8         /* Light background */
--secondary-foreground: #8b6f47 /* Dark text on light bg */

/* Accents */
--accent: #a0826d            /* Accent color */
--accent-foreground: #ffffff /* Text on accent */

/* Utility */
--muted: #e8dfd2             /* Muted text background */
--muted-foreground: #8b7355  /* Muted text */
--border: #e0d5c7            /* Border color */
--input: #ffffff             /* Input background */
```

## Feature Configuration

### Payment Wall

Located in: `components/PaymentWall.tsx`

**Customizable Elements:**
- Payment requirement percentage (currently 50%)
- Contact link (uses `NEXT_PUBLIC_ADMIN_USERNAME`)
- Modal text and styling
- Payment flow instructions

**To Change:**
1. Edit `components/PaymentWall.tsx`
2. Modify the JSX and styling
3. Restart dev server

### Product Catalog

Located in: `components/ProductCatalog.tsx`

**Customizable Elements:**
- Grid columns: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- Product card styling
- Loading skeleton
- Empty state message

**To Change:**
1. Edit `components/ProductCatalog.tsx`
2. Adjust grid classes: `grid-cols-X`
3. Modify card styling

### Order Form

Located in: `components/OrderForm.tsx`
Schema: `lib/form-schema.ts`

**Customizable Elements:**
- Form fields (name, phone, address, telegram username)
- Validation rules
- Error messages
- Submit button text

**To Add a Field:**
1. Edit `lib/form-schema.ts` - add to Zod schema
2. Edit `components/OrderForm.tsx` - add form field
3. Edit `app/api/webhooks/order.ts` - handle new field in database

### Telegram Notifications

Located in: `lib/telegram.ts`

**Order Notification Format:**
```html
<b>📦 New Order Received</b>

<b>Customer:</b> {name}
<b>Phone:</b> {phone}
<b>Address:</b> {address}
<b>Telegram:</b> @{username}
```

**To Customize:**
1. Edit `lib/telegram.ts`
2. Modify `sendOrderNotification()` function
3. Change message format and emoji

## Database Schema Customization

### Add New Product Field

1. Create migration in Supabase:
```sql
ALTER TABLE products ADD COLUMN description TEXT;
```

2. Update types in `lib/supabase.ts`:
```typescript
export type Product = {
  // ... existing fields
  description: string
}
```

3. Update `ProductCard.tsx` to display new field

### Add New Order Field

1. Create migration in Supabase:
```sql
ALTER TABLE orders ADD COLUMN notes TEXT;
```

2. Update types in `lib/supabase.ts`:
```typescript
export type Order = {
  // ... existing fields
  notes: string
}
```

3. Update form schema and component

## Webhook Configuration

### Telegram Webhook URLs

After deployment, register these URLs with Telegram:

**Admin Bot:**
```
https://your-domain.vercel.app/api/webhooks/admin
```

**Payment Bot:**
```
https://your-domain.vercel.app/api/webhooks/payment
```

**Order Bot:**
```
https://your-domain.vercel.app/api/webhooks/order
```

**To Register:**
```bash
# Each bot:
curl https://api.telegram.org/bot<TOKEN>/setWebhook?url=<URL>
```

### Webhook Security

- Tokens are verified in each webhook handler
- Tokens extracted from request URL path
- Mismatch returns 401 Unauthorized
- All updates logged in Vercel logs

## Performance Configuration

### Supabase Real-time

Currently enabled for `products` table:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE products;
```

To disable:
```sql
ALTER PUBLICATION supabase_realtime DROP TABLE products;
```

### Image Optimization

Using Next.js Image component in `ProductCard.tsx`:
- Automatic optimization
- Responsive sizing
- Lazy loading
- WebP conversion

## Development Configuration

### TypeScript

See `tsconfig.json` for:
- Strict mode: enabled
- Module resolution: "node"
- Target: "ES2020"

### Tailwind CSS

See `tailwind.config.ts` for:
- Theme extensions
- Custom utilities
- Preset configurations

### Next.js

See `next.config.mjs` for:
- Build settings
- Image optimization
- API routes

## Deployment Configuration

### Vercel Environment Setup

1. Go to Vercel Dashboard → Project → Settings
2. Click "Environment Variables"
3. Add all required variables from `.env.local`
4. Deploy

### Database Permissions (Supabase RLS)

Currently using public anon key for read/write operations.

For production, consider enabling Row Level Security:

```sql
-- Example RLS policy
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders"
  ON orders
  FOR INSERT
  WITH CHECK (true);
```

## Security Best Practices

1. **Never commit `.env.local`**
   ```bash
   echo ".env.local" >> .gitignore
   ```

2. **Use environment variables in Vercel**
   - Never hardcode secrets
   - Use Vercel's environment variable UI

3. **Keep service keys secret**
   - Only use server-side
   - Never expose in client code

4. **Validate all inputs**
   - Forms use Zod validation
   - API routes validate data

5. **Use HTTPS only**
   - Vercel provides free SSL
   - Telegram requires HTTPS for webhooks

## Monitoring & Logging

### Vercel Logs

View deployment logs:
1. Vercel Dashboard → Deployments
2. Click deployment → Logs
3. Search by request path

### Error Tracking

Common error locations to check:
- Supabase credentials: Missing or incorrect
- Bot tokens: Invalid or expired
- Webhook URLs: Unreachable or misconfigured
- Database: Missing tables or incorrect schema

### Testing Webhooks

Test each webhook locally:

```bash
# Test order webhook
curl -X POST http://localhost:3000/api/webhooks/order \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test User",
    "phone": "+998901234567",
    "address": "Test Address",
    "telegram_username": "testuser"
  }'
```

## Upgrading Guide

### Update Dependencies

```bash
pnpm update
```

### Update Next.js

Next.js is pinned to version 16. To update:
1. Change version in `package.json`
2. Run `pnpm install`
3. Test thoroughly

### Database Schema Changes

Always create migrations:
```sql
-- Migration: add_field
ALTER TABLE products ADD COLUMN new_field TEXT;
```

## Backup & Recovery

### Database Backup

Supabase auto-backups daily:
1. Vercel Dashboard → Backups
2. Or Supabase Dashboard → Backups

### Configuration Backup

Keep safe backup of:
- `.env.local` (store securely, not in git)
- Bot tokens (store in password manager)
- Supabase keys (save in password manager)

---

For more details, see:
- [README.md](./README.md) - Project overview
- [QUICKSTART.md](./QUICKSTART.md) - Quick setup guide
- [SETUP.md](./SETUP.md) - Detailed setup
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Bot integration
