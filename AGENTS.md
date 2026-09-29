<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working on Swee

Swee is a trust-first beauty and wellness booking platform for Singapore. See
`README.md` for the product summary, setup and roadmap.

## Commands

- `npm run lint`, `npm run typecheck`, `npm test` must pass before every push.
- `npm run test:e2e` runs Playwright against the `swee_test` database; run it
  for any change to auth, routing, forms or data access.
- `npm run format` formats with Prettier (single quotes, semicolons).

## Conventions

- **Auth checks go through `src/lib/dal.ts`** (`requireSession`, `requireRole`).
  Call them in the page or server action that touches the data, not only in a
  layout. Server actions are public endpoints: every action that changes data
  must check the role itself.
- **Roles are set only on the server.** The Better Auth `role` field is
  `input: false`; never accept a role from a form.
- **Validate form input with Zod** schemas in `src/lib/validation.ts`, and return
  field errors to the form instead of throwing.
- **Database changes:** edit `prisma/schema.prisma`, run
  `npm run db:migrate -- --name <change>`, and commit the migration folder.
  The generated client in `src/generated/` is not committed.
- **Prisma is pinned to 7.x.** Its npm `latest` tag has pointed at a pre-release,
  so install with an explicit version.
- **Better Auth tables** were generated with `npx auth@<version> generate`;
  regenerate that way after upgrading Better Auth or adding plugins.
- **Styling:** Tailwind with the Swee tokens in `src/app/globals.css`
  (`coral`, `rose`, `blush`). Text and background pairs must keep WCAG AA
  contrast; use `primary` (deep coral), not `coral`, for text and buttons.
- **Forms** use native `<select>` and checkbox elements so they work without
  JavaScript.

## Honesty in docs and UI

Only describe features that exist. Label unbuilt features "coming soon", and
never invent metrics, testimonials or user numbers.
