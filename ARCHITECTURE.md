# EASYSHOP UZB - Architecture Overview

A comprehensive guide to the architecture, data flow, and technical decisions behind EASYSHOP UZB.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                          FRONTEND                            │
│           (Next.js 16 + React 19 + TypeScript)              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  app/page.tsx (Main Page)                                   │
│    ├── ProductCatalog (Real-time updates)                   │
│    ├── PaymentWall (Payment gating)                         │
│    ├── OrderForm (Order submission)                         │
│    └── SuccessMessage (Confirmation)                        │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                      API LAYER                               │
│           (Next.js API Routes - Serverless)                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  /api/webhooks/                                             │
│    ├── order.ts (Receives customer orders)                  │
│    ├── admin.ts (Receives product uploads)                  │
│    └── payment.ts (Receives payment proofs)                 │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    EXTERNAL SERVICES                         │
└─────────────────────────────────────────────────────────────┘
     │                  │                      │
     │                  │                      │
  Supabase          Telegram Bot API      Local Storage
  (PostgreSQL)      (3 independent bots)   (Payment unlock)
     │                  │                      │
     └──────────────────┴──────────────────────┘
```

## Data Flow

### Product Upload Flow

```
Admin User
    │
    └─→ Sends photo + price to Admin Bot
        │
        └─→ Telegram receives photo
            │
            └─→ Telegram calls webhook
                │
                └─→ POST /api/webhooks/admin
                    │
                    ├─→ Extract price from caption
                    ├─→ Store in Supabase products table
                    └─→ Send confirmation to admin
                        │
                        └─→ Website (all clients)
                            │
                            └─→ Supabase Realtime notifies
                                │
                                └─→ Product appears instantly
                                    in ProductCatalog
```

### Order Placement Flow

```
Customer
    │
    └─→ Fills order form on website
        │
        └─→ Form validation (Zod)
            │
            └─→ Submit to /api/webhooks/order
                │
                ├─→ Validate all fields
                ├─→ Store in Supabase orders table
                ├─→ Call Order Bot API
                │   │
                │   └─→ Send message to admin's Telegram
                │
                └─→ Return success response
                    │
                    └─→ Show SuccessMessage modal
                        │
                        └─→ Customer receives confirmation
```

### Payment Verification Flow

```
Customer
    │
    └─→ Clicks "Unlock Catalog"
        │
        └─→ PaymentWall modal opens
            │
            ├─→ Shows payment instructions
            └─→ Links to Admin's Telegram
                │
                └─→ Customer sends 50% payment to admin
                    │
                    ├─→ Admin verifies payment
                    └─→ Admin confirms in app
                        │
                        └─→ localStorage.catalog-unlocked = true
                            │
                            └─→ Products visible (no blur)
                                │
                                └─→ Can click "Buy Now"
```

## Component Architecture

### Page Components

```
app/page.tsx (Server Component)
├── Contains state for:
│   ├── isPaymentWallOpen
│   ├── isOrderFormOpen
│   ├── isSuccessOpen
│   ├── selectedProduct
│   └── isUnlocked
│
└── Renders:
    ├── Header (static header with branding)
    ├── HeroSection (introductory section)
    ├── ProductSection (main content)
    │   └── ProductCatalog (client component with real-time)
    ├── PaymentWall Modal (payment requirement)
    ├── OrderForm Modal (order collection)
    ├── SuccessMessage Modal (confirmation)
    └── Footer (company info)
```

### Client Components

**ProductCatalog.tsx**
- Handles Supabase real-time subscription
- Fetches products on mount
- Updates products in real-time
- Renders grid of ProductCards
- Shows loading states and empty states

**ProductCard.tsx**
- Displays individual product
- Shows image and price
- Handles blur overlay effect
- Triggers onBuy callback

**PaymentWall.tsx**
- Modal overlay
- Payment instructions
- Telegram contact link
- Unlock confirmation

**OrderForm.tsx**
- React Hook Form integration
- Zod validation
- Field: customer_name, phone, address, telegram_username
- Submits to /api/webhooks/order
- Shows loading state during submission

**SuccessMessage.tsx**
- Confirmation modal
- Shows delivery timeframe (7-15 days)
- "Continue Shopping" button
- Thank you message

## Database Schema

### Products Table

```typescript
type Product = {
  id: string              // UUID primary key
  image_url: string       // URL to product image
  price: number           // Decimal(10, 2)
  created_at: string      // ISO timestamp
}
```

**Indexes:**
- id (primary key)
- created_at (for ordering)

**Real-time enabled:** Yes
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE products;
```

### Orders Table

```typescript
type Order = {
  id: string              // UUID primary key
  customer_name: string   // Required
  phone: string           // Required, validated format
  address: string         // Required
  telegram_username: string // Required, validated format
  created_at: string      // ISO timestamp
}
```

**Indexes:**
- id (primary key)
- created_at (for chronological access)

**No real-time needed** - Orders are one-way write

## API Routes

### POST /api/webhooks/order

**Purpose:** Receive and process customer orders

**Flow:**
1. Validate request body
2. Extract all required fields
3. Store in Supabase orders table
4. Send notification via Order Bot
5. Return success response

**Error Handling:**
- 400: Missing required fields
- 500: Database error or Telegram error
- Always returns 201 on success

**Validates:**
- All fields present
- No empty values
- Phone format valid
- Telegram username format valid

### POST /api/webhooks/admin

**Purpose:** Receive product uploads from Admin Bot

**Flow:**
1. Verify bot token from request path
2. Check for photo and caption
3. Extract price from caption
4. Store product in Supabase
5. Send confirmation to admin

**Supports:**
- Photo uploads with prices
- Price extraction from captions (regex: `\$?(\d+(?:\.\d{2})?)`)
- Real-time propagation via Supabase

### POST /api/webhooks/payment

**Purpose:** Handle payment verification requests

**Flow:**
1. Verify bot token
2. Receive payment proof
3. Send acknowledgment to user
4. Wait for admin verification
5. Admin confirms in app

**Note:** Actual payment verification requires manual admin review

## Validation Strategy

### Client-side Validation

All forms use Zod schemas for validation:

```typescript
// lib/form-schema.ts
const orderFormSchema = z.object({
  customerName: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  address: z.string().min(5).max(500),
  telegramUsername: z.string().regex(/^[a-zA-Z0-9_]{5,32}$/),
})
```

### Server-side Validation

All API routes validate data before processing:
- Field presence checks
- Type validation
- Format validation
- Sanitization

### Database Constraints

Supabase enforces:
- NOT NULL constraints
- Data type constraints
- Referential integrity (if applicable)

## Real-time Synchronization

### Supabase Realtime Subscriptions

**Products Table:**
```typescript
supabase
  .channel('products')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'products' },
    (payload) => {
      // Handle INSERT, UPDATE, DELETE events
      if (payload.eventType === 'INSERT') {
        // Add to local state
      } else if (payload.eventType === 'DELETE') {
        // Remove from local state
      } else if (payload.eventType === 'UPDATE') {
        // Update in local state
      }
    }
  )
  .subscribe()
```

**Flow:**
1. Admin uploads product via bot
2. Webhook stores in Supabase
3. Supabase broadcasts change
4. All connected clients receive update
5. ProductCatalog updates in real-time

## Authentication & Authorization

### Current Implementation

**No authentication layer** - Public store

**Access Control:**
- Payment wall provides basic gating
- Uses localStorage for state management
- Admin endpoints verify bot tokens

### Future Security Improvements

Consider implementing:
1. User authentication (Supabase Auth)
2. Payment verification via third-party provider
3. Admin authentication for product uploads
4. Order tracking per customer

## Error Handling

### Client-side

**Form Validation:**
- Zod provides detailed error messages
- Displays below form fields
- Prevents submission on invalid data

**API Errors:**
- Try-catch blocks
- User-friendly error messages
- Toast notifications for feedback

**Network Errors:**
- Graceful fallbacks
- Retry logic for critical operations
- Loading states to indicate progress

### Server-side

**API Routes:**
- Try-catch wrapping all logic
- Detailed console logging
- Appropriate HTTP status codes
- Error messages for debugging

**Database Errors:**
- Caught and logged
- Return 500 status
- Don't expose internal details to client

**Telegram Errors:**
- Non-blocking (won't fail order)
- Logged for debugging
- Retry mechanism recommended

## Performance Optimizations

### Frontend

1. **Image Optimization**
   - Next.js Image component
   - Automatic WebP conversion
   - Responsive sizing

2. **Code Splitting**
   - App Router automatic splitting
   - Dynamic imports for heavy components
   - Component-level code splitting

3. **Lazy Loading**
   - Images lazy-loaded
   - Components load on demand
   - Real-time subscription only active on product page

4. **Caching**
   - Next.js ISR for static content
   - Browser caching for assets
   - Service-level caching

### Backend

1. **Database Queries**
   - Supabase handles indexing
   - Efficient JOIN operations
   - Real-time subscriptions via PostgreSQL triggers

2. **API Routes**
   - Serverless functions (fast startup)
   - No database connection pooling needed
   - Vercel edge caching

3. **Webhook Processing**
   - Async operations where possible
   - Non-blocking Telegram notifications
   - Minimal database roundtrips

## Scalability Considerations

### Current Limitations

- Single Supabase project
- Limited to Supabase tier limits
- No caching layer
- No CDN for images

### Future Scaling

1. **Database**
   - Supabase scaling (auto)
   - Connection pooling if needed
   - Read replicas for high traffic

2. **Caching**
   - Redis for frequently accessed data
   - Vercel KV for edge caching
   - Product list caching

3. **Images**
   - Vercel Blob for storage
   - Image optimization service
   - CDN for global delivery

4. **Rate Limiting**
   - Implement rate limiting on API routes
   - Bot request throttling
   - Telegram webhook rate limiting

## Development Workflow

### Adding a New Feature

1. **Create component** in `components/`
2. **Add types** in `lib/supabase.ts` if needed
3. **Create API route** in `app/api/` if needed
4. **Add validation** schema in `lib/form-schema.ts`
5. **Integrate** into main page
6. **Test** locally
7. **Deploy** to Vercel

### Testing Checklist

- [ ] Form validation works
- [ ] API routes respond correctly
- [ ] Supabase queries work
- [ ] Real-time updates work
- [ ] Telegram webhooks triggered
- [ ] Mobile responsive
- [ ] Error messages clear
- [ ] Loading states visible

## Deployment Pipeline

```
Local Development
    ↓
Git Push to GitHub
    ↓
Vercel Detects Changes
    ↓
Build & Test
    ↓
Automatic Deployment
    ↓
Production URL Active
    ↓
Register Webhooks (manual step)
    ↓
Ready for Use
```

## Security Considerations

1. **Secrets Management**
   - Use Vercel environment variables
   - Never commit `.env.local`
   - Rotate tokens regularly

2. **Input Validation**
   - Zod schemas on client
   - Server-side validation always
   - Sanitize user input

3. **Data Protection**
   - HTTPS only (Vercel enforces)
   - Service key kept server-side
   - No sensitive data in logs

4. **API Security**
   - Bot token verification in webhooks
   - CORS headers properly set
   - Rate limiting recommended

5. **Database Security**
   - Use service role key carefully
   - Consider RLS policies
   - Regular backups (Supabase auto)

## Monitoring & Debugging

### Key Metrics

- Orders per day
- Products uploaded
- Active users (from browser analytics)
- API response times
- Webhook success rate

### Debugging Tools

1. **Browser DevTools**
   - Network tab for API calls
   - Console for errors
   - React DevTools for component state

2. **Vercel Logs**
   - Function logs
   - Error logs
   - Request details

3. **Supabase Dashboard**
   - Query editor
   - Real-time activity
   - Database statistics

4. **Telegram Bot API**
   - getWebhookInfo to check status
   - Webhook test URL
   - Message sending verification

## Dependencies & Stack

### Core Dependencies

```json
{
  "next": "16.2.0",              // React framework
  "react": "19.2.4",              // UI library
  "react-dom": "19.2.4",          // DOM rendering
  "typescript": "5.7.3",          // Type safety
  "tailwindcss": "4.2.0",         // Styling
  "@supabase/supabase-js": "2.45",// Database
  "react-hook-form": "7.54.1",    // Form handling
  "zod": "3.24.1",                // Validation
  "sonner": "1.7.1"               // Notifications
}
```

### UI Components

- shadcn/ui (180+ components)
- Radix UI (underlying primitive components)
- Lucide React (icons)

### Development Dependencies

- TypeScript (type checking)
- ESLint (code quality)
- Tailwind CSS (utility CSS)

---

For detailed guides, see:
- [README.md](./README.md)
- [SETUP.md](./SETUP.md)
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- [CONFIG.md](./CONFIG.md)
