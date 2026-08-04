# EasyShopUZB — Feature: telegram-poster-ui-vton-optim

This PR contains multiple changes (UI, poster generation, VTON proxy, Firebase upload). Please review the following areas closely:

- next.config.mjs changes for next/image remotePatterns (telegram) and formats.
- app/api/telegram-poster/route.ts (edge) — poster rendering via @vercel/og.
- app/api/telegram-webhook/route.ts (server) — poster upload to Firebase Storage and Firestore update.
- app/api/vton/route.ts — proxying VTON AI; propagates 503 for model loading.
- app/page.tsx + app/components/* — UI: grid, product card, skeleton, AI UX, pagination.

Testing steps (short):
1. Setup .env.local from .env.example (fill Firebase service account and other secrets).
2. Run locally: `npm install && npm run dev`.
3. Test poster generator: `GET /api/telegram-poster?...` (should return an image).
4. Test webhook: `POST /api/telegram-webhook` with product payload — check Firebase Storage and Firestore `products/{id}` for `poster_url`.
5. Test VTON: `POST /api/vton` with base64 data URLs — if upstream model is loading it should return 503; otherwise returns `{ success: true, image_url }`.

Notes:
- No secrets are committed to the repo. Ensure you add them to environment variables in your hosting provider.
- If you want signed URLs for storage instead of public objects, I can update the webhook to use `file.getSignedUrl()`.

