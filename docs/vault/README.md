# Vault documents

Owner: Vault & redemption chat · starter brief: `docs/briefs/14-vault-redemption.md`

This folder holds the custody and insurance plan, the quote requests, the risk limits and, later, the valuation sources. Intake and redemption procedures go to `docs/sops/`. The item record (contract C9) goes to `docs/contracts/redemption.md`, and the code to `packages/core/src/vault/` and `src/redemption/`.

| File | What it is | Task |
|---|---|---|
| `custody-comparison.md` | The custodians for each location, the insurance structure, the war exclusions, costs for the budget, and the recommendation | VLT-01 |
| `risk-limits.md` | The cap on user-owned value held in Taiwan, the transfer threshold and the evacuation plan | VLT-01 |
| `quote-requests/malca-amit.md` | Request to Malca-Amit: Singapore, plus Hong Kong as a price check and Taiwan transport | VLT-01 |
| `quote-requests/brinks.md` | Request to Brink's: Singapore, Taiwan, Hong Kong as a price check, and the US as the PSA Vault fallback | VLT-01 |
| `quote-requests/taiwan-hub.md` | Requests for the Taiwan intake hub: a free-trade-zone operator and a bonded warehouse, in zh-TW and English | VLT-01 |
| `quote-requests/psa-vault.md` | Questions to PSA Vault about a business account (Phase 2) | VLT-01 |
| `quote-requests/insurance-broker.md` | Request to a Lloyd's broker for specie and fine-art cover, including the war questions | VLT-01 |

**Nothing here has been sent.** Contacting a vendor, broker or insurer needs the owner's go-ahead, and the owner sends the requests.

## Placeholders

- `[owner: …]` and `［待業主填寫：…］` mark facts only the owner has, such as company details, volumes and dates.
- Rulings that Planning or the owner has to make first are listed in each request's "Before sending" checklist, and in the handoff note `docs/handoffs/VLT-01.md`.

## Source markers

- **[P]** The vendor's own page, or an official law or regulator page.
- **[S]** Secondary: a news report, trade article, forum or aggregator.
- **[G]** General knowledge, not checked in this session.
- **[E]** A planning estimate made in this session, with no source. A quote replaces it.

This session couldn't open web pages directly, because the environment's network policy blocked them (for example `www.malca-amit.com` and `sg.brinks.com`). Every [P] and [S] item was read through search-result summaries, so check each one against the live page before relying on it.
