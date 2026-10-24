# Backend core: starter brief

**Attach:** this file and `01-project-brief.md` · **Where:** Claude Code (claude.ai/code or the desktop app's Code tab) on the GitHub monorepo, with the Vercel connector · **Wave:** 1, the first code chat

## Your role

You build the foundation every other code chat plugs into: the monorepo and CI, Vercel projects and previews, the database, the money ledger, the domain-command framework, the API contract, login and the compliance hook. Give other chats interfaces and mocks early, so they can build in parallel.

## Before you start

- **Needs:** the GitHub repo exists with the Claude GitHub App installed, and the owner's Vercel team is ready.
- **Runs in parallel with:** the document chats (Design, Compliance, Payments applications, Vault partners, Marketplace rules).
- **Unblocks:**
  - Smart contracts and Admin & content, through BE-02.
  - Interface and Admin & content, through the BE-04 mock.
  - Payments code and Marketplace code, through the BE-03 ledger.
- **Order:** BE-01 to BE-04 run one after another. BE-05 and BE-06 can follow while Wave 2 starts.

## You own

- **Packages:** `packages/core` (the framework), `db`, `ledger`, `events`, `api-contract`, `auth`, `search`, `flags`, `observability`, `config` and `testing`.
- **Apps and tooling:** `apps/api`, `apps/media-worker`, CI and root tooling.
- **Contracts you maintain:** C1 (data model), C2 (API) and C3 (events).

## Tasks

### BE-01 Scaffold the monorepo

- Turborepo + pnpm with catalogs. TypeScript strict, plus lint, format, type-check and test in CI on every pull request.
- The folder layout from the brief, with a short CLAUDE.md stub in each folder naming its owner chat. A root CLAUDE.md, under 200 lines, that points every session to `docs/briefs/01-project-brief.md`.
- Commit the whole starter kit to `docs/briefs/`. Create `docs/contracts/`, `docs/adr/` and `docs/handoffs/`.
- Vercel projects for `web`, `admin` and `api`, with functions pinned to `sin1` and a preview deployment per pull request.
- **Done when:** CI passes on an empty pull request, and previews build for all three apps.

### BE-02 Data model v0 (C1) and conventions

- Postgres 17 on Neon (Singapore), with Drizzle migrations.
- Write the conventions in `docs/contracts/data-model.md`:
  - ID format.
  - Money in integer minor units, with USD = USDC as the ledger unit and TWD as indicative.
  - UTC and the database clock.
  - Idempotency keys.
  - Audit columns.
- Core tables: users, roles and KYC tier; items, linked to C9; listings, auctions and bids; orders; ledger accounts and postings; outbox and inbox; audit log.
- **Done when:** migrations run on a fresh database and in CI, and the conventions doc is merged.

### BE-03 Ledger

- Append-only double-entry postings with pending holds (place, capture, void), idempotent by key. Outbox and inbox tables for reliable events.
- No user balances or spendable credit: holds back bids and purchases only.
- **Done when:** property tests prove every posting balances, and repeating a place, capture or void with the same key changes nothing.

### BE-04 API contract v0 (C2), event catalog v0 (C3) and mock server

- OpenAPI for the Hono API, plus typed Server Actions. Event names and payloads.
- A mock server with realistic fixtures: every v1 category, live and ended auctions, vaulted and redeemed items.
- **Done when:** Interface and Admin & content can run fully against the mock, and contract tests run in CI.

### BE-05 Login and gating

- Privy login (email, Google, Apple, LINE) with embedded Ethereum wallets and external wallets. Platform sessions and roles.
- Sumsub KYC tiers T0–T3, triggered on the first gated action, through signed webhooks. A wallet-screening hook (TRM or Chainalysis) on wallet link, deposit and redemption.
- The launch-policy check (C6, from Compliance) runs inside every command. Vercel's country header is only a pre-check.
- **Done when:** a gated command refuses a user below the needed KYC tier or in a blocked country, and logs the reason.

### BE-06 Platform services

- Typesense search sync, with tokenization for zh-TW, en and ja.
- Media pipeline: image masters, deep-zoom tiles, and video upload to Mux.
- Notifications (email first), feature flags, Sentry and OpenTelemetry, and an append-only audit log.
- **Done when:** a product saved in Admin is searchable and viewable with deep zoom on the preview.

## Rules

- Every write goes through a domain command with an actor and an idempotency key, in one database transaction.
- Keep functions pinned beside the database in Singapore. Don't put a proxy in front of Vercel: it breaks the country headers.
- Make a shared-type change and all its call sites in one session, and announce it in your handoff.
- Install Next.js and dependency security releases within 48–72 hours.

## First message

> Read both attached files. You are the Backend core chat. Start with BE-01. Work on a branch, open one draft pull request, and finish with a handoff note in docs/handoffs/BE-01.md.
