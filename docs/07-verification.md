# M1 verification ledger

Delivery: M0 specification + M1 initial scaffold. Research and initial checks: 2026-09-20; final packaging: 2026-09-21. No live marketplace is claimed.

## Implemented and executed

| Check | Result / scope |
|---|---|
| `npm run lint` | PASS; zero ESLint warnings after correcting the PostCSS default export |
| `npm run typecheck` | PASS; Next route type generation and strict TypeScript |
| `npm test` | PASS; 4 tests: missing/unsafe Supabase configuration, correct WhatsApp context, invalid phones, unsafe URLs/titles |
| `npm run build` | PASS; production Next build without credentials or remote font downloads |
| Native server HTTP smoke | PASS; home 200, pricing 200, unknown route 404, staging robots, liveness JSON/no-store, empty staging sitemap; checks noindex and security headers |
| `npm run build:worker` | PASS; OpenNext emits `.open-next/worker.js` from real Next output |
| `npm run preview:worker` | BLOCKED; Wrangler starts binding setup then exits with `uv_interface_addresses returned Unknown system error 1` in this execution environment |
| Local Workers HTTP | NOT RUN because runtime startup failed; repeat commands are in setup guide and CI |
| Browser visual/mobile test | NOT RUN; Chromium download timed out and returned 502; repeated attempts stopped |
| `npm audit --omit=dev --json` | PASS at initial check; zero reported production vulnerabilities (not a guarantee of security) |
| Supabase Auth/DB/Storage/RLS/AI integration | NOT IMPLEMENTED / NOT RUN; M2 onward |
| Live Cloudflare deployment | NOT RUN; no account configuration or deployment credentials used |
| GitHub Actions workflow | Created, not executed on GitHub; no remote repository connected |

Initial HTTP request from a separate execution session encountered ECONNREFUSED despite a running server session. The test was rerun with server and client inside the same execution command and passed. This is included for reproducibility; it is not hidden as a passing first attempt.

## Exact direct versions

Node used: 24.19.0. Framework: Next 16.3.5, React/React DOM 19.3.0. TypeScript 6.0.3; Tailwind/@tailwindcss/postcss 4.3.3. Supabase JS 2.116.0; SSR 0.12.7. OpenNext Cloudflare 1.20.6; Wrangler 4.125.0. Full direct and transitive versions are in `package.json` and `package-lock.json`.

Registry peer check for the selected adapter: Next `>=15.5.24 <16 || >=16.3.3` and Wrangler `^4.125.0`; selected versions satisfy those ranges. Peer range and successful bundle compilation do not replace runtime testing. Current install produced deprecation notices for ESLint 9 and transitive node-domexception/glob; no forced dependency overrides were applied.

## Files created / modified

- Specification: `docs/01-mvp-scope.md`, `02-routes.md`, `03-data-model.md`, `04-architecture.md`, `05-milestones.md`, `06-setup-and-access.md`, this ledger.
- Tooling: `package.json`, `package-lock.json`, `tsconfig.json`, `next-env.d.ts`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `components.json`, `.nvmrc`, `.gitignore`.
- Deployment candidate: `open-next.config.ts`, `wrangler.jsonc`, `.dev.vars.example`, `public/_headers`, `.github/workflows/ci.yml`.
- Configuration/integrations: `.env.example`, `src/lib/site.ts`, `src/lib/utils.ts`, `src/lib/supabase/config.ts`, `browser.ts`, `server.ts`, `src/lib/whatsapp.ts`.
- UI: `src/components/ui/button.tsx`, `card.tsx`, `src/components/site-header.tsx`, `src/app/globals.css`, `layout.tsx`, `page.tsx`, `pricing/page.tsx`, `not-found.tsx`, `error.tsx`.
- Server/SEO: `src/app/api/health/route.ts`, `robots.ts`, `sitemap.ts`.
- Tests: `tests/config.test.mjs`, `tests/whatsapp.test.mjs`, `scripts/smoke.mjs`.
- Handoff: `README.md`, `supabase/migrations/README.md`. The latter marks the M2 migration boundary; it is not executable SQL.

M0 documentation was committed as `e60eed4`. M1 source and final documentation are committed in the included Git history bundle. No existing repository or working app was overwritten.

## Honest limitations and next gate

The UI is a small branded foundation with an explicit “In development” state, not a finished screenshot recreation. No product images, demo sellers, fake reviews, prices, orders or analytics. Registration and discovery links are not made clickable before their routes exist. Public Supabase factories compile, but are not connected to a project; no secret client has been created. Database schema and RLS rules are fully specified logically, but SQL migration generation/application and all tenant-security tests belong to M2. No claim of responsive visual signoff without browser testing.

Next milestone: provision local/staging Supabase, implement and validate schema + auth + RLS, generate database types, and prove authenticated cookie behavior on Workers before implementing seller screens. The owner's account/access checklist is in `06-setup-and-access.md`.
