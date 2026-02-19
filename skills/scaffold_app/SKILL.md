# SKILL: scaffold_app (LifeLink)

## Purpose
Generate an MVP web app skeleton consistent with `docs/` and ready for iterative Codex development.

## Output structure
- `apps/web` (Next.js App Router)
- `packages/db` (Prisma schema + migrations)
- `packages/ui` (shared UI components)
- `infra` (optional: docker compose for postgres, local S3)

## MVP implementation order
1. Create Next.js app (TypeScript) with Tailwind.
2. Add auth scaffolding (NextAuth or equivalent).
3. Add Prisma + Postgres (docker compose for local).
4. Implement Story MVP:
   - Profile/memorial pages
   - Media upload (stub first, then S3)
   - Permissions model
5. Implement Links MVP:
   - Family invites
   - Basic family tree visualization (simple)
6. Implement Self MVP:
   - Life log + reflection prompts
7. Add minimal admin + audit logs.

## Guardrails
- Keep dependencies minimal.
- Prefer server actions / route handlers over adding extra backend frameworks.
- Always update docs before large code changes.
