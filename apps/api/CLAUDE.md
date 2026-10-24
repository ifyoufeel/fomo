# apps/api

Owner: Backend core chat · starter brief: `docs/briefs/10-backend-core.md`

- **Holds:** the Hono API and webhooks.
- **Contract:** C2 API (spec in `packages/api-contract` from BE-04).
- **Status:** `GET /health` only (BE-01).

## Notes

- Vercel deploys the default export of `src/index.ts` as one function in `sin1` (`vercel.json`).
- `pnpm --filter @fomo/api dev` serves it on http://localhost:3001 through `src/dev.ts`.
- Relative imports use the `.js` extension, so the code also runs as plain Node ESM.
- Don't put a proxy in front of Vercel: it breaks the country headers.

Only the owner chat changes this folder. Any other chat puts a change request in its handoff note instead.
