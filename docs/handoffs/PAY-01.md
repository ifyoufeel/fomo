# Handoff: PAY-01 Provider applications

Payments · PAY-01 · 24 Oct 2026

## Status

**Done.** The comparison and every application draft are ready, with the open questions listed. Nothing has been sent: the owner submits each application, after the rulings and facts below.

## What changed

- **Branch:** `claude/trusting-feynman-wl76s7`, from `main`. It touches only `docs/payments/` and `docs/handoffs/`, so it won't conflict with BE-01, DES-01 or CMP-01.
- **Pull request:** https://github.com/ifyoufeel/fomo/pull/4 (draft).
- **`docs/payments/README.md`:** the folder index, placeholders and source markers.
- **`docs/payments/provider-comparison.md`:**
  - the recommendation;
  - three findings that need a ruling;
  - the rules that shape every application;
  - comparison tables for the Taiwan gateways and for card checkout;
  - where card checkout meets our rules, the risks, the open questions and the sources.
- **`docs/payments/product-description.md`:** what we sell, in English and zh-TW, with matching sections. It covers auctions, fixed-price sales, the ownership token, storage and delivery, and packs (later, USDC only).
- **`docs/payments/applications/`:**
  - `ecpay.md`, `newebpay.md`, `crossmint.md` and `transak.md`. Each has a pre-send checklist, what we apply for, documents, text ready to paste, a message to sales, questions for the provider, and what not to say.
  - `tappay.md`: backup notes.

## Recommendation in short

- **Taiwan gateway:** apply to ECPay and NewebPay in parallel, with ECPay first, because it documents holds, takes overseas cards and has its own e-invoice API. TapPay is the backup.
- **Card checkout abroad:** apply to Crossmint and Transak in parallel, with Crossmint first, because it runs no second KYC and carries chargebacks. Transak takes over if Crossmint can't raise its US$1,500 default card limit far enough.
- **Choosing one:** decide once both have answered on limits, refunds after delivery, chargeback scope and fees.
- **PAY-02 doesn't need the final choice.** The rail adapter and its mocks are the same whichever provider wins.

## Checks run

- **Product coverage.** Every product the card names (auctions, fixed price, the vault token, redemption, packs for USDC only) appears in both language versions of the product description, checked by script. Every application reuses that description.
- **Language parity.** The English and zh-TW versions have the same 10 sections, checked by script, and I compared them by hand.
- **Rules.** Each rule in the starter brief's "Rules" section is reflected in the comparison's section 3.3 or in the drafts, checked by hand.
- **Sources.** Each fact carries [P], [S] or [G]; the comparison lists the sources. This session's network policy blocked direct page fetches (for example `udn.com` and `docs.crossmint.com`), so every source was read through search-result summaries. **Re-check every [P] and [S] fact on the live page before it goes into an application.**
- **Not run:**
  - `pnpm check`, CI and Vercel previews: not applicable. These are Markdown files only, and `main` has no tooling until BE-01 merges.
  - A separate fresh-context review against "Done when": not run. I checked against "Done when" in this session.

## Change requests for Planning

1. **Merchant of record (D2), which affects Compliance and Payments.**
   - Crossmint's documentation says Crossmint stays merchant of record for every transaction. Transak charges the card itself, so it is very likely merchant of record for the card payment too.
   - Compliance's condition `card-provider-live` requires the Taiwan company to be merchant of record, which neither provider meets as written.
   - **Recommended:** restate D2 as "the Taiwan company is the seller of the item; for card checkout abroad, the provider may be merchant of record for the payment". Compliance updates the condition, and counsel checks receipts and cancellations.
   - The alternatives are in `provider-comparison.md`, section 6.1.
2. **D3 input, which affects the owner and Compliance (CMP-02).**
   - The FSC's July 2022 letter bars acquirers from signing virtual-asset service providers as merchants, and October 2026 news says the policy is unchanged.
   - Registering as a virtual-asset service provider could therefore end the Taiwan company's card acceptance in Taiwan. Please add this to the D3 decision.
3. **The brief's open question "NFT exclusion", which affects Compliance (CMP-02).**
   - The Virtual Asset Service Act passed on 30 June 2026 and was promulgated on 22 July 2026. It isn't in force yet; the FSC aims for Q1 2027.
   - Art. 3(1) excludes non-fungible tokens whose value is non-fungible (表彰之價值具不可代替性之非同質化代幣).
   - The AML rules in force today don't carry that wording.
   - Please update the brief, and give counsel this text.
4. **A site gateway reviewers can open, which affects the owner, Backend core, Interface and Compliance.**
   - Taiwan gateways review the merchant's website before approval.
   - Today every Vercel deployment needs a Vercel login, and the account is on Hobby.
   - The owner decides on a reviewable site, since Vercel settings and published legal text need their go-ahead. Compliance drafts the terms, returns and privacy pages.
   - Gateway approval, and so the Phase 1 gate, waits on this.
5. **Smart contracts (SC-01, C4).** The sales contract's purchase function should:
   - take the item ID and a `recipient` that isn't the caller;
   - be callable any number of times by allow-listed card-provider addresses (Crossmint's treasury, Transak's executor);
   - accept USDC;
   - record card-funded purchases and start the clearing lock (ERC-6982) on its own.

   Card providers review the final mainnet address, which exists only after the audits. So PAY-05 production depends on the audits.
6. **A folder for Payments documents.** Please add `docs/payments/` (owner: Payments) to the brief's repo layout and the root CLAUDE.md ownership table.
7. **Compliance (C6) and Payments (C5): the funding source.** The launch policy has three rails. PAY-02 will add a funding method under `twd_gateway`: card, wallet, ATM or convenience store. That lets C5 enforce "ATM and convenience-store payments never fund a transferable token" and lets PAY-07 set clearing tiers. No change to C6's rail IDs; the policy can ignore the method.

## Decisions I made inside my area

- **Parallel applications** for both pairs. Each second application is a hedge, because approval for a product with a token isn't certain.
- **ATM and convenience-store payments are requested for fees only**, such as the delivery fee, never for items.
- **Not requested at launch:** card instalments, cardless instalments, reward points and subscriptions. Instalment refunds are full-only at ECPay, and buy-now-pay-later raises credit questions. PAY-04 can revisit.
- **Wallets are treated like cards until PAY-07.** LINE Pay and Taiwan Pay purchases get the clearing lock until PAY-07 sets their tiers.
- **Deposits are left out of the drafts.** "Refundable bidder deposits may be stored value" is open with counsel, so the drafts mention only pre-registration for high-value lots and card holds for leaders in the final 7 days.
- **Wording.** The drafts make no legal claim about our virtual-asset status and use no investment language.

## Questions for the owner

1. **Facts for the drafts:**
   - the company's legal name, tax ID, responsible person and registered business items;
   - the settlement bank account;
   - the domain and customer-service contact;
   - monthly sales, average and largest order, and the share of buyers abroad;
   - the Phase 1 target date.
2. **Approve the plan:** ECPay and NewebPay in parallel, Crossmint and Transak in parallel. Recommended: yes.
3. **ECPay overseas cards.** Ask ECPay about overseas cards as a possible route for buyers abroad, with the Taiwan company as merchant of record? Recommended: yes. It costs nothing and gives a fallback if the merchant-of-record ruling goes the other way.
4. **Card limits to ask for:** Crossmint and Transak need a per-transaction figure. Recommended: your largest planned lot price, or US$25,000 to start.
5. **The brand on the applications:** lastfomo, as picked in DES-01? It isn't in the brief yet.

## Next task I'd take

1. **PAY-02 Payment interface v0 (C5)**, as soon as BE-03 (ledger with holds) merges. The provider choice isn't needed for it.
2. **Meanwhile, a C5 v0 design note** in `docs/payments/`. It would cover the rail adapter (hold, capture, void, refund, payout), funding sources, webhooks into ledger postings, and the mock rails. Marketplace and Interface can then review it before code.
3. **Then PAY-04 and PAY-05**, once the gateways and card providers answer.
