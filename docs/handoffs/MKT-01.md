# Handoff: MKT-01 Sale rules

Marketplace · MKT-01 · 25 Oct 2026

## Status

**Done, pending the owner's approval of the numbers.** The card's "Done when" has two parts:

- **The owner approves the numbers.** They are in `docs/marketplace/sale-rules.md`, section 2, and in question 1 below.
- **Design, Smart contracts and Backend core can build from the spec.**
  - Design: section 13 of the sale rules.
  - Smart contracts: `settlement.md`, sections 1–4.
  - Backend core: `events-and-channels.md`, and the commands in section 11 of the sale rules.

## What changed

- **Branch:** `claude/gifted-babbage-5uf5qs`, from `main`. It touches only `docs/marketplace/` and `docs/handoffs/`, so it won't conflict with BE-01, DES-01, CMP-01, PAY-01 or VLT-01.
- **`docs/marketplace/sale-rules.md`:**
  - the 16 numbers to approve;
  - principles;
  - timed auctions: lot states, scheduling, the increment ladder, maximum bids, the reserve, the soft close, 11 worked examples, corrections and outages, who may bid;
  - the premium and all-in price; backing a bid;
  - after the hammer: payment, non-payment, second-chance offers, the 7-day cancellation right;
  - no seller bids; fixed-price sales; operator controls and the Taiwan exposure guard;
  - commands, refusal codes, and bid-panel copy in en, zh-TW and ja.
- **`docs/marketplace/settlement.md`:**
  - the six close-and-settlement steps and the three on-chain paths;
  - the bid log: contents, a worked example, the hash, publication, the reserve commitment and a daily anchor;
  - requirements R1–R12 for the lot escrow and sales contracts;
  - what Payments needs.
- **`docs/marketplace/events-and-channels.md`:** the C3 proposal:
  - per-lot sequence numbers and deterministic message IDs;
  - 30 events, with visibility and payloads;
  - the Ably channels and token capabilities;
  - the 1-second-cached watcher snapshot and resync;
  - starting rate limits and the MKT-05 load-test scenario.
- **`docs/marketplace/chance-features.md`:** packs, free draws and the prediction contest, built switched off, with the mechanics counsel needs and the parameters to set with counsel.
- **`docs/marketplace/README.md`:** the folder index and source markers.

## The numbers in short

| # | Number | Proposed |
|---|---|---|
| N1 | Increments | A ladder from US$2 (under US$50) to US$100,000 (US$1M and up): 5–12.5% of the bid from US$100 up. Every bid is on the ladder |
| N2 | Lowest opening bid | US$10 |
| N3–N5 | Soft close | A bid in the last 2 minutes resets the clock to 2 minutes. Latest close 60 minutes after the scheduled end |
| N6 | Length | 3–14 days, 7 by default |
| N7 | Closing order | One lot a minute (up to 10 a minute for large sales) |
| N8 | Premium | 20% of the winning bid, auctions only |
| N9 | Payment window | 48 hours, for winners whose bid wasn't already paid for |
| N10 | Second chance | Up to 3 underbidders, 24 hours each, at their own maximum |
| N11 | Non-payment | 1st default: secured bidding only for 12 months. 2nd within 12 months: barred. No fees |
| N12 | High-value lot | US$10,000 opening bid or low estimate: pre-registration |
| N13 | Bidding limits without anything set aside (all-in) | T1 US$2,500 · T2 US$10,000 · T3 US$25,000 |
| N14 | Fixed-price hold | 10 minutes; 30 minutes once payment is submitted |
| N15 | Bid corrections | Until 1 hour before the scheduled end, once per bidder per lot |
| N16 | Outage pause | Remaining time plus 10 minutes on resume |

## Checks run

- **Reference model.** A Python model of the ladder and the bidding rules ran in this session's scratchpad; it isn't committed. It checked:
  - every band starts on a multiple of its increment;
  - every band top is reachable;
  - the next rung is always the amount plus its increment;
  - from US$100 up, steps are 5.3–12.5% of the bid;
  - there are 159 rungs from US$10 to US$1M.
- **Worked examples.** The model produced every result in examples E1–E9 and E7 (the cap), and the bid log example in `settlement.md`. Writing them caught two errors in my first drafts, both fixed before commit:
  - a US$525 bid that isn't on the ladder;
  - a bid log line that missed the reserve rule.
- **Scripts,** rerun after the review fixes:
  - the ladder table in the document matches the model, row for row;
  - all 37 copy keys have en, zh-TW and ja text with the same placeholders, and none is duplicated;
  - every message key in the refusal table and every viewer state in section 13 has a draft;
  - every section reference across the four files resolves;
  - the two references into other chats' folders exist on their branches.
- **Card coverage,** checked by hand:

| The card asks for | Where |
|---|---|
| Reserve | Sale rules 4.5 |
| Increment table | 4.3, N1 |
| Maximum (proxy) bids | 4.4 |
| Short soft close with a cap | 4.6, N3–N5 |
| The 20% premium | Section 5, N8 |
| Non-payment with second-chance offers | 7.3, 7.4, N9–N11 |
| No seller bids, ever | Section 8 |
| Fixed-price rules | Section 9 |
| Close and settlement steps | `settlement.md` |
| Events and channels | `events-and-channels.md` |
| Rule: never bid fees, paid raffles or staked betting | Principle 3; `chance-features.md` section 1 |
| Rule: all-in cost beside the bid button | Section 5, section 13 |
| Rule: high-value lots need pre-registration | 6.4 |
| Rule: watchers get the cached snapshot | `events-and-channels.md` sections 4–5 |

- **Fresh-context review.** A separate review with no context from this session read all six files and checked every worked example by hand. The examples and the bid log example held up. It found gaps, all fixed in this pull request:
  - **The bid log** was "never changed" yet recorded second-chance sales. Offers now get their own offer record (`settlement.md` 3.4).
  - **Return path.** A token couldn't come back to inventory after a 7-day cancellation. R8 now has a return path, and there is a `returned` state.
  - **Sequence numbers.** `seq` had three meanings. Bid numbers now order bids, and `seq` counts public lot events only.
  - **Lot states.** The state table was missing transitions.
  - **Backing.** "Every live bid is backed" contradicted the release of backing when outbid.
  - **The ladder.** An all-in example used US$12,500, which isn't on the ladder.
  - **Chain detail in public.** The public `auction.settled` event carried a transaction reference, and the reserve commitment sat on the lot page.
  - **Missing pieces:** commands, events, refusal codes, a section on ledger holds (6.5), bid-panel state copy and flows.
  - **Translations.** The ja and zh-TW drafts used one word for both "maximum bid" and "bidding limit".
  - **Edge cases:** extensions on a lowered reserve or a removal, lots ending in an outage's first minute, the reserve's lower bound, and capture failures.
- **Not run:**
  - `pnpm check`, CI and Vercel previews: not applicable. These are Markdown files only, and `main` has no tooling until BE-01 merges.
  - Native-speaker review of the zh-TW and ja drafts.
- **Sources** were read through search-result summaries; re-check each [P] and [S] item before it goes into terms users see.

## Change requests for Planning

1. **A folder for Marketplace documents.**
   - Add `docs/marketplace/` (owner: Marketplace) to the brief's repo layout and the root CLAUDE.md ownership table.
   - This is the same request as PAY-01's `docs/payments/` and VLT-01's `docs/vault/`.
   - Also add `15-marketplace.md` to `docs/briefs/` (joins BE-01's change request 1).
2. **C3, which affects Backend core (BE-04), Interface and Admin & content.** Include in C3 v0:
   - the auction and sale events;
   - per-lot `seq`, and message IDs `{lotId}:{seq}`;
   - the channels `auction:{lotId}`, `user:{userId}` and `ops:auctions`;
   - the watcher snapshot and `/me` endpoints.

   All of it is in `events-and-channels.md`.
3. **C1, which affects Backend core (BE-02).**
   - **Lots:** opening bid, reserve, reserve commitment and salt, estimate, start, scheduled end, end, latest close, state, `seq`, and the time left while paused.
   - **Maximums:** bidder, amount, bid number, database time, payment method, and status (live, outbid, voided or removed).
   - **Per lot and per bidder:** the bidder code, registrations and payment deadlines.
   - **Elsewhere:** strikes, offers, reservations, and the bid log hash and URL.
   - **A unique constraint:** one completed sale per item.
4. **C6, which affects Compliance.**
   - A `system` actor kind for the close, deadline and settlement jobs.
   - Operator actions for scheduling a lot and listing an item, or confirmation that `catalog.publish_item` covers both.
   - Confirmation that the winner's re-check at the close uses `auction.bid`.
   - Confirmation that accepting a second-chance or post-auction offer uses `sale.buy`.
   - The staff, supplier and barred-bidder rules stay Marketplace rules, outside the policy.
5. **C5 and the starter brief, which affects Payments and Compliance: a bank wire.**
   - The Marketplace starter brief says high-value lots need "a deposit, USDC escrow or a bank wire".
   - C5 and C6 have no bank-wire rail.
   - Deposits wait on counsel's stored-value answer.
   - **So at Phase 1, high-value lots can be bid on only with USDC set aside,** plus card holds once PAY-06 confirms them.
   - Either Payments and Compliance add a `bank_wire` rail, or the brief drops it.
6. **C5, which affects Payments (PAY-02, PAY-06).**
   - Per-lot holds, with partial capture, and void when the bidder is outbid or loses.
   - Payment requests with deadlines.
   - Per-transaction limits for each rail, readable by the bid command.
   - The winning bid and the premium on separate ledger lines.
   - The full list is in `settlement.md`, section 5.
7. **C4, which affects Smart contracts (SC-01, SC-04).** Requirements R1–R12 in `settlement.md`, section 4. The main ones:
   - deposits only with our signed authorisation;
   - funds can move only to settlement or back to the depositor;
   - a 14-day escape hatch after the latest close;
   - signed vouchers that expire with the reservation;
   - the bid log hash, or the offer record hash, in every settlement event;
   - a return path for a token after a 7-day cancellation (R8);
   - the recommended daily anchor for unsold lots.
8. **C9, which affects Vault & redemption (VLT-03).**
   - The item record carries the supplier the item was bought from, for the supplier bidding bar.
   - It also carries a sellable state.
   - I accept VLT-01's change request 5: listing commands check the Taiwan exposure figure and refuse new Taiwan-held listings at 90% of the cap, until exposure falls under 70%.
9. **Design (DES-02, DES-06).**
   - The soft-close copy changes from "adds two minutes" to "resets the clock to 2 minutes".
   - The ladder replaces the flat US$100 increment.
   - The bid panel's states and copy drafts are in section 13 of the sale rules.
   - Fixed-price sales show no premium if the owner agrees (question 2).
10. **Compliance (CMP-02, CMP-05).**
    - Add the counsel questions in `sale-rules.md` section 14 and `chance-features.md` section 5 to the lawyer briefs.
    - The most urgent: Taiwan's list of exceptions to the 7-day cancellation right doesn't name auctions, so the right probably reaches auction wins.
    - CMP-05 writes the disclosure texts the chance features need.

## Decisions I made inside my area

- **Every bid is a maximum bid** on the ladder, in whole dollars. A whole-dollar winning bid always gives a premium in whole cents.
- **The price** is one formula over all maximums (section 4.4). It never depends on the order the maximums came in, except for ties.
- **The reserve rule:** a leader whose maximum meets the reserve leads at the reserve, as on eBay.
  - The reserve is never above the low estimate.
  - It can be lowered, never raised.
  - It is committed by hash at opening.
- **The soft close** extends whenever the price, the leader or the reserve status changes in the last 2 minutes: through a bid, a lowered reserve or a removal. For bids this means exactly "a bid that raises the price". It resets the clock rather than adding time. The end is strict: a bid at the end time exactly is refused.
- **Bid numbers and `seq`.** Bid numbers order every accepted maximum, including quiet raises, and break ties. `seq` counts public lot events only, so the live channel has no gaps.
- **Offer records.** Second-chance and post-auction sales get their own published offer record. The bid log stays final at the close.
- **Outbid maximums** keep counting for the price, while their backing is released. A void or a removal recomputes the price, which may fall.
- **USDC bidders always set the amount aside.**
  - Exposure counts only the lots a bidder leads, plus unpaid wins.
  - High-value registration needs T2.
- **No money penalties** for non-payment in version 1.
- **The 7-day cancellation right** is treated as applying to auction wins until counsel rules: no strike, and the lot goes to second-chance offers.
- **Bars on bidding:** staff, contractors, suppliers of the item, and a second account of the same verified person.
- **The bid log:**
  - bidder codes per lot;
  - losing maximums published;
  - the winner's maximums withheld;
  - keccak-256 over RFC 8785 canonical JSON.
- **Fixed price:**
  - one reservation per unit, taken with `SKIP LOCKED`;
  - payment authorisations expire with the reservation;
  - a unique constraint per item.
- **Realtime:**
  - live channels for bidders only;
  - watchers poll the snapshot every 5 seconds, or every 2 in the closing phase;
  - starting rate limits as in `events-and-channels.md`, section 7.
- **Chance features:**
  - packs draw uniformly over the items left and refund in USDC if randomness fails;
  - draws commit the entry list before randomness is requested;
  - contest entrants can't bid on the lots they predicted.

## Questions for the owner

1. **Approve the numbers N1–N16** (table above; reasons in `sale-rules.md`, section 2). Change any you want. Recommended: approve as proposed.
2. **Premium on fixed-price sales?** DES-01 asked this. Recommended: no premium. The listed price is the whole price, and the premium belongs to auctions.
3. **Payment-method fees:** if a card-checkout provider charges the buyer a fee, do we absorb it, so the total is the same on every method? Recommended: yes. Otherwise each method shows a different total beside the bid button.
4. **Publish the reserve after the close,** for every lot, sold or unsold? Recommended: yes. It is what makes "reserve not met" believable, and the next listing of the item isn't bound by it.

## Next task I'd take

- **MKT-02 (bid transaction)** needs BE-03 (ledger holds), PAY-02 (C5) and SC-04 (lot escrow). None has merged, so it can't start yet.
- **Meanwhile:**
  - review SC-01's design note against R1–R12 when it lands;
  - review PAY-01's C5 v0 note against `settlement.md` section 5;
  - update these documents with the owner's answers.
- **Then MKT-02.** Its test vectors start with examples E1–E9 in section 4.7 of the sale rules.
