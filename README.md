# Vible

Online teaching platform built with Nuxt, Vue, Nuxt UI, Pinia, and PostgreSQL on Neon.

## Setup

Use Node.js 24 and npm. Run app commands from `src`:

```bash
cd src
npm ci
```

Create `src/.env.local` with your Neon connection strings (already configured on
this computer):

```dotenv
DATABASE_URL=<pooled PostgreSQL connection string>
DATABASE_URL_UNPOOLED=<direct PostgreSQL connection string>
```

Use the pooled URL for app queries and the direct URL for migrations. Keep
credentials out of Git and browser code. `neon.ts` contains the Neon service configuration.

## Run

```bash
npm run dev       # http://localhost:3000
npm run build     # production build
npm start         # run the built app locally
```

`GET /api/health` checks the database connection. Success returns
`{"status":"ok","database":"connected"}`; failure returns HTTP 503.

For deployment, set `DATABASE_URL` on the app host and run
`node .output/server/index.mjs` from `src` after building on that host.

## Structure

- `src/app/` — pages, layouts, components, and Pinia stores
- `src/server/` — server routes and database access
- `src/public/` — static assets
- `docs/` — project documentation

Authentication and application database tables are not implemented yet.
