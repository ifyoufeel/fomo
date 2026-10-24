# Handoff: Design · DES-01 · 24 Oct 2026

**Status:** partly done. The three directions are ready for review. The card is done when the owner picks one.

## What changed

- **Design canvas** (Claude Design artifact, private until shared): https://claude.ai/artifact/EgeQtoy1BLwbFFSfpnZvBq
  - Nine boards: a brand sheet, the home page and an item page for each direction.
  - Each brand sheet covers the logo placeholder, type, colour and tone.
- **Repo:** this note only. No product code.

All three directions use the same sample lots, prices and page structure, so the brand is the only thing that changes between them. Each one uses liquid glass (backdrop blur, rim highlights and specular edges) and packed bento layouts, as the owner asked, based on the two references they shared (the "veri" health app and the fitness dashboard).

| | A · Nocturne | B · Clubhouse | C · Clear Case |
|---|---|---|---|
| Idea | Every item glows. A night gallery where each piece floats in a soft colour aura taken from the item | The collector's magazine with a live auction inside. A graphite glass app over soft studio photography | Everything on the label. The grading slab becomes the brand: clear acrylic tiles, and a white label strip on every item |
| Type | Geist, Geist Mono, Doto (dot-matrix, used only for countdowns and the live price) | Unbounded (labels, big numbers), Schibsted Grotesk (headlines, reading) | Funnel Display, Funnel Sans, Martian Mono (labels and every number) |
| Colour | Night #0A0A0C, Paper #F2F1EE; auras Rose, Sage, Cobalt and Coral; Signal #E4F36B for live markers only | Mist #B8C1CA, Graphite #181917, Bone #EDEDE8, Butter #F6F2C9 (stories), Lime #CDF56A (actions only) | Pearl #ECEFF2, Ink #11141A, Ultramarine #2F3BFF (actions), Vermilion #C7361D (live and closing) |
| Tone | Calm. Intimate. Exact. | Social. Editorial. Upbeat. | Transparent. Archival. Exact. |
| Closest reference | veri | Fitness dashboard | Neither: a new direction built on the slab |
| Main trade-off | The most premium and focused, but dark-first, so the light theme in DES-02 is real work. Doto only reads well at large sizes | The best fit for stories and community, but it depends most on photography and on a steady flow of editorial content | The strongest trust story for users new to crypto, and it fits proof of reserve and condition data naturally. It has the least emotional pull, and long mono labels need care in zh-TW and ja |

**What every direction includes:**

- **Interactive bid panel** on each item page:
  - Changing your maximum bid recalculates the 20% premium, the all-in total and the indicative TWD amount.
  - A bid below the minimum shows an error.
  - A bid in the last 2 minutes extends the clock and adds you to the live feed.
- **Blur tweak:** glass blur is adjustable from 0 to 48 px in each page's Tweaks panel.

## Round 2 · 24 Oct 2026

**Owner feedback:** prefers C, with B's green as the action colour. They also shared two earlier directions to combine with it: the LASTFOMO "Illuminated Protocol" brandbook and the Soft Matter 3D gallery.

The canvas has a new "Round 2 · C combinations" page. Round 1 is unchanged.

| | C1 · Clear Case + Lime | C2 · Clear Case + Illuminated | C3 · Clear Case + Soft Matter |
|---|---|---|---|
| Ground | Pearl, light | Ink #111111, night | Mist #E9E7EE, light |
| Action | Lime #CDF56A with ink text | Chartreuse #D4F70D, used only as a surface | Lime #CDF56A with an ink plus circle |
| Type | Funnel Display, Funnel Sans, Martian Mono | Jacquard 24 (names), Geist Light, Geist Mono | Instrument Sans, Instrument Serif italic (titles), Doto (numbers) |
| Mark | Slab mark with a lime label band, "fomo" | "lastfomo" wordmark | Galloping horse mark |
| Signature | Ink bid case on a light page; lime "Inspected" sticker | One acid tile per page; 70/20/10 ink, grey and acid | The walkable viewing room as the home hero |

**Key board finding:** every green reads well with ink text on it, at 11:1 or better.

- **On a light ground** (pearl or mist), the green itself barely separates from the page, at 1.0 to 1.4:1. So it needs an ink edge, an ink case or an ink dot.
- **On ink,** any of the greens works as it is.
- **Magenta,** the brandbook's Arca storage wing colour, is shown as the alternative.

## Checks run

- **Brief rules, checked by hand:**
  - **All-in cost:** every bid and buy button has the buyer's premium and the total next to it. Lot cards show the current bid and the all-in price.
  - **Banned language:** none.
  - **Invisible chain:** the copy says "your vault" and "your item". The only chain-related text is the "Ownership record (advanced)" link and USDC named as a payment method.
  - **Category details:** the card item page shows grader, grade, cert, set, card number and language.
- **Accessibility:**
  - I checked the main text and background colour pairs by hand against 4.5:1.
  - Targets are 44 px. Pages use real buttons, links, inputs and labels, with an `aria-label` on every icon-only button. Motion respects `prefers-reduced-motion`.
- **Asset files:** the six item drawings parse as valid SVG.
- **Not run:** no automated accessibility audit and no screenshot review. For this card, the owner reviewing the canvas is the check.

## Change requests for Planning

1. **Where design files live.** The repo layout has no folder for design source. For DES-01 the canvas stays in the Design artifact. I suggest:
   - DES-02 tokens go to `packages/ui`, as the brief already says.
   - DES-06 handoff specs go to a new `docs/design/`.
   - Affects: Interface, Admin & content.
2. **Figma or Claude Design (PLN-02).** I built this as a Claude Design canvas because the Figma decision is still open. I recommend staying on Claude Design unless the owner buys a Figma Full or Dev seat.

## Decisions I made inside my area

- **Working name:** "fomo" (the repo name) is the logo placeholder in all three directions.
- **Sample content:** every item, price, date, provenance entry and cert number is illustrative. Cert numbers are shown as `[cert no.]`.
- **Item images:** drawn placeholders with no brand logos. Real photography comes later, with art direction set per direction.
- **Marketplace placeholders, until MKT-01 sets the rules:**
  - the soft-close copy ("A bid in the last 2 minutes adds 2 minutes")
  - the US$100 bid increment
- **TWD:** shown as indicative, using a sample rate of 32.
- **Live feed:** bidders appear by code only, never by name, to match the pseudonymized bid log.

## Questions for the owner

1. **Which direction: A, B or C?** A mix also works, for example C's label strips inside A's dark aura gallery.
2. **Is "fomo" the public brand name, or only the repo codename?**
   - An urgency-themed name sits awkwardly next to the no-pressure, all-in-cost approach, so Compliance may want to look at it.
   - Recommended default: treat it as a codename until a naming decision.
3. **Does the 20% buyer's premium apply to fixed-price "Buy now" sales?**
   - D9 names it without saying, and the design rule asks for the premium and total next to every buy button, so I showed it.
   - Recommended default: confirm it with Marketplace in MKT-01.

### Added in Round 2

4. **Which combination: C1, C2 or C3?**
5. **Is the brand "lastfomo"?** The brandbook uses that name.
   - If this platform is one wing of that house, the brandbook's rule ("one wing colour per composition") points to Arca magenta rather than green.
   - Recommended default: keep green as the action colour and treat the wing colour as a later decision.
6. **Should the horse mark be the logo?** It comes from Soft Matter, which used no brand name.
7. **Chinese and Japanese names in C2.** Jacquard 24 has no CJK glyphs, so zh-TW and ja item names would need a matching serif (Noto Serif TC and JP).

## Next task I'd take

DES-02, the design system v1, in the chosen direction:

- Tokens for the light and dark themes.
- A type scale tuned for zh-TW, ja and Latin.
- The component set.
- An export for `packages/ui`.
