# CLAUDE.md

Rules for every Claude session in this repo: a vault-and-redeem collectibles platform. Planning owns this file; propose changes in your handoff note.

## Start here

1. Read `docs/briefs/01-project-brief.md`: scope, owner decisions, architecture, launch matrix and templates. It wins over every other brief.
2. Read your chat's starter file in `docs/briefs/` (for example `10-backend-core.md`). If it isn't there, ask the owner to add it.
3. Read your task card, and the CLAUDE.md in every folder you touch. Each one names its owner chat.

## Who owns what

| Path | Owner chat |
|---|---|
| `apps/api`, `apps/media-worker` | Backend core |
| `packages/{db,ledger,events,api-contract,auth,search,flags,observability,config,testing}` | Backend core |
| `packages/core` | Shared: `framework/` Backend core, `auctions/` `sales/` `packs/` `draws/` Marketplace, `vault/` `redemption/` Vault & redemption |
| `apps/web`, `packages/{ui,i18n,media}` | Interface (tokens from Design) |
| `apps/admin`, `packages/catalog` | Admin & content |
| `apps/indexer`, `packages/{chain,contracts}` | Smart contracts |
| `packages/realtime` | Marketplace |
| `packages/payments` | Payments |
| `packages/compliance`, `docs/legal` | Compliance |
| `docs/sops` | Vault & redemption |
| `docs/briefs`, `docs/adr`, `docs/contracts` approvals, this file | Planning |
| CI, root tooling, `scripts/` | Backend core |

## Working rules

- **One task, one branch, one draft pull request** into `main`, titled `[T-ID] title`.
- **Stay in your folders.** Change only what your task card lists. Never change a contract in `docs/contracts/`, a shared type or another chat's folder: write a change request in your handoff note and keep building on the current version.
- **No guessing.** Missing a decision, an API, a key or a design? Say exactly what, and stop. Build against a mock only when your card says so.
- **Check your own work** before saying done:
  - `pnpm check` passes (what CI runs).
  - The Vercel preview works for anything users see.
  - A fresh-context review finds no gap against the card's "Done when".
  - The pull request shows the evidence.
- **Hand off.** Finish every task with `docs/handoffs/<T-ID>.md`, using the template in the brief.
- **Shared-type changes** land with all their call sites in one pull request, announced in the handoff.

## Ask the owner first

Production or mainnet deployments, Vercel environment or domain changes, spending money, contacting vendors or lawyers, and publishing legal text.

## Legal gates

- Packs, draws, the prediction contest and every chance feature stay **off** in `packages/compliance` until the launch matrix says Launch for that market.
- **Never build:** paid raffles, staked betting, bid fees, fractional or yield-bearing tokens, or balances that hold users' money.

## Conventions

- **Code:** TypeScript strict. No `any`; lint rejects floating promises.
- **Money:** integer minor units. The ledger unit is USD = USDC; TWD is shown as indicative only.
- **Time:** UTC timestamps. The database clock is authoritative, never the app server's.
- **Writes:** every write goes through a domain command with an actor and an idempotency key, in one database transaction, with the launch-policy check inside.
- **Users:** all user-facing text in zh-TW, en and ja. Keep the chain invisible to users.
- **Imports:** relative imports end in `.js` in Node code (`./index.js` for `index.ts`).

## Toolchain

- Node 24 (`.nvmrc`), pnpm 10 (`packageManager` in `package.json`), Turborepo 2.
- TypeScript 6.0. Not 7 yet: typescript-eslint supports only TypeScript below 6.1.
- ESLint 10 with type-aware typescript-eslint rules, Prettier for code formatting (not Markdown), Vitest for tests.
- Next.js 16 and React 19 for `web` and `admin`; Hono for `api`.

## Commands

```sh
pnpm install                     # once, from the repo root
pnpm check                       # everything CI runs: repo rules, format, lint, typecheck, test, build
pnpm --filter @fomo/web dev      # one app (web :3000, api :3001, admin :3002)
pnpm --filter @fomo/api test     # one package's tests
pnpm format                      # fix formatting
```

## Adding a package or app

1. Create the folder under `apps/` or `packages/` with a CLAUDE.md that starts `Owner: <chat> chat`. CI fails without it.
2. `package.json`: name `@fomo/<folder>`, `"private": true`, `"type": "module"`.
3. Extend `@fomo/config` for `tsconfig.json` and `eslint.config.js` (see `packages/config/CLAUDE.md`).
4. Scripts are optional: `lint`, `typecheck`, `test` and `build`. Add `build` only if the package emits files.
5. Dependencies:
   - Use `"workspace:*"` for internal packages.
   - Use `"catalog:"` for anything in the `catalog:` of `pnpm-workspace.yaml`; CI fails otherwise.
   - Add a new shared dependency to the catalog in the same pull request.

## Vercel

- Three projects build from this repo: `fomo-web` (`apps/web`), `fomo-admin` (`apps/admin`) and `fomo-api` (`apps/api`).
- Functions are pinned to `sin1`, beside the Neon Singapore database, in each app's `vercel.json`.
- Every pull request gets a preview deployment per app.
- Production deployments from `main` are off (`git.deploymentEnabled.main: false`) until the owner approves going live.
- Don't put a proxy in front of Vercel: it breaks the country headers.

## Security releases

Install Next.js and dependency security releases within 48–72 hours.
