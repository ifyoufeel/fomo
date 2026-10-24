# NewebPay (藍新金流) application draft

Payments · PAY-01 · 24 Oct 2026 · **draft, not sent**. The owner submits it.

Second application for the Taiwan gateway, filed in parallel with ECPay. It becomes the first choice if ECPay declines us or can't hold authorisations (`provider-comparison.md`, section 1). Rail: `twd_gateway`.

## Before sending

- [ ] Planning has ruled on the three findings in `provider-comparison.md`, section 2.
- [ ] The owner has filled every `［待業主填寫］` below.
- [ ] A site reviewers can open is live, with the pages in "Website checks".
- [ ] Every [P] and [S] fact used here has been re-checked on NewebPay's live pages.

## What we apply for

- **Membership:** business (企業) membership with a negotiated contract [G, confirm the type].
- **Card payments:** one-time payment with 3-D Secure, and overseas cards if NewebPay offers them.
- **Manual capture:** authorise first, then capture through `CreditCard/Close` [S]. It backs auction holds.
- **Wallets:** LINE Pay, Taiwan Pay, Apple Pay, Google Pay and Samsung Pay [S].
- **ATM and convenience-store payments:** for fees only, such as the delivery fee. Our checkout never offers them for an item.
- **B2C e-invoices:** through ezPay (簡單行動支付), issued automatically [S].
- **Not requested at launch:** card instalments, reward-point redemption and subscriptions. Same reasons as the ECPay draft.

**Wallet funding.** LINE Pay can be funded from a card or a stored balance, and Taiwan Pay takes money from a bank account [G]. PAY-07 decides which clearing tier each one gets. Until then, treat both like cards: the item is locked until the payment clears.

## Documents to prepare [G, confirm with NewebPay]

Same as the ECPay draft:

- the company registration record;
- both sides of the responsible person's national ID card;
- the cover page of the company bank passbook;
- the website address and a test account;
- registered business items that cover online retail.

## Website checks [G]

Same as the ECPay draft.

## Text for the form (ready to paste)

**營業項目與商品類別：** 線上收藏品零售（本公司自有庫存），包括鑑定評級卡牌、未拆封集換式卡牌商品、手錶、精品包、球鞋、玩具、公仔、現代藝術品及版畫。以定價銷售及限時拍賣兩種方式出售。

**商品及服務說明：** 貼上 `product-description.md` 繁體中文版全文（一至十節）。

**銷售對象：** 台灣及海外的成年消費者（18 歲以上，部分地區依當地成年年齡更高），購買或出價前須完成身分驗證。

**出貨及交付方式：** 商品於成交時即移轉所有權，並存放於投保的保管庫（免費保管）；擁有者申請交付時再寄送，並支付交付費用。

**預估交易量：**

- 每月營業額：［待業主填寫］
- 平均客單價：［待業主填寫］
- 單筆最高金額：［待業主填寫］
- 各支付方式預估占比：［待業主填寫］
- 預計上線日：［待業主填寫］

## Message to the NewebPay sales contact (ready to send once approved)

> 您好：
>
> 我們是［公司全名］（統一編號［ ］），經營［品牌］線上收藏品平台，銷售本公司自有庫存的評級卡牌、手錶、精品包、潮流商品及現代藝術品，以定價及限時拍賣兩種方式出售。
>
> 我們希望申請藍新金流，使用信用卡（含 3D 驗證並以手動請款；如有提供，亦申請國外卡）、LINE Pay、台灣 Pay、Apple Pay、Google Pay，以及 ezPay B2C 電子發票；ATM 及超商付款僅用於運費等費用。
>
> 每件商品附有一個數位所有權憑證（以太坊上的 ERC-721 非同質化代幣，一物一證），用來記錄所有權及提領權利；它不可分割、不生收益，也不是貨幣或投資商品。部分買家以自己錢包的 USDC 付款，這部分不經藍新。本公司不為使用者買賣或兌換虛擬通貨，也不保管使用者的款項或餘額。完整說明附於申請文件。
>
> 想先請教幾個問題（附件列出），並了解費率及審核流程。謝謝！
>
> ［聯絡人、職稱、電話、電子郵件］

## Questions for NewebPay

1. **Fit with the 2022 FSC letter.** The same question as for ECPay: does the non-fungible ownership record meet NewebPay's and the acquiring bank's review standards?
2. **Holds.**
   - Can capture be manual?
   - Is there a call that cancels an authorisation before capture, and what is it called?
   - How many days can an authorisation stay open, per card network?
   - What is the largest single authorisation?
3. **Overseas cards.** Are they supported? If so: the fee, the currency, 3-D Secure and chargeback handling.
4. **Partial refunds.** Partial refunds through `CreditCard/Close`, and refunds for LINE Pay and Taiwan Pay: full, partial and deadlines.
5. **Saved cards.** Can a bidder save a card, so that we charge the winner after the auction? Is 3-D Secure needed again?
6. **E-invoices through ezPay.**
   - The quota price per invoice.
   - The carriers available to buyers without a Taiwan mobile barcode.
   - Void and allowance.
   - Whether zero-rated export invoices are supported.
   - Whether the invoice can be issued automatically from the payment, or only through its own API.
7. **Reconciliation.** A daily settlement file or API, the settlement cycle, fee detail per transaction, and how wallet payments appear in it.
8. **Chargebacks.** The process and deadlines, and any reserve or delayed settlement.
9. **Sandbox.** Can capture, cancel and refund be tested end to end before going live?
10. **Payment notifications.** Retries, signing, and the IP ranges to allow.
11. **Card country.** Can we learn the card's BIN country before we capture?
12. **Wallet funding source.** For LINE Pay and Taiwan Pay, does the notification tell us whether the payment came from a card, a bank account or a stored balance?

## What not to say or promise

Same as the ECPay draft.
