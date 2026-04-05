# Bourbon Finder MVP (Expo + Azure)

This branch scaffolds a React Native (Expo) proof-of-concept for Bourbon Finder with:

- Search -> Bottle Detail -> Listings flow.
- Price comparison sorted ascending and highlighted best price.
- Quick add listing form for MVP admin/test updates.
- Azure Functions-compatible API wrapper.
- Cosmos DB seed strategy with a starter JSON list of 50 bottles.

## Quick start

```bash
npm install
npm run start
```

Set the API endpoint for device/simulator access:

```bash
EXPO_PUBLIC_API_BASE_URL=https://<your-functions-app>.azurewebsites.net/api
```

## API endpoints used

- `GET /bottles`
- `GET /bottles/{id}`
- `GET /stores`
- `GET /listings?bottleId=`

## Seed data

Starter bottle file:

- `scripts/seed-bottles.json` (50 records)

Validate locally:

```bash
npm run seed:validate
```

Load into Cosmos DB:

```bash
COSMOS_ENDPOINT=... COSMOS_KEY=... node scripts/seed-cosmos.mjs
```

## GitHub Action: Expo build by PR label

The workflow at `.github/workflows/expo-build.yml` supports two trigger styles:

1. **Pull request labels** (recommended)
2. **Manual `workflow_dispatch`** inputs

### Label format

Apply a PR label with this exact syntax:

- `eas-build-[platform]:[profile]`

Examples:

- `eas-build-ios:preview`
- `eas-build-android:production`
- `eas-build-all:preview`

Supported values:

- `platform`: `android`, `ios`, `all`
- `profile`: `development`, `preview`, `production`

When a valid label exists, CI installs dependencies, validates seed data, then runs:

```bash
eas build --platform <platform> --profile <profile> --non-interactive
```

Required GitHub secret:

- `EXPO_TOKEN`: personal or robot token from your Expo account.

### Do you still need this pipeline if GitHub is connected in Expo?

If Expo GitHub integration is already connected, you *can* trigger builds from Expo UI alone.

Keep this pipeline when you want:

- label-driven build control directly in PR workflow,
- auditable build triggers inside GitHub checks,
- a single automation path for the team.



## Expo Web deploy (GitHub Pages)

A separate workflow `.github/workflows/expo-web-deploy.yml` now exports web output and deploys it to GitHub Pages on pushes to `main`.

It runs:

```bash
npm ci
npm run web:build
```

The web export output directory is `dist/`, which is uploaded/deployed by GitHub Pages actions.

### iOS non-interactive build requirements

If you run `eas build --platform ios --profile production --non-interactive`, Apple credentials must already exist on Expo servers.

If you do **not** have an Apple Developer account yet:

- Use Android-only labels for now (for example `eas-build-android:production`), or
- Use non-production profiles while you validate UI/API flow.

Also set in app config (already done in this repo):

- `ios.infoPlist.ITSAppUsesNonExemptEncryption = false`

Without Apple credentials, iOS production non-interactive builds will fail during credential setup even if app config is correct.

## Supabase-only option (drop Azure entirely)

Yes — you can run this MVP fully on Supabase and remove Azure services.

### Minimum architecture

1. **Expo React Native app** (client)
2. **One Supabase project** with:
   - Postgres database (bottles, stores, listings)
   - Storage bucket (bottle images)
   - Optional Auth (can be anonymous/public for MVP)

For a low-security MVP, you can query Supabase directly from the app using the anon key and relaxed RLS policies.

### Do you need backend resources beyond Supabase?

For your current requirements: **no additional backend is required**.

### RLS vs Data API security (recommended)

Use **RLS** as your primary security model.

- Turn **RLS ON** for all tables.
- For MVP speed, allow public `SELECT` via an `anon` policy on read-only tables (`bottles`, `stores`, `listings`).
- Keep `INSERT/UPDATE/DELETE` locked down (or limited to an admin role).

Treat Data API settings as secondary guardrails, not your main authorization layer.

Practical recommendation for this app:

1. `bottles`, `stores`, `listings`: RLS enabled + public read policy.
2. Writes: restricted to admin/service role only.
3. When user accounts arrive, tighten policies per user/store ownership.


You only add more backend pieces later if you need them, e.g.:

- server-side ingestion/scraping jobs,
- rate-limiting and stricter API control,
- private admin-only write APIs.


### Supabase provisioning next step (with your secret)

Since you now use the `SUPABASE_DB_*` secret naming, set/export these and run:

```bash
export SUPABASE_DB_HOST=<your-supabase-db-host>
export SUPABASE_DB_PORT=5432
export SUPABASE_DB_NAME=postgres
export SUPABASE_DB_USER=postgres
export SUPABASE_DB_PASSWORD=<from secret store>
./scripts/apply-supabase-schema.sh
```

This applies `supabase/schema.sql`, creates `bottles`, `stores`, and `listings`, and enables RLS with public read-only policies for MVP.

`SUPABASE_DB_PUB_KEY` is useful for app-side read access (set it as `EXPO_PUBLIC_SUPABASE_ANON_KEY` when you wire Supabase client reads in React Native).

### Suggested Supabase schema mapping

- `bottles` table -> bottle metadata
- `stores` table -> geo/store metadata
- `listings` table -> price + stock + timestamps
- `storage` bucket -> bottle images

This gives you search + price comparison + availability without any Azure dependency.

## Azure resources to provision (MVP)

For your current architecture, provision these first:

1. **Azure Functions (Consumption plan)**
   - Hosts API endpoints (`/bottles`, `/stores`, `/listings`)
   - Lowest-cost serverless compute for intermittent traffic
2. **Azure Cosmos DB for NoSQL (free tier enabled)**
   - Primary app data store for bottles, stores, and listings
   - Enable free tier at account creation
3. **Azure Storage Account (Blob + Functions backing storage)**
   - Bottle image storage (Blob)
   - Required backing storage for Functions runtime
4. **Azure Static Web Apps** (optional for web-lite now, useful later)
   - Hosts a read-only web surface if/when you add Next.js
5. **Application Insights**
   - Request/error telemetry for API quality and debugging

Nice-to-have later:

- **Azure API Management** for versioning, quotas, partner integrations
- **Azure AD B2C / Entra External ID** for phase-2 user auth flows

## Should you use another free NoSQL alternative?

Short answer: if your backend is Azure-first, **stay on Cosmos DB free tier** for MVP speed.

When to stay with Cosmos DB:

- You want minimal cloud sprawl and easiest Azure Functions integration.
- You can fit early traffic/data into free tier limits.
- You want partitioning + low-latency reads without extra adapters.

When to consider alternatives:

- **MongoDB Atlas free tier**: good dev UX, broad ecosystem, but adds cross-cloud ops complexity.
- **Supabase (Postgres) free tier**: great product velocity and auth/storage bundle, but shifts architecture away from current Azure plan and NoSQL model.
- **Firebase Firestore free tier**: excellent mobile sync ergonomics, but requires a Google Cloud backend track.

Recommendation for this project:

- **Phase 1 (now): Cosmos DB free tier**
- **Re-evaluate** only if cost/throughput outgrows free tier or your team prefers a non-Azure backend platform.

## Suggested next steps

1. Replace mock function data with real Cosmos DB reads in Azure Functions.
2. Add Expo Router / React Navigation for explicit multi-screen UX.
3. Add `eas.json` and credentials setup for automated submit profiles used by GitHub Actions.


### EAS init command (project linkage)

```bash
npm install --global eas-cli && eas init --id 52fca7bd-f77c-408e-b3a9-0292eca9139d
```
