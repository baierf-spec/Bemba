# Bemba MVP scope — decision baseline

Status: specification for phased implementation. Milestone M1 delivers the scaffold only.
Authority: the user's current BEMBA.COM brief overrides all screenshot text and any older Bemba concepts. Bemba is a seller SaaS and product directory, not a dating app or transaction marketplace.

## Product boundary

Launch market: Zambia; English UI; ZMW prices; timestamps stored in UTC, seller reports displayed in Africa/Lusaka. One storefront per seller account in MVP, with UUID tenancy at every data boundary. Buyers browse without registering. No buyer account is required for WhatsApp contact.

Sellers publish a branded catalog and receive contact through ordinary wa.me links. Bemba cannot observe whether a message is sent, answered, paid, delivered or refunded. The UI always says “Ask on WhatsApp” or “Contact seller”. Sellers arrange the transaction independently.

## Included

| Area | Committed MVP behavior |
|---|---|
| Discovery | SSR homepage, category directory, keyword/category/city/price/availability filters, newest/price sorting, URL-backed pagination, honest empty/error states |
| Product | Gallery, title, plain-text description, category, optional price in ZMW or “Ask for price”, availability, seller link, WhatsApp CTA, report form, metadata and eligible structured data |
| Store | Unique slug, logo/cover, name, description, city, category, palette preset, contact number, opening hours, seller-provided pickup/delivery note, product catalog |
| Authentication | Email/password, verified email, reset password, logout; same identity service for administrators; no social auth or phone OTP in MVP |
| Onboarding | 1 business identity and slug; 2 logo/cover and theme; 3 contact and business information; 4 validation and preview/submission. Draft persisted after each step; resumable |
| Seller workspace | Actual store/product totals, actual views and WhatsApp clicks, product CRUD, reorder/remove images, publish/unpublish, customize store, settings |
| AI | Generate a product description from seller-supplied facts; preview and explicit apply; server-side provider call, atomic per-user daily quota, usage record, error handling |
| Moderation | Admin queue for store/product approval and rejection, reports, product/store restrictions, account suspension, append-only audit history, reason recorded |
| Operations | Actual active-store/published-product/report counts, recent failures, account lifecycle, privacy notice, terms, reporting/support details |
| SaaS boundary | Pricing information and entitlement interface; no payment provider or charge button until commercial terms and provider are chosen |

Defaults to validate before public launch: first-publication approval; substantive changes (text, category, contact, images) reset approval to pending. Published content requires an active owner, approved store and approved product. Sellers cannot approve themselves. An empty approved store can be public; onboarding never manufactures a product.

Content limits proposed for engineering: 5 images/product, 5 MiB/image, JPEG/PNG/WebP only; name 120 characters, description 5,000 characters. These are initial safety limits, not paid plan promises. AI launch quota and pricing require owner decision; no invented commercial price in the UI.

## Explicitly excluded

No cart, checkout, product payment, orders, earnings, balances, withdrawals, payouts, shipping integrations, internal chat, WhatsApp inbox synchronization, reviews, star ratings, testimonials, follower counts, verified badges or invented growth statistics. No inventory reservation, product variants, team members, custom domains per seller, automatic social posting, AI image generation, AI ad campaigns, marketing email system, multi-currency, advanced visitor demographics or recommendations in MVP.

Paid subscriptions/promotions are a later billing milestone: Bemba is the merchant for its own service only. A future BillingProvider interface creates Bemba subscriptions and verifies provider webhooks; it must never create seller orders or settlement ledgers. Promotion placement will be explicitly labeled “Sponsored”. No production billing rows or pretend invoices now.

## Reference audit

All 17 PNGs from Bemba.rar were inspected. Thumbs.db is an irrelevant operating-system thumbnail file. No separate textual brief was present. References are design input only and are not copied into public assets.

| Reference | Keep | Remove or change |
|---|---|---|
| home page.png | Ivory/green header, serif hero, category tiles, product grid, 3-step explanation | Testimonials, ratings, invented featured listings, unapproved K99/K249 prices; “WhatsApp orders” → contact |
| all_products.png | Search row, category chips, filters, responsive grid | Rating filters, unearned badges, fabricated counts; no fake featured inventory |
| product.png | Gallery, details, prominent contact CTA | Star reviews, quantity/variant ordering controls, shipping promises; order CTA → inquiry |
| seller profile.png | Cover/logo, store description, catalog, opening hours | Follow, ratings, reviews, verified badges, add-to-cart buttons |
| seller page.png | Sidebar, actual catalog totals, quick actions | Orders, payouts, messages, fake customer conversations, “customers” inferred from clicks |
| manage products.png | Table/cards, search, filters, draft/publish states | Total orders, ratings and fake insight numbers |
| add new product.png | Structured fields, image upload, draft/publish, AI description helper | Product-specific shipping fees, social posting tools, invented AI performance promises |
| create store step 1.png | Business identity form and saved draft | Consolidate duplicated branding/contact into subsequent steps; no payouts/messages nav |
| create store step 2.png | Theme, image upload, live preview | Template product imagery, fabricated metrics and reviews inside preview |
| create store step 3.png | Saved contact, hours, informational pickup/delivery text | Fulfilment management, shipping price engine, map logistics, automatic return workflows |
| create store step 4.png | Checklist, desktop/mobile preview, submit | “Launch instantly” before moderation; unapproved plan promises |
| customize storefront.png | Brand controls, preview, save, share link | Delivery-management engine, fake verification, payment/social integrations |
| orders and inquiries.png | Nothing from the inbox workflow | Entire internal inbox, order status, quick replies, conversations; replace entry with Analytics |
| analytics.png | Date range, genuine page views/CTA counts, top viewed products | Orders, inquiry completion, sales conversion, demographics, city inference and unsupported source attribution |
| ai tools.png | Description input/output and explicit apply | Social posts, ads, bio/headline suite, fake usage metrics |
| profile settings.png | Profile, email/password flows, account settings | Team, fake connected WhatsApp/Google/Facebook, unsupported notifications |
| billing and plans.png | Informational plan layout after approval | Saved payment cards, invoices, next bill, fabricated subscription state, checkout |

## Design system

Forest #164B38; warm ivory #F7F7EF; white surfaces; muted green #E7EEE6; restrained gold accents. Serif display typography with system sans body for the scaffold (no remote font build dependency). Later choose and self-host licensed font files. 8px spacing rhythm, 12–24px card radii, thin neutral borders, subtle shadows. Primary CTA solid forest; secondary outlined. Header collapses cleanly on small screens; seller table becomes cards; filter controls use accessible mobile dialog. Focus rings, semantic labels, 44px targets, reduced motion, and no horizontal overflow at 360px.

Product photography must be supplied by rights-holding sellers or licensed with provenance in an asset register. No screenshot crops are production photographs. The initial scaffold intentionally has no fictional product catalog.
