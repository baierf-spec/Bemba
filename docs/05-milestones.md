# Incremental delivery and acceptance gates

Every implementation milestone: update this ledger with changed files, configuration prerequisites, actual command results and limitations; pass lint/typecheck/unit/build plus milestone-specific functional tests; commit working source before proceeding. Do not replace missing integrations with demo arrays. Tests requiring unavailable credentials are recorded as NOT RUN, never green.

| Milestone | Deliverable / file areas | Prerequisite | Required acceptance |
|---|---|---|---|
| M0 — Specification | `docs/01`–`06`: scope, reference exclusions, routes, schema, architecture, plan, configuration | Supplied brief and 17 PNGs | All business rules mapped, scope conflicts resolved; no runtime code to build |
| M1 — Scaffold (this task) | `src/app`, shared UI tokens/components, Supabase client factories, env/config, package lock, health route, CI, tests, adapter validation where possible | npm access; no production accounts | Lint, TypeScript, unit tests, Next production build, live HTTP smoke; document exact adapter build/workerd outcome. No claim of login/product CRUD |
| M2 — Identity + data | CLI-created `supabase/migrations/*`, local seed, generated DB types, auth forms/callbacks, session refresh, auth services | Docker/local Supabase, staging project, email sender; admin bootstrap UUID | Clean reset/replay, auth signup/verify/login/reset/logout, two-user isolation, protected route denial, role escalation denial, suspended-token denial, RLS/Storage advisors; Workers cookies compatibility |
| M3 — Seller catalog | Four onboarding steps, product forms/actions, private image pipeline, storefront editor/preview | M2; approved upload transform approach | Draft resume, duplicate slug errors, CRUD, image limits/order/delete, cross-tenant object denial, unpublished image denial, no remote arbitrary URL fetch |
| M4 — Public discovery | Public pages, SQL search/filter queries, metadata, image/gallery, WhatsApp links, sitemap | M3; approved test fixtures; licensed/seller media | SSR content without JS, filters/paging/canonical behavior, mobile 360/768/1440 QA, drafted/hidden content 404, product link/phone encoding, structured-data validation |
| M5 — Moderation + analytics | Admin guards/queues/actions, reports, audit, event ingestion/aggregation, real dashboard | MFA admin, abuse challenge/rate limits | Nonadmin forbidden, transactional audit, stale-review race test, suspension hides content/media, anonymous abuse limit, dedupe, only observed clicks/views in chart; no sales inference |
| M6 — AI | Server provider adapter, quota transaction, request validation, description preview/apply | Server AI key, model and spend limit approved | Ownership checks, simultaneous quota exhaustion, provider failure/timeout, no browser key, no fabricated claims in prompt, explicit apply resets approval |
| M7 — Release | Owner-approved pricing/terms/privacy/support, retention/deletion, deployment config, production assets, monitoring/runbook | Cloudflare/DNS, SMTP, staging signoff, backup restore verification | Full browser E2E on staging Workers, auth cookie/redirect tests, accessibility, SEO, image/performance, dependency audit, secrets scan, migration replay; deploy then production smoke |
| Later — Bemba billing | Subscriptions and labeled promotions only | Provider/price/legal decisions | Separate spec, signature-verified idempotent webhooks, entitlement expiry; no seller settlements |

## M1 completion ledger

See `07-verification.md` for the actual executed commands, versions, output summary, file inventory and Git checkpoints. Later milestones are not implemented by the scaffold. No live accounts, payment methods, admin identity or product content have been invented.
