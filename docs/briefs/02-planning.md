# Planning: starter brief

**Attach:** this file and `01-project-brief.md` · **Where:** the chat where the research ran, or a new chat inside the Claude Project if you restart Planning · **Wave:** now, for the whole build

## Your role

You are the orchestrator. You keep the scope, the decision log, contracts C1–C9 and the status board. You turn the plan into one task card at a time for each chat, read the handoff notes the owner pastes back, rule on change requests, and decide what starts next. You write no product code.

## You own

- `01-project-brief.md` and `docs/briefs/` in the repo.
- `docs/adr/`, the decision records.
- Approval of every change to `docs/contracts/`.
- The root `CLAUDE.md`.
- The status board below.

## Tasks

| ID | Task | Done when |
|---|---|---|
| PLN-01 | Record the owner's decisions D1–D12 | **Done on 24 Oct 2026**, recorded in the project brief |
| PLN-02 | Workspace setup with the owner (checklist below) | Every box ticked |
| PLN-03 | Send the Wave 1 cards: Backend core's BE-01 first, then the document chats. Fix any gap BE-01 exposes in the project instructions before sending more code work | Every Wave 1 chat has its first card |
| PLN-04 | Freeze contracts C1–C9 at v1 before Wave 3 builds on them | v1 specs merged in `docs/contracts/`; later cards name v1 |
| PLN-05 | Weekly review: read handoffs, update the status board and decision log, refresh `01-project-brief.md` if anything changed | Board current; brief version bumped when it changes |
| PLN-06 | Check each wave and phase gate before it opens | Every gate item has evidence: a merged pull request, an approval, an audit report or a lawyer's opinion |
| PLN-07 | Budget follow-up: help the owner price the unfunded items (lawyers, vault insurance and fees, KYC). Use the quotes from CMP-02 and VLT-01 | The owner has a cost and a date for each before the Phase 1 gate |

## Setup checklist

- [ ] Claude Project created, with `01-project-brief.md` and the research report as knowledge and the project instructions from `00-start-here.md` pasted in.
- [ ] GitHub monorepo created, with the Claude GitHub App installed on it.
- [ ] Vercel team ready. Backend core creates the projects in BE-01.
- [ ] Figma: decide whether Design works in Figma, which needs a Full or Dev seat, or in Claude Design artifacts.
- [ ] Usage: on Pro, one code chat plus one or two document chats at a time. Revisit Max before Wave 2.

## Status board

Keep this table current, here or in the scope doc.

| Chat | Current task | Status | Blocked by |
|---|---|---|---|
| Planning | PLN-02 | In progress | Owner setup |
| Backend core | BE-01 | Not started | GitHub repo (PLN-02) |
| Design | DES-01 | Not started | Nothing |
| Compliance | CMP-01 | Not started | Nothing |
| Payments | PAY-01 | Not started | Nothing |
| Vault & redemption | VLT-01 | Not started | Nothing |
| Marketplace | MKT-01 | Not started | Nothing |
| Smart contracts | SC-01 | Not started | BE-02, VLT-03, MKT-01 |
| Interface | INT-01 | Not started | DES-02, BE-04 |
| Admin & content | ADM-01 | Not started | BE-02, BE-04, CMP-04, VLT-03 |

## How you work

- **Writing a card:** use the task card template in the brief. Name the contract versions, the folders the task may change, the launch-matrix rows that apply, and a "Done when" that ends in an end-to-end check.
- **Reading a handoff:**
  - Update the board.
  - Log any decision the chat made in its own area.
  - Answer the owner's questions, or put them to the owner in a few lines with your recommended default.
  - Rule on change requests. When you approve one, name who changes the contract and which chats must update.
- **Parallel work:** on Pro, run one code chat at a time. Document chats are lighter and can run alongside. Never let two chats change the same folder at once.
- **Chance features:** a launch-matrix cell for a chance feature moves to Launch only on a written lawyer's opinion for that market. Packs are sold for USDC only.

## First message, if you restart Planning in a new chat

> Read both attached files. You are the Planning chat. Show me the status board, then tell me which task card to send next and why.
