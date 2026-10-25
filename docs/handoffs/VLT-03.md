# Handoff: VLT-03 Item record and states (C9)

Vault & redemption · VLT-03 · 25 Oct 2026

## Status

**Done, as a v0 draft:** `docs/contracts/redemption.md`, version 0.1.0.

The card's "Done when" is that Smart contracts and Admin & content build against it. That can only be confirmed once SC-01 and ADM-01 start, and both are Wave 2 chats that also wait on Backend core (BE-02, BE-04).

## What changed

- **Branch:** `claude/sleepy-hopper-0w9kuu`, the same branch as VLT-01.
  - This session can push only to that branch, so VLT-03 shares pull request https://github.com/ifyoufeel/fomo/pull/5 (draft) as a separate commit with its own handoff note.
  - It touches only `docs/contracts/redemption.md` and `docs/handoffs/`.
- **`docs/contracts/redemption.md`**, C9 v0:
  - **Scope:** what the contract covers, what it leaves to C1–C8, and its principles.
  - **Intake record:** five statuses; the fields for pre-registration, receiving, authentication by category and recording; the acceptance rules; the rejection reasons.
  - **Vault item record:** identity, physical facts, the single fair-market value, custody, the token, the state, locks and the derived owner. It also defines how Taiwan exposure is computed.
  - **Item-to-token link:** the token ID, a salted item digest written at mint, and what goes into ERC-721, ERC-7578, ERC-6982, ERC-4906 and the token metadata.
  - **States:** VAULTED, LISTED, LOCKED, IN_REDEMPTION and REDEEMED, with every allowed and forbidden transition, chain timing, and user labels drafted in en, zh-TW and ja.
  - **Locks:** four reasons, who sets and clears each, and how several reasons combine.
  - **Custody:** sites, and moves between vaults.
  - **Redemption:** the steps as a v0 outline for VLT-04.
  - **For the code chats:** the commands, proposed C3 event names, a section on what each chat builds against, a TypeScript sketch, and nine open items.

## Checks run

- **State transitions.** A script checked that every pair of the five states is either an allowed transition or explicitly forbidden: 0 gaps.
- **References.** Every file and section reference in the spec resolves, checked by script.
- **Fields other chats asked for:**
  - Compliance's change request 5 in CMP-01: `vaultCountry` and the provenance-cleared flag. Both are in section 4.
  - The policy's `origin` field: mapped from `acquisitionChannel`, with a naming question in open item 5.
  - Payments' change request 5 in PAY-01: locking in the settlement transaction. This is the LISTED-to-LOCKED transition.
  - VLT-01: vault country, owner type, fair-market value and position for the Taiwan exposure and the evacuation manifest. All are in section 4.
- **Card coverage.** The intake data model is in section 3; the item-to-token link (cert number, media hashes, NFC tag) in section 5; the five states in section 6.
- **Token standards.** ERC-6982 (a per-token lock flag with `Locked` and `DefaultLocked` events) and ERC-7578 (fixed properties per token, re-mint on change) were read through search summaries [S]. Smart contracts should check them against the EIP texts.
- **Not run:**
  - `pnpm check`: not applicable to Markdown, and `main` has no tooling yet.
  - A separate fresh-context review.

## Change requests for Planning

1. **Contracts index.** In `docs/contracts/README.md` (from BE-01), mark C9 as "v0 draft: `redemption.md` 0.1.0".
2. **Smart contracts (SC-01).** Please build against section 5:
   - the token ID taken from the item's UUID (or record your own mapping);
   - the item digest written once at mint;
   - ERC-7578 properties that never change when an item moves or is revalued, so no burn and re-mint is needed;
   - ERC-6982 with `defaultLocked` false;
   - the redemption escrow returning the token to the address it came from on cancel.
3. **Compliance:**
   - Settle the field name `origin` against `acquisitionChannel` (open item 5).
   - Add C6 actions for the operator commands that have none (open item 7).
   - Add to CMP-02: does ERC-7578's `assetHolder` (the "legal owner of the underlying asset") mean the token holder or the company as custodian (open item 2)?
4. **Backend core (C1, C3).** Tables for intake records, items, media, locks, sites, shipments, counts and redemption requests; and the event names in section 10.2.
5. **Planning, for v1.** Decide whether a permanently lost item gets a sixth, terminal state, such as WRITTEN_OFF (open item 1). v0 keeps the brief's five.
6. **Interface.** The state labels in section 6.3 need native review in zh-TW and ja.

## Decisions I made inside my area

- **Five item states, as the brief lists them.** Intake has its own statuses, and redemption has its own request record, so neither adds item states.
- **The database owns the state; the chain owns the holder.** Locks lead the chain; settlement, escrow and burn follow it.
- **One fair-market value field.** The insured and declared values are always that value, so they can't drift apart.
- **`vaultCountry` changes only when a receiving count confirms arrival,** so items in transit from Taiwan still count against the Taiwan cap.
- **Serial numbers are stored only as a salted digest,** plus the last four characters for staff, and never go on chain.
- **A request is cancelled if the token leaves the requesting wallet before escrow,** because the checks were for the old holder.
- **We never destroy rejected goods.**

## Questions for the owner

1. **Pull request layout.** VLT-03 shares pull request 5 with VLT-01, because this session can push only to its own branch. Should it stay that way, or would you allow a separate branch so the two can merge separately? Recommended: allow a separate branch, since C9 needs Planning's approval as a contract and VLT-01 doesn't.

## Next task I'd take

1. **VLT-02 Intake procedures**, in `docs/sops/`. These are the procedures behind section 3: the photo sets by category, the NFC decision, the filmed two-person receipt, and the dry run from receipt to listing in about 3 business days.
2. **VLT-05 Valuation sources**, which fill the fair-market value field.
