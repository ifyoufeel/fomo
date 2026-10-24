# Launch policy v1 (contract C6)

Compliance · CMP-01 · 24 Oct 2026 · Version 1.0.0, **draft for the owner's approval and for counsel review**

> **Not legal advice.** Compliance drafts and qualified lawyers decide. This document turns the launch matrix in `docs/briefs/01-project-brief.md` (version 1, 24 Oct 2026) into rules that code can check. It changes no cell of that matrix.
>
> **Source markers.** **[P]** means a primary source checked in this session. **[S]** means a secondary source, such as a law firm note. **[G]** means general knowledge that was not checked against any source in this session. Every [S] and [G] item needs counsel or a primary-source check before Phase 1.

## 1. What this policy does

- **One check inside every domain command:** may this actor take this action, here, now? The answer is *allowed*, or *refused* with one or more reason codes, and every refusal is logged.
- **It encodes:**
  - the launch matrix (feature × market);
  - the standard controls that "Launch" assumes: 18+, KYC tiers, sanctions and wallet screening;
  - the item rules behind matrix rows 16–18.
- **It leaves to others:**

| Topic | Owner |
|---|---|
| KYC triggers, amount limits per tier, screening procedures, record keeping | Compliance, CMP-03 |
| Listing checks and the category allow-list | Compliance, CMP-04; enforced by Admin & content and Vault & redemption |
| Tax and invoicing | Compliance, CMP-06; built by Payments |
| Rollout: phase, invitation list, kill switches | Backend core, through `packages/flags` |
| Required disclosures on screen (buyer's premium and total before a bid, odds) | Interface and Marketplace; texts from CMP-05 |

## 2. Principles

1. **Fail closed.** Anything unknown is refused. That covers an unknown action, a missing or unrecognised country, an unverified location, a missing birth date and pending screening.
2. **The most restrictive jurisdiction wins.** When the user's signals point to more than one country, every one of them must allow the action (section 4.1).
3. **Chance features are off.** Rows 10, 11, 12 and 15 need an activation record (section 5) for each market. Version 1 contains no activation records.
4. **The never list can't be switched on.** Paid raffles (row 13) and staked betting (row 14) are Block in every market, and the activation loader rejects them. The same goes for bid fees, fractional, yield-bearing or lendable tokens, user balances or spendable credit, and packs with an instant cash buyback in Taiwan. No command exists for any of these. Rows 13 and 14 still have IDs, so that an attempt is refused, logged and covered by tests.
5. **Flags can only restrict.** An action runs only if the policy allows it *and* its rollout flag is on. A flag can never turn on something the policy refuses.
6. **The policy is reviewed code, not a setting.** The matrix, jurisdiction lists, age table and activation records live in `packages/compliance`. They change only through a Compliance pull request that the owner approves. The admin panel has no toggle for them.
7. **Every decision leaves a record.** A refusal is logged in full (section 11). An allowed command records the policy version on its audit entry.

## 3. Inputs

| Input | Source | Used for |
|---|---|---|
| Action | Declared by each command (section 9) | Which features and rules apply |
| Time | The command's database transaction, never the app server's clock | Activation start and review dates; age |
| IP country and subdivision | Vercel's `x-vercel-ip-country` and `x-vercel-ip-country-region` headers | User jurisdiction |
| VPN or proxy | A detection service, **not chosen yet** (section 15) | Whether the location can be trusted |
| Residence | Declared at T0; taken from KYC from T1 on | User jurisdiction |
| Birth date | Declared at T0; verified from T1 on, and the verified date wins | Age |
| KYC tier | Sumsub, through BE-05 | Tier floors |
| Person screening | Sanctions and PEP screening at T1 (CMP-03) | Screening gate |
| Wallet screening | TRM or Chainalysis, for the wallet the action uses: the one being linked, the paying wallet, or the holding wallet at redemption | USDC rail, wallet link, resale and redemption |
| Card country | Card BIN country from the payment provider | Blocked-jurisdiction check only |
| Delivery country | Redemption or prize address | Blocked-jurisdiction check, row 3, cross-border item rules |
| Payment rail | C5: `usdc`, `twd_gateway` or `card_checkout` | Rows 4 and 5 |
| Item | C8 policy tags, the item's origin and vault country, the provenance flag (C9) | Rows 16–18, pack-pull rule |

## 4. Jurisdictions

### 4.1 From signals to countries

- **User jurisdictions:** the IP country and the residence country. Every feature cell is checked for each of them, and the most restrictive result wins. A traveller is therefore limited by both places. This is deliberately conservative (see the counsel questions in section 15).
- **Card country** counts only against the blocked lists in section 4.3. CMP-03 may add review rules for mismatches.
- **Delivery country** counts against the blocked lists, against row 3 ("physical redemption") and against the cross-border item rules.
- **No usable user jurisdiction:** refused with `location_unknown`.
- **VPN or proxy detected, or not checked:** refused with `location_unverified`. When the detection service hasn't run, the result counts as "not checked", which keeps this rule fail-closed. Local and preview environments use a stub that reports "not detected".
- **The one exception is `account.open`.** It isn't refused for a VPN. Instead, the IP country stops counting as a user jurisdiction and the declared residence is used. Every other check still applies.
- **A blocked-list match on the IP counts even when a VPN is detected.**

### 4.2 From countries to markets

Countries are ISO 3166-1 alpha-2 codes. Subdivisions are ISO 3166-2 codes. A value that isn't a valid code counts as missing, for example a provider's "XX" or a Tor marker.

| Market | Countries |
|---|---|
| TW | TW |
| US | US (the 50 states and DC). The US territories (PR, GU, VI, AS, MP, UM) count as **Other** until a US Cond. or Counsel cell is turned on; that activation then states whether they are covered |
| JP, KR, HK, SG | Their own code |
| EU | AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE, plus the outermost regions and Åland that have their own codes: GF GP MQ RE YT MF AX. Iceland, Liechtenstein and Norway count as Other |
| UK | GB. Jersey, Guernsey, the Isle of Man and Gibraltar count as Other |
| CN | CN (mainland only; HK, MO and TW are separate) |
| Other | Any other code that isn't on a blocked list |

### 4.3 Blocked jurisdictions

A match on **any** signal (IP, residence, card or delivery) refuses every action, including account creation. Each list entry carries its source and the date it was checked.

**Sanctioned: comprehensive embargoes** (reason `sanctioned_jurisdiction`)

| Code | Place | Basis |
|---|---|---|
| CU | Cuba | US embargo [G] |
| IR | Iran | US, EU, UK and UN sanctions [G] |
| KP | North Korea | US, EU, UK and UN sanctions [G] |
| UA-43, UA-40 | Crimea, Sevastopol | US regional embargo, EU and UK measures [G] |
| UA-14, UA-09 | Donetsk, Luhansk | US regional embargo, EU and UK measures [G] |

**Restricted by this policy: recommended, owner to confirm** (reason `restricted_jurisdiction`)

| Code | Place | Why it's blocked by default |
|---|---|---|
| RU | Russia | EU rules bar crypto-asset service providers from serving Russian nationals and residents [S]. Several regimes ban exports of luxury goods to Russia [G]. Our product is luxury goods paid in crypto |
| BY | Belarus | Measures that mirror the Russia rules [G] |
| SY | Syria | OFAC's comprehensive Syria program ended on 1 July 2025 and Syria's state-sponsor-of-terrorism designation was removed on 24 Aug 2026 [P]. Targeted sanctions remain [P]. Keep it blocked until counsel confirms that unblocking is safe |
| UA-23, UA-65 | Zaporizhzhia, Kherson | EU measures cover the areas outside government control [G]. IP data can't separate those areas, so the whole oblasts are blocked |

- **Review:** monthly and on every sanctions change. Each update is a minor version (section 13).
- **High-risk but not blocked:** for example Myanmar, which is on FATF's call-for-action list [G], and Afghanistan and Venezuela. They follow the Other column, and CMP-03 adds enhanced due diligence.
- **Sanctioned persons** in any country are a screening matter (CMP-03). They reach this policy as `screening: hit`.

## 5. Cell statuses and activation records

| Status | At launch | It turns on only when | The activation records |
|---|---|---|---|
| Launch | On | — | — |
| Cond. | Off | Every condition listed for the cell in section 7 is met | Basis `conditions_met`, with evidence for each condition |
| Counsel | Off | A written opinion from a lawyer qualified in that market covers the feature as built | Basis `counsel_opinion`: an opinion reference (not the opinion itself, which is privileged), the design version, and the controls the opinion requires |
| Defer | Off | A licence, registration or licensed partner is in place and Planning records the decision in an ADR | Basis `licence`, with the licence or partner reference and the ADR |
| Block | Off | Never through an activation. Only Planning changing the matrix in the brief, with the owner, can change a Block cell | — |

**An activation record holds:** an ID, the feature, the market, the basis, its evidence, the countries it covers, any excluded subdivisions, who approved it (the owner), when it was approved, the date it takes effect, a review date, and any extra controls.

The loader rejects, at build and test time:

- an activation on a Block cell, on row 13 or 14, or on anything in the never list;
- one without evidence;
- a Cond. activation that doesn't list every condition for its cell;
- a Counsel activation without an opinion reference;
- an **EU** activation based on national law without a list of member states. Gambling and promotion law isn't harmonised across the EU, so each member state needs its own opinion;
- a review date more than 12 months after approval.

**After the review date the cell is off again (fail closed).** The package warns 30 days before a review date. A US activation may exclude states, for example where sweepstakes need registration.

**Version 1 contains no activation records.**

## 6. The matrix as rules

These are the feature IDs used in code, logs and tests. Statuses come from the brief: **L** Launch, **C** Cond., **N** Counsel, **D** Defer, **B** Block. The Blocked column covers both lists in section 4.3.

| # | Feature ID | TW | US | JP | KR | HK | SG | EU | UK | CN | Other | Blocked |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `own_stock_sales` | L | L | L | L | L | L | L | L | D | L | B |
| 2 | `timed_auctions` | L | L | L | L | L | L | L | L | D | L | B |
| 3 | `vault_tokens_redemption` | L | L | C | L | L | L | L | C | D | L | B |
| 4 | `usdc_own_wallet` | L | L | C | C | C | C | L | L | D | L | B |
| 5 | `card_ewallet_payment` | L | C | C | C | C | C | C | C | D | C | B |
| 6 | `p2p_resale_crypto` | C | C | C | C | C | C | C | C | D | C | B |
| 7 | `p2p_resale_fiat` | D | D | D | D | D | D | D | D | D | D | B |
| 8 | `sell_to_platform` | C | C | C | C | C | C | C | C | D | C | B |
| 9 | `custody_user_funds` | D | D | D | D | D | D | D | D | D | D | B |
| 10 | `packs_usdc` | N | N | N | N | N | N | N | N | B | B | B |
| 11 | `packs_instant_buyback` | B | N | N | B | B | B | B | B | B | B | B |
| 12 | `free_draws` | C | C | C | N | N | N | N | N | B | B | B |
| 13 | `paid_raffles` | B | B | B | B | B | B | B | B | B | B | B |
| 14 | `staked_betting` | B | B | B | B | B | B | B | B | B | B | B |
| 15 | `free_prediction_contest` | C | N | C | N | N | N | N | N | B | B | B |
| 16 | `old_masters` | C | C | C | C | C | C | C | C | D | C | B |
| 17 | `antiquities_relics` | B | B | B | B | B | B | B | B | B | B | B |
| 18 | `protected_wildlife` | B | B | B | B | B | B | B | B | B | B | B |

Row 9 is Defer in the matrix, but D3 says we never hold users' funds. An activation for row 9 therefore also needs D3 changed in the brief.

## 7. Conditions for Cond. cells

A Cond. cell turns on only when **every** condition listed for it has evidence.

**I don't have the research report in this session**, so each cell carries a `research` condition: "the conditions the research report sets for this cell, transcribed here". That condition keeps every Cond. cell off until the report's conditions are copied into this table. The other conditions come from the brief and the starter files.

| Feature | Markets | Condition ID | Condition | Source |
|---|---|---|---|---|
| `vault_tokens_redemption` | JP | `jp-secondhand-dealer` | Counsel confirms whether a second-hand dealer licence is needed, and we hold one if so | CMP-02 (Japan) |
| | JP, UK | `research` | Report conditions | Research report |
| `usdc_own_wallet` | JP, KR, HK, SG | `research` | Report conditions | Research report |
| `card_ewallet_payment` | US, JP, KR, HK, SG, EU, UK, Other | `card-provider-live` | Crossmint or Transak is approved and live for the market, with the Taiwan company as merchant of record | D2, D10, PAY-01 |
| | Same | `research` | Report conditions | Research report |
| `p2p_resale_crypto` | All except CN | `phase-2-gate` | Phase 2 gate passed: clean reconciliation, chargeback controls proven, card checkout live | Brief, Phases |
| | Same | `nft-exclusion` | Counsel confirms that the NFT exclusion keeps resale outside Taiwan's Virtual Asset Service Act, and the D3 registration decision is made | Brief, open questions; D3 |
| | Same | `research` | Report conditions | Research report |
| `sell_to_platform` | All except CN | `phase-2-gate` | As above | D9 |
| | Same | `price-data` | Licensed price data is in place | Brief, budget status |
| | JP | `jp-secondhand-dealer` | As above | CMP-02 (Japan) |
| | Same | `research` | Report conditions | Research report |
| `free_draws` | TW, US, JP | `phase-2-gate` | As above | Brief, Phases |
| | Same | `official-rules` | Free-entry official rules and the prize disclosure are approved by counsel and published | CMP-05 |
| | US | `us-sweepstakes` | Counsel's view on sweepstakes rules, including any state registration or bonding | CMP-02 (US) |
| | JP | `jp-premiums-act` | Counsel's view on prize caps under the Premiums Act | CMP-02 (Japan) |
| | TW, US, JP | `research` | Report conditions | Research report |
| `free_prediction_contest` | TW, JP | `phase-2-gate`, `official-rules`, `research` | As above | Brief; CMP-05 |
| | JP | `jp-premiums-act` | As above | CMP-02 (Japan) |
| `old_masters` | All except CN | `phase-2-gate` | As above | D6 |
| | Same | `provenance-process` | The CMP-04 process is in force: 1933–45 provenance, an Art Loss Register check, an INTERPOL ID-Art search and a source-country export licence | CMP-04 |
| | EU, UK | `art-market-checks` | Art-market checks at €10,000 and £10,000 are in force | CMP-03 |
| | Same | `research` | Report conditions | Research report |

## 8. Controls for each feature

Every user action needs the minimum age. Every action with a KYC floor of T1 or higher needs person screening to be `clear`. Section 9 says which features each action uses.

| # | Feature | KYC floor | Other controls |
|---|---|---|---|
| 1 | `own_stock_sales` | T0 to open an account; T1 to buy | — |
| 2 | `timed_auctions` | T1 | — |
| 3 | `vault_tokens_redemption` | T1 | The holding wallet must screen clear at redemption. The recipient must be the verified account holder. The delivery country is checked |
| 4 | `usdc_own_wallet` | T1 | The wallet must screen clear on link and on each payment. Only the user's own wallet; nothing ever goes into a balance we hold |
| 5 | `card_ewallet_payment` | T1 | — |
| 6 | `p2p_resale_crypto` | T2 to sell, T1 to buy | Wallet screening on both sides; atomic settlement only |
| 7 | `p2p_resale_fiat` | — | Defer: no commands in version 1 |
| 8 | `sell_to_platform` | T2 | Wallet screening. **Never on pack pulls**, in any market. Liquid graded cards only (D9; a Marketplace rule) |
| 9 | `custody_user_funds` | — | Defer: no commands in version 1 |
| 10 | `packs_usdc` | T1 | USDC only, published odds, a value floor, and no buyback in Taiwan |
| 11 | `packs_instant_buyback` | T2 | — |
| 12 | `free_draws` | T0 to enter; T1 to claim a prize | No purchase necessary |
| 13 | `paid_raffles` | — | Never |
| 14 | `staked_betting` | — | Never |
| 15 | `free_prediction_contest` | T0 to enter; T1 to claim a prize | No stake |
| 16 | `old_masters` | T2 | The item has cleared provenance (CMP-04) |
| 17 | `antiquities_relics` | — | Never listed |
| 18 | `protected_wildlife` | — | Never listed. Our model always crosses borders (Singapore vault, users worldwide), so these items aren't taken in at all |

**Provisional tier meanings, until CMP-03 replaces them:**

- **T0:** signed in, with a declared residence and birth date.
- **T1:** ID document and liveness check, verified birth date, sanctions and PEP screening.
- **T2:** T1 plus proof of address, and verified payout details when we pay the user.
- **T3:** enhanced due diligence (source of funds or wealth), with triggers from CMP-03.

**Minimum age:** the highest value across the user's jurisdictions [G, counsel to confirm]:

| Where | Minimum age |
|---|---|
| Default | 18 |
| KR | 19 |
| US-AL, US-NE | 19 |
| US-MS | 21 |

Age is computed on the database's UTC date. Pages anyone can view without an account aren't commands, so this policy doesn't gate them.

## 9. Actions

Each command declares exactly one action. Backend core maps commands to actions in BE-05.

| Action | Actor | Features required | Also checked |
|---|---|---|---|
| `account.open` | User | `own_stock_sales` | Declared birth date and residence |
| `wallet.link` | User | `usdc_own_wallet` | Wallet screening |
| `sale.buy` | User | `own_stock_sales`, `vault_tokens_redemption`, the rail's feature, the item's features | — |
| `auction.bid` (also setting or raising a maximum bid) | User | `timed_auctions`, `vault_tokens_redemption`, the rail's feature, the item's features | — |
| `vault.redeem` | User | `vault_tokens_redemption`, for the user's jurisdictions **and** the delivery country; the rail's feature when a fee is paid | Recipient, cross-border item rules, wallet screening |
| `resale.list` | User | `p2p_resale_crypto`, the item's features | Tier T2 |
| `resale.buy` | User | `p2p_resale_crypto`, `usdc_own_wallet`, the item's features | — |
| `buyback.sell` | User | `sell_to_platform` | The item isn't a pack pull |
| `pack.buy` | User | `packs_usdc`, `usdc_own_wallet` | — |
| `pack.instant_buyback` | User | `packs_instant_buyback` | — |
| `draw.enter` | User | `free_draws` | — |
| `draw.claim_prize` | User | `free_draws`; `vault_tokens_redemption` for the delivery country when the prize ships | — |
| `contest.enter` | User | `free_prediction_contest` | — |
| `contest.claim_prize` | User | `free_prediction_contest`; `vault_tokens_redemption` for the delivery country when the prize ships | — |
| `catalog.publish_item` | Operator | — | Item rules |
| `vault.intake` | Operator | — | Item rules |
| `raffle.*`, `bet.*`, `resale_fiat.*`, `custody.*` | — | Rows 13, 14, 7 and 9 | No commands exist. The IDs exist so that an attempt is refused and tested |

**Rails:**

| Rail | Feature |
|---|---|
| `usdc` | `usdc_own_wallet` |
| `twd_gateway` | `card_ewallet_payment` |
| `card_checkout` | `card_ewallet_payment` |

**Item rules**, using the policy tags carried by C8:

- **`antiquity`, `cn_cultural_relic`, `ivory`, `rhino_horn` or `tortoiseshell`:** refused for every action (`item_blocked_category`).
- **`old_master`:**
  - For buyers, `old_masters` is checked per market.
  - `catalog.publish_item` needs the item's provenance to be cleared, and `old_masters` to be on in at least one market.
- **`cites_exotic_leather`:** refused when the delivery country differs from the vault country, until the strap is swapped and the tag removed (CMP-04).
- **Origin `pack_pull` with `buyback.sell`:** refused everywhere (`pack_pull_not_eligible`).

**Operator actions** skip the user checks (location, age, KYC, screening) and apply only the item rules.

**Token transfers outside our platform can't be gated here.** Users can export keys, so redemption is the control point: the person redeeming must pass every check, and their holding wallet must screen clear. Smart contracts and Vault & redemption should design for this.

## 10. How a decision is made

The checks run in this order. Every refusal found is returned, and the first one is the reason shown to the user. Market checks come before KYC, so nobody pays for an identity check on something they can't use where they are.

1. **Unknown action:** `unknown_action`.
2. **Row 13 or 14, or the never list:** `never_permitted`.
3. **A signal on a blocked list:** `sanctioned_jurisdiction` or `restricted_jurisdiction`.
4. **User actions only:**
   - no user jurisdiction: `location_unknown`;
   - VPN or proxy detected, or not checked: `location_unverified`. For `account.open`, the IP country is dropped instead (section 4.1).
5. **Each required feature × each relevant market** (section 9): Launch passes. A Cond., Counsel or Defer cell passes only with an activation record that is in effect, and that covers the country and isn't excluded for its subdivision. Otherwise the refusal is `conditions_not_met`, `awaiting_counsel`, `market_deferred` or `market_blocked`.
6. **Item rules:**
   - `item_blocked_category`;
   - `item_not_cleared`;
   - `pack_pull_not_eligible`;
   - `cross_border_restricted`.
7. **Age** (user actions):
   - no birth date: `age_unknown`;
   - below the minimum: `under_age`.
8. **KYC tier below the floor:** `kyc_tier_required`, which names the tier needed so BE-05 can start the right Sumsub level.
9. **Person screening**, for actions with a floor of T1 or higher:
   - pending or not run: `screening_pending`;
   - a hit: `screening_hit`.
10. **Wallet screening**, where the action needs it:
    - pending: `wallet_screening_pending`;
    - a hit: `wallet_screening_hit`.
11. **Recipient** isn't the verified holder: `recipient_mismatch`.

## 11. Refusals: codes, logging and messages

### 11.1 What users see

The rules for messages:

- The text never mentions wallets, tokens or chains.
- After a screening hit it never says why, so the user isn't tipped off.
- It says "country or region".

The translations are drafts that need review by native speakers. Interface owns the final text in `packages/i18n`.

| Key | en | zh-TW | ja |
|---|---|---|---|
| `policy.unavailable_region` | This isn't available in your country or region yet. | 此功能目前尚未在您所在的國家或地區開放。 | この機能は、お住まいの国・地域ではまだご利用いただけません。 |
| `policy.payment_method_unavailable` | This payment method isn't available in your country or region. Choose another one. | 您所在的國家或地區無法使用此付款方式，請選擇其他付款方式。 | お住まいの国・地域ではこのお支払い方法をご利用いただけません。別の方法をお選びください。 |
| `policy.delivery_unavailable` | We can't deliver to this country or region yet. | 我們目前尚無法配送至此國家或地區。 | 現在、この国・地域への配送には対応していません。 |
| `policy.location_unverified` | We couldn't confirm your location. Turn off any VPN or proxy and try again. | 我們無法確認您的所在位置。請關閉 VPN 或代理伺服器後再試一次。 | 現在地を確認できませんでした。VPN やプロキシをオフにして、もう一度お試しください。 |
| `policy.age_required` | You must be {minAge} or older to use this. | 您必須年滿 {minAge} 歲才能使用此功能。 | ご利用には{minAge}歳以上である必要があります。 |
| `policy.verify_identity` | Verify your identity to continue. | 請先完成身分驗證以繼續。 | 続行するには本人確認を完了してください。 |
| `policy.checking` | We're still checking your details. Please try again shortly. | 我們仍在核對您的資料，請稍後再試。 | お客様の情報を確認しています。しばらくしてから、もう一度お試しください。 |
| `policy.item_not_eligible` | This item isn't eligible for this option. | 此商品不適用此選項。 | この商品はこのオプションの対象外です。 |
| `policy.recipient_must_match` | Deliveries go to the verified account holder. Use your own name as the recipient. | 商品僅能配送給已驗證身分的帳戶持有人，請以您本人姓名作為收件人。 | お届け先は本人確認済みのアカウント名義人に限られます。受取人にはご本人のお名前をご指定ください。 |
| `policy.unavailable` | This isn't available for your account. Contact support if you think this is a mistake. | 您的帳戶目前無法使用此功能。如您認為有誤，請聯絡客服。 | お客様のアカウントではご利用いただけません。誤りと思われる場合は、サポートまでお問い合わせください。 |

### 11.2 Reason codes

| Code | Message key |
|---|---|
| `unknown_action`, `never_permitted`, `screening_hit`, `wallet_screening_hit` | `policy.unavailable` |
| `sanctioned_jurisdiction`, `restricted_jurisdiction` | `policy.unavailable_region` |
| `location_unknown`, `location_unverified` | `policy.location_unverified` |
| `market_blocked`, `market_deferred`, `awaiting_counsel`, `conditions_not_met` | `policy.payment_method_unavailable` when the feature is a rail; `policy.delivery_unavailable` when the market comes from the delivery country; otherwise `policy.unavailable_region` |
| `item_blocked_category`, `item_not_cleared`, `pack_pull_not_eligible` | `policy.item_not_eligible` |
| `cross_border_restricted` | `policy.delivery_unavailable` |
| `under_age` | `policy.age_required` |
| `age_unknown`, `kyc_tier_required` | `policy.verify_identity` |
| `screening_pending`, `wallet_screening_pending` | `policy.checking` |
| `recipient_mismatch` | `policy.recipient_must_match` |

### 11.3 The refusal record

- **Fields:**
  - decision ID and database time;
  - policy version;
  - action, command name and idempotency key;
  - actor ID and actor kind;
  - every reason, with its feature, market and country where they apply;
  - the signals as countries and subdivisions: IP, residence, card and delivery, plus the VPN result;
  - KYC tier;
  - the minimum age and whether the age check passed;
  - screening statuses;
  - the item ID and tags.
- **Not stored:** birth date, document numbers, names or raw IP addresses. Those stay with the KYC and security systems under CMP-03 retention.
- **Must survive the command's rollback.** A refused command writes nothing else, but its refusal record has to persist (BE-05).
- **Retention:** set by CMP-03. Five years is the working assumption, which is common for AML records [G].

## 12. Tests: the "Done when" for code

- **An independent oracle.** The test suite transcribes the matrix from the brief as its own literal table. It never imports the package's data, so a wrong cell can't pass by agreeing with itself.
- **Every cell, 18 features × 10 markets:**
  - With no activation records, a Launch cell is allowed when every standard control passes. Every other status is refused with its own code.
  - With a valid activation, Cond., Counsel and Defer cells are allowed. For Block cells, the loader rejects the activation.
- **The blocked lists.** Every entry, through every signal type (IP, residence, card, delivery), refuses every action.
- **Boundaries:**
  - **Tier:** one tier below the floor is refused and names the required tier; the floor itself is allowed.
  - **Age:** the day before the minimum age is refused and the birthday is allowed, including KR at 19 and US-MS at 21.
- **Jurisdiction:**
  - TW residence with a JP IP is limited by JP;
  - VPN detected and VPN not checked are both refused, except `account.open`, which falls back to the declared residence;
  - a blocked IP counts even behind a detected VPN;
  - no signal at all is refused;
  - a US territory counts as Other, and an EU outermost region counts as EU.
- **Item rules.** Each tag is covered, and so are pack-pull buyback, CITES straps across a border and a recipient mismatch.
- **Activation loader.** Every rejection in section 5 is covered, including expiry at the review date, judged by the database time passed in.
- **Messages.** Every reason code maps to a message key, and every key exists in zh-TW, en and ja.
- **Determinism.** A property test shows that the same request always gives the same decision. Branch coverage of the evaluation is 100%.
- **In BE-05, Backend core** adds three things:
  - a CI check that fails any command without a declared action;
  - a test that a refused command leaves its refusal record after rollback;
  - one end-to-end refusal per reason family on a preview.

## 13. Versions and change control

The package exports `POLICY_VERSION`, and every decision records it. The changelog lives in the package.

| Change | Version step | Who decides |
|---|---|---|
| A matrix cell or a hard rule | Major | Planning changes the brief, with the owner; Compliance implements |
| An activation added, expired or removed; a blocked-list or age-table update | Minor | Compliance proposes; the owner approves in the pull request |
| A fix that changes no decision | Patch | Compliance |
| The C6 interface (section 14) | Any | Planning approves |

## 14. Interface sketch (C6 v0, for BE-05)

This is a pure TypeScript library with no I/O and no database access. The data are typed constants, and `evaluate` is synchronous and deterministic. Backend core collects the signals and persists the records.

```ts
// FeatureId, ActionId, RefusalCode and MessageKey are string unions of the
// names in sections 6, 9, 11.2 and 11.1.
export const POLICY_VERSION = '1.0.0';

export type Market = 'TW' | 'US' | 'JP' | 'KR' | 'HK' | 'SG' | 'EU' | 'UK' | 'CN' | 'OTHER';
export type CellStatus = 'launch' | 'cond' | 'counsel' | 'defer' | 'block';
export type KycTier = 0 | 1 | 2 | 3;
export type Screening = 'clear' | 'pending' | 'hit'; // absent means pending
export type Rail = 'usdc' | 'twd_gateway' | 'card_checkout';
export type ItemTag =
  | 'old_master' | 'antiquity' | 'cn_cultural_relic'
  | 'ivory' | 'rhino_horn' | 'tortoiseshell' | 'cites_exotic_leather';

export interface Place {
  country: string; // ISO 3166-1 alpha-2
  subdivision?: string; // ISO 3166-2, e.g. 'US-NE', 'UA-43'
}

export interface PolicyRequest {
  action: ActionId; // section 9
  now: Date; // database time from the command's transaction
  actor:
    | { kind: 'operator'; staffId: string }
    | {
        kind: 'user';
        userId: string;
        kycTier: KycTier;
        birthDate?: string; // YYYY-MM-DD; verified from T1, declared at T0
        residence?: Place;
        screening?: Screening;
      };
  location?: { ip?: Place; vpn: 'detected' | 'not_detected' | 'unchecked' };
  payment?: { rail: Rail; cardCountry?: string };
  wallet?: { screening?: Screening }; // the linked, paying or holding wallet
  item?: {
    id: string;
    tags: ItemTag[];
    origin: 'own_stock' | 'pack_pull' | 'resale';
    vaultCountry: string;
    provenanceCleared?: boolean;
  };
  delivery?: Place & { recipientIsHolder: boolean };
}

export interface Refusal {
  code: RefusalCode; // section 11.2
  messageKey: MessageKey; // section 11.1
  feature?: FeatureId;
  market?: Market;
  country?: string;
  requiredTier?: KycTier;
  minAge?: number;
}

export type Decision =
  | { allowed: true; policyVersion: string; markets: Market[] }
  | { allowed: false; policyVersion: string; reasons: [Refusal, ...Refusal[]] };

export function evaluate(request: PolicyRequest): Decision;

// For Interface: what a visitor or user may use here, so the UI can hide or explain features.
export function availability(
  request: Omit<PolicyRequest, 'action' | 'item' | 'payment' | 'delivery'>,
): Record<FeatureId, 'available' | 'verify_identity' | 'unavailable'>;
```

## 15. Open items

### What the matrix means for Phase 1

These follow directly from the matrix and section 9. Planning should see them.

1. **JP and UK users can't buy until row 3's conditions are met.** Every sale or winning bid creates a token holding (row 3), and row 3 is Cond. in JP and UK. If the report's row-3 conditions concern only physical redemption, Planning could split row 3 into "token holding" and "redemption" in the brief.
2. **JP, KR, HK and SG have no payment method at launch.** USDC (row 4) and cards (row 5) are both Cond. there.
3. **Taken together, at Phase 1 purchases work for:** TW (USDC and the TWD gateway), and the US, EU and Other (USDC only).
4. **The EU Counsel cells** (rows 10, 12 and 15) need opinions member state by member state, not one EU opinion.
5. **The VPN rule blocks every transaction until a detection service is wired in.** Phase 1 needs one.

### Questions for the owner

1. **Restricted list.** Confirm that RU, BY, SY, UA-23 and UA-65 are blocked by default (section 4.3).
2. **VPN and proxy detection.** No service is chosen or funded. Options include MaxMind GeoIP2 Anonymous IP or IPinfo's privacy detection [G: pricing not checked]. Until one is chosen, the policy refuses transactions as "location not verified".
3. **The research report.** Attach `Web3 collectibles platform scope.md` to the next Compliance session, or ask Planning to commit it to `docs/briefs/`. I need it to transcribe the `research` conditions in section 7.
4. **KYC floors** (section 8). Approve them now as provisional, or wait for CMP-03.

### Questions for counsel (these seed CMP-02)

1. **Age.** Is 18, or the local age of majority, enough for every market, including Other? Do any of our features need a higher age?
2. **Location.** Should the user's IP location or their residence govern? Is blocking by IP region enough for the occupied areas of Ukraine?
3. **Nationality.** Do restrictions based on nationality, such as the EU's Russia crypto rules, reach a Taiwan operator? If so, should KYC nationality become a signal?
4. **US territories.** Should they follow US rules?
5. **Syria.** Can it be unblocked, and with what screening?
6. **Taiwan.** Does the NFT exclusion wording keep row 3 tokens, and later row 6 resale, outside the Virtual Asset Service Act?

## Sources checked in this session

- OFAC, Syria Sanctions FAQs: https://ofac.treasury.gov/faqs/topic/1571 [P]
- OFAC, Syria-related sanctions (PAARSS): https://ofac.treasury.gov/sanctions-programs-and-country-information/syria-related-sanctions [P]
- OFAC, recent action of 24 Aug 2026 (Syria's state-sponsor-of-terrorism designation removed): https://ofac.treasury.gov/recent-actions/20260824 [P]
- Baker McKenzie, "European Union sanctions compliance for crypto assets" (Sept 2026): https://www.bakermckenzie.com/en/insight/publications/2026/09/european-union-sanctions-compliance-for-crypto-assets [S]
