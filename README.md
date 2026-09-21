# Bemba

Seller storefront SaaS and product discovery for Zambia. Buyers contact sellers on WhatsApp; Bemba does not process their purchases.

**Delivery status: M2 database/authentication code implemented; source is hosted at [baierf-spec/Bemba](https://github.com/baierf-spec/Bemba); hosted Supabase verification remains pending.** See [M2 handoff and test report](docs/08-m2-handoff.md). PostgreSQL/RLS tests pass; real Supabase registration and storage HTTP tests have not yet run. Seller catalog, marketplace, moderation workflows and AI remain later milestones.

**Design update:** the supplied 17 mockups now have mapped screen implementations, generated/local image assets and a clearly separated interactive design preview. Start at `/`, `/demo/marketplace`, `/demo/dashboard` or `/demo/onboarding/1`. See [reference mapping and verification](docs/09-design-reference-implementation.md) and [image provenance](docs/10-image-assets.md). Demo forms do not write to real seller accounts.


## Start

Node 24 required (native TypeScript support is used by the test runner).

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. No credentials are needed for scaffold build. Supabase client factories require actual configured keys when invoked and never silently substitute local data.

```bash
npm run check
npm run start -- --hostname 127.0.0.1
# Other terminal:
npm run test:smoke
```

## Documentation

1. [MVP and screenshot audit](docs/01-mvp-scope.md)
2. [Complete target routes](docs/02-routes.md)
3. [Database schema and relationship diagrams](docs/03-data-model.md)
4. [Architecture and deployment](docs/04-architecture.md)
5. [Milestones and gates](docs/05-milestones.md)
6. [Setup, credentials and permissions](docs/06-setup-and-access.md)
7. [Executed validation and limitations](docs/07-verification.md)

## Source structure

```text
src/app/                 App Router pages, metadata and route handlers
src/components/ui/       Owned shadcn-style primitives
src/lib/supabase/        Official browser/server clients; no privileged client yet
src/lib/whatsapp.ts      Validated, unit-tested contact-link builder
supabase/migrations/     M2 migration destination; schema currently documented
tests/                   Native Node functional unit tests
scripts/                 Live HTTP smoke tests
docs/                    Scope, design audit, schema, decisions and runbooks
```

The 17 supplied design PNGs are references only. They are not shipped as app assets. No image licensing assumptions, invented price plans, testimonials, ratings or sales metrics.
