# ECPay (綠界科技) application draft

Payments · PAY-01 · 24 Oct 2026 · **draft, not sent**. The owner submits it.

First choice for the Taiwan gateway (`provider-comparison.md`, section 1). Rail: `twd_gateway`.

## Before sending

- [ ] Planning has ruled on the three findings in `provider-comparison.md`, section 2.
- [ ] The owner has filled every `［待業主填寫］` below.
- [ ] A site reviewers can open is live, with the pages in "Website checks".
- [ ] Every [P] and [S] fact used here has been re-checked on ECPay's live pages.

## What we apply for

- **Membership:** contract seller (特約賣家). Negotiated rates, overseas cards and manual capture are usually contract-seller features [G, confirm].
- **Card payments:** one-time payment, domestic and overseas cards, with 3-D Secure.
- **Manual capture:** daily auto-capture (每日自動關帳) turned off, so that we capture with `DoAction` ourselves. This backs auction holds and lets us capture only after the payment checks pass.
- **Wallets:** Apple Pay, and Google Pay if offered. TWQR to be decided once ECPay confirms how refunds work for it.
- **ATM and convenience-store payments:** for fees only, such as the delivery fee. Our checkout never offers them for an item.
- **B2C e-invoices:** through ECPay's e-invoice API, with void and allowance.
- **Not requested at launch:** card instalments, cardless instalments and subscriptions. Instalment refunds are full-only [P], and buy-now-pay-later raises credit questions we haven't answered. PAY-04 can revisit this.

## Documents to prepare [G, confirm with ECPay]

- The company registration record (設立或變更登記表).
- Both sides of the responsible person's national ID card.
- The cover page of the company bank passbook, for settlements.
- The website address, and a test account for the reviewer.
- Registered business items that cover online retail. For example, F399040 non-store retailing (無店面零售業) [G]. The owner checks the registration.

## Website checks [G]

A reviewer will look for:

- the company's full name, tax ID, address and customer-service contact;
- product pages with tax-inclusive TWD prices;
- terms of service, a returns and cancellation policy, and a privacy policy (Compliance drafts; publishing needs the owner's go-ahead);
- delivery terms that explain the vault: ownership passes at once, storage is free, and delivery is on request;
- auction rules: how bidding works, the 20% buyer's premium and the absence of bid fees.

## Text for the form (ready to paste)

**營業項目與商品類別：** 線上收藏品零售（本公司自有庫存），包括鑑定評級卡牌、未拆封集換式卡牌商品、手錶、精品包、球鞋、玩具、公仔、現代藝術品及版畫。以定價銷售及限時拍賣兩種方式出售。

**商品及服務說明：** 貼上 `product-description.md` 繁體中文版全文（一至十節）。

**銷售對象：** 台灣及海外的成年消費者（18 歲以上，部分地區依當地成年年齡更高），購買或出價前須完成身分驗證。

**出貨及交付方式：** 商品於成交時即移轉所有權，並存放於投保的保管庫（免費保管）；擁有者申請交付時再寄送，並支付交付費用。

**預估交易量：**

- 每月營業額：［待業主填寫］
- 平均客單價：［待業主填寫］
- 單筆最高金額：［待業主填寫］
- 海外卡占比：［待業主填寫］
- 預計上線日：［待業主填寫］

## Message to the ECPay sales contact (ready to send once approved)

> 您好：
>
> 我們是［公司全名］（統一編號［ ］），經營［品牌］線上收藏品平台，銷售本公司自有庫存的評級卡牌、手錶、精品包、潮流商品及現代藝術品，以定價及限時拍賣兩種方式出售。
>
> 我們希望申請綠界特約會員，使用信用卡（國內卡及國外卡，含 3D 驗證並以手動請款）、Apple Pay 及 B2C 電子發票；ATM 及超商付款僅用於運費等費用。
>
> 每件商品附有一個數位所有權憑證（以太坊上的 ERC-721 非同質化代幣，一物一證），用來記錄所有權及提領權利；它不可分割、不生收益，也不是貨幣或投資商品。部分買家以自己錢包的 USDC 付款，這部分不經綠界。本公司不為使用者買賣或兌換虛擬通貨，也不保管使用者的款項或餘額。完整說明附於申請文件。
>
> 想先請教幾個問題（附件列出），並了解特約會員的費率及審核流程。謝謝！
>
> ［聯絡人、職稱、電話、電子郵件］

## Questions for ECPay

1. **Fit with the 2022 FSC letter.** Each item comes with a non-fungible ownership record on Ethereum. Does that meet ECPay's and the acquiring bank's review standards? Do the bank's rules under the FSC's July 2022 letter on virtual assets affect us?
2. **Holds.**
   - With daily auto-capture off, how many days can an authorisation stay open before capture?
   - Does that differ for Visa, Mastercard and JCB, or for overseas cards?
   - What is the largest single authorisation allowed?
3. **Overseas cards.**
   - The fee, 3-D Secure, and manual capture.
   - The currency: TWD only?
   - Approval rates, and how chargebacks on overseas cards are handled.
4. **Partial refunds.** On a normal (not instalment) authorisation, can we refund part of the amount after capture? ECPay's documents say different things on different pages.
5. **Saved cards.** Can a bidder save a card (記憶卡號 or a token), so that we charge the winner after the auction? Does that charge need 3-D Secure again?
6. **E-invoices.**
   - The price per invoice.
   - Which carrier (載具) buyers without a Taiwan mobile barcode can use.
   - The void and allowance APIs.
   - Whether zero-rated export invoices are supported.
7. **Reconciliation.** A daily settlement file or API, the settlement cycle, fee detail per transaction, and the report format.
8. **Chargebacks.** The process and deadlines, and any reserve, rolling hold or delayed settlement for a business like ours.
9. **Testing holds.** `DoAction` can't be tested in the sandbox. How do merchants test capture, void and refund before going live?
10. **Payment notifications.** Retries, signing, and the IP ranges to allow.
11. **Card country.** Can we learn the card's BIN country before we capture? Our launch policy checks it against blocked jurisdictions.

## What not to say or promise

- No investment language, and nothing about prices rising.
- Don't call the token a virtual asset, a currency or a security, and don't call us "not a virtual-asset service provider" (D3 and CMP-02 settle that).
- Don't promise mystery packs, draws or buyback dates. Name them only as later, outside ECPay, as in the product description.
