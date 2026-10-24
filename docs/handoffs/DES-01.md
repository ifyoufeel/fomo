# Handoff: Design · DES-01 · 24 Oct 2026

**Status:** done. The owner picked a direction.

## Owner decisions

- **Direction:** C2, Clear Case + Illuminated Protocol.
- **Brand name:** lastfomo.
- **Logo:** the galloping horse mark on its own, with no wordmark.
  - It is white on ink and ink on light grounds.
  - The source is `Mark.svg` from the Soft Matter bundle.

## The chosen direction

This is what DES-02 builds on.

| Part | C2 |
|---|---|
| Ground | Night first: ink `#111111`, grey `#2A2A2A`, paper `#F2F2F2`, muted text `#9A9A9A` (6.7:1 on ink) |
| Action | Chartreuse `#D4F70D`, only as a surface with ink text on it (15.4:1). The ratio is 70 ink, 20 grey, 10 chartreuse, with one chartreuse surface per page |
| Glass | Smoked acrylic cases: a 2–8% white fill, 24 px blur, a 1 px light rim and an inner case wall. Tiles have a 12 px radius; buttons and chips 4 px |
| Type | Jacquard 24 for names: lowercase, at least 48 px, in steps of 24. Geist Light for statements, Geist Regular for body text, and Geist Mono, uppercase and tracked, for labels, navigation, buttons and numbers |
| Clear Case pieces kept | A label strip on every item (lot, category, vault, barcode), the item shown inside a lit case, and facts set in mono |
| Voice | From the brandbook: elegant, airy, sharp, deliberate. No exclamation marks. "Kept, not stored." |

**Where to see it:** the boards `C2-Home` and `C2-Item` on the canvas's "Round 2" page.

## What changed

- **Design canvas** (private until shared): https://claude.ai/artifact/EgeQtoy1BLwbFFSfpnZvBq
  - **Round 1:** three directions (A Nocturne, B Clubhouse, C Clear Case). Each has a brand sheet, a home page and an item page.
  - **Round 2:** three combinations of C with a green action colour:
    - C1 · Clear Case + Lime
    - C2 · Clear Case + Illuminated Protocol (chosen)
    - C3 · Clear Case + Soft Matter
  - **Key board:** compares four greens on each ground.
- **Repo:** this note only. No product code.

## Checks run

- **Brief rules, checked by hand on every page:**
  - **All-in cost:** every bid and buy button has the 20% premium and the total next to it.
  - **Banned language:** none.
  - **Invisible chain:** the copy says "your vault" and "your item". The only chain-related text is the "Ownership record" link and USDC named as a payment method.
  - **Category details:** the card item page shows grader, grade, cert, set, card number and language.
- **Accessibility:**
  - I checked the text and background colour pairs by hand against 4.5:1.
  - Targets are 44 px. Pages use real buttons, links, inputs and labels, and motion respects `prefers-reduced-motion`.
- **Green against ground,** from the key board:
  - Ink text on any of the greens is 11:1 or better.
  - On light grounds the green itself reaches only 1.0–1.4:1 against the page, so it needs an ink edge or an ink case.
  - On ink every green works on its own. This is part of why C2 suits chartreuse.
- **Not run:** no automated accessibility audit and no screenshot review of the boards.

## Change requests for Planning

1. **Record the brand decisions in `01-project-brief.md`:** the name lastfomo, the horse mark used without a wordmark, and direction C2.
   - Affects: Interface, Admin & content, and Compliance (legal text that names the brand).
   - Planning should also decide whether the repo keeps the name `fomo`.
2. **Where design files live.**
   - DES-02 tokens go to `packages/ui`, as the brief already says.
   - I suggest DES-06 specs go to a new `docs/design/`.
3. **Figma or Claude Design (PLN-02).** DES-01 was built as a Claude Design canvas. I recommend staying there unless the owner buys a Figma Full or Dev seat.

## Decisions I made inside my area

- **Sample content:** every item, price, date, provenance entry and cert number is illustrative. Cert numbers are shown as `[cert no.]`.
- **Item images:** drawn placeholders, not photography, with no brand logos on them.
- **Marketplace placeholders, until MKT-01 sets the rules:**
  - the soft-close copy ("A bid in the last two minutes adds two minutes")
  - the US$100 bid increment
- **TWD:** shown as indicative, using a sample rate of 32.
- **Live feed:** bidders appear by code only, never by name.
- **Error colour in C2:** a coral `#FF8A73` that is not in the brandbook palette. DES-02 should settle a functional error colour.

## Questions for the owner

1. **Does the 20% buyer's premium apply to fixed-price "Buy now" sales?** C2 shows it.
   - Recommended default: confirm it with Marketplace in MKT-01.
2. **Which colour is this platform's wing?** C2 uses chartreuse, which the brandbook names as Machina's signal. If this platform is meant to be the Arca (storage) wing, its colour would be magenta `#FF0A96`.
   - Recommended default: keep chartreuse.
3. **Chinese and Japanese names.** Jacquard 24 has no CJK glyphs.
   - Recommended default: Noto Serif TC and Noto Serif JP for item names in zh-TW and ja, with Jacquard kept for Latin names.
4. **Day mode.** C2 is night-first, but DES-02 needs light and dark tokens. The brandbook's rule 03 already covers this: on paper, chartreuse is a surface and never type.

## Next task I'd take

DES-02, the design system v1, built on C2:

- Tokens for the night and day themes.
- A type scale with Jacquard, Geist and the CJK fallbacks.
- The component set.
- An export for `packages/ui`.
