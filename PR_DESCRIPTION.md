
PR Update: This project has been migrated to Firebase only. All Supabase-related files have been removed or neutralized in this branch. There is no remaining Supabase runtime dependency in this branch and package.json has been updated to remove `@supabase/supabase-js` and add `firebase` and `firebase-admin`.

Files removed/neutralized:
- app/api/bot/route.ts
- app/api/webhook/route.ts
- app/api/webhooks/admin.ts, app/api/webhooks/payment.ts, app/api/webhooks/order.ts
- lib/supabase.ts (replaced with deprecation shim)
- lib/form-schema.ts
- components/ProductCatalog.tsx, components/OrderForm.tsx, components/PaymentWall.tsx, components/SuccessMessage.tsx
- scripts/setup-database.sql, scripts/setup-db.js
- Multiple documentation files that contained legacy tokens/sensitive info (ARCHITECTURE.md, CHANGELOG.md, COMPLETE_GUIDE.md, CONFIG.md, DEPLOYMENT*, DOCS_INDEX.md, FINAL_SETUP.md, INTEGRATION_GUIDE.md, PROJECT_*.md, QUICKSTART.md, QUICK_REFERENCE.md, SETUP.md, START_HERE.md, SUMMARY.txt)

All server-side routes (app/api/telegram-webhook, app/api/vton, etc.) now use firebase-admin or proxy to upstream services; no Supabase usage remains.

Please run `npm install` and `npm run build` locally or in CI to verify the build passes.
