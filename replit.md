# Attendance Tracker Dashboard

A personalized academic attendance tracker — students sign in, track subject-wise attendance daily, see Safe/At Risk status, and get smart guidance on how many classes to attend or safely skip.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/attendance-tracker run dev` — run the frontend (port 22620)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + Clerk auth
- DB: PostgreSQL + Drizzle ORM (`lib/db/src/schema/subjects.ts`)
- Auth: Clerk (Google + email, managed by Replit)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite + Tailwind v4 + shadcn/ui

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/subjects.ts` — Database schema (subjects table)
- `artifacts/api-server/src/routes/subjects.ts` — Subject CRUD + present/absent endpoints
- `artifacts/api-server/src/routes/dashboard.ts` — Dashboard summary + delete
- `artifacts/api-server/src/middlewares/clerkProxyMiddleware.ts` — Clerk proxy
- `artifacts/attendance-tracker/src/` — React frontend

## Architecture decisions

- Each subject is scoped to a `userId` (Clerk user ID) — no shared data between users
- Attendance calculations done client-side from `presentCount`/`absentCount` stored on the server
- Guidance logic (classes to attend / can skip) is computed on the frontend from raw counts
- Clerk handles auth for both web (cookie-based) — no custom JWT tokens
- Dashboard delete removes all subjects for a user (cascade)

## Product

- Students sign up/in with Google or email
- Create subjects and mark Present/Absent daily with one tap
- Cards show attendance percentage with progress bars, Safe (green) or At Risk (red) status
- Overall dashboard summary at top
- Guidance report shows exactly how many classes to attend or skip per subject

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm run typecheck:libs` after any change to `lib/*` before checking artifact typechecks
- Clerk 504 errors in browser dev console are harmless — Clerk proxy is production-only
- Vite config has `tailwindcss({ optimize: false })` — required for Clerk themes in prod

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
