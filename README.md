# Bourbon Finder MVP

Expo React Native app backed by Supabase, with a local sample-data fallback when live tables are unavailable.

## Quick start

```bash
npm install
npm run start
```

For web:

```bash
npm run web
```

## Environment

The app and Supabase scripts read env files in this order:

- `.env`
- `.env.local`
- `.env.<APP_ENV>`
- `.env.<APP_ENV>.local`
- process env

`APP_ENV` defaults to `EAS_BUILD_PROFILE`, then `NODE_ENV`, then `development`.

Recommended local setup:

```bash
.env.development.local
.env.preview.local
.env.production.local
```

Required database settings:

```bash
SUPABASE_DB_HOST=db.<project-ref>.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=...
SUPABASE_DB_PUB_KEY=...
```

`app.config.js` derives the Expo public values automatically:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

For EAS builds, set those two `EXPO_PUBLIC_*` variables in each environment you use (`development`, `preview`, `production`).

## Database bootstrap

Apply schema:

```bash
npm run supabase:apply
```

Seed data:

```bash
npm run supabase:seed
```

Generate a SQL seed file for the Supabase SQL Editor fallback:

```bash
npm run supabase:seed:sql
```

Run both:

```bash
npm run supabase:bootstrap
```

The bootstrap script prefers SQL files in `supabase/migrations/` and falls back to `supabase/schema.sql`.

## IPv4-only migration path

If your machine cannot reach the direct IPv6-only `db.<project-ref>.supabase.co` endpoint, set `SUPABASE_DB_URL` to a Supavisor session-pooler connection string and rerun the same scripts. If you still do not have a working pooler URL, run the schema and `supabase/seed.sql` through the Supabase SQL Editor.

Supabase documents the format as:

```bash
postgres://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

Reference:

- [Connect to your database](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Available regions](https://supabase.com/docs/guides/platform/regions)

## Important paths

- `src/services/api.ts`: Supabase data access with local fallback
- `src/services/supabase.ts`: Supabase client creation
- `supabase/migrations/20260618202500_init_bourbon_finder.sql`: initial schema migration
- `supabase/seed.sql`: SQL Editor seed payload
- `scripts/apply-supabase-schema.mjs`: schema runner
- `scripts/seed-supabase.mjs`: seed loader
- `scripts/generate-seed-sql.mjs`: SQL seed generator

## Current status

- Expo Android preview build succeeds.
- The app loads locally.
- Live Supabase reads still require the schema to exist in the target project.
