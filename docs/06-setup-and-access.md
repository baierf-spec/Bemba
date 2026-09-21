# Accounts, permissions and exact setup path

## What the owner needs to provide

| Account / information | Needed when | Least privilege / use |
|---|---|---|
| GitHub or other Git remote you own | After scaffold | Repository read/write for source and CI; no organization admin required |
| Supabase staging project | M2 | Project URL + publishable key; project developer access for migrations/Storage/Auth setup |
| Supabase production project | M7 | Separate project and secrets; database migration capability only for deploy job |
| Supabase CLI login / project reference and DB password | M2/M7 | Use local secure CLI/session or CI secrets, not chat or committed `.env` |
| Supabase server secret | M5 and privileged operations | Worker/server secrets only; never NEXT_PUBLIC, never frontend |
| SMTP sender/domain | M2 production-like email testing | Configure inside Supabase Auth; approved From address and SPF/DKIM records |
| Initial admin email/UUID | M2/M5 | A real verified user, manually promoted via audited bootstrap; MFA before admin use |
| Cloudflare account | Adapter deployment/M7 | Worker edit; scoped deployment token, account ID, only required zone DNS edits |
| bemba.com DNS access | M7 | Add the agreed application domain; no unrelated DNS changes |
| OpenAI/provider project | M6 | Restricted API key, selected model, spend budget, daily attempt limit; add via secret manager |
| Actual brand/product assets | M3/M4 | Rights to use originals, logo, alt text; screenshots do not grant asset licenses |
| Commercial/operating details | M7 | Legal business name, support address, terms/privacy owner, approved plan prices/limits, data retention |

No WhatsApp Business API account is needed for ordinary wa.me links. Sellers supply their own valid WhatsApp number. No product-payment provider, bank account or payout permissions are needed. Do not send passwords or secret keys into this conversation; configure them in local ignored env files or the hosting secret manager.

## Run this scaffold

Use Node 24 and npm. In the extracted `bemba` directory:

```bash
npm ci
cp .env.example .env.local
npm run check
npm run dev
```

Open http://localhost:3000. M1 runs without Supabase credentials; missing client credentials produce an explicit configuration error if a client is invoked, never fallback data. `/api/health` is process liveness only. `APP_ENV=production` is reserved for the live public release; previews stay noindex. Set a valid HTTPS `SITE_URL` for production canonical links.

For production-mode local HTTP verification:

```bash
npm run build
npm run start -- --hostname 127.0.0.1
# In another terminal:
npm run test:smoke
```

## M2 database setup (not yet implemented)

Install Docker. Pin the selected current Supabase CLI as a development dependency, inspect `npx supabase --help`, `npx supabase init --help`, `npx supabase start --help` and migration commands before use. Initialize local configuration, create migration files from `03-data-model.md`, then start/reset local Supabase. Never run a production reset. Local seed must refuse non-local URLs and require an explicit development flag.

Configure Auth site URL to `http://localhost:3000` locally and the exact staging/live domains remotely. Allow only the required `/auth/callback`, `/auth/confirm` and recovery destinations. Enable email confirmation, turn off anonymous sign-in, set secure password policy, and test sender delivery. No wildcard production redirect domains. Generate `src/lib/supabase/database.types.ts` from the validated database; don't hand-maintain generated types.

Scaffold Supabase factories are preparatory code, not a complete auth implementation. M2 must implement session refresh, callback, route/action guards and cookie/no-cache tests together.

## Cloudflare release path

Use the adapter commands/config only if recorded as validated in `07-verification.md`. Configure staging first, set build-time public Supabase URL/key and runtime server secrets separately, run adapter build and local preview smoke, deploy to staging, then run full auth/DB/media tests. Cloudflare token and account selection must point to the owner's account. Set production domains only after staging signoff. Do not publish the M1 scaffold as a finished marketplace.

Read `04-architecture.md` before changing adapter. Current Cloudflare default vinext is beta; this project preserves native Next.js and evaluates OpenNext explicitly. A successful Next build alone does not prove Workers compatibility.

The exact candidate is included. To rerun the remaining runtime check on your own Linux/WSL machine:

```bash
npm run build:worker
cp .dev.vars.example .dev.vars
npm run preview:worker
# In another terminal:
SMOKE_URL=http://127.0.0.1:8787 npm run test:smoke
```

These are local commands, with no Cloudflare account required. `npm run deploy:worker` is a separate external deployment command; do not run it until the intended account, staging secrets and runtime tests are ready. The bundled `wrangler.jsonc` targets `bemba-staging`, not the live domain.

## Restore the included Git history

The ZIP includes a complete Git bundle in its `history` folder as well as the working source. To recover commits into a fresh checkout from the extracted `bemba` directory:

```bash
git clone history/bemba-history.bundle ../bemba-with-history
cd ../bemba-with-history
git remote remove origin
# Then add the repository you own:
git remote add origin YOUR_GIT_REPOSITORY_URL
```

`YOUR_GIT_REPOSITORY_URL` is a placeholder. No repository has been created or pushed to an external account. Keeping the ZIP alone also preserves all source files and the lockfile.
