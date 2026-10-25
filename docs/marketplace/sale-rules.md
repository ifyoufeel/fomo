# Sale rules

Marketplace · MKT-01 · 25 Oct 2026 · Version 0.1, **a draft: the owner approves every number in section 2**

> **Source markers.** **[P]** is a primary source checked in this session. **[S]** is a secondary source, such as a help page mirror or an article. **[G]** is general knowledge not checked in this session. This session read sources through search-result summaries only, so re-check each [P] and [S] item before it goes into user-facing terms.
>
> **Not legal advice.** Where a rule touches consumer, gambling or privacy law, it says so and names the question for counsel (CMP-02).

## 1. What this covers

| File | What it holds | Who builds from it |
|---|---|---|
| `sale-rules.md` (this file) | The numbers to approve, timed auctions, the buyer's premium and all-in price, backing a bid, non-payment, no seller bids, fixed-price sales, operator controls, commands and refusal codes | Backend core, Marketplace (MKT-02, MKT-04), Design, Interface, Admin & content |
| `settlement.md` | The close and settlement steps, the bid log and its hash, and what contracts C4 and C5 need | Smart contracts (SC-01), Payments (PAY-06), Marketplace (MKT-03) |
| `events-and-channels.md` | Auction and sale events, sequence numbers, Ably channels and the watcher snapshot, for contract C3 | Backend core (BE-04), Interface, Admin & content, Marketplace (MKT-05) |
| `chance-features.md` | Packs, free draws and the free prediction contest, all built switched off | Compliance (CMP-02 lawyer briefs), Marketplace (MKT-06, MKT-07) |

Amounts are in US dollars, the ledger unit (USD = USDC). TWD is shown as indicative only. Every time is the database's UTC time.

## 2. Numbers for the owner to approve

| # | Number | Proposed | Why | Section |
|---|---|---|---|---|
| N1 | Increment ladder | The table in 4.3: from US$2 under US$50 up to US$100,000 above US$1M. Each step is 5–12.5% of the current bid from US$100 up | Round numbers, close to the tables collectors already know from Heritage [S]. Every band edge is reachable, so "one increment" always means "the next rung" | 4.3 |
| N2 | Lowest opening bid | US$10 | Below this, fixed price fits better | 4.2 |
| N3 | Soft-close window | 2 minutes | The brief's example. Catawiki uses 60 seconds [S]; most platforms use 1–10 minutes [S] | 4.6 |
| N4 | After a late bid | The clock resets to 2 minutes | "There are always 2 minutes after the last bid" is easy to explain and bounds each extension | 4.6 |
| N5 | Latest close (the cap) | 60 minutes after the scheduled end | It takes about 34 back-to-back late bids to reach it (example E7). It gives every lot a known latest close for settlement, support and realtime load | 4.6 |
| N6 | Auction length | 3 to 14 days; 7 by default | Enough time for KYC and backing before the close | 4.2 |
| N7 | Closing order in a sale | One lot a minute, in lot order. The operator may set up to 10 lots a minute for large sales | Christie's and Phillips close online sales lot by lot at 1-minute intervals [S] | 4.2 |
| N8 | Buyer's premium | 20% of the winning bid, on every auction lot | D9 | 5 |
| N9 | Payment window, for winners whose bid wasn't already paid for | 48 hours | Escrow and card-hold winners pay at the close; this covers the rest | 7.2 |
| N10 | Second-chance offers | Up to 3 underbidders, one at a time, 24 hours each, at the underbidder's own maximum | eBay's offers use the underbidder's highest bid [P] | 7.4 |
| N11 | Non-payment | 1st default: secured bidding only, for 12 months. 2nd default within 12 months: no more auctions. No fee is charged | No penalties in money until counsel advises | 7.3 |
| N12 | High-value lot | Opening bid or low estimate of US$10,000 or more. Bidders pre-register | The brief requires pre-registration; this sets the line | 6.4 |
| N13 | Bidding limits without secured backing, all-in | T1 US$2,500; T2 US$10,000; T3 US$25,000. A lower limit from CMP-03 wins | Caps the cost of a default while card holds and deposits wait on PAY-06 and counsel | 6.2 |
| N14 | Fixed-price reservation | 10 minutes, extended to 30 minutes from the moment payment is submitted | Long enough for 3-D Secure or an on-chain payment; short enough that abandoned carts free stock quickly | 9.2 |
| N15 | Bid corrections | Support may void a bidder's own clear mistake until 1 hour before the scheduled end, once per bidder per lot | Fixes typos without letting anyone retract in the closing phase | 4.8 |
| N16 | Outage pause | Clocks stop while bidding is down; each lot gets its remaining time plus 10 minutes on resume | Nobody loses a lot because our service failed | 4.8 |

**Numbers Marketplace sets in MKT-05 without approval,** because they're technical: rate limits (`events-and-channels.md`, section 7) and the watcher refresh rates (section 5 there).

## 3. Principles

1. **Postgres decides every bid.** One database transaction per bid, on the database clock. The chain settles the result; it never decides it.
2. **Our own stock only** (D7). The company is the only seller, and it never bids (section 8).
3. **Bidding is free.** No bid fees, no paid entry and no penalty fees.
4. **The price you see is the price you pay.** The 20% premium and the total show beside every bid button (section 5).
5. **Every live bid is backed.** A bid is accepted only if what it could cost is covered (section 6).
6. **Rules don't change during a lot.** Once a lot opens, the operator can lower its reserve, withdraw it or pause the whole sale, and nothing else.
7. **Everything is logged, and the bid log is published** with its hash in the settlement transaction (`settlement.md`).
8. **The chain stays invisible.** Users see "set aside", "your vault" and "your item", never "escrow", "wallet", "token" or "gas".

## 4. Timed auctions

### 4.1 Lot states

| State | Meaning | Next |
|---|---|---|
| `draft` | Being prepared in admin; not visible | `scheduled`, deleted |
| `scheduled` | Visible with its start and end times; no bids yet | `open`, `cancelled` |
| `open` | Taking bids. A sale-wide pause stops the clock (4.8) | `closed`, `cancelled` |
| `closed` | The end time has passed; the close command has picked the result | `awaiting_payment`, `unsold` |
| `awaiting_payment` | Won; payment not yet captured | `paid`, `defaulted` |
| `paid` | Payment captured; settlement pending | `settled` |
| `settled` | Ownership recorded on-chain and in our records | — |
| `defaulted` | The winner didn't pay; second-chance offers run (7.4) | `settled` (an offer was accepted and paid), `unsold` |
| `unsold` | No bids, reserve not met, or no second-chance offer taken | — (the operator relists as a new lot or lists at fixed price) |
| `cancelled` | Withdrawn before the close (4.8) | — |

Bids are refused once the database time reaches the end time, whether or not the close command has run yet. The close job's timing never changes a result.

### 4.2 Scheduling

- **Length:** 3 to 14 days from opening to scheduled end; 7 by default (N6).
- **Sales and closing order:** lots are grouped into sales. A sale's lots close in lot order, one a minute by default, up to 10 a minute (N7). Each lot's soft close runs on its own: an extension on one lot never moves another.
- **Opening bid:** set by the operator. It is on the ladder, at least US$10 (N2), and not above the reserve.
- **Estimate:** optional, shown as a low–high range in US dollars.
- **Reserve:** optional and confidential. It is on the ladder, at least the opening bid, and **not above the low estimate** when an estimate is shown, so the estimate stays honest.
- **Before opening** the operator may change anything. **From opening** the rules in principle 6 apply.

### 4.3 Increment ladder (N1)

| Current bid from | Up to | Increment |
|---|---|---|
| US$10 | US$49 | US$2 |
| US$50 | US$99 | US$5 |
| US$100 | US$199 | US$10 |
| US$200 | US$499 | US$25 |
| US$500 | US$999 | US$50 |
| US$1,000 | US$1,999 | US$100 |
| US$2,000 | US$4,999 | US$250 |
| US$5,000 | US$9,999 | US$500 |
| US$10,000 | US$19,999 | US$1,000 |
| US$20,000 | US$49,999 | US$2,500 |
| US$50,000 | US$99,999 | US$5,000 |
| US$100,000 | US$199,999 | US$10,000 |
| US$200,000 | US$499,999 | US$25,000 |
| US$500,000 | US$999,999 | US$50,000 |
| US$1,000,000 | — | US$100,000 |

- **Ladder amounts.** A valid amount is a whole number of dollars that is a multiple of its band's increment: 48, 50, 55, 475, 500, 550 and 4,750 are on the ladder; 9, 230 and 510 are not. Every band starts on a multiple of its own increment, so the top of each band is reachable from below, and the next rung above any amount on the ladder is that amount plus its increment.
- **Every bid, opening bid and reserve is on the ladder.** The bid panel offers only ladder amounts, and the bid command refuses anything else (`amount_not_on_ladder`).
- **Why whole dollars:** the 20% premium on a whole-dollar amount is always a whole number of cents, so there's no rounding anywhere.
- **Comparison.** Heritage's published table is close to this one: US$5 under US$100, US$10 to US$200, US$50 to US$1,000, US$100 to US$2,000, and so on [S]. Ours uses US$25, US$250 and US$2,500 steps in the 2–5 bands, so bids land on round numbers.

### 4.4 Maximum (proxy) bids

- **Every bid is a maximum bid.** The bidder says the most they will pay as a winning bid; the system bids for them one rung at a time, only as far as needed to lead. The quick-bid button places a maximum equal to the minimum bid.
- **The minimum bid** is the opening bid while there are no bids, and otherwise the next rung above the current price.
- **The current price** comes from the live maximums, every time, by one formula:
  - one bidder: the opening bid;
  - two or more: the next rung above the second-highest maximum, but never more than the highest maximum;
  - a tie at the top: the tied amount. The bidder who reached that amount first leads;
  - then the reserve rule in 4.5.
- **The leader** is the bidder with the highest maximum; between equal maximums, the one with the lower sequence number (the earlier bid).
- **Raising your own maximum** is allowed at any time before the close, to any ladder amount above your current maximum. It doesn't change the current price unless it meets the reserve (4.5).
- **Bids are binding.** A bidder can't lower or withdraw a maximum. Section 4.8 covers corrections.
- **Outbid maximums stay.** When a bidder is outbid, their backing for that lot can be released (6.1), but their maximum stays and still counts when the price is computed. Taking back the amount set aside therefore never lowers the price.
- **Privacy.** Only the bidder sees their own maximum. Others see the current price, the leader's bidder code and the number of bids. After the close, the bid log publishes every maximum except the winner's (`settlement.md`).
- **Time and order.** Each bid takes its time from the database after it has locked the lot, and gets the lot's next sequence number. A later sequence number never carries an earlier time (MKT-02 enforces this).

### 4.5 Reserve

- **Status shown:** "No reserve", "Reserve not met" or "Reserve met". The amount itself is never shown during the auction.
- **The reserve rule:** when the leader's maximum is at or above the reserve, the current price is at least the reserve. So a single bidder whose maximum covers the reserve leads at the reserve, not at the opening bid. This is the leader's own maximum bidding for them, as on eBay [S]; it is not a seller bid.
- **The reserve can be lowered** during the auction, never raised. Each change is a logged operator command and appears in the bid log. A lowered reserve may meet the reserve at once.
- **Proof:** a commitment to the reserve (a salted hash) is fixed when the lot opens and opened in the bid log after the close, so anyone can check the reserve never went up (`settlement.md`, section 3).
- **Reserve not met at the close:** the lot is unsold. The operator may make the highest bidder a post-auction offer (7.5).

### 4.6 Soft close (N3–N5)

- **The rule.** When a bid is accepted with less than 2 minutes to go, and it changes the price, the leader or the reserve status, the end time moves to 2 minutes after that bid. The end time never moves past the latest close: the scheduled end plus 60 minutes.
- **Strict end.** A bid is accepted only while the database time is before the end time. A bid at the end time exactly is refused (`lot_closed`).
- **What doesn't extend:** a leader raising their own maximum without changing anything visible (example E4), and any refused bid. Otherwise a leader could keep a lot open by raising their own maximum in small steps.
- **Shown from the start:** the scheduled end, and "closes by" the latest close.
- **Design copy.** DES-01 used "a bid in the last two minutes adds two minutes". The rule resets the clock to 2 minutes, so the copy becomes "A bid in the last 2 minutes resets the clock to 2 minutes" (section 13).

### 4.7 Worked examples

These are the first test vectors for MKT-02. A reference model in this session produced every result. All lots end at 20:00:00 unless the example says otherwise; amounts are in US dollars.

| # | Lot | Bids, in order | Result after each bid |
|---|---|---|---|
| E1 | Opening 100, no reserve | A max 500 | Price 100, A leads. Sold to A at 100 |
| E2 | Opening 100, no reserve | A max 500; B max 200; B max 500; C max 550 | 100 A; 225 A; 500 A (tie, A was first); 550 C. Sold to C at 550 |
| E3 | Opening 100, reserve 1,000 | A max 800; B max 1,500 | 100 A, reserve not met; 1,000 B, reserve met (850 lifted to the reserve). Sold to B at 1,000 |
| E3b | Opening 100, reserve 1,000 | A max 800; A raises to 1,000 | 100 A, reserve not met; 1,000 A, reserve met. Sold to A at 1,000 |
| E3c | Opening 100, reserve 1,000 | A max 800; B max 900 | 100 A; 850 B, reserve not met. Unsold |
| E4 | Opening 100, no reserve | A max 500; B max 200; at 19:59:00 A raises to 1,000 | 100 A; 225 A; 225 A, nothing visible changed, so no extension. Sold to A at 225 |
| E5 | Opening 100, no reserve | A max 500; at 19:58:30 B max 550; at 20:00:29 A max 700; at 20:02:29 B max 750 | 100 A; 550 B, end 20:00:30; 600 A, end 20:02:29; B refused, `lot_closed`. Sold to A at 600 |
| E6 | Opening 100, no reserve | At 19:57:00 A max 500 | 100 A; more than 2 minutes left, so no extension |
| E7 | Opening 1,000, no reserve | A max 1,000 at 19:50; then A and B alternate minimum bids every 110 seconds from 19:59:00 | 34 bids are accepted, the last at 20:59:30 at 12,000, and the end stops at the cap, 21:00:00. The next bid, at 21:01:20, is refused |
| E8 | Ladder edges | Bids of 48, 50, 475, 4,750; and of 9, 230, 510 | Accepted, and the next rungs are 50, 55, 500, 5,000. Refused as `amount_not_on_ladder` |
| E9 | Opening 100, no reserve | A max 1,000; B max 700; support voids B's bid | 100 A; 750 A; 100 A (the price can fall after a void) |

All-in totals at the 20% premium: a winning bid of US$100 costs US$120.00; US$1,000 costs US$1,200.00; US$12,500 costs US$15,000.00; US$47,500 costs US$57,000.00.

### 4.8 Corrections, removals, withdrawals and outages

- **A bidder's own mistake (N15).** Support may void one bid, at the bidder's request, when it is clearly a mistake (for example an extra zero). This works until 1 hour before the scheduled end, once per bidder per lot. The bidder's maximum goes back to what it was before that bid, the price is recomputed and may fall (E9), and the bid log shows the void.
- **Leading again after a void.** If a void or removal makes an outbid bidder the leader again, they lead even if their backing was already released. If they win, they pay within the 48-hour window (7.2), and missing it isn't a strike.
- **A bidder who becomes ineligible** during the auction (a screening hit, a blocked location, a closed or barred account) has every maximum on open lots removed at once, at any time. The price is recomputed. The bid log shows "removed" with no reason, so nobody is tipped off.
- **Withdrawing a lot** (`cancelled`) is allowed only before the close and only when the item can't be sold as described: damage, loss, a failed authentication, a compliance hold, or a listing error that changes the description materially. Every bid is void and all backing is released. Withdrawing a lot to avoid a low price is never allowed; the reserve is the only protection.
- **Small listing fixes,** such as a typo in the text, don't need a withdrawal. A material change does: withdraw the lot and relist it.
- **Outages (N16).** If bidding is unavailable for 60 seconds or more while any lot in a sale is open, the operator pauses the sale, or monitoring does it automatically. Every open lot's clock stops. On resume, each lot gets the time it had left plus 10 minutes, and its latest close moves by the same amount. Users are told on the lot page and by notification.

### 4.9 Who may bid

A bid is accepted only if all of these pass, in the bid transaction:

1. **The launch policy** (C6), action `auction.bid`: location, age, KYC tier T1 or above, screening, and the features for timed auctions, the vault token, the payment method's rail and the item.
2. **Not staff,** not a supplier of this item, and not barred (section 8 and 7.3).
3. **Registered** for a high-value lot (6.4).
4. **Backed** for the new maximum (section 6).
5. **Within rate limits** (`events-and-channels.md`, section 7).
6. **When the prediction contest is on:** not an entrant in a contest on this lot (`chance-features.md`).

**At the close,** the winner is checked again (checks 1 and 2). If they fail, nobody wins at their price: there is no strike, and second-chance offers start (7.4).

## 5. Buyer's premium and the all-in price

- **The premium** is 20% of the winning bid, on every auction lot (D9). On a whole-dollar winning bid it is always a whole number of cents.
- **Beside every bid button:** the bid or maximum, the premium, the total, and the total in TWD marked as indicative. For example: "Your maximum US$1,000 · Buyer's premium (20%) US$200 · Total US$1,200 · ≈ NT$38,400 (indicative)".
- **For a maximum bid** the panel also says "If you win at your maximum, you pay US$1,200". The actual winning bid may be lower.
- **Tax.** The winning bid and the premium include Taiwan's 5% business tax where it applies; nothing is added on top. CMP-06 confirms the treatment, including for buyers abroad [G].
- **Payment-method fees.** If a payment method adds a fee for the buyer (for example a card-checkout provider's convenience fee, PAY-01), the panel shows it in the total for that method before the bid. The recommendation is that we absorb these fees so the total is the same on every method (owner question 3).
- **Not in the total:** delivery. Storage is free, and the delivery fee, duties and taxes on import are quoted when the owner asks for delivery.
- **Fixed-price sales carry no premium** (recommended; owner question 2). The listed price is the whole price.
- **TWD.** The total in TWD is indicative while bidding. The TWD amount actually charged is fixed when checkout starts (PAY-01's rule).

## 6. Backing a bid

### 6.1 Exposure

- A bidder's **exposure** is the sum of:
  - the all-in amount (maximum plus 20%) on every open lot where they lead;
  - the all-in amount of every win not yet paid.
- A new maximum is accepted only if the exposure it creates is covered by the backing below. Otherwise it is refused, with `limit_exceeded`, `rail_limit_exceeded` or `secured_backing_required`.
- **When a bidder is outbid,** their backing for that lot is released:
  - the lot stops counting against a bidding limit at once;
  - a card hold is voided (PAY-06);
  - USDC set aside comes back when the bidder asks for it, or at the close otherwise. Keeping it set aside lets them bid again at once.

  The maximum itself stays and still counts for the price (4.4).

### 6.2 Kinds of backing

| Backing | Payment method | What it covers | Status |
|---|---|---|---|
| **Set aside in USDC** (the per-lot escrow): the bidder sets aside USDC from their own wallet for this lot | `usdc` | That lot, up to the amount set aside, which must cover the maximum's all-in | Phase 1, on SC-04 |
| **Card hold**: an authorisation for the lot's all-in amount | `twd_gateway` with a card | That lot | Waits on PAY-06 confirming how long the gateway keeps an authorisation open [P: ECPay documents authorise, capture and void; PAY-01] |
| **Bidding limit**, without anything set aside (N13) | `twd_gateway`, `card_checkout` | All the bidder's lots together, up to the limit | Phase 1 |
| **Refundable deposit** | Any | — | Built switched off until counsel says whether deposits count as stored value (brief, open questions) |
| **Bank wire after the hammer** | Not a C5 rail | — | The Marketplace starter brief names it for high-value lots, but C5 has no such rail. Change request to Planning |

- **USDC bidders always set the amount aside.** They never use a bidding limit, because the per-lot escrow is how crypto bidders are backed and settlement pays from it.
- **Bidding limits by tier (N13), all-in:** T1 US$2,500; T2 US$10,000; T3 US$25,000. If CMP-03 sets a lower limit for a tier, the lower one applies.
- **A bidding limit isn't credit.** Nothing is transferred or delivered before payment. The limit only caps what a bidder can commit to and leave unpaid.
- **The payment method is chosen per lot** with the first bid, and it decides which backing applies. It can change before the close only if the new backing covers the current maximum.

### 6.3 Limits of the payment method

- A maximum's all-in must fit the payment method's per-transaction limit. For example, Crossmint's default card limit is US$1,500 per transaction [P, through PAY-01]. Otherwise the bid is refused with `rail_limit_exceeded`, and the panel suggests another method.
- **Card holds in TWD** cover the all-in amount plus an exchange-rate buffer that PAY-06 sets, because the ledger runs in US dollars.

### 6.4 High-value lots (N12)

- **Which lots:** an opening bid or low estimate of US$10,000 or more. The lot page says "Registration needed" from the moment it is scheduled.
- **To register,** the bidder:
  - has tier T2, or the higher tier CMP-03 sets for the amount;
  - states the most they intend to bid;
  - backs that maximum's all-in with USDC set aside or a card hold. A bank wire can be added once C5 has the rail, with the operator's approval.
- **Registration sets a limit for that lot.**
  - Registering with USDC set aside is approved at once.
  - Any route that staff review should be requested at least 24 hours before the scheduled end.
- **Phase 1 effect.** Until card holds (PAY-06) or a bank-wire rail exist, high-value lots can be bid on only with USDC set aside.

## 7. After the hammer

### 7.1 The close

At or after the end time, the close command (a system actor) locks the lot and records the result. **Sold:** a leader exists and the reserve is met (or there is no reserve); the winning bid is the current price. **Unsold:** otherwise. The steps that follow are in `settlement.md`.

### 7.2 Paying (N9)

| How the winner was backed | Payment |
|---|---|
| USDC set aside | Paid at settlement, from the amount set aside. The rest goes back to the winner |
| Card hold | The hold is captured for the all-in amount at the close |
| Bidding limit | The winner pays the all-in amount within **48 hours**, through the TWD gateway or card checkout. Reminders go out at the close, after 24 hours, and 4 hours before the deadline |

- **One extension.** Support may extend the deadline once, by up to 72 hours, for a documented payment problem such as a card issuer's block.
- **Ownership** passes only once payment is captured. Settlement follows (`settlement.md`).

### 7.3 Non-payment (N11)

- **A default** is a missed deadline, or a capture that fails and isn't fixed by the deadline. The win is cancelled, and the lot goes to second-chance offers (7.4).
- **Strikes:**
  - **1st default:** the account may bid only with USDC set aside or a card hold, for 12 months.
  - **2nd default within 12 months:** the account is barred from auctions. The operator may reinstate it after review.
- **No money penalty** in version 1: no fee, no forfeit and no interest. That needs counsel's view under consumer law first.
- **Not a default:**
  - a cancellation within a statutory right (7.6);
  - a payment refused because of our own error;
  - a winner who fails the policy check at the close;
  - a winner whose backing had been released before a void made them lead again (4.8).

### 7.4 Second-chance offers (N10)

- **Who gets one:** the underbidders, in order of their maximum (highest first, then earliest). Only those whose maximum meets the reserve qualify; the operator may lower the reserve first.
- **The price** is the underbidder's own maximum, plus the 20% premium.
- **How it runs:**
  - One offer at a time, each open for 24 hours.
  - Up to 3 offers, all within 14 days of the close.
  - It is a private offer, never shown to other users.
- **Accepting means paying.** The offer opens the fixed-price checkout (section 9) with the policy check for `sale.buy`. An unpaid acceptance simply lapses, with no strike.
- **If nobody takes an offer,** the lot is `unsold`. The operator relists it as a new lot or lists it at fixed price.
- **The bid log** records the second-chance sale.

### 7.5 Reserve not met: post-auction offer

- The operator may offer the lot to the highest bidder for 24 hours.
- **The price** is between that bidder's own maximum and the reserve, plus the premium.
- Accepting means paying, as in 7.4.

### 7.6 The 7-day cancellation right

- Taiwan gives consumers a 7-day right to cancel distance sales (Consumer Protection Act, Art. 19) [G]. The list of exceptions (通訊交易解除權合理例外情事適用準則, Art. 2) doesn't name auctions [S], so assume the right applies to auction wins until counsel rules. When the period starts for an item kept in our vault is already an open question in the brief.
- **Until counsel rules (CMP-02):**
  - A consumer winner who cancels within the period gets a full refund on the same payment method.
  - There is no strike.
  - The lot goes to second-chance offers if it's within 14 days of the close; otherwise it is relisted.
- **Repeated cancellations** go to Compliance for review. They're not penalised.

## 8. No seller bids, ever

**The rule.** The company is the only seller (D7). The company never bids in its own auctions, and neither does anyone acting for it:

- no house bids;
- no bids on the seller's behalf up to the reserve ("chandelier" bids);
- no phantom bids, and no shill accounts;
- no bids from staff, contractors or the supplier of the item.

The reserve is the only thing that protects our price.

**How it's enforced:**

- **Staff accounts.** Accounts with a staff or operator role can't bid (`staff_not_permitted`).
- **Staff as private users.** Staff and contractors are listed by identity. A matching KYC identity is barred from bidding.
- **One person, one bidder.** One verified person is one bidder: BE-05 keeps one account per verified identity.
- **Suppliers.** The supplier who sold us an item is recorded at intake (a C9 field) and can't bid on that item. We never share auction proceeds with a supplier, because that would be consignment, which is deferred (D7).
- **Review after the close.** Accounts that look related (a shared device, payment card or wallet funding source) and bid against each other are flagged to Compliance.
- **Proof.** The published bid log and the reserve commitment let anyone check.

**Consignment, when it comes (Phase 4).** The consignor is a seller, and is barred from their own lots in the same way.

## 9. Fixed-price sales

### 9.1 Listings

- **One listing** sells one item, or a set of identical units. Each unit is still its own item, with its own token.
- **The price** is in US dollars (cents allowed; normally whole dollars) and includes tax. It carries no premium (owner question 2).
- **Optional settings:**
  - a start time (a "drop"), judged by the database clock;
  - a limit per buyer, which counts paid orders and live reservations.
- **The operator** may change the price or withdraw the listing, but not a unit while it is reserved.

### 9.2 Checkout without overselling (N14)

1. **Reserve.** Checkout starts by reserving one available unit for the buyer, in one transaction. Only an available unit can be reserved, and pools of units use `FOR UPDATE SKIP LOCKED`.
2. **Hold for 10 minutes.** When the buyer submits payment (an on-chain payment or a provider's checkout session), the reservation extends to 30 minutes from that moment.
3. **The payment can't outlive the reservation.**
   - The on-chain payment authorisation (`settlement.md`, section 5) expires with the reservation.
   - So does the card provider's checkout session.
   - A payment after the reservation lapses therefore fails, instead of selling a unit twice.
4. **Sell once.**
   - The database allows one completed sale per item (a unique constraint).
   - On-chain, the token can leave our inventory only once.
5. **Release.** On expiry, a buyer's cancel or a failed payment, the unit is available again at once.
6. **Price changes** never affect a live reservation. TWD totals are fixed when checkout starts.
7. **Policy check:** `sale.buy` (C6), inside the reserve command, and again at payment.

The 7-day cancellation right (7.6) applies to fixed-price sales in the same way.

## 10. Operator controls and guards

| Command | Before opening | While open | Notes |
|---|---|---|---|
| Schedule a lot or list an item | Yes | — | Item checks below |
| Edit times, opening bid, reserve, estimate, description | Yes | No | Material changes after opening mean withdrawing and relisting (4.8) |
| Lower the reserve | Yes | Yes | Logged; in the bid log |
| Void a bid at the bidder's request | — | Until 1 hour before the scheduled end | 4.8 |
| Remove an ineligible bidder's maximums | — | Yes | 4.8 |
| Withdraw a lot | Yes | Yes, for the listed reasons | 4.8 |
| Pause or resume a sale | — | Yes | 4.8 |
| Make a second-chance or post-auction offer | — | After the close | 7.4, 7.5 |
| Bid | Never | Never | Section 8 |

**Item checks when a lot is scheduled or an item listed:**

- The item is our own stock, in a sellable state in C9: intake complete, vaulted, not locked, and not being redeemed.
- It passes the item rules in the launch policy (C6).
- **The Taiwan exposure guard** (VLT-01, `docs/vault/risk-limits.md`, section 3): while the exposure is 90% of the Taiwan cap or more, an item held in Taiwan can't be scheduled or listed, until exposure falls under 70%. Vault & redemption supplies the exposure figure.

## 11. Commands

Every command has an actor and an idempotency key, runs in one database transaction, and calls the launch policy inside it.

| Command | Actor | Policy action (C6) | Module |
|---|---|---|---|
| `auction.schedule`, `auction.edit` | Operator | `catalog.publish_item` item rules (change request: a dedicated `auction.schedule`) | `auctions/` |
| `auction.place_bid` (new or raised maximum) | User | `auction.bid` | `auctions/` |
| `auction.lower_reserve`, `auction.void_bid`, `auction.remove_bidder`, `auction.withdraw` | Operator | Item rules only | `auctions/` |
| `auction.pause_sale`, `auction.resume_sale` | Operator, or monitoring as a system actor | — | `auctions/` |
| `auction.register` (high-value lots) | User | `auction.bid` | `auctions/` |
| `auction.open` (at the start time; fixes the reserve commitment) | System | — | `auctions/` |
| `auction.close` | System | — | `auctions/` |
| `auction.record_payment`, `auction.mark_defaulted` | System (from C5 events and deadlines) | — | `auctions/` |
| `auction.offer_second_chance`, `auction.offer_post_auction` | Operator or system | — | `auctions/` |
| `auction.accept_offer` | User | `sale.buy` | `auctions/`, `sales/` |
| `auction.settle` | System | — | `auctions/` |
| `sale.list`, `sale.change_price`, `sale.withdraw` | Operator | Item rules | `sales/` |
| `sale.reserve`, `sale.cancel_reservation` | User | `sale.buy` (reserve only) | `sales/` |
| `sale.complete`, `sale.release_reservation` | System | — | `sales/` |

C6 v0 has two actor kinds, user and operator. The close, deadline and settlement jobs need a third, **system**, which skips user checks like an operator does. This is a change request to Compliance.

## 12. Refusal codes and messages

Marketplace refusals sit beside the launch policy's (C6, section 11). When both refuse, the policy's reason is shown first.

**Rules for the text:**

- It never mentions wallets, tokens, escrow or chains.
- A barred or staff account sees C6's general `policy.unavailable`, with no reason.

| Code | Message key |
|---|---|
| `lot_not_open` | `auction.not_open` |
| `lot_closed` | `auction.closed` |
| `amount_not_on_ladder` | `auction.not_on_ladder` |
| `below_minimum` | `auction.below_minimum` |
| `not_above_own_max` | `auction.raise_above_own_max` |
| `limit_exceeded` | `auction.limit_reached` |
| `rail_limit_exceeded` | `auction.payment_method_limit` |
| `secured_backing_required` | `auction.set_aside_required` |
| `registration_required` | `auction.registration_required` |
| `bidder_barred`, `staff_not_permitted`, `supplier_not_permitted` | `policy.unavailable` (C6) |
| `contest_entrant` | `auction.contest_entrant` (only when the contest is on) |
| `rate_limited` | `auction.slow_down` |
| `reservation_expired` | `sale.reservation_expired` |
| `sold_out` | `sale.sold_out` |
| `buyer_limit_reached` | `sale.buyer_limit` |

**Drafts.** Native speakers review them; Interface owns the final text in `packages/i18n`.

| Key | en | zh-TW | ja |
|---|---|---|---|
| `auction.not_open` | Bidding hasn't started yet. | 競標尚未開始。 | 入札はまだ始まっていません。 |
| `auction.closed` | Bidding has closed. | 競標已結束。 | 入札は終了しました。 |
| `auction.not_on_ladder` | At this price, bids go up in steps of {step}. | 此價格區間的出價級距為 {step}。 | この価格帯では {step} 単位で入札できます。 |
| `auction.below_minimum` | Bid at least {minimum}. | 出價至少需 {minimum}。 | {minimum} 以上で入札してください。 |
| `auction.raise_above_own_max` | Your new maximum must be above {current}. | 新的最高出價必須高於 {current}。 | 新しい上限額は {current} より高く設定してください。 |
| `auction.limit_reached` | This is above your bidding limit. Choose a lower maximum, or see how to raise your limit. | 此金額超過您的出價上限。請調低最高出價，或查看提高上限的方式。 | この金額は入札上限を超えています。上限額を下げるか、入札上限の引き上げ方法をご確認ください。 |
| `auction.payment_method_limit` | This payment method can't cover a total of {total}. Choose another one. | 此付款方式無法支付總計 {total}，請選擇其他付款方式。 | このお支払い方法では合計 {total} をお支払いいただけません。別の方法をお選びください。 |
| `auction.set_aside_required` | For now, your bids need the full amount set aside first. | 目前您的出價需先預留全額。 | 現在、入札には全額の事前確保が必要です。 |
| `auction.registration_required` | Register for this lot before you bid. | 此拍品須先完成登記才能出價。 | このロットに入札するには事前登録が必要です。 |
| `auction.contest_entrant` | You entered the prediction contest for this lot, so you can't bid on it. | 您已參加此拍品的預測活動，因此無法對其出價。 | このロットの予想コンテストに参加しているため、入札できません。 |
| `auction.slow_down` | Too many bids at once. Try again in a moment. | 出價過於頻繁，請稍後再試。 | 短時間に入札が集中しています。少し待ってからもう一度お試しください。 |
| `sale.reservation_expired` | Your hold on this item has ended. Start checkout again. | 此商品的保留時間已結束，請重新結帳。 | この商品の確保時間が終了しました。もう一度購入手続きを行ってください。 |
| `sale.sold_out` | This item is sold out. | 此商品已售完。 | この商品は完売しました。 |
| `sale.buyer_limit` | You've reached the limit for this item. | 您已達到此商品的購買上限。 | この商品の購入上限に達しました。 |

## 13. The bid panel: what Design needs

**Always shown on an auction lot:**

- the current price, the number of bids and the leader's bidder code;
- the reserve status: "No reserve", "Reserve not met" or "Reserve met";
- the time left, the scheduled end in the viewer's time zone, and "closes by" the latest close;
- "Bidding is free."

**Beside the bid button** (section 5):

- the bid or maximum, the 20% premium, the total and the indicative TWD;
- for a maximum, "If you win at your maximum, you pay {total}".

**Entering a bid:**

- quick bid at the minimum, and two or three higher rungs;
- a maximum chosen from ladder amounts only, with a stepper rather than free typing;
- the payment method, chosen per lot with the first bid.

**States for the viewer:**

- watching;
- registration needed;
- leading, showing "your maximum {amount}";
- outbid;
- tied, where an earlier bid of the same amount leads;
- closing, in the soft-close window;
- extended;
- won, with payment due by a deadline;
- won and paid;
- lost;
- unsold;
- withdrawn;
- paused.

**Watchers see a snapshot that refreshes every few seconds** (`events-and-channels.md`, section 5). The panel should say "Bid to get live updates" rather than imply that a watcher's page is live.

**Copy drafts:**

| Key | en | zh-TW | ja |
|---|---|---|---|
| `auction.premium_line` | Buyer's premium (20%) {premium} · Total {total} | 買家佣金（20%）{premium}・總計 {total} | 落札手数料（20%）{premium}・合計 {total} |
| `auction.total_at_max` | If you win at your maximum, you pay {total}. | 若以您的最高出價得標，需支付 {total}。 | 上限額で落札した場合のお支払い額は {total} です。 |
| `auction.twd_indicative` | ≈ {twd} (indicative) | 約 {twd}（僅供參考） | 約 {twd}（参考値） |
| `auction.soft_close` | A bid in the last 2 minutes resets the clock to 2 minutes. Bidding closes by {latestClose} at the latest. | 最後 2 分鐘內若有新出價，倒數將重設為 2 分鐘。最晚於 {latestClose} 截止。 | 終了 2 分前以降に入札があると、残り時間は 2 分に戻ります。遅くとも {latestClose} に終了します。 |
| `auction.no_reserve` | No reserve | 無底價 | 最低落札価格なし |
| `auction.reserve_not_met` | Reserve not met | 未達底價 | 最低落札価格に未達 |
| `auction.reserve_met` | Reserve met | 已達底價 | 最低落札価格に到達 |
| `auction.leading` | You're the highest bidder. | 您目前是最高出價者。 | 現在、最高入札者です。 |
| `auction.outbid` | You've been outbid. | 您的出價已被超越。 | より高い入札がありました。 |
| `auction.tied_earlier` | An earlier bid of the same amount leads. | 已有人較早出價相同金額，由對方領先。 | 同額の先行入札が優先されます。 |
| `auction.payment_due` | You won. Pay {total} by {deadline}. | 恭喜得標。請於 {deadline} 前支付 {total}。 | 落札しました。{deadline} までに {total} をお支払いください。 |
| `auction.free_to_bid` | Bidding is free. | 出價免費。 | 入札は無料です。 |
| `auction.live_on_bid` | Bid to get live updates. | 出價後即可接收即時更新。 | 入札するとリアルタイムで更新されます。 |

**Glossary for the translations:**

| en | zh-TW | ja |
|---|---|---|
| winning bid (hammer price) | 得標價 | 落札価格 |
| maximum bid | 最高出價 | 上限額 |
| buyer's premium | 買家佣金 | 落札手数料 |
| reserve | 底價 | 最低落札価格 |
| lot | 拍品 | ロット |

**Numbers that replace DES-01's placeholders:** the ladder (4.3) replaces the flat US$100 increment, and the soft-close copy changes as in 4.6.

## 14. Open questions

**For the owner** (also in the handoff note):

1. Approve the numbers in section 2.
2. **The premium on fixed-price sales.** Recommended: none. The listed price is the whole price; the premium belongs to auctions. DES-01 asked this.
3. **Payment-method fees.** Recommended: we absorb them, so the total is the same whatever the buyer pays with.
4. **Publishing the reserve after the close** (`settlement.md`, section 3). Recommended: yes, for every lot, sold or unsold. It is what makes "reserve not met" believable.

**For counsel (CMP-02):**

1. Does the 7-day cancellation right reach auction wins, and from when, for an item kept in the vault (7.6)?
2. May we charge anything for non-payment, such as a fee, interest or the cost of a second-chance sale, or only restrict the account (7.3)?
3. Is publishing a per-lot pseudonymous bid log, with losing maximums, acceptable under Taiwan's Personal Data Protection Act and the GDPR for EU bidders (`settlement.md`)?
4. Is a bidding limit without anything set aside a form of credit under Taiwan law (6.2)?
5. Is the reserve rule (4.5) acceptable as disclosed, and does any market require the reserve to be disclosed?

**For other chats:** in the handoff note, as change requests.

## Sources

Read through search-result summaries in this session; check each one before use.

- Heritage Auctions conditions of sale, bid increments (mirrors of HA.com terms): https://www.auctionzip.com/auction-lot/barbara-grenell-american-1944-2001-planar-escape-_D504F5683E and https://www.estatesales.net/TX/Dallas/75261/5062332/print [S]
- Catawiki, why bidding times are extended: https://auction.catawiki.com/en/help/bidding-basics/why-are-bidding-times-for-some-lots-occasionally-made-longer [S, help page through a summary]
- Soft-close settings, reset or add: https://www.auctionmethod.com/blog/when-to-use-soft-close-groups-in-your-online-auction and https://racklify.com/encyclopedia/what-is-soft-close-how-it-works-in-online-auctions/ [S]
- Late bidding with and without extension (Roth and Ockenfels): https://www.nber.org/papers/w7729 [S]
- Christie's online sale closing lots at 1-minute intervals: https://onlineonly.christies.com.cn/s/collection-ann-gordon-getty-wheatland-online/overview/3430?sc_lang=en [S]; Phillips online auctions: https://phillips.com/auction/NY011525 [S]
- eBay, Second Chance Offer: https://developer.ebay.com/api-docs/user-guides/static/trading-user-guide/second-chance.html [P]
- eBay, reserve and proxy bids: https://oreilly.com/library/view/ebay-hacks-2nd/059610068X/ch04s05.html [S]
- Taiwan, exceptions to the 7-day cancellation right: https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0170012 and https://www.legis-pedia.com/dictionary/55 [S]; Executive Yuan consumer-protection interpretation: https://www.ey.gov.tw/Page/24C4B877E850ED4E/36663b43-67df-4bdb-b8f7-d6a649b95223 [S]
- Payment facts (ECPay holds, Crossmint limit): `docs/payments/provider-comparison.md` (PAY-01)
