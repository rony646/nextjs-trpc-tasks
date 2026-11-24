# AGENTS.md

Rules for any coding agent working in this repository. Follow them on every change.

## Project

A simple task manager built for a technical case. Less is more: simple and working beats complete and complex.

- Next.js 15 (App Router) + TypeScript
- tRPC v11 with TanStack Query, superjson transformer
- Zod for validation, react-hook-form for the task form
- Radix UI + Tailwind CSS
- In-memory storage only: no database, no SQL

## Structure

- `src/app`: the task list page and the tRPC route handler
- Create and edit happen in a modal on the list page, using one `TaskForm` component. No separate pages.
- `src/server`: tRPC setup, routers and the task repository
- `src/server/tasks/task.schema.ts`: the single source of truth for task validation, used by backend and form
- `src/trpc`: tRPC client, provider and server helpers
- `src/components`: UI components

## Code style

- Keep it simple. Do not add abstractions, layers, options or dependencies without a current need.
- Code must be clean and self-explanatory. Prefer clear names and small functions.
- Comments only for key decisions, and keep them short. Never comment what the code already says.
- No magic numbers or strings: use named constants.
- Use TypeScript strict mode. Do not use `any`.
- Task fields keep the names from the case: `id`, `titulo`, `descricao`, `dataCriacao`. Everything else is in English.

## Rules

- Reuse before creating: search for an existing component, schema or helper first.
- Routers only call the task repository. Never access the in-memory store directly from a router.
- Validate every input with the Zod schema. Throw `TRPCError` with a clear message: `NOT_FOUND` for a missing task, `BAD_REQUEST` for invalid input.
- Every mutation shows loading, success and error states to the user.
- The task list page is server-rendered on every request. Do not let it become static.

## Data fetching

Keep TanStack Query usage minimal and easy to read:

- All task queries and mutations live in one file, `src/trpc/tasks.ts`, one small hook per operation.
- Use the tRPC hooks and their generated query keys. Never write query keys by hand.
- After a mutation, refresh data only with `invalidate` on the task list.
- No optimistic updates, no manual cache edits, no custom query client options beyond the defaults.
- All data is fictional. Never commit personal data, secrets, tokens or `.env` files.

## Lint, format and tests

- ESLint and Prettier are the source of truth. Never disable a rule to make code pass.
- Run `lint` and `build` before every commit.
- Unit tests with Vitest only for the repository and the router. No e2e tests.

## Commits

- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`.
- Never add an agent or AI tool as commit co-author.
