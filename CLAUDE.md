# CLAUDE.md — LifeLink project instructions (Claude Code)

## Project
**Name:** LifeLink  
**Tagline:** *Your links. Your story. Your self.*  
**One-liner (JP):** 人生のつながりを編み直し、物語として残し、自分を再発見できる場所。  
**MVP focus:** Validate the smallest loop across **Links / Story / Self**.

## Repository map (important)
- `apps/web/` — Next.js web app (App Router)
- `packages/ui/` — minimal shared UI (no build step; consumed via Next transpile)
- `packages/db/` — Prisma schema only (no generate/migrate in this phase)
- `infra/` — optional Postgres docker-compose
- `docs/` — concept, requirements, spec, roadmap
- `AGENTS.md` — project rules (also relevant to Claude; follow them)

## How to work (always do this)
1. **Read**: `AGENTS.md`, `docs/00_concept/lifelink_concept.md`, `docs/30_roadmap/roadmap.md`
2. **Plan first**: produce a short plan before editing files.
3. **Make small diffs**: prefer incremental changes.
4. **Run checks** after changes:
   - `npm run lint -w apps/web`
   - (optional) `npm run dev -w apps/web` and confirm pages load

## Constraints
- Keep dependencies minimal. Do **not** add new libraries unless explicitly requested.
- Do not run destructive commands (e.g., `npm audit fix --force`, mass upgrades) without explicit approval.
- MVP phase: **Prisma generate/migrate NOT executed**; schema only.
- NextAuth is scaffold-only (providers empty) and may require env vars; keep it non-blocking.
- Windows + Dropbox path can be sensitive; prefer simple commands and small changes.

## Current MVP pages
- `/` landing (MVP summary)
- `/links` placeholder
- `/story` placeholder
- `/self` placeholder

## Default next task
Implement the **Self** “reflection prompts” minimal loop:
- prompts (3–5), textarea answers, save to localStorage, list + edit/delete
- no DB required

## Commands (Windows)
From repo root:
- Install: `npm install`
- Dev: `npm run dev -w apps/web`
- Lint: `npm run lint -w apps/web`

## Style
- UI plain is fine; correctness and flow > aesthetics for now.
