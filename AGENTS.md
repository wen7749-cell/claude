# AGENTS.md (LifeLink)

This repository is the **LifeLink** project.

**Brand**
- Name: **LifeLink**
- Tagline: **LifeLink — Your links. Your story. Your self.**
- One-liner (JP): 「つながりを通して人生を物語として残し、自分を再発見できる場所」

## Operating rules for Codex
1. **Always read these docs before acting**
   - `docs/00_concept/lifelink_concept.md`
   - `docs/10_requirements/requirements_core.md`
   - `docs/20_spec/lifelink_spec.md`
   - `docs/30_roadmap/roadmap.md`
2. **Use the core taxonomy everywhere**: organize features and architecture using **Links / Story / Self**.
3. **Planning first**
   - For any change that touches multiple files, start with a short plan (like `/plan`) and confirm scope.
4. **Minimal change principle**
   - Do not introduce new frameworks or dependencies unless the spec explicitly requires it.
   - Prefer small, reviewable commits/patches.
5. **Doc-driven development**
   - If requirements are unclear, update docs first (add assumptions + TODO), then implement.
6. **Safety**
   - Never exfiltrate secrets. Never write private keys to the repo.
7. **Naming**
   - Use `lifelink_*` prefix for key spec/architecture docs and internal modules.

## Default build target (MVP)
- Web app: Next.js (App Router), TypeScript, Tailwind
- Auth: NextAuth (or next-auth equivalent per spec)
- DB: Postgres + Prisma
- Storage: S3-compatible
(See `docs/20_spec/lifelink_spec.md` for details.)
