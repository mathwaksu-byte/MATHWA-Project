# Cloudflare Deployment Tasks

- Admin: Cloudflare Pages static deploy readiness
- Client: Cloudflare Pages SSR wiring and build verification
- Server: Cloudflare Worker API proxy and migration plan
- Global: Environment variables mapping for Pages/Workers

## Tasks

- [x] Verify admin builds for Cloudflare Pages
- [x] Wire client for Cloudflare Pages SSR
- [x] Verify client builds and note Cloudflare SSR steps
- [x] Write Cloudflare env variable mapping
- [x] Create Cloudflare Worker proxy for server
- [ ] Plan Worker proxy for server and phased migration

## Migration Plan (Server → Cloudflare Workers)

- Phase 0: Proxy
  - Deploy `server/cloudflare-worker` with `UPSTREAM_URL` pointing to current Express (`server/src/index.js`).
  - Flip `client` `PUBLIC_SERVER_BASE_URL` and `admin` `VITE_SERVER_BASE_URL` to the Worker URL.

- Phase 1: Files & Storage
  - Replace `multer` with `request.formData()` in Worker handlers.
  - Store hero videos/posters and gallery assets in R2; bind `R2_BUCKET`.
  - Replace `fs` reads/writes with KV/D1 for `site-settings.json` and `leads.json`.

- Phase 2: Auth & Middleware
  - Replace `jsonwebtoken` with `jose` for JWT in Workers.
  - Implement CORS using native headers; mirror current allowlist in `server/src/index.js:23`.
  - Use Cloudflare Rate Limiting (dashboard) initially; optional KV/Durable Objects later.

- Phase 3: Database
  - Option A: `@prisma/client/edge` + Data Proxy; keep existing Prisma models.
  - Option B: Migrate to D1 + Drizzle; re-implement queries used in `server/src/index.js`.
  - Supabase calls remain supported in Workers (HTTP fetch), keep existing integration.

- Phase 4: Endpoint Migration (by slice)
  - Public universities: `GET /api/universities`, `GET /api/universities/:slug`.
  - Admin CRUD for universities and fees: `POST/PUT/DELETE /api/universities*`, `POST/DELETE /api/universities/:slug/fees`.
  - Site settings: `GET/POST /api/site-settings`, `POST /api/admin/site-settings` (file uploads → R2).
  - Leads: `POST /api/apply`, `GET /api/admin/leads*`, `PATCH /api/admin/leads/:id`.
  - Checkout: `POST /api/checkout/create-order` (Razorpay SDK → REST calls via fetch).

- Phase 5: Cutover
  - Remove proxying for migrated routes; serve directly from Worker.
  - Keep fallback to upstream for any remaining endpoints until all are migrated.
  - Point `client` and `admin` envs to Worker URL; verify CRUD, fees, leads, settings.
  - Deploy Worker and update DNS subdomain `api.yourdomain.com` to Worker route.

## Cloudflare Bindings

- R2: `R2_BUCKET` for file storage
- KV: `KV_APP` for site settings and small docs
- D1 (optional): `DB` for relational data when moving off Prisma

## Env Vars

- Admin (Pages): `VITE_SERVER_BASE_URL=https://<worker-url>`
- Client (Pages SSR): `PUBLIC_SERVER_BASE_URL=https://<worker-url>`, `PUBLIC_APP_BASE_URL=https://<pages-url>`
- Worker: `UPSTREAM_URL`, `CORS_ORIGIN`, `ADMIN_JWT_SECRET`, `RAZORPAY_*`, `SUPABASE_*`, `PRISMA_DATABASE_URL` (if using Data Proxy)

## Notes

- Admin uses `VITE_SERVER_BASE_URL` to reach API.
- Client uses `PUBLIC_SERVER_BASE_URL` and `PUBLIC_APP_BASE_URL`.
- Server currently Express/Prisma/FS; needs Worker rewrite or proxy.

## Env Variables

- Admin (Pages): `VITE_SERVER_BASE_URL=https://api.yourdomain.com`
- Client (Pages SSR): `PUBLIC_SERVER_BASE_URL=https://api.yourdomain.com`, `PUBLIC_APP_BASE_URL=https://app.yourdomain.com`
- Server (Workers): `CORS_ORIGIN`, `PUBLIC_SERVER_BASE_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `ADMIN_JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_KEY`, `PRISMA_DATABASE_URL` (or Cloudflare D1 bindings if migrating)
