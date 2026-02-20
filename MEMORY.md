# MEMORY.md (LifeLink)

LifeLink — Your links. Your story. Your self.

MVP goal: validate a minimal loop across Links/Story/Self before investing in design or infra.

Rules:
- Plan briefly before edits.
- Small diffs; run lint after changes.
- No dependency sprawl.
- NextAuth + Prisma are scaffold-only in MVP.

## Project state (2026-02-19)
- apps/web scaffolded: Next.js 14.2.5, TypeScript, ESLint (next/core-web-vitals)
- Root package.json uses npm workspaces: apps/*, packages/*
- Commands: `npm run dev -w apps/web` | `npm run lint -w apps/web`
- /self page implemented: 5 reflection prompts, localStorage (key: lifelink:self:answers), edit/delete
- /story page implemented: profile (lifelink:story:profile) + life events (lifelink:story:events), add/edit/delete, events sorted by year
- /links page implemented: connections list (lifelink:links:connections), relationship types [家族/親族/友人/同僚・知人/その他], filter by type, sorted by relationship then name
- NextAuth v4 scaffold: CredentialsProvider (test@lifelink.local / lifelink), JWT session, /login page, Nav shows login state
- Prisma: SQLite (packages/db/prisma/dev.db), client at root node_modules/@prisma/client
  - packages/db/.env: DATABASE_URL="file:./dev.db"
  - apps/web/.env.local: DATABASE_URL="file:../../packages/db/prisma/dev.db"
  - Tables created via db:push. Models: User, StoryProfile, LifeEvent, SelfAnswer, Connection
- All 3 pages (/self, /story, /links) now use fetch() → API routes → Prisma DB
- API routes: /api/self/answers, /api/story/profile, /api/story/events, /api/links/connections (CRUD)
- Auth guard in all API routes via getSessionUser(); pages show login prompt if unauthenticated
- Git initialized: master branch, 3 commits
- User registration: /register, POST /api/auth/register, bcrypt (cost 12), auto-login after register
- CredentialsProvider now looks up DB user (hardcoded test account removed)
- Vercel prep: vercel.json, .env.example, postinstall (auto prisma generate), docs/deploy.md
- Production schema: packages/db/prisma/schema.postgresql.prisma → copy to schema.prisma for Vercel deploy
- Lint: clean. Dev server: ✓ Ready in 15s
