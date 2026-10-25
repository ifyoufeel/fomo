# Marketplace documents

Owner: Marketplace chat · starter brief: `docs/briefs/15-marketplace.md`

The sale rules, and the specs other chats build the selling engine from. The code lives in `packages/core/src/{auctions,sales,packs,draws}/` and `packages/realtime`.

| File | What it is | Task |
|---|---|---|
| `sale-rules.md` | The numbers to approve, timed auctions, the premium and all-in price, backing a bid, non-payment, no seller bids, fixed-price sales, commands, refusal codes and bid-panel copy | MKT-01 |
| `settlement.md` | The close and settlement steps, the bid log and its hash, and what contracts C4 and C5 need | MKT-01 |
| `events-and-channels.md` | Auction and sale events, sequence numbers, Ably channels, the watcher snapshot and rate limits: the C3 additions | MKT-01 |
| `chance-features.md` | Packs, free draws and the free prediction contest, all switched off: the design outline for counsel | MKT-01 |

**Status:** drafts. The owner approves the numbers in `sale-rules.md`, section 2. Planning approves the C3 additions as part of contract C3.

## Source markers

- **[P]** A primary source checked in this session: the platform's own documentation, or an official law or regulator page.
- **[S]** A secondary source: a help-page mirror, an article, a law summary.
- **[G]** General knowledge, not checked in this session.

This session read sources through search-result summaries only. Check each [P] and [S] item against the live page before it goes into terms users see.
