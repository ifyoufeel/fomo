# TapPay backup notes

Payments · PAY-01 · 24 Oct 2026 · **not for sending yet**

TapPay is the backup for the Taiwan gateway. File it only if both ECPay and NewebPay decline us, or can't hold authorisations.

## Why it's the backup

- **Two contracts.** TapPay is a gateway and card vault. The acquiring contract is with a bank, so we pass two reviews: TapPay's and the bank's [S]. The bank applies the FSC's 2022 letter on virtual assets directly.
- **A third contract for invoices.** TapPay needs a separate e-invoice provider (starter brief). Its Portal lists an e-invoice item under Marketplace [P], which may be a partner integration.
- **What it does well.**
  - Holds are explicit: `delay_capture_in_days` sets when capture happens, `-1` turns auto-capture off, and each bank sets its own capture deadline [P].
  - It covers more wallets than either gateway [G].

## If we file it

- **Reuse:** `product-description.md`, plus the website checks, the documents list and the "what not to say" list from the ECPay draft.
- **Add for the bank:**
  - the bank's own merchant application;
  - the bank's view on the ownership record under the 2022 letter;
  - the capture deadline for each card network.
- **Add for TapPay:** its fee on top of the bank's discount rate; how card tokens (`card_key`, `card_token`) are stored and reused for charging auction winners; and reconciliation reports.
- **E-invoices:** apply to ECPay's or ezPay's e-invoice service separately, or use a third e-invoice provider. Either way, PAY-04 joins invoice records to payments in reconciliation.

## Questions for TapPay (and its partner bank)

1. Which banks do you recommend for a collectibles retailer that sells high-value items and runs auctions?
2. The longest `delay_capture_in_days` each bank allows, for each card network.
3. The fee structure: TapPay's fee and the bank's discount rate, with and without wallets.
4. Merchant-initiated charges on a stored card token for auction winners, and whether 3-D Secure applies.
5. The e-invoice partners you integrate with, and whether the invoice can be triggered from the payment.
6. The reconciliation and settlement reports you provide, and in which format.
