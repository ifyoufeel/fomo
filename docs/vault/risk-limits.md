# Taiwan risk limits and evacuation plan

Vault & redemption · VLT-01 · 24 Oct 2026 · **a draft: the owner sets every number marked "proposed"**

## 1. Why this exists

- **War on land in Taiwan can't be insured in practice** (`custody-comparison.md`, finding 3). A war loss of user-owned items in Taiwan would fall on the company.
- **The brief's rule:** keep user-owned value held in Taiwan under a cap, with a written evacuation plan.
- **This document sets:**
  - the cap;
  - the threshold above which items move to Singapore;
  - how both are measured and enforced;
  - what we do, and when, if the risk rises.
- **People first.** No one stays at, or travels to, the hub at risk to themselves to save items. Insured items are replaceable; staff are not.

## 2. The limits

| Limit | Proposed for Phase 1 | Why |
|---|---|---|
| **Taiwan cap**: user-owned value in Taiwan, plus our own Taiwan-held stock that is listed for sale | **US$1,000,000** | Small enough to pack and fly out in one shipment within 48 hours, inside one per-shipment insurance limit. The owner holds a reserve of the same amount, to make users whole if a war loss isn't insured |
| **Transfer threshold**: items at or above it go to Singapore after intake | **US$2,000** fair-market value | Below it are mostly cards, sealed products and toys: many items, low value each, where a transfer costs more per item. Above it, value concentrates |
| **Always Singapore**, whatever the value | Watches, luxury goods and art | The brief's rule |
| **Our own unlisted stock in Taiwan** | **US$1,000,000**, soft | It's the company's own risk, but it competes for the same evacuation flight |
| **Volume** | Fits one secure air shipment (the custodian confirms the size) | Value isn't the only limit on a fast move: sneakers and toys are bulky |

**The rule for setting the cap:** the cap is the smallest of:

- the per-shipment limit on the transit policy with war cover (the broker's answer);
- what staff can pack and the carrier can lift within 48 hours (the custodian's answer, then a drill);
- the reserve the owner is willing to hold against an uninsured war loss.

Review the cap at each insurance renewal, every quarter, and after every Level 1 or higher event (section 4.2).

## 3. Measuring and enforcing the cap

- **Exposure** is the fair-market value (VLT-05) of:
  - items in Taiwan owned by a user, in any state except REDEEMED;
  - plus our own Taiwan-held items that are LISTED, because a sale can turn them into user-owned value at any moment.
- **Value:** until VLT-05's price sources exist, use the larger of purchase cost and last sale price.
- **Data:** computed from the item record (C9, VLT-03), which carries `vaultCountry`, the state, the owner type (a user, or our own stock) and the current value.
- **Daily:** the proof-of-reserve run (VLT-06) reports exposure against the cap to the owner.
- **Live guard:**

| Exposure | What happens |
|---|---|
| Under 80% | Normal |
| 80% or more | A transfer batch to Singapore is scheduled within 7 days |
| 90% or more | No new listing of a Taiwan-held item, until transfers bring exposure under 70% |
| 100% or more | Treated as a Level 1 event (section 4.2), whatever caused it |

- **Who builds the guard:**
  - the listing guard: Admin & content and Marketplace (a change request in the handoff);
  - the exposure figure: Vault & redemption, in `packages/core/src/vault/`.
- **Transfers are batched:** monthly, or when a batch reaches the threshold, as `custody-comparison.md` section 7.2 recommends.

## 4. Evacuation plan

### 4.1 Standing preparations

All of these are in place before the first user-owned item is stored in Taiwan.

- [ ] **Singapore vault account open,** with a written evacuation service: a priority lift from Taiwan, confirmed within 24 hours of our call.
- [ ] **Open transit insurance with war cover bound** for Taiwan to Singapore by air, so cover attaches when goods are loaded. Its per-shipment limit is at least the cap plus our Taiwan stock.
- [ ] **A customs broker on standby at both ends**, with power of attorney filed. Export and import templates filled from the item records: description, origin, tariff code, value and our item ID.
- [ ] **One-click manifest:** the system exports every Taiwan-held item, with its location in the hub, packing box and value, sorted by the loading order in section 4.5.
- [ ] **Items stored ready to go:** in numbered, tamper-evident boxes by category, each box with its own manifest, so packing takes hours, not days.
- [ ] **Nothing that needs special papers in Taiwan:** no exotic-leather straps (`custody-comparison.md`, finding 7), and no art, watches or luxury goods.
- [ ] **Named people:** the owner, two evacuation leads (section 4.4), and a backup for each. Their contacts, and the vault, carrier and broker contacts, are kept both outside the office and offline.
- [ ] **Records kept outside Taiwan:** the item records, intake videos and photos live in cloud storage outside Taiwan. The database is on Neon Singapore under the brief's architecture.
- [ ] **User messages drafted** in zh-TW, en and ja, ready for Compliance's review (CMP-05) and for Interface.

### 4.2 Levels and triggers

| Level | Triggered by any of | Who declares |
|---|---|---|
| **0 Normal** | — | — |
| **1 Watch** | <ul><li>A large-scale named PLA exercise around Taiwan, or closure zones declared near Taiwan's ports or airports. Routine drills, such as Taiwan's Han Kuang exercise, don't count</li><li>The broker or an insurer says Taiwan war or political-violence terms are under review</li><li>The US, Japan or UK raises its travel advice for Taiwan</li><li>Exposure reaches 100% of the cap</li></ul> | The owner or either evacuation lead |
| **2 Move** | <ul><li>An insurer gives notice cancelling war cover for Taiwan transits. The 7-day notice is the window to move</li><li>A declared blockade, "quarantine" or inspection regime on shipping or flights to Taiwan</li><li>Major airlines suspend Taiwan flights, or air cargo out of Taoyuan is restricted</li><li>A foreign government tells its citizens to leave Taiwan</li><li>The owner decides</li></ul> | The owner, or either evacuation lead if the owner can't be reached within 2 hours |
| **3 Shelter** | Nothing can fly or sail out | The owner or either evacuation lead |

The PLA's December 2025 exercise rehearsed a full blockade, with live fire inside Taiwan's contiguous zone [S]. An exercise like that would be a Level 1 trigger.

### 4.3 What happens at each level

**Level 1, within 24 hours:**

1. Stop shipments into the Taiwan hub. Ask suppliers to hold, or to ship to Singapore, where the custodian's inspection service can do part of the intake.
2. Bring exposure under 50% of the cap within 7 days, with a transfer to Singapore.
3. Confirm the carrier's lift, that the transit cover is in force, and that the customs broker is ready.
4. Report exposure to the owner daily.
5. **Return to Level 0** when the owner decides, but not before 14 days pass with no new trigger.

**Level 2, the move:**

1. Pause sales of Taiwan-held items, and redemptions shipping from Taiwan.
2. Pack and ship every user-owned item within **72 hours**, or before war-cover cancellation takes effect, whichever comes first. Then ship our own stock, in the loading order (section 4.5).
3. Send the drafted user messages: items are being moved to the Singapore vault, ownership is unchanged, and sales of those items resume after arrival.
4. On arrival, the Singapore custodian counts against the manifest within 24 hours. Each item record's `vaultCountry` changes to SG through a domain command.
5. Publish an extra proof-of-reserve report once the count is done.

**Level 3, shelter:**

1. Staff leave the hub when it's safe. No one goes back for items.
2. Items stay locked in the safes. The intake room's alarm and monitoring stay on as long as power allows.
3. Records are already outside Taiwan (section 4.1). Mark every Taiwan item's record as unreachable; tokens are unaffected.
4. Tell users plainly what we know. Open claims on whatever the policies cover. The owner decides on using the reserve.

### 4.4 Roles

| Role | Who | Does |
|---|---|---|
| Owner | `[owner: name]` | Declares levels, approves spend, speaks to users |
| Evacuation lead 1 | `[owner: name]` | Runs packing, the handover to the carrier, and the manifest |
| Evacuation lead 2 | `[owner: name]` | Customs broker, insurer notice, Singapore receipt |
| Custodian or carrier | Account manager at the chosen vault | Lift, transit, Singapore intake count |
| Broker | Appointed broker | Confirms cover before items move, and files claims |

Two people are present whenever items are packed or handed over, as at intake (VLT-02).

### 4.5 Loading order

1. User-owned items, highest value first.
2. Our own stock that is listed for sale, highest value first.
3. Our own unlisted stock, highest value first.

### 4.6 Drills

- **Tabletop drill every 6 months:** walk through Levels 1 to 3 with the named people and check every contact.
- **Live drill once a year:** time one monthly transfer as if it were Level 2, from declaring the level to the Singapore count. If it takes over 48 hours, lower the cap or fix the bottleneck.
- **Record the result** in `docs/sops/` once the intake procedures exist (VLT-02).

## 5. Other Taiwan risks

- **Earthquake and typhoon:** insured (`custody-comparison.md`, section 6.2). Store items in safes or secured cabinets, never on open shelves; slabs crack when they fall.
- **Theft and staff dishonesty:** two-person rule, filmed intake, a monitored alarm, and the insurer's security conditions. The policy covers employee dishonesty.
- **Customs or tax change:** handled by Compliance. A change that makes holding in Taiwan costly is a reason to lower the threshold.

## 6. What the owner decides

1. **The cap.** Proposed US$1,000,000, with a matching reserve.
2. **The transfer threshold.** Proposed US$2,000.
3. **The soft limit on our own unlisted stock in Taiwan.** Proposed US$1,000,000.
4. **Named people:** two evacuation leads and their backups.
5. **Whether staff in Taiwan get a written safety instruction** beyond this plan. Recommended: yes, from HR or counsel, since it concerns people, not items.
