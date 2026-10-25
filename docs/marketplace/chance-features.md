# Packs, free draws and the free prediction contest

Marketplace · MKT-01 · 25 Oct 2026 · Version 0.1, design outline · **all built switched off**

The mechanics in enough detail for Compliance's lawyer briefs (CMP-02) and for MKT-06 and MKT-07 to build from. The parameters marked "with counsel" are set in MKT-06 or MKT-07 once a lawyer has looked at the design. Source markers are as in `sale-rules.md`.

## 1. What stays true everywhere

- **Off until the launch policy says Launch.** Packs (launch matrix row 10) are Counsel in every market they're allowed in. Free draws (row 12) and the prediction contest (row 15) are Cond. or Counsel. The commands exist, the tests run with the flag on, and the policy refuses them everywhere in version 1 (C6, section 5).
- **Never:**
  - paid raffles;
  - staked betting, including on winning bids;
  - packs with instant cash buyback in Taiwan;
  - selling a pack pull back to us, in any market (C6: `pack_pull_not_eligible`);
  - entries or odds that improve with spending.
- **Our own stock only.** Every prize and every item in a pack is an item already in the vault, with its own token.
- **Verifiable randomness.** Chainlink VRF v2.5, through the randomness adapter (C4). Randomness is requested only after everything it decides is fixed and published.

## 2. Packs (MKT-06)

### 2.1 How a pack works

| Part | Rule |
|---|---|
| **Pool** | A named set of vaulted items, split into tiers (for example common, rare, chase). A pack draws exactly one item from the pool |
| **Value floor** | Every item in the pool has a fair-market value (VLT-05) of at least a set share of the pack price (the floor, with counsel). A pool can't open unless every item meets it |
| **Price** | In USDC only, from the buyer's own wallet. Never by card, the TWD gateway or any other rail |
| **Epoch** | The period between restocks. At each epoch's start we publish: <ul><li>the tiers;</li><li>each tier's item count;</li><li>the odds per tier;</li><li>the average value of the pool;</li><li>a Merkle root of each tier's inventory.</li></ul>The pool can't change during an epoch except by pulls |
| **Inventory proof** | A leaf is (tier, item ID, value). A buyer can check that their item was in the committed inventory |
| **Draw** | Without replacement. Each pull picks uniformly among the items left, so a tier's odds are its share of the items left. Odds shown live update after every pull |
| **Order** | Pulls are numbered when they're paid. Pull *n* uses the items left after pulls 1 to *n*−1, even when randomness answers arrive out of order |
| **Index** | Sort the items left by item ID, then take the random word modulo the number left |
| **Delivery** | The item's token goes to the buyer. The item stays in the vault like any other purchase |
| **Randomness failure** | If VRF doesn't answer within a set time, refund the pull in USDC. Never re-draw with another source |

### 2.2 Protections

- **Eligibility:** T1 and the age floor (C6). In Taiwan, no buyback of any kind on pack pulls.
- **Spend limits:**
  - a daily and a monthly limit for each user (amounts with counsel);
  - users can lower a limit at once, and a raise takes effect after 24 hours.
- **Self-exclusion:**
  - for 6 months, 1 year or permanently;
  - it covers every chance feature, can't be undone early, and blocks marketing of chance features to that user.
- **Reality check:** a reminder of time and spend after a set number of pulls in a session.
- **Disclosures** before every purchase:
  - the odds;
  - the value floor;
  - the pool's average value;
  - "No buyback";
  - the self-exclusion link.

  The texts come from CMP-05.

### 2.3 Parameters to set with counsel (MKT-06)

The value floor as a share of the pack price; the daily and monthly spend limits; the reality-check interval; the VRF timeout; and whether to publish expected value per pack as well as the pool's average value.

## 3. Free draws (MKT-07)

| Part | Rule |
|---|---|
| **Entry** | Free. No purchase, payment, deposit or bid is needed, and none gives extra entries. One entry per person per draw: T0 to enter, T1 to claim (C6) |
| **Tickets** | Entries get consecutive ticket ranges in entry order. One ticket each by default. A range of more than one ticket is allowed only for free extra entries offered equally to everyone under the official rules |
| **Prize** | One item from our stock. Its token goes into the draw escrow when the draw is created, before entries open |
| **Closing** | Entries close at a fixed time. Then we publish a Merkle root of the entry list (per-draw pseudonymous codes and ticket ranges). Only after that do we request randomness |
| **Winner** | The ticket number is the random word modulo the number of tickets, plus 1. The winner is the entrant whose range holds it |
| **Claim** | Within 30 days, passing `draw.claim_prize` (C6). If the prize isn't claimed, it is redrawn from the same committed list with a new randomness request, without the first winner |
| **Rules** | Official rules and the prize disclosure are approved by counsel and published (CMP-05) before the draw opens |

## 4. Free prediction contest (MKT-07)

| Part | Rule |
|---|---|
| **What's predicted** | The winning bid of a named lot, or of a set of lots |
| **Entry** | Free; no stake and no purchase. One entry per person per contest: T0 to enter, T1 to claim (C6) |
| **Disclosure** | Shown before entry: we sell the lot and set its reserve. The wording comes from CMP-05 |
| **Integrity** | <ul><li>Entries close when the lot opens.</li><li>Entries stay hidden until the lot closes.</li><li>Entrants can't bid on the lots in a contest they entered (`contest_entrant`, `sale-rules.md` section 12).</li><li>Staff can't enter</li></ul> |
| **Scoring** | Closest to the winning bid, over or under. Ties go to the earlier entry. If the lot doesn't sell, the contest has no winner and the prize stays in our stock |
| **Prize** | An item from our stock, escrowed as for draws |

## 5. Questions for counsel (for CMP-02)

1. **Packs.** With USDC-only payment, a published value floor, published odds and no buyback, is a pack a lottery or gambling in each market? Does the floor's size change the answer? What spend limits and self-exclusion terms would counsel require?
2. **Free draws.** Is "one free entry per person, no purchase connected" enough to keep a draw outside lottery rules in TW, US and JP? What prize caps apply? For Japan, the Premiums Act. For the US, state sweepstakes registration and bonding.
3. **Prediction contest.** Does barring entrants from bidding on the predicted lots, plus the disclosure that we run the auction, resolve the conflict of interest? Is any prize value limit needed?
4. **Unclaimed prizes.** Is a redraw acceptable, or must an unclaimed prize be handled another way?
