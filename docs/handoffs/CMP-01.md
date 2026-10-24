# Handoff: CMP-01 Launch policy v1

Compliance · CMP-01 · 24 Oct 2026

## Status

**Partly done.**

- **Done:** the policy document, which is the first half of the card. It is a draft for the owner's approval and for counsel review.
- **Not started:** the code in `packages/compliance`.
  - The start-here file says no other code chat starts before BE-01 merges, and the BE-01 pull request is still a draft: https://github.com/ifyoufeel/fomo/pull/1.
  - The card's "Done when" (Backend core calls the policy from every command, and tests cover every matrix cell) needs this code and BE-05.

## What changed

- **Branch:** `claude/epic-knuth-edjlev`, from `main`. It touches only `docs/legal/` and `docs/handoffs/`, so it won't conflict with BE-01.
- **Pull request:** https://github.com/ifyoufeel/fomo/pull/3 (draft).
- **`docs/legal/launch-policy.md`**, version 1.0.0. It covers:
  - Principles: fail closed, the most restrictive jurisdiction wins, the never list can't be switched on, and flags can only restrict.
  - Inputs, and how signals map to countries and markets, with ISO codes for every market.
  - Blocked jurisdictions: comprehensive sanctions, plus a "restricted, owner to confirm" list.
  - How Cond., Counsel and Defer cells turn on through activation records, and what the loader rejects. Version 1 has no activation records.
  - The matrix as rules, with feature IDs, and the conditions for every Cond. cell.
  - Controls per feature: KYC floor, minimum age and screening.
  - The action catalogue, rails, item rules and the order of checks.
  - Reason codes, the refusal record, and user messages drafted in zh-TW, en and ja.
  - The test plan, version control, and a TypeScript interface sketch (C6 v0) for BE-05.
  - Open items.
- **`docs/handoffs/CMP-01.md`**: this note.

## Checks run

- **Matrix.** A script compared all 180 cells (18 features × 10 markets) in the policy against the brief's launch matrix and found 0 mismatches.
- **Cond. cells.** Every one has a row in the policy's conditions table (section 7), checked by hand against the matrix.
- **Sources.** Three OFAC pages [P] and one law-firm note [S]; they're listed at the end of the policy. Every other legal claim is marked [G], meaning general knowledge not checked in this session.
- **Not run:**
  - `pnpm check`: there's no code yet, and `main` has no tooling until BE-01 merges.
  - A fresh-context review against "Done when": that "Done when" is about code and can't be reached yet.

## What the policy means for Phase 1 (Planning should see these)

1. **JP and UK users can't buy at launch.** Every sale or winning bid creates a token holding, which is row 3, and row 3 is Cond. in JP and UK.
2. **JP, KR, HK and SG have no payment method at launch.** USDC (row 4) and cards (row 5) are both Cond. there.
3. **So at Phase 1, purchases work only for:** TW (USDC and the TWD gateway), and the US, EU and Other (USDC only).
4. **The EU Counsel cells need an opinion per member state.** These are rows 10, 12 and 15. Gambling and promotion law isn't harmonised.
5. **Transactions are refused until a VPN or proxy detection service is wired in.** The rule is fail-closed, so Phase 1 needs one.
6. **The D3 deadline is close.** D3 sets "before Q1 2027" for the virtual-asset service provider decision, about 10 weeks from today. That question should probably join the Phase 1 minimum set of opinions (CMP-02).

## Change requests for Planning

1. **Starter kit.** Add `12-compliance.md` to `docs/briefs/`, since `packages/compliance/CLAUDE.md` points there. This joins BE-01's change request 1. Please also add the research report, `Web3 collectibles platform scope.md`. Section 7 can't be finished without it.
2. **Contracts index.** In `docs/contracts/README.md`, mark C6 as "v0 draft: `docs/legal/launch-policy.md`, section 14" until the package lands.
3. **Backend core (BE-05):**
   - Every command declares one policy action, and a CI check fails any command without one.
   - Commands pass database time to the policy.
   - Commands collect the signals:
     - IP country and region from Vercel's headers;
     - the VPN result;
     - KYC residence and birth date;
     - card BIN country;
     - delivery country;
     - screening statuses.
   - A refused command's refusal record must survive the rollback.
   - Flags can only restrict what the policy allows.
4. **Admin & content (C8).** Items carry policy tags (`old_master`, `antiquity`, `cn_cultural_relic`, `ivory`, `rhino_horn`, `tortoiseshell`, `cites_exotic_leather`) and an origin (`own_stock`, `pack_pull`, `resale`).
5. **Vault & redemption (C9).** Items carry `vaultCountry` and a provenance-cleared flag.
6. **Payments (C5).** Rail IDs are `usdc`, `twd_gateway` and `card_checkout`, and the card BIN country reaches the command.
7. **Interface.** Take the ten `policy.*` message keys into `packages/i18n` after native review. Use `availability()` to hide features a user can't use.
8. **Smart contracts (SC-01).** Users can move tokens off the platform, so redemption is the compliance control point: the holding wallet is screened when a redemption is requested.
9. **The brief.** Once the research report's row-3 conditions are known, consider splitting row 3 into "token holding" and "physical redemption". If JP's and UK's conditions concern only redemption, buying could open there sooner.

## Decisions I made inside my area

- **Names.** Feature IDs, action IDs, reason codes and message keys, as listed in the policy.
- **Jurisdictions:**
  - Every feature cell is checked for both the IP country and the residence, and the more restrictive wins.
  - Card country counts only against the blocked lists.
  - Delivery country counts against the blocked lists, row 3 and the cross-border item rules.
- **Markets:**
  - US territories, Iceland, Liechtenstein, Norway, the Crown Dependencies and Gibraltar count as Other.
  - The EU's outermost regions and Åland count as EU.
- **VPN.** A detected VPN, or a check that hasn't run, refuses every action except `account.open`, which falls back to the declared residence.
- **Activation records:**
  - They live in code and change only through a pull request the owner approves.
  - Each needs a review within 12 months, or the cell switches off again.
  - An EU activation based on national law must list its member states.
- **Order of checks.** Market checks run before KYC, so nobody pays for an identity check on something they can't use.
- **Refusal records** don't store birth dates, document numbers, names or raw IP addresses.
- **KYC floors and tier meanings (T0–T3)** are provisional until CMP-03.
- **Minimum age** is 18, or a higher local age of majority (KR 19; US-AL and US-NE 19; US-MS 21) [G].

## Questions for the owner

1. **Restricted list.** Do you agree to block Russia, Belarus, Syria, and Ukraine's Zaporizhzhia and Kherson oblasts by default? The policy's section 4.3 gives the reasons. Recommended: yes, until counsel reviews.
2. **VPN and proxy detection.** No service is chosen or funded; options include MaxMind GeoIP2 Anonymous IP and IPinfo privacy detection [G]. Until one is chosen, transactions are refused as "location not verified". Recommended: choose one before Phase 1, with a test stub until then.
3. **The research report.** Please attach it to the next Compliance session, or have Planning commit it.
4. **KYC floors.** Approve them now as provisional, or wait for CMP-03? Recommended: provisional now, so BE-05 can plan against them.

## What I need for CMP-02 (lawyer briefs and minimum budget)

1. **The research report**, for the evidence and sources each brief cites.
2. **A budget ceiling** for the Phase 1 opinions, and the currency to quote in, or permission to propose one from typical fee ranges.
3. **Counsel.** Any firms you already use or prefer in Taiwan, the US and Japan. Otherwise I'll propose selection criteria and a shortlist to research. I won't contact anyone.
4. **Company facts lawyers will ask for:**
   - the Taiwan company's legal form and registered business items (營業項目);
   - any registrations it already holds, for example an AML registration for virtual-asset business [G];
   - where the staff work;
   - the target date for Phase 1;
   - rough Phase 1 volumes per market.
5. **Product facts from other chats:**
   - the pack design and sale rules (MKT-01);
   - the custody structure and vault terms (VLT-01);
   - the chosen payment providers (PAY-01);
   - the redemption and cancellation flow.
6. **The Phase 1 minimum set.** Please confirm it, or tell me to cut it. I'd propose four Taiwan opinions:
   - the 7-day cancellation right for vaulted goods, including whether refundable bidder deposits count as stored value;
   - export zero-rating for items kept in the vault;
   - the D3 virtual-asset service provider question, given the deadline;
   - the NFT exclusion.

   The US and Japan opinions, and Taiwan's gambling reach, would wait until before the feature that needs them.

## Next task I'd take

1. **CMP-01 code**, in `packages/compliance`, as soon as BE-01 merges. It is a pure library with the test plan in section 12 of the policy.
2. **Meanwhile, CMP-04** (listing rules and the category allow-list), because ADM-01 waits on it.
3. **Then CMP-03** (KYC, AML and sanctions), which replaces the provisional floors before BE-05.
4. **CMP-02** once the inputs above arrive.
