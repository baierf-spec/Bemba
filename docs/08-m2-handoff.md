# M2 — Database and authentication implementation

Status: code implemented and PostgreSQL isolation tests pass; external provisioning and real Supabase acceptance remain pending. Do not label this milestone complete until live Auth/Storage tests pass.

## Scope delivered

- Two CLI-created SQL migrations implement the 17-table model, UUID/FK/check constraints, search indexes, signup provisioning, ownership, independent publication/moderation, automatic review reset and RLS.
- Email/password registration/login, email confirmation, recovery/reset, logout, server-side identity checks, current account-state checks and same-origin auth form POST validation.
- `/dashboard`, `/dashboard/settings`, `/account/restricted`, `/admin` protected on the server; mutations recheck identity. Admin requires database role plus AAL2; `/auth/mfa` provides TOTP enrollment/challenge.
- Real SDK calls only. Dashboard reads own profile/store from Supabase and settings updates the signed-in user's display name. Missing configuration/provider failures do not substitute demo records.
- Private `store-media` bucket with 5 MiB / JPEG-PNG-WebP restrictions. Upload requires an owned pending `media_assets` row with exact UUID-based path. Foreign/anonymous reads denied. No overwrite/upsert; approved bytes cannot be silently replaced. Byte validation, EXIF stripping and public renditions are M3; M2 does not expose raw uploads publicly.
- No marketplace payments, carts, payouts, internal messages or unrelated public UI changes.

## Migrations

1. `supabase/migrations/20260921023956_bemba_identity_catalog_rls.sql`
2. `supabase/migrations/20260921023959_bemba_private_storage.sql`

The migrations have been executed against a clean PGlite PostgreSQL engine by automated tests. Supabase-owned Auth/Storage relation/function contracts in that test are fixtures; the application schema, triggers, grants, SQL constraints and RLS are the actual migrations. This verifies PostgreSQL behavior, not Supabase Auth email delivery or Storage HTTP. No migration was applied to the existing unrelated VPN project.

Test-driven correction: store INSERT ... RETURNING initially failed because a STABLE ownership lookup could not see the newly inserted row in the same command snapshot. The store SELECT policy now compares its own owner_id directly and checks active account status. The regression is covered by the store creation test.

## Test results

| Gate | Result |
|---|---|
| ESLint | PASS |
| TypeScript | PASS |
| Native Node tests | PASS: 18 tests including 11 database/security subtests |
| PostgreSQL migration execution | PASS on clean embedded PostgreSQL, all 17 tables have RLS |
| Tenant privacy | PASS: other seller cannot read private rows or update profile/store |
| Privilege escalation | PASS: owner rewrite, forged ownership, user metadata admin and direct approval denied |
| Public privacy | PASS: private profiles/drafts denied |
| Suspension | PASS: public visibility, writes and storage access revoked against current account status |
| Admin MFA policy | PASS: admin role alone insufficient; AAL2 required |
| Storage SQL policies | PASS: owned pending insert/read allowed; foreign/anon/overwrite denied |
| Next production build | PASS |
| OpenNext bundle | PASS, includes middleware; Workers runtime remains unverified |
| Native HTTP smoke | PASS: prior public routes, five auth pages, cache/noindex, cross-origin POST 403, missing configuration handled |
| Real Supabase register/sign-in | NOT RUN: no Bemba project/keys |
| Real Supabase private Storage HTTP | NOT RUN: no Bemba project/keys |
| Email delivery, browser cookie journey, recovery and TOTP | NOT RUN end-to-end |
| Hosted Supabase security/performance advisors | NOT RUN: no Bemba project |
| GitHub source sync | Source upload targets the owner-created `baierf-spec/Bemba` repository; verify the remote tree after upload |

Native Next 16 warns that middleware.ts is deprecated. It is intentionally used as an Edge-compatible refresh boundary for the OpenNext candidate; server authorization is independent. Do not claim Workers session compatibility based solely on a successful bundle.

## External setup needed

### 1. GitHub

Repository: https://github.com/baierf-spec/Bemba (created by the owner). The connected account has push permission. The existing local project is uploaded through GitHub Git Data APIs; no source is recreated and no credentials are committed. Local milestone commits are retained locally; the remote import records the reviewed source snapshot.

### 2. Supabase project

Available organization: **baierf-spec's Org**, id `czyjegaplzllkvnzdnun`. Only an inactive **VPN** project exists; it was left untouched. Cost lookup returned **0 USD/month** for a new project at this check. The create-project tool explicitly requires the user to choose the organization. Proposed project: **bemba-staging**, in that organization; use an available European region after confirming current choices. This is a separate test environment, never reuse the unrelated VPN project.

After the organization is chosen and cost confirmation completed, create the project, apply the two version-controlled migrations, run advisors, and configure:

- `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SITE_URL=http://localhost:3000`, `APP_ENV=development`.
- Production/staging host uses its exact HTTPS SITE_URL; keep auth redirect allowlists exact.
- Supabase Auth: email confirmation enabled, password minimum 12, anonymous sign-in disabled; production SMTP configured by owner. Template sources are in `supabase/templates/confirmation.html` and `recovery.html`.
- Email confirmation template targets `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`; recovery uses `type=recovery`.
- Enable TOTP MFA in the project. No user is automatically made an admin; owner must select a verified account UUID for audited bootstrap.
- Ordinary application requests use only the publishable key and user's session, not a service-role bypass. The integration test's server secret is never part of frontend env.

### 3. Local Supabase alternative

Docker is not installed in this execution environment. On a machine with Docker, use Node 24 and the pinned Supabase CLI in package-lock:

```bash
npm ci
npx supabase start
npx supabase db reset --local
npx supabase status
```

This reset is for local disposable development only. `supabase/seed.sql` is intentionally empty; categories are in migration history. Local signup email uses the local inbox service; do not fabricate a production sender. The supplied TOML includes confirmation/recovery template paths.

For hosted migration, after linking the intended new project with the CLI, review `npx supabase db push --help`, then `npx supabase db push --linked`. Generate real project types with `npx supabase gen types --linked --lang typescript --schema public > src/lib/supabase/database.types.ts` and commit them. Generated hosted database types remain an external gate; no hand-written types are mislabeled as generated.

### 4. Run real integration tests

Use a dedicated local/staging project only. Set these in a secure environment, not source control:

- `TEST_SUPABASE_URL`
- `TEST_SUPABASE_PUBLISHABLE_KEY`
- `TEST_SUPABASE_SECRET_KEY`
- `TEST_ALLOW_REMOTE_PROJECT_REF` (only for remote; must match host exactly)

```bash
npm run test:integration
```

The script calls actual Auth signUp/signIn, provisions two uniquely named disposable TEST accounts, uses Auth Admin API to confirm those test emails, checks profile/ownership through PostgREST, uploads a tiny image to real private Storage, verifies cross-user/anonymous/overwrite denial and checks signout. Test-only confirmation does not prove email delivery; separately complete registration/confirmation/recovery through an inbox and the application UI. Cleanup targets only this run's IDs. If a failure leaves constrained records, inspect that test project; do not run broad DELETE queries.

## Changed files

- Dependency/config: `package.json`, `package-lock.json`, `supabase/config.toml`, `supabase/.gitignore`, `supabase/seed.sql`, email templates.
- Database: both migrations above, migration README.
- Auth services: `src/lib/auth/access.ts`, `validation.ts`, `src/lib/supabase/server.ts`, `src/middleware.ts`.
- Auth UI: `src/components/auth-form.tsx`, `mfa-form.tsx`; `src/app/auth/layout.tsx`; login/register/forgot-password/reset-password/check-email/error/forbidden/mfa pages; session/confirm/callback handlers.
- Seller/admin: `src/app/dashboard/layout.tsx`, `page.tsx`, `settings/page.tsx`, `settings/actions.ts`; `src/app/admin/layout.tsx`, `page.tsx`; `src/app/account/restricted/page.tsx`.
- Tests: `tests/database.test.mjs`, `auth-validation.test.mjs`, `scripts/supabase-integration.mjs`, `auth-smoke.mjs`.
- Handoff: this file, README and status notes in existing docs.

No hosted credentials or user data are included in source or the downloadable package.
