# Contracts between chats

The agreed interfaces chats build against. Each contract has one maintainer, and Planning approves every change. A task card names the version it builds against: v0 is a draft with mocks, v1 is frozen for the build.

| Contract | Defines | Spec and code | Maintainer | Version |
|---|---|---|---|---|
| C1 Data model | Tables, IDs, money units, time | `data-model.md`, `packages/db` | Backend core | Not started (BE-02) |
| C2 API | OpenAPI spec, Server Action types, mock server | `packages/api-contract` | Backend core | Not started (BE-04) |
| C3 Events | Domain events, realtime channels, sequence numbers | `packages/events`, `packages/realtime` | Backend core; Marketplace adds auction channels | Not started (BE-04) |
| C4 Chain | ChainAdapter, ABIs, addresses | `packages/chain`, `packages/contracts` | Smart contracts | Not started |
| C5 Payments | Rails, funding-source flag, ledger postings | `packages/payments` | Payments | Not started |
| C6 Launch policy | Rules by feature, country, KYC tier and age | `packages/compliance` | Compliance | Not started |
| C7 Design system | Tokens, components, states | Figma or Design System artifact; `packages/ui` | Design | Not started |
| C8 Catalog | Attribute schema per category | `packages/catalog` | Admin & content | Not started |
| C9 Vault item | Intake record, item states, redemption steps | `redemption.md`, `packages/core` | Vault & redemption | Not started |

To change a contract you don't maintain, put a change request in your handoff note and keep building on the current version.
