# Complete target route map

Only `/`, `/pricing`, `/api/health`, `robots.txt`, `sitemap.xml`, and framework error/not-found handling are implemented in M1. All other routes below are planned, not working placeholders. Private routes have noindex metadata **and** server authorization; robots is not an access control.

## Pages

| Route | Access | Purpose / milestone |
|---|---|---|
| `/` | Public | SSR entry; scaffold M1, real discovery M4 |
| `/discover` | Public | `q`, `category`, `city`, `min`, `max`, `availability`, `sort`, `page` allowlisted query parameters; M4 |
| `/categories` | Public | Approved taxonomy; M4 |
| `/categories/[slug]` | Public | Canonical category landing; M4 |
| `/products/[id]/[slug]` | Public published only | UUID lookup; redirect stale slug to canonical; M4 |
| `/stores/[slug]` | Public approved only | Storefront/catalog; M4 |
| `/pricing` | Public | No charge flow; M1 information, final terms M7 |
| `/for-sellers` | Public | Explain storefront and WhatsApp model; M4 |
| `/privacy`, `/terms`, `/support` | Public | Owner-approved operating information; M7 |
| `/auth/register` | Guest | Seller email registration; M2 |
| `/auth/login` | Guest | Seller/admin login; M2 |
| `/auth/check-email` | Guest | Verification instructions; M2 |
| `/auth/forgot-password` | Guest | Generic response, no email enumeration; M2 |
| `/auth/reset-password` | Recovery session | Validated new password; M2 |
| `/auth/error` | Public noindex | Safe error/retry UI; M2 |
| `/onboarding/business` | Active seller | Step 1; M3 |
| `/onboarding/brand` | Active seller, owns draft | Step 2; M3 |
| `/onboarding/contact` | Active seller, owns draft | Step 3; M3 |
| `/onboarding/review` | Active seller, owns draft | Step 4, submit for review; M3 |
| `/dashboard` | Active seller | Operational summary; M5 |
| `/dashboard/products` | Active seller | Paginated own catalog; M3 |
| `/dashboard/products/new` | Active seller | Create draft; M3 |
| `/dashboard/products/[id]/edit` | Owner | Edit/publish/archive; M3 |
| `/dashboard/storefront` | Owner | Brand and contact settings; M3 |
| `/dashboard/storefront/preview` | Owner, no-store | SSR unpublished preview; M3 |
| `/dashboard/ai` | Active seller | Description generation; M6 |
| `/dashboard/analytics` | Owner | View and click counts; M5 |
| `/dashboard/settings` | Authenticated | Profile/password/deletion request; M2/M7 |
| `/dashboard/plan` | Active seller | Informational entitlement, no payment UI; M7 |
| `/account/restricted` | Authenticated | Restriction reason/support path; M2 |
| `/admin` | Active admin + MFA | Real operational totals; M5 |
| `/admin/stores`, `/admin/stores/[id]` | Active admin + MFA | Review stores; M5 |
| `/admin/products`, `/admin/products/[id]` | Active admin + MFA | Review products; M5 |
| `/admin/reports`, `/admin/reports/[id]` | Active admin + MFA | Triage reports; M5 |
| `/admin/users`, `/admin/users/[id]` | Active admin + MFA | Restrictions; M5 |
| `/admin/audit` | Active admin + MFA | Read-only audit; M5 |

## Server boundaries

| Method / endpoint | Authorization / validation |
|---|---|
| GET `/api/health` | Liveness only, no secrets or database-readiness claim |
| GET `/auth/callback` | PKCE exchange; same-origin allowlisted redirect; no-store |
| GET `/auth/confirm` | Verify email token; fixed allowed destinations |
| POST `/auth/logout` | Session + same-origin CSRF checks |
| POST `/api/events` | Bounded payload, actual published target resolved server-side, bot/rate checks; never arbitrary store ID |
| POST `/api/contact/whatsapp` | Resolve public product/store, record click attempt once, return computed wa.me URL; no purchase/lead assertion |
| POST `/api/reports` | Bounded report text, published target, rate limit and abuse challenge for anonymous reports |
| POST `/api/ai/description` | Validated session, active user, product ownership, atomic quota reservation, capped input/output |
| POST `/api/uploads/sign` | Active owner; allowed target/path/MIME/size; short-lived upload token |
| POST `/api/uploads/finalize` | Verify stored object bytes, strip EXIF, re-encode/renditions, ownership, moderation reset |
| GET `/media/[assetId]/[variant]` | Check publication or owner/admin on each request; safe MIME; no public raw bucket |
| GET `/sitemap.xml`, GET `/robots.txt` | Published canonical public content only; deny indexing in nonproduction |

Store/product/profile and admin mutations use named Server Actions, not duplicate REST endpoints. Each action rechecks identity, current account status, tenant/role, parses its complete payload, and checks origin. Actions return typed field errors; SQL constraints/RLS enforce the same boundary. Never rely on hidden UI buttons or middleware alone.

No routes are planned for cart, checkout, orders, messages, earnings or payouts. Billing provider checkout/webhook routes are intentionally absent until a separate billing specification is accepted.
