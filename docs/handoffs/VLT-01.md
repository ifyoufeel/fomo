# Handoff: VLT-01 Custody and insurance quotes

Vault & redemption · VLT-01 · 24 Oct 2026

## Status

**Done.** The comparison, the recommendation and the cost ranges for the owner's budget are ready. So are the quote requests, the Taiwan cap and the evacuation plan. Nothing has been sent: the owner sends each request after the rulings and facts below.

## What changed

- **Branch:** `claude/sleepy-hopper-0w9kuu`, from `main`. It touches only `docs/vault/` and `docs/handoffs/`, so it won't conflict with BE-01, DES-01, CMP-01 or PAY-01.
- **Pull request:** https://github.com/ifyoufeel/fomo/pull/5 (draft).
- **`docs/vault/README.md`:** the folder index, placeholders and source markers.
- **`docs/vault/custody-comparison.md`:**
  - the recommendation, and eight findings that need a ruling;
  - how custody works in our model;
  - comparisons for Singapore, Hong Kong, the Taiwan hub and the US satellite;
  - insurance: what the custodians cover, what our policy must add, war and political violence, where the policy can be placed, and the broker shortlist;
  - costs at three sizes, a scoring sheet for the quotes, open risks, and sources.
- **`docs/vault/risk-limits.md`:** the Taiwan cap and transfer threshold; how they are measured and enforced; the evacuation plan (standing preparations, levels and triggers, actions, roles, loading order, drills); and the owner's decisions.
- **`docs/vault/quote-requests/`:**
  - `malca-amit.md` and `brinks.md`. Each has a checklist, what we ask for, the documents they'll want, the message ready to send, questions for the call, and what not to say.
  - `taiwan-hub.md`: letters in zh-TW and English to a free-trade-zone operator and to bonded warehouses, plus questions for the customs broker and counsel.
  - `psa-vault.md`: business-account questions for Phase 2, and how to read the answer.
  - `insurance-broker.md`: how to appoint one broker, and the risk presentation with the war questions.

## Recommendation in short

- **Singapore:** quotes from Brink's and Malca-Amit in parallel, both at Le Freeport.
  - Brink's leads on fit: it has vaults in Taiwan, Singapore, Hong Kong and the US, and already holds the cards behind Courtyard's tokens.
  - Choose on the quotes, using the scoring in the comparison's section 8.
- **Hong Kong:** a price check only. No user-owned items there, because its risk moves with Taiwan's.
- **Taiwan hub:** the Taoyuan Air Cargo Free Trade Zone is the target, a bonded warehouse the second choice, and Brink's Taiwan's vault the fallback. Counsel's export-tax answer and the insurer's security requirements decide.
- **US (Phase 2):** PSA Vault if it will take a business account and sign counts; otherwise Brink's US.
- **Insurance:** appoint one broker, starting with a call to Gallagher (London specie team plus a Taiwan brokerage). Expect no war cover on land in Taiwan; the cap and the evacuation plan carry that risk.
- **Budget:** about US$32,000–143,000 a year at US$1M vaulted, and 0.6–2.3% of value at US$20M, plus US$15,000–60,000 one-off. These are estimates; the quotes replace them.

## Checks run

- **Card coverage.** Each part of VLT-01 maps to a section, checked by hand:

| Card asks for | Where |
|---|---|
| Quotes from Malca-Amit and Brink's, Singapore and Hong Kong | `quote-requests/malca-amit.md`, `brinks.md`; comparison 5.1, 5.2 |
| Taiwan hub options, free trade zone or bonded | `quote-requests/taiwan-hub.md`; comparison 5.3 |
| PSA Vault terms | `quote-requests/psa-vault.md`; comparison 5.4 |
| Specie or fine-art cover through a Lloyd's broker | `quote-requests/insurance-broker.md`; comparison 6 |
| War exclusions checked | Comparison 6.3; broker questions 2, 3 and 5 |
| A cap on user-owned value in Taiwan, and an evacuation plan | `risk-limits.md` |
| Don't contact vendors; drafts for the owner | Nothing sent; every file says so |
| Comparison, recommendation and costs for the budget | Comparison 1, 5, 7 and 8 |

- **The starter brief's rules.** The cap and evacuation plan, origin recorded at intake, antiquities and ivory refused, and graded-only cards are all reflected in the comparison's section 4 and in `risk-limits.md`. Checked by hand.
- **Cost arithmetic.** A script recomputed every figure in section 7.2 from the assumptions in 7.1 and matched the table after rounding.
- **zh-TW letter.** It has the same five sections as the English version; I compared them by hand. A native speaker should still read it before it's sent.
- **Links.** Every file and section the documents point to exists, checked by script.
- **Sources.** Each fact carries [P], [S], [G] or [E], and the comparison lists its sources. This session's network policy blocked direct page fetches (for example `www.malca-amit.com` and `sg.brinks.com`), so every source was read through search-result summaries. **Re-check every [P] and [S] fact on the live page before it goes into a request.**
- **Not run:**
  - `pnpm check`, CI and Vercel previews: not applicable. These are Markdown files only, and `main` has no tooling until BE-01 merges.
  - A separate fresh-context review against "Done when". I checked against "Done when" in this session.

## Change requests for Planning

1. **Hong Kong (D8 and the brief's "Custody" line), which affects the brief and Compliance (CMP-02).** Singapore should be the only third-party vault for user-owned items. Hong Kong would get a price check only. See the comparison's finding 1.
2. **The Phase 1 gate.** Add to "vault insurance in place":
   - the Singapore vault account is open, because it is the evacuation destination (finding 2);
   - the owner has set the Taiwan cap and its reserve;
   - the evacuation plan's standing preparations are done (`risk-limits.md`, section 4.1).
3. **Compliance (CMP-02, the Taiwan lawyer's questions).** Add:
   - whether holding stock in a free trade zone or bonded warehouse answers the export zero-rating question (finding 6);
   - whether property in Taiwan must be insured by a Taiwan-licensed insurer (finding 4);
   - how custody contracts and insurance should name token holders' interest (finding 8).
4. **Compliance (CMP-04).** A buying rule for watches: no exotic-leather straps, or the seller swaps the strap before shipping (finding 7). Today's policy handles the strap only at delivery, but our items cross two borders before then.
5. **Admin & content and Marketplace.**
   - **The guard:** a listing guard on Taiwan exposure. At 90% of the cap, no new listing of a Taiwan-held item until exposure falls under 70% (`risk-limits.md`, section 3).
   - **The data:** Vault & redemption supplies the exposure figure in `packages/core/src/vault/`. C9 (VLT-03) will carry `vaultCountry`, the owner type and the current value.
6. **A folder for vault documents.** Please add `docs/vault/` (owner: Vault & redemption) to the brief's repo layout and to the root CLAUDE.md ownership table. This is the same kind of request as PAY-01's `docs/payments/`.
7. **PLN-07, the budget.** The cost ranges in the comparison's section 7 are the input for "vault insurance and fees".

## Decisions I made inside my area

- **Parallel Singapore quotes,** with Brink's leading on fit and a scoring sheet for the final choice. Weights: liability 25, proof of reserve 20, network and evacuation 20, price 20, operations 15.
- **The Taiwan hub:** the free trade zone is the target; Brink's Taiwan is the fallback. Our own premises with our own safe is not recommended.
- **What may stay in Taiwan:** watches, luxury goods and art never stay in Taiwan after intake. Only items below the threshold do, under the cap.
- **Proposed limits, for the owner to set:**
  - a US$1,000,000 cap, with a matching reserve;
  - a US$2,000 threshold;
  - a US$1,000,000 soft limit on our own unlisted stock in Taiwan.
- **What counts toward the cap:** listed own stock counts, because a sale can turn it into user-owned value at any moment.
- **Evacuation:** three levels with named triggers, a 72-hour move at Level 2 (or before war-cover cancellation takes effect), and people before items.
- **Transfers** to Singapore are batched monthly.
- **One broker,** asked for indications first, with binding after the custodian is chosen.

## Questions for the owner

1. **Approve the plan:**
   - quotes from Brink's and Malca-Amit;
   - letters to the free-trade-zone operator and two or three bonded warehouses;
   - the PSA questions;
   - short calls with two brokers (Gallagher first), then appointing one.

   Recommended: yes.
2. **Facts for the requests:**
   - the company's legal name and registration documents;
   - the start date and the Phase 2 date;
   - the expected value held, item count and highest single item value;
   - transfer and delivery volumes;
   - the size of the Taiwan intake room.
3. **Limits** (`risk-limits.md`, section 6): the cap, the threshold and the soft limit on own stock. Recommended: US$1,000,000, US$2,000 and US$1,000,000, with a US$1,000,000 reserve.
4. **People:** two evacuation leads and their backups.
5. **Budget:** fund vault fees and insurance in the range above before Phase 1. They are a Phase 1 gate, and the Singapore minimums start as soon as the first user-owned item is stored in Taiwan.

## Next task I'd take

1. **VLT-03 Item record and states (C9 v0)**, in `docs/contracts/redemption.md`. Smart contracts (SC-01) and Admin & content (ADM-01) wait on it. It will carry the fields this task needs: `vaultCountry`, owner type, fair-market value, and the location in the hub for the evacuation manifest.
2. **Then VLT-02 Intake procedures**, in `docs/sops/`, including the filmed two-person receipt and the dry run.
3. **Then VLT-05 Valuation sources**, which set the one fair-market value behind the insured, declared and buyback values.
