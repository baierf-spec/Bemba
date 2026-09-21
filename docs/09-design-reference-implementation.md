# Bemba reference design implementation

The owner requested the supplied visual mockups be implemented after the Vercel deployment exposed the earlier technical scaffold. All 17 PNG references in `Bemba(1).rar` were inspected. The application remains the existing Next.js/Supabase project; authentication, migrations and RLS were not replaced.

## Reference-to-route mapping

| Reference | Implemented route |
|---|---|
| home page | `/` |
| all_products | `/demo/marketplace` |
| product | `/demo/products/kitenge-handbag` |
| seller profile | `/demo/store` |
| seller page | `/demo/dashboard` |
| manage products | `/demo/dashboard/products` |
| add new product | `/demo/dashboard/products/new` |
| create store step 1 | `/demo/onboarding/1` |
| create store step 2 | `/demo/onboarding/2` |
| create store step 3 | `/demo/onboarding/3` |
| create store step 4 | `/demo/onboarding/4` |
| customize storefront | `/demo/dashboard/storefront` |
| ai tools | `/demo/dashboard/ai` |
| analytics | `/demo/dashboard/analytics` |
| orders and inquiries | `/demo/dashboard/inquiries`, redesigned as WhatsApp contact activity |
| billing and plans | `/demo/dashboard/billing` and `/pricing` |
| profile settings | `/demo/dashboard/settings` |

Real `/dashboard`, `/dashboard/settings` and authentication pages use the same visual system. They still require the real Supabase session and read/write the signed-in user's data. `/admin` authorization remains unchanged.

## Design implementation

Forest-green / warm-ivory tokens, editorial serif headings, compact product cards, a CSS-built phone preview, layered photographic hero, category strips, compact seller sidebar, form panels and preview columns reproduce the reference hierarchy. Components are reusable; no full-page screenshot is used as a background. Layouts adapt at 1100, 800 and 600 px. Generated imagery and business-rule exclusions mean this is not a pixel-for-pixel copy.

`src/components/bemba/` contains the shared presentation, marketplace, product/store views, seller shell, seller screens and store editor. `src/lib/demo/catalog.ts` is explicitly a design-preview fixture. It is not imported by Supabase services or the protected dashboard's database queries.

Preview interactions include live search, category/city/price filtering, product sorting, photo selection, mobile navigation, store tabs, seller-product filtering, editable product preview with local image selection, four-step store setup, name/tagline/theme preview, settings tabs and clearly labelled non-persistent form feedback. AI preview uses an explicitly labelled local text template, not an API or fabricated AI success. Real AI integration remains a later milestone.

## Preserved business rules

- No marketplace checkout, cart, internal chat, payouts, withdrawals or seller balances.
- No fabricated reviews, endorsements, verified badges, sales revenue or invoice records.
- Analytics show no recorded events until real event collection is connected. Sample product count reflects only preview fixtures.
- Demo WhatsApp CTAs explain that no real seller number is attached; they never contact an arbitrary person.
- Plans do not activate subscriptions or collect payments. Prices and limits remain unannounced.
- `/demo/*` is marked `noindex, nofollow`. Sample content cannot mutate private seller data.

## Verification

- `npm run check`: lint, type generation/TypeScript, existing 18 tests and Next production build.
- `npm run test:smoke` and `node scripts/auth-smoke.mjs`: existing public/auth route and error handling checks.
- `npm run test:design`: 18 screen routes, preview labels/noindex, nine local image assets and unknown-product 404.
- Browser visual verification remains blocked: the remote browser cannot open local loopback or local files, and the known Vercel deployment URL requires Vercel sign-in. No mobile screenshot or pixel-identical claim is made. Responsive rules are implemented, but still require browser acceptance at mobile/tablet/desktop widths.
- Supabase project provisioning, live registration/Storage acceptance and seller publishing remain separate unfinished M2/M3 integration gates. No database capability is claimed on the basis of demo UI.

## Hosting

The owner connected the existing repository to Vercel. These changes use standard Next.js rendering and local Next Image assets. Existing optional Cloudflare configuration is retained. No hosting credentials or deployment settings are modified by this design change.
