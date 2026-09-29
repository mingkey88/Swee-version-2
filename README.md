# Swee 2.0

**Beauty services without the sales pressure.**

Swee is a trust-first beauty and wellness booking platform for Singapore. It
connects customers with vetted businesses that publish clear, all-in prices,
and it gives customers a simple way to report hard selling after every visit.
Merchants get a booking and management back office.

This repository is a rebuild of the original Swee prototype on a current stack,
focused on a working core booking loop before anything else.

## Status

Milestone 1 (foundation) is done. Everything listed under "Built" works end to
end and is covered by tests.

**Built**

- Email and password accounts with three roles: customer, merchant, admin
- Business sign-up: a merchant account and its business are created together
- Merchant vetting: new businesses start **under review** and only appear
  publicly after an admin approves them
- Admin page to approve, suspend and reinstate businesses
- Landing page listing approved businesses
- Server-side role checks on every protected page and server action

**Next milestones**

1. Merchant setup: services with all-in prices, practitioners, opening hours
2. Discover and book: browse by category and neighbourhood, real time slots,
   no double bookings
3. Merchant calendar: appointments per practitioner; confirm, complete, cancel,
   no-show
4. Trust layer: post-visit review and hard-sell report, admin review queue,
   Swee Trust Score
5. Payments: receipts and transaction history; later escrow and per-session
   packages

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Server Actions) with React 19
  and TypeScript
- [Tailwind CSS 4](https://tailwindcss.com) and
  [shadcn/ui](https://ui.shadcn.com) (Base UI primitives)
- [PostgreSQL](https://www.postgresql.org) with [Prisma 7](https://www.prisma.io)
- [Better Auth](https://www.better-auth.com) for authentication
- [Vitest](https://vitest.dev) for unit tests and
  [Playwright](https://playwright.dev) for end-to-end tests

## Getting started

You need **Node.js 22** and a **PostgreSQL** database.

1. **Install dependencies**

   ```bash
   npm ci
   ```

2. **Start a database.** Pick one:
   - **Docker:** `docker compose up -d` starts PostgreSQL 16 on port 5432.
   - **Neon or Supabase (free tier, nothing to install):** create a project and
     copy its connection string.

3. **Configure the environment**

   ```bash
   cp .env.example .env
   ```

   If you use Neon or Supabase, paste your connection string into
   `DATABASE_URL`. Set `BETTER_AUTH_SECRET` to a long random string (for
   example the output of `openssl rand -base64 32`).

4. **Create the tables and demo data**

   ```bash
   npm run db:deploy
   npm run db:seed
   ```

5. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

The seed creates these accounts, all with the password `sweedemo123`. They are
for local development only.

| Role                                 | Email                |
| ------------------------------------ | -------------------- |
| Customer                             | `customer@swee.test` |
| Merchant (Rita's Home Facials, live) | `rita@swee.test`     |
| Merchant (Nail Nook, under review)   | `aisha@swee.test`    |
| Admin                                | `admin@swee.test`    |

Sign in as the admin to approve Nail Nook, then check that it appears on the
home page.

## Scripts

| Command              | What it does                                       |
| -------------------- | -------------------------------------------------- |
| `npm run dev`        | Start the development server                       |
| `npm run build`      | Production build                                   |
| `npm run lint`       | ESLint                                             |
| `npm run typecheck`  | Generate route types and run TypeScript            |
| `npm run format`     | Format with Prettier (`format:check` to verify)    |
| `npm test`           | Unit tests (Vitest)                                |
| `npm run test:e2e`   | End-to-end tests (Playwright), see below           |
| `npm run db:migrate` | Create and apply a migration after a schema change |
| `npm run db:deploy`  | Apply existing migrations                          |
| `npm run db:seed`    | Load the demo data (safe to run more than once)    |
| `npm run db:studio`  | Browse the database in Prisma Studio               |

## Testing

Unit tests sit next to the code they test (`src/**/*.test.ts`):

```bash
npm test
```

End-to-end tests (`e2e/`) build the app, start it on port 3100 and drive a real
browser against a **separate test database**. The test setup wipes that
database before each run and refuses to touch any database whose name doesn't
end in `_test`.

```bash
# once: download the browser
npx playwright install chromium

# create an empty database called swee_test (Docker example):
docker compose exec db createdb -U swee swee_test

npm run test:e2e
```

Set `TEST_DATABASE_URL` to use a different test database.

## Project structure

```
prisma/
  schema.prisma        Database models (auth tables + Swee domain)
  migrations/          SQL migrations, committed
  seed.ts              Demo data
src/
  app/                 Routes (App Router)
    (auth)/            Sign in, sign up, business sign-up, and their actions
    account/           Customer home
    business/          Merchant dashboard
    admin/             Business vetting
    api/auth/          Better Auth endpoint
  components/          Shared UI; components/ui holds shadcn components
  lib/
    auth.ts            Better Auth configuration
    dal.ts             Data access layer: session and role checks
    prisma.ts          Database client
    validation.ts      Form validation (Zod)
e2e/                   Playwright tests
```
