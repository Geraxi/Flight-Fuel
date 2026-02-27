# FlightFuel

Full-stack TypeScript aviation nutrition app: React 19 frontend + Express backend + PostgreSQL 16.

## Cursor Cloud specific instructions

### Services overview

| Service | Required | Notes |
|---------|----------|-------|
| PostgreSQL 16 | Yes | Local instance on port 5432. DB: `flightfuel`, user: `flightfuel`, password: `flightfuel` |
| Express + Vite dev server | Yes | `npm run dev` on port 5000 (serves both API and frontend) |
| Clerk (external SaaS) | Yes | All API routes use `requireAuth()`. Needs `VITE_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` |
| Stripe (external SaaS) | No | Uses Replit Connectors (won't work locally). App starts gracefully without it |

### Starting the dev server

```bash
sudo pg_ctlcluster 16 main start  # ensure PostgreSQL is running
export DATABASE_URL="postgresql://flightfuel:flightfuel@localhost:5432/flightfuel"
export PORT=5000
npm run dev
```

Clerk env vars (`VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) must be set before starting, or the frontend will error and the API middleware will reject all requests.

### Key commands

- **Type check**: `npm run check` (runs `tsc`)
- **Schema push**: `DATABASE_URL=... npx drizzle-kit push` (uses `shared/schema.ts`)
- **Build**: `npm run build` (esbuild for server, Vite for client)

### Gotchas

- No ESLint or test framework is configured in this project.
- **CLERK_SECRET_KEY and Cursor "Redacted Secret" type**: Adding `CLERK_SECRET_KEY` as a "Redacted Secret" in Cursor injects Unicode bullet characters (U+2022) instead of the real value. Use the plain **"Secret"** type instead, or add the key to `/workspace/.env` (loaded by `dotenv/config` in `server/index.ts`). If using `.env`, unset the env var first (`unset CLERK_SECRET_KEY`) so dotenv's value takes precedence.
- Stripe initialization depends on Replit Connectors (`REPLIT_CONNECTORS_HOSTNAME`, `REPL_IDENTITY`). It fails gracefully in local/cloud environments—the rest of the app works without it.
- The Vite config conditionally loads Replit-specific plugins (`@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`) only when `REPL_ID` is defined; these are safely skipped outside Replit.
- The `stripe-replit-sync` package runs its own migrations on startup (`runMigrations`). This creates a `stripe` schema in PostgreSQL on first run—this is automatic and expected.
