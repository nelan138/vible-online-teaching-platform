# Vible

An online teaching platform built with Nuxt and Neon PostgreSQL.

## Setup

Use Node.js 24 and npm. Run commands from `src`:

```bash
cd src
npm ci
```

In the Neon Console, enable Auth and Google sign-in for your database branch.
Allow `http://localhost:3000` for local development.

Install the [Neon CLI](https://neon.com/docs/cli), then download the settings:

```bash
neon link
neon env pull --service auth --service postgres --file .env.local
```

If asked to choose a project, add `--project-id YOUR_PROJECT_ID`.
Use the same branch for Auth and the database.

The generated `.env.local` must contain `DATABASE_URL` and `NEON_AUTH_BASE_URL`.
Keep this file out of Git. Restart the app after changing it.

### Create the profile table

For a new database, run this in Neon's SQL Editor after enabling Auth:

```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES neon_auth."user"(id),
    name TEXT NOT NULL CHECK (length(btrim(name)) > 0),
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher'))
);
```

Neon stores login accounts. This table stores each user's name and role.

## Run and test

```bash
npm run dev       # open http://localhost:3000
npm test          # run automated tests
npm run build     # build the app
npm start         # run the built app
```

Open `/api/health` to check the database connection.
The tests run locally without Neon credentials; they do not test Google sign-in.

## Login and setup

- Logged out → `/account/login`.
- Logged in with an incomplete profile → `/user/setup` to enter a name and choose Student or Teacher.
- Setup complete → `/user/dashboard`.

Only Google sign-in works currently. Email/password login is not connected yet.
Open `/debug` directly to log out and test the flow again.

The server checks login details before reading or creating a profile. Users can
only access their own profile.

## Deployment

Set `DATABASE_URL` and `NUXT_PUBLIC_NEON_AUTH_URL` on your host. Use your Neon Auth
URL for the second value, and allow your website's address in Neon Auth.
Build with `npm run build`, then start with `node .output/server/index.mjs` from `src`.

## Folders

- `src/app/` — pages and interface code
- `src/server/` — APIs and database queries
- `src/shared/` — code shared by the app and server
- `src/tests/` — automated tests
- `docs/` — project documentation
