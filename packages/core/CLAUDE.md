# packages/core

Owner: shared by three chats, one subfolder each. Change only your own.

| Subfolder (planned) | Owner chat | Starter brief |
|---|---|---|
| `src/framework/` — the domain-command framework | Backend core | `docs/briefs/10-backend-core.md` |
| `src/auctions/`, `src/sales/`, `src/packs/`, `src/draws/` | Marketplace | `docs/briefs/15-marketplace.md` |
| `src/vault/`, `src/redemption/` | Vault & redemption | `docs/briefs/14-vault-redemption.md` |

- **Contract:** C9 vault item lives here (spec: `docs/contracts/redemption.md`).
- **Status:** empty. The framework comes first; every write goes through a domain command with an actor and an idempotency key, in one database transaction, with the launch-policy check (C6) inside.

Anything outside your subfolder needs a change request in your handoff note.
