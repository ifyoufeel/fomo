# fomo

Vault-and-redeem collectibles platform: a gallery, timed auctions and fixed-price sales, with each item a token while the physical piece sits in an insured vault.

- **Scope and decisions:** [`docs/briefs/01-project-brief.md`](docs/briefs/01-project-brief.md)
- **Rules for contributors and Claude sessions:** [`CLAUDE.md`](CLAUDE.md)
- **Contracts between chats:** [`docs/contracts/`](docs/contracts/README.md)

## Develop

Needs Node 24 and pnpm 10 (`corepack enable` picks the pinned version).

```sh
pnpm install
pnpm check                    # what CI runs
pnpm --filter @fomo/web dev   # http://localhost:3000
```
