# EasyShopUZB — README

See `.env.example` for required environment variables and setup instructions.

Main features in this branch:
- Poster generation using `@vercel/og` (edge).
- Webhook that uploads posters to Firebase Storage and stores `poster_url` in Firestore.
- Product grid UI, ProductCard, SkeletonCard, search & filters, pagination (limit 50) and infinite scroll.
- VTON proxy for AI-based virtual try-on with frontend UX for model-loading and retries.

