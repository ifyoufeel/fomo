# Project brief: vault-and-redeem collectibles platform

Shared context for every chat. Attach it together with the chat's own starter file. Planning owns this file: if it conflicts with a starter file, this file wins, and you tell Planning.

Version 1 · 24 Oct 2026 · owner decisions D1–D12 recorded

## What we're building

A web app where people explore a gallery of collectibles, bid in timed auctions and buy at fixed prices. Each item they own is a token on Ethereum while the physical item sits in an insured vault. Owners keep it vaulted, resell it, or redeem it for delivery. The operator, a Taiwan company, uploads products and editorial content through an admin panel. Users are in Taiwan and worldwide, and many are new to crypto, so the chain stays in the background.

**Version 1 (Phases 1–2)**

- **Explore:** a gallery and search across every allow-listed category.
- **Bid:** timed auctions with a reserve, maximum (proxy) bids and a short soft close. The 20% buyer's premium and the total cost show before every bid.
- **Buy:** fixed-price sales of our own stock. The Taiwan company is merchant of record.
- **Own:** one ERC-721 token per item on Ethereum mainnet. Keep it vaulted, resell it, or redeem it.
- **Pay:** USDC from the user's own wallet; TWD through a Taiwan gateway (ECPay or NewebPay) with e-invoices; card checkout for buyers abroad (Crossmint or Transak).
- **Manage:** an admin panel for products, content, sale scheduling, fulfilment and compliance queues.

**Built but switched off**

- **Mystery packs:** sold for USDC only, with value-floor pools, published odds, verifiable randomness and no buyback in Taiwan. Each market turns on only after a written lawyer's opinion.
- **Free-entry draws and a free prediction contest** (no stake), behind the same gate.

**Never**

Paid raffles; staked betting, including on hammer prices; bid fees; fractional, yield-bearing or lendable tokens; user balances or spendable credit; packs with instant cash buyback in Taiwan. Paying in crypto doesn't change this. Taiwan's Criminal Code (Arts. 266, 268 and 269) covers online gambling and unlicensed lotteries however they're paid, and the operator is in Taiwan.

## Owner decisions

| # | Decision | Answer |
|---|---|---|
| D1 | Chance features | Crypto-only packs, built switched off and turned on per market after a written lawyer's opinion. Free draws and a free prediction contest sit behind the same gate. No paid raffles or staked betting anywhere |
| D2 | Merchant of record | The Taiwan company. A foreign affiliate only later, for card acquiring, after legal review |
| D3 | Holding users' funds | Never: users pay from their own wallets. Decide before Q1 2027 whether to register as a virtual-asset service provider, to keep that option open |
| D4 | Chain | Ethereum mainnet, using the design below |
| D5 | Markets | Core features worldwide. Sanctioned countries are blocked. Mainland China is deferred, because crypto transactions are banned there. Each feature follows the launch matrix |
| D6 | Categories | Every category, through the Compliance allow-list. Old masters in Phase 2; antiquities later, only with documented export papers; ivory, rhino horn and tortoiseshell blocked |
| D7 | Inventory | Our own stock. Consignment later, once seller payouts have a licensed route |
| D8 | Vaults | A Taiwan intake hub, a Singapore third-party vault and a PSA Vault satellite in the US |
| D9 | Fees | 20% buyer's premium; free storage; paid redemption; buyback at 85–90% for liquid graded cards only, from Phase 2 |
| D10 | Payments | USDC on Ethereum; ECPay or NewebPay for TWD with e-invoices; Crossmint or Transak card checkout for buyers abroad |
| D11 | Budget | Funded: two smart-contract audits and a bug bounty. Not funded yet: lawyers, vault insurance and fees, and KYC, price data and realtime services (see Budget status) |
| D12 | Claude setup | Pro plan. A Claude Project for document chats and Claude Code for code chats, with one code chat at a time |

## Key architecture

- **Chain: Ethereum mainnet.**
  - **Tokens:** one ERC-721 token per item, with ERC-2981 royalties, ERC-4906 metadata updates, ERC-7578 physical-asset properties and ERC-6982 lock events, built on OpenZeppelin Contracts 5.x. The token contract enforces locks for card-funded clearing and disputes.
  - **Redemption:** the token moves into a redemption escrow, is burned on delivery and is returned if the request is cancelled.
  - **Admin keys:** a 3-of-5 hardware-key Safe multisig behind a 24–72 hour timelock.
  - **Gas and randomness:** the platform pays gas. Randomness for packs, which are off, comes from Chainlink VRF v2.5.
  - **Indexing:** we index our own events into Postgres.
  - **Fees:** mainnet costs cents per action at 2026 gas levels but can spike, so mint in batches at quiet times.
- **Auctions: Postgres decides every bid.** Each bid runs in one transaction: lock the auction row, read the database clock, check increments and the proxy maximum, assign a sequence number, extend the end time in the anti-snipe window, move ledger holds and write an outbox event. Crypto bidders lock USDC in a per-lot escrow contract. Card and TWD bidders are backed by holds, deposits or limits tied to their KYC tier. The winner settles on-chain, and a pseudonymized bid log is published with its hash in the settlement transaction.
- **Wallets:** Privy embedded wallets with email, Google, Apple or LINE login, plus external wallets. Users can export keys, and we pay gas.
- **Money:** never held. We sell our own stock as merchant of record, and refunds and payouts go back on the rail they came in on. The ledger unit is USD = USDC, with TWD shown as indicative.
- **Custody:** a Taiwan intake hub, ideally in a free trade zone or bonded facility. A Singapore third-party vault (Malca-Amit or Brink's) holds high-value items and all watches, luxury goods and art. PSA Vault in the US holds graded cards. A custodian-signed proof of reserve is published monthly.
- **Web stack:**
  - **Frontend:** Next.js 16.4 (App Router, React 19.3, Cache Components), Tailwind 4.2 with shadcn/ui, and next-intl for zh-TW, en and ja.
  - **Admin:** Payload 3.x, self-hosted.
  - **Data and hosting:** Postgres 17 on Neon Singapore with Drizzle; Vercel functions pinned to `sin1`, with Vercel Workflows and Queues.
  - **Realtime, search and checks:** Ably for realtime and Typesense for search; Sumsub for KYC and TRM or Chainalysis for wallet screening.
  - **Ops:** Sentry and OpenTelemetry; a Turborepo + pnpm monorepo.
- **Compliance:** one policy (feature × country × KYC tier × age) checked inside every command. Every chance feature is off everywhere at launch.

## Phases

- **Phase 0, decide and contract.** Interface contracts v1, design system, ledger, launch policy and smart contracts on Sepolia; payment applications filed; vault and insurance quotes. Nothing live.
- **Phase 1, closed beta.** Gate: audits closed, gateway approved, vault insurance in place, and a Taiwan lawyer's view on the 7-day cancellation right. Adds the gallery, fixed price, auctions, vault tokens, redemption, USDC and TWD payments, KYC tiers, proof of reserve and escrow caps. Taiwan plus invited international users.
- **Phase 2, public core launch.** Gate: clean reconciliation, chargeback controls proven, card checkout live. Adds crypto peer-to-peer resale, offers on liquid graded cards, free draws and the prediction contest where cleared, curated old masters and the US PSA satellite.
- **Phase 3, chance features.** Gate: a written lawyer's opinion per market. Adds value-floor packs for USDC with published odds and verifiable randomness, with no buyback in Taiwan. One market at a time.
- **Phase 4, licensed expansions.** Gate: a registration or licensed partner. Adds fiat resale and consignment payouts, custodial features if registered, a card-acquiring affiliate and the antiquities allow-list.

## Budget status (D11)

Funded: two independent smart-contract audits and a bug bounty. Not funded yet, and what each one blocks:

- **Lawyers (Taiwan, US, Japan):** every chance feature stays off. Phase 1 needs at least a Taiwan lawyer's view on the 7-day cancellation right for vaulted goods and on export tax.
- **Vault insurance and third-party vault fees:** required before any user-owned item is stored, so this is a Phase 1 gate.
- **KYC, price data and realtime:**
  - KYC is pay-per-check (Sumsub, about US$1.35–1.85 each) and is needed for sanctions and AML checks from the first sale.
  - Ably can start on a standard plan; it needs Enterprise before the first big drop.
  - Licensed price data can wait for buyback in Phase 2.

## Markets and categories

- **Markets:** core features worldwide except sanctioned countries (blocked) and mainland China (deferred). The launch matrix decides each feature.
- **Categories, version 1:** graded cards and sealed trading-card products; watches and luxury bags; sneakers, toys and figures; modern art and prints. Other categories, such as coins, comics, memorabilia and jewellery, join after a Compliance check.
- **Later or never:** old masters in Phase 2, with the provenance process. Antiquities later, only with a documented lawful export trail. Ivory, rhino horn and tortoiseshell are blocked across borders.

## Launch matrix

**Launch** = in scope with standard controls (18+, KYC tiers, sanctions and wallet screening, disclosures). **Cond.** = once the conditions in the research report are met. **Counsel** = built, but off until a written local lawyer's opinion. **Defer** = needs a licence or a licensed partner. **Block** = geo-blocked. Sanctioned countries are blocked for everything. CN is mainland China. Other means any market not researched and not sanctioned.

| # | Feature | TW | US | JP | KR | HK | SG | EU | UK | CN | Other |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Gallery and fixed-price sales of our own stock | Launch | Launch | Launch | Launch | Launch | Launch | Launch | Launch | Defer | Launch |
| 2 | Timed auctions, soft close, no bid fees | Launch | Launch | Launch | Launch | Launch | Launch | Launch | Launch | Defer | Launch |
| 3 | One token per item and physical redemption | Launch | Launch | Cond. | Launch | Launch | Launch | Launch | Cond. | Defer | Launch |
| 4 | USDC paid from the user's own wallet | Launch | Launch | Cond. | Cond. | Cond. | Cond. | Launch | Launch | Defer | Launch |
| 5 | Card and e-wallet payment | Launch | Cond. | Cond. | Cond. | Cond. | Cond. | Cond. | Cond. | Defer | Cond. |
| 6 | Crypto peer-to-peer resale, settled atomically | Cond. | Cond. | Cond. | Cond. | Cond. | Cond. | Cond. | Cond. | Defer | Cond. |
| 7 | Fiat peer-to-peer resale or consignment payouts | Defer | Defer | Defer | Defer | Defer | Defer | Defer | Defer | Defer | Defer |
| 8 | Sell-to-platform offers (never on pack pulls) | Cond. | Cond. | Cond. | Cond. | Cond. | Cond. | Cond. | Cond. | Defer | Cond. |
| 9 | Holding users' stablecoins or payouts | Defer | Defer | Defer | Defer | Defer | Defer | Defer | Defer | Defer | Defer |
| 10 | Packs for USDC: odds, value floor, no instant buyback | Counsel | Counsel | Counsel | Counsel | Counsel | Counsel | Counsel | Counsel | Block | Block |
| 11 | Packs with instant buyback | Block | Counsel | Counsel | Block | Block | Block | Block | Block | Block | Block |
| 12 | Free-entry promotional draws | Cond. | Cond. | Cond. | Counsel | Counsel | Counsel | Counsel | Counsel | Block | Block |
| 13 | Paid raffles | Block | Block | Block | Block | Block | Block | Block | Block | Block | Block |
| 14 | Staked betting on outcomes | Block | Block | Block | Block | Block | Block | Block | Block | Block | Block |
| 15 | Free prediction contest, no stake | Cond. | Counsel | Cond. | Counsel | Counsel | Counsel | Counsel | Counsel | Block | Block |
| 16 | Old master paintings | Cond. | Cond. | Cond. | Cond. | Cond. | Cond. | Cond. | Cond. | Defer | Cond. |
| 17 | Archaeological antiquities, Chinese relics | Block | Block | Block | Block | Block | Block | Block | Block | Block | Block |
| 18 | Ivory, rhino horn or tortoiseshell, across borders | Block | Block | Block | Block | Block | Block | Block | Block | Block | Block |

## Contracts between chats

Contracts are the agreed interfaces chats build against. Each has one maintainer, and Planning approves every change. Each task card names the version it uses: v0 is a draft with mocks, v1 is frozen for the build.

| Contract | Defines | Lives in | Maintainer | Used by |
|---|---|---|---|---|
| C1 Data model | Tables, IDs, money units, time | `packages/db` | Backend core | Every code chat |
| C2 API | OpenAPI spec, server-action types, mock server | `packages/api-contract` | Backend core | Interface, Admin & content |
| C3 Events | Domain events, realtime channels, sequence numbers | `packages/events`, `packages/realtime` | Backend core; Marketplace adds auction channels | Interface, Admin & content, Smart contracts |
| C4 Chain | ChainAdapter (mint, lock, escrow, settle, purchase, redeem, burn), ABIs, addresses | `packages/chain`, `packages/contracts` | Smart contracts | Backend core, Marketplace, Payments, Vault & redemption |
| C5 Payments | Rails (hold, capture, void, refund), funding-source flag, ledger postings | `packages/payments` | Payments | Marketplace, Interface, Admin & content |
| C6 Launch policy | Rules by feature, country, KYC tier and age | `packages/compliance` | Compliance | Every command |
| C7 Design system | Tokens, components, states | Figma library or Design System artifact; `packages/ui` | Design | Interface, Admin & content |
| C8 Catalog | Attribute schema per category | `packages/catalog` | Admin & content | Interface, Backend core (search), Vault & redemption |
| C9 Vault item | Intake record, item states, redemption steps | `docs/contracts/redemption.md`, `packages/core` | Vault & redemption | Smart contracts, Payments, Admin & content, Interface |

## Repo layout

```text
collectibles/                one GitHub monorepo (Turborepo + pnpm)
├── CLAUDE.md                rules for every session, under 200 lines
├── apps/
│   ├── web/                 Interface: the Next.js app users see
│   ├── admin/               Admin & content: Payload CMS and operations views
│   ├── api/                 Backend core: Hono API and webhooks
│   ├── indexer/             Smart contracts: chain events into Postgres
│   └── media-worker/        Backend core: image tiling and video
├── packages/
│   ├── core/                domain commands: framework (Backend core),
│   │                        auctions, sales, packs, draws (Marketplace),
│   │                        vault and redemption (Vault & redemption)
│   ├── db/ ledger/ events/ api-contract/ auth/ search/
│   │   flags/ observability/ config/ testing/      Backend core
│   ├── realtime/            Marketplace
│   ├── chain/ contracts/    Smart contracts (Foundry)
│   ├── payments/            Payments
│   ├── catalog/             Admin & content
│   ├── compliance/          Compliance
│   └── ui/ i18n/ media/     Interface (tokens from Design)
└── docs/
    ├── briefs/              this starter kit
    ├── contracts/           C1–C9 specs; Planning approves changes
    ├── adr/                 decision records
    ├── handoffs/            one note per finished task
    ├── sops/                vault intake and redemption procedures
    └── legal/               Compliance drafts for lawyers
```

Each owner keeps a short CLAUDE.md in its own folders. Rules that must never break go into CI checks and hooks, because CLAUDE.md guides Claude but doesn't enforce anything.

## Working rules

- **One task, one branch, one draft pull request.** Small pull requests merge faster and break less.
- **Planning owns scope and contracts.** If you need a contract change, write a change request in your handoff and keep building on the current version.
- **No guessing.** Missing a decision, an API, a key or a design? Say exactly what, and stop. Build against a mock only when your card says so.
- **Check your own work.** Tests and type checks pass, the Vercel preview works for anything users see, and a fresh-context review finds no gap against "Done when". Show the evidence.
- **The owner's go-ahead first** for production or mainnet deployments, Vercel settings, spending money, contacting vendors or lawyers, and publishing legal text.
- **Legal gates hold.** Chance features stay off in `packages/compliance` until the launch matrix says Launch for that market.
- **Fresh starts.** Start a new chat per task, and restart one that has needed two failed corrections.
- **Conventions.**
  - Code: TypeScript strict.
  - Money: integer minor units; the ledger unit is USD = USDC, with TWD as indicative.
  - Time: UTC timestamps, with the database clock authoritative.
  - Writes: every one goes through a domain command with an actor and an idempotency key.
  - Users: all user-facing text in zh-TW, en and ja, and the chain stays invisible to users.

## Templates

```text
TASK CARD
T-ID · Title
Chat: … · Wave: … · Priority: P0 / P1 / P2
Goal: one sentence
Builds against: contract versions, e.g. C1 v1, C2 v0
Changes only: the folders this task may touch
Deliverables: …
Done when: … (ends with an end-to-end check)
Legal gates: launch-matrix rows that apply
Out of scope: …
```

```text
HANDOFF NOTE
Chat · T-ID · date
Status: done / partly done / blocked
What changed: pull request, files, artifact links
Checks run: tests, preview URL, review result
Change requests for Planning: what, which chats it affects, why
Decisions I made inside my area: …
Questions for the owner: …
Next task I'd take: …
```

## Open questions to keep in view

- **NFT exclusion:** the exact wording that keeps NFTs outside Taiwan's Virtual Asset Service Act. Only secondary sources have been checked.
- **Gambling law's reach:** whether Taiwan's gambling articles reach Taiwan staff who serve only foreign users.
- **Cancellation right:** when a vaulted item counts as "received" under Taiwan's 7-day cancellation right, and whether refundable bidder deposits count as stored value.
- **Export tax:** whether an item sold abroad but kept in the Taiwan vault is a zero-rated export.
- **US tariff:** sources disagree on the Section 301 rate for goods from Taiwan, 10% or 12.5%.
- **Card grading:** no PSA grading route for Taiwan residents was found, so buy cards already graded.
- **Demand:** pack demand is concentrated and falling. At Collector Crypt, the 3.7% of users who spent over $100,000 made 87% of spending. Don't build the business on packs.
