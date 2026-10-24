# Provider comparison

Payments · PAY-01 · 24 Oct 2026 · draft for the owner and Planning

Source markers [P], [S] and [G] are explained in `README.md`. Every figure here is a starting point for a quote, not a quote.

## 1. Recommendation

**Taiwan gateway: apply to ECPay and NewebPay in parallel, with ECPay as the first choice. Keep TapPay as the backup.**

- ECPay's documentation describes every step a hold needs: authorise, capture, void before capture and refund after capture [P]. Auction holds (PAY-06) depend on that.
- ECPay also takes overseas cards, at about 3.5% [S]. That gives buyers abroad a second card route, with the Taiwan company as merchant of record (section 6.1).
- ECPay issues B2C e-invoices through its own API, so payments, invoices and the reconciliation feed come from one provider [P].
- NewebPay has the better mix of consumer wallets: LINE Pay, Taiwan Pay, Apple Pay, Google Pay and Samsung Pay [S]. If ECPay declines us, or answers badly on holds, NewebPay becomes the first choice.
- **Why apply to both.** Approval isn't certain for a product that carries a token (section 3.1), and a second application costs only time.
- **TapPay is the backup.** It needs a separate acquiring-bank contract, and that bank faces the FSC's 2022 card-acquiring letter directly. It also needs a separate e-invoice provider.

**Card checkout abroad: apply to Crossmint and Transak in parallel, with Crossmint as the first choice. Choose one once both have answered.**

- Crossmint doesn't run its own KYC on buyers at checkout [P]. We already verify every buyer at T1 through Sumsub, so a second KYC would add friction without adding control.
- Crossmint says it takes the chargeback risk and handles disputes with the bank [P].
- Crossmint's checkout works with our own ERC-721 contract, delivering to a recipient address that isn't the caller, and it accepts mint functions priced in USDC [P].
- **Against Crossmint:** its default card limit is US$1,500 per transaction [P]. Most watches, bags and art lots cost more. If Crossmint won't raise the limit far enough, Transak is the better choice: it allows up to about US$75,000 for buyers who pass its enhanced KYC [P, sources conflict].
- **Against Transak:** it runs NFT Checkout under MCC 5815, a code for digital goods [P]. Our tokens stand for physical items, so its review may treat us differently.
- **Choosing between them:** compare the answers to the questions in each draft. The ones that matter most are the per-transaction limit, refunds after delivery, chargeback scope and fees.

**PAY-02 doesn't need the final choice.** The rail adapter and its mocks are the same whichever provider wins. PAY-04 and PAY-05 do need it.

## 2. Three findings that need a ruling before anything is sent

1. **Merchant of record (D2).** Crossmint's documentation says Crossmint stays the merchant of record for every transaction [P]. Transak charges the card itself, so it is very likely the merchant of record for the card payment too [inference]. Compliance's launch policy makes card checkout depend on the Taiwan company being merchant of record (condition `card-provider-live`, section 7). Neither provider fits that as written. Options are in section 6.1.
2. **D3 and Taiwan card acceptance.** In July 2022 the FSC told the Bankers Association that acquirers may not sign virtual-asset service providers as merchants, and that merchants may not take them on as payees. It gave three months to comply [S], and news from October 2026 says the policy hasn't changed [S]. Two things follow:
   - If the D3 decision ends with the Taiwan company registering as a virtual-asset service provider, its Taiwan card acceptance could be cut off. D3 needs this as an input.
   - Each application has to describe us accurately: a seller of physical goods that gives each item a digital ownership record. We don't buy, sell, exchange or hold virtual currencies for users.
3. **A site reviewers can open.** Taiwan gateways review the merchant's website before approval [G]. It needs product pages with tax-inclusive prices, terms, a returns policy, a privacy policy, contact details and the company's name and tax ID. Today every Vercel preview needs a Vercel login (BE-01), and the account is on the Hobby plan, which Vercel limits to non-commercial use. A reviewable site needs the owner's go-ahead on Vercel settings. Its legal text needs Compliance drafts and the owner's go-ahead to publish.

## 3. Rules that shape every application

### 3.1 Card acquiring and virtual assets in Taiwan

- **FSC letter, July 2022.** Cards may not be used to pay for virtual-asset transactions. Acquirers may not sign virtual-asset service providers as merchants, and merchants may not take them on as payees [S]. Reports at the time said it was unclear whether NFTs were covered [S].
- **Virtual Asset Service Act.**
  - It passed its third reading on 30 June 2026 and was promulgated on 22 July 2026, but isn't in force yet [P].
  - The FSC expects it to apply from Q1 2027 at the earliest, once nine sets of subsidiary rules are written [S].
  - Virtual-asset service providers will need an FSC licence [S].
  - **NFT exclusion.** Article 3(1) excludes from "virtual asset" a non-fungible token whose value is non-fungible (表彰之價值具不可代替性之非同質化代幣) [P].
  - The AML rules in force today don't carry the same NFT wording [P].
  - The brief's open question on the NFT exclusion now has a primary text to give counsel (CMP-02).
- **What this means for the applications.**
  - Describe the product as what it is: one non-fungible ownership record per physical item.
  - Never describe it as crypto, an investment or a virtual currency.
  - Say plainly that USDC payments go from the buyer's own wallet to us, outside the gateway.
  - Don't claim a legal conclusion we don't have yet, for example "we are not a virtual-asset service provider". D3 and CMP-02 settle that.

### 3.2 Consumer and invoice rules [G, Compliance to confirm in CMP-06]

- **7-day cancellation.** Distance sales carry a 7-day right to cancel (Consumer Protection Act, Art. 19). When a vaulted item counts as "received" is an open question in the brief.
- **Tax-inclusive prices.** B2C prices include the 5% business tax.
- **E-invoices.**
  - B2C e-invoices go to the Ministry of Finance platform within 48 hours of issue.
  - A refund needs a void or an allowance (折讓) on the e-invoice.
- **Buyers abroad.** Whether an item sold abroad but kept in the Taiwan vault is a zero-rated export is an open question in the brief. It decides which invoice a buyer abroad gets.

### 3.3 Our own payment rules (from the starter brief)

- No user funds, no balances, no spendable credit.
- Refunds and payouts go back on the rail they came in on.
- Convenience-store and ATM payments never fund a transferable token. The applications offer them only for fees, such as the redemption fee, or not at all.
- Stablecoin payouts to Taiwan users wait until a lawyer confirms the Virtual Asset Service Act's scope. Until then, pay in TWD or refund to the source. No application asks for payouts yet.
- The ledger runs in USD = USDC. A TWD charge is quoted from the USD price at checkout and fixed for that checkout.

## 4. Taiwan gateways

| | ECPay 綠界科技 | NewebPay 藍新金流 | TapPay |
|---|---|---|---|
| **What it is** | Third-party payment provider. Membership types: individual, business and contract (特約) sellers, plus ECPay Pay [P] | Third-party payment provider. Passed the Ministry of Digital Affairs' third-party payment registration in the first batch [S] | Gateway and tokenisation only. We sign with acquiring banks ourselves [S] |
| **Card fee, domestic** | 2.75%, NT$5 minimum, before tax; contract sellers negotiate [S] | About 2.75% [S] | About 2.75%, plus the bank's terms [S] |
| **Overseas cards** | Yes, 3.5% [S] | Not confirmed | Depends on the acquiring bank |
| **Wallets** | Apple Pay, ECPay Pay, TWQR, WeChat Pay (cross-border) [S]; Google Pay [S, 2020 source]. LINE Pay not found | LINE Pay, Taiwan Pay, Apple Pay, Google Pay, Samsung Pay [S]. LINE Pay about 2.625–3% [S] | Apple Pay, Google Pay, Samsung Pay, LINE Pay, JKOPAY and others [G] |
| **ATM and convenience store** | Yes, about NT$15 per payment [S] | Yes [G] | Not through TapPay |
| **Hold, capture, void** | Authorise, then capture (`Action=C`); void before capture (`N`); cancel a capture (`E`); refund after capture (`R`). Daily auto-capture can be turned off [P] | Capture and refund through `CreditCard/Close` [S]. A cancel-authorisation call wasn't confirmed | `delay_capture_in_days`; `-1` turns off auto-capture. Each bank sets its own capture deadline [P] |
| **Partial refunds** | Docs conflict: one page allows partial refunds on normal authorisations and full only on instalments; another says full only [P] | Not confirmed | Not checked |
| **E-invoice** | Its own B2C API, with delayed issue and donation codes [P]. Price per invoice not found | Through ezPay, in the same group: issued automatically from prepaid invoice quota [S] | Separate provider needed (starter brief). An e-invoice item appears in the TapPay Portal [P] |
| **3-D Secure** | A separate flow in the docs [P] | Not checked | Through the bank [G] |
| **Sandbox** | Yes, but the hold API (`DoAction`) can't be tested there [P] | Yes [S] | Yes [P] |
| **Main risk for us** | Partial refunds; no LINE Pay | Holds not confirmed; overseas cards not confirmed | Two reviews (TapPay and the bank) and a third contract for e-invoices |

**What each answer changes.**

- **Holds.** If neither gateway can keep an authorisation open for 7 days, PAY-06 needs deposits or tier limits for card bidders instead.
  - Visa's rules since 13 April 2024 allow up to 10 days for an online cardholder-initiated authorisation, or 30 days with an extended-authorisation flag and a 0.08% fee [P]. One processor's summary says 7 days [S].
  - Taiwan acquirers may set shorter limits, so ask each gateway.
- **Partial refunds.** Partial refunds matter for a cancelled redemption fee, or a refund of the buyer's premium without the hammer price. If only full refunds work, PAY-04 refunds in full and charges again.

## 5. Card checkout abroad

| | Crossmint | Transak |
|---|---|---|
| **What it is** | Card checkout for NFTs. Crossmint's treasury calls our contract and the token goes to the buyer's wallet [P] | NFT Checkout: Transak takes the card payment, calls our contract with the calldata we supply, and the token goes to the buyer's wallet [P] |
| **Merchant of record** | Crossmint, for every transaction [P] | Transak charges the card, under MCC 5815 for digital goods [P]; merchant of record in practice [inference] |
| **Chargebacks** | Crossmint takes the risk and handles disputes with the bank [P]. Scope (fraud only, or disputes such as "not as described" too) not stated | "100% chargeback protection" on the product page [P, marketing]. Terms not found |
| **Buyer KYC** | None at checkout [P]. We do our own at T1 | Transak runs KYC in tiers: light, standard and enhanced [P] |
| **Limits** | US$1,500 per card transaction by default; higher on request through sales [P, updated June 2025] | Up to about US$75,000 with enhanced KYC. Tier figures conflict between sources: light up to US$200 or US$500; standard up to US$3,000 a transaction and US$25,000 a month [P] |
| **Fees** | Quote only. The buyer usually pays them as a convenience fee [P]. An aggregator lists 5% + US$0.30 as typical [S] | NFT Checkout fees are on a separate page I couldn't read. A partner page gives 0.5–3% for Transak generally [S] |
| **Countries** | "197 countries and all US states", or "all non-sanctioned geographies" [P] | "161+ countries"; a state-by-state table for the US [P]. Taiwan not confirmed |
| **Our contract** | ERC-721 or ERC-1155. The function must send the token to a recipient other than the caller, and Crossmint's treasury must be able to call it without limit. Review takes 1–2 business days [P] | Custom EVM contracts are allowed after a review, which may ask for audit details [P] |
| **Settlement** | Paid straight to our contract on-chain; USDC-priced functions are supported [P] | Paid to our contract on-chain [P]. Currency to confirm |
| **Refunds** | Not found beyond failed orders | Full refund when the mint fails [P]. Refunds after delivery not found |
| **Content rules** | No wording that promises appreciation, profit or yield. Physical goods are fine when bundled with an NFT [P] | Not found |
| **Merchant onboarding** | Business verification (KYB) for production access [P] | Business verification (KYB) and contract allow-listing [P, via a partner's docs] |

## 6. Where card checkout meets our rules

### 6.1 Merchant of record

D2 says the Taiwan company is merchant of record. With Crossmint or Transak, the Taiwan company still sells the item, but the provider is merchant of record for the card payment. Options for Planning:

1. **Restate the rule** as "the Taiwan company is the seller of the item; for card checkout abroad, the provider may be merchant of record for the payment". Compliance updates condition `card-provider-live`, and counsel checks the tax and consumer-law effect: who issues the receipt, and who handles a cancellation. **Recommended**, because it keeps the D10 providers.
2. **Route buyers abroad through ECPay's overseas cards.** The Taiwan company stays merchant of record, and holds become possible. But buyers pay in TWD, we carry chargebacks and fraud ourselves, and acceptance abroad may be lower [G]. Worth asking ECPay anyway; it costs nothing.
3. **Wait for the foreign affiliate** (D2) and a Stripe-style acquirer. That route is Phase 4.

### 6.2 Refunds on the same rail

- Neither provider documents a refund after delivery. That is the case of a buyer abroad who cancels within 7 days, or a sale we cancel because the item fails intake.
- If a provider can't refund to the card, the rule "refunds go back on the rail they came in on" can't be met for card checkout.
- So this is a must-ask question for both providers, and the answer decides the choice.

### 6.3 The clearing lock (PAY-07)

- **How the lock gets set.** The token contract can lock a token automatically when the caller is a card provider's address, using an ERC-6982 lock event. That is a change request for Smart contracts (SC-01).
- **Ask the providers.** Will they deliver a token that can't be transferred until the payment clears?
- **Why the lock stays even if a provider covers chargebacks.** It stops a stolen card from buying a token that is then sold for USDC (crypto resale in Phase 2) or redeemed and shipped.

### 6.4 Auction bids

- **No holds.** Neither provider offers a card hold before a purchase.
- **Bidders abroad who pay by card** are backed by deposits or KYC-tier limits while bidding (PAY-06), and pay through checkout after the hammer.
- **High-value lots.** At Crossmint's default US$1,500 limit, most lots can't be paid by card. This is why the limit question decides the choice.
- **Refundable bidder deposits** may count as stored value. That is an open question in the brief, so PAY-06 waits on counsel before it builds them.

### 6.5 What our launch policy needs from the provider

- **Card country.** Compliance's policy checks the card's BIN country against the blocked lists (C6 inputs). Each provider has to tell us the card country before the payment completes, or let us block countries ourselves.
- **Wallet screening.** We screen the receiving wallet ourselves before checkout starts. Ask whether the provider screens it too, so a wallet isn't rejected twice for different reasons.

## 7. Risks

| Risk | Likelihood | Effect | What we do |
|---|---|---|---|
| A Taiwan gateway or its bank treats the token as a virtual asset under the 2022 letter | Medium | No card payments in Taiwan; TWD buyers limited to wallets that aren't cards | Describe the product accurately (section 3.1); apply to two gateways; give counsel's NFT-exclusion view to the gateway if it asks |
| The D3 decision is to register as a virtual-asset service provider | Unknown | Could end Taiwan card acceptance | Give D3 this input now |
| Crossmint keeps the US$1,500 limit | Medium | Card checkout abroad covers only cheap items | Transak, or ECPay overseas cards |
| Neither card provider refunds after delivery | Medium | The rail rule breaks for card checkout | Pick the provider that does; otherwise Planning rules |
| A gateway reviewer can't open our site | High, today | Approval waits | Owner decision on a reviewable site (section 2, item 3) |
| Gateways treat "own it now, ship it later" as delayed delivery | Medium | Reserves, rolling holds on settlements or a refusal | Explain that ownership passes at once, storage is free, and shipping is on request; ask about reserves directly |

## 8. Open questions

**For the owner.** The facts each draft needs:

- the company's legal name, tax ID (統一編號), responsible person and registered business items (營業項目);
- the settlement bank account;
- the website domain and customer-service contact;
- volumes: monthly sales, average order value, largest single order, and the share of buyers abroad;
- the target date for Phase 1.

**For Planning:**

- the merchant-of-record ruling (6.1);
- the D3 input (section 2);
- a reviewable site (section 2);
- `docs/payments/` as Payments' folder.

**For Compliance and counsel (CMP-02, CMP-06):**

- the NFT exclusion under Art. 3(1), and how it sits with the 2022 letter;
- the 7-day cancellation right for vaulted items;
- e-invoices for buyers abroad, and zero-rating;
- whether refundable bidder deposits count as stored value;
- who is the seller for consumer law when a provider is merchant of record.

**For the providers.** Each draft ends with its own list.

## Sources

Read through search-result summaries; check each one before use.

- ECPay, capture and refund API: https://developers.ecpay.com.tw/45919/ and https://developers.ecpay.com.tw/16567/ [P]
- ECPay, terms revision notes (membership types, prohibited uses): https://support.ecpay.com.tw/wp-content/uploads/2025/05/修正對照總說明_GW250505BS1.pdf and https://support.ecpay.com.tw/wp-content/uploads/2024/04/修正對照總說明_V1130408.pdf [P]
- ECPay, B2C e-invoice API: https://developers.ecpay.com.tw/?p=7829 [P]
- ECPay, fees as listed in its Shopify app: https://apps.shopify.com/ecpay-app-credit-card [S]
- ECPay, payment methods: https://ithelp.ithome.com.tw/articles/10230353 [S, 2020] and the 2025 shareholders' meeting minutes https://corp.ecpay.com.tw/wp-content/uploads/2026/06/綠界-115年度-股東常會議事錄.pdf [P]
- ECPay, NewebPay and TapPay fee comparison: https://ithelp.ithome.com.tw/articles/10317508 [S, 2023] and https://ithelp.ithome.com.tw/articles/10396944 [S]
- NewebPay, payment methods: https://wordpress.org/plugins/newebpay-payment/ [S]
- NewebPay, `CreditCard/Close`: https://agentskills.so/skills/paid-tw-skills-newebpay-refund [S]
- NewebPay, Ministry of Digital Affairs registration: https://tw.stock.yahoo.com/news/藍新金流通過數發部第三方支付機構能量登錄-113912482.html [S]
- ezPay invoice quota: https://root.packagist.org/packages/agriweather/laravel-ezpay-invoice [S]
- TapPay, backend API (`delay_capture_in_days`): https://docs.tappaysdk.com/tutorial/en/back.html [P]
- TapPay Portal manual: https://tappaysdk.com/documents/TapPay%20Portal%20User%20Manual.pdf [P]
- FSC card letter, 2022: https://blockcast.it/2022/07/22/taiwan-to-ban-credit-card-purchases-of-cryptocurrencies/ and https://technews.tw/2022/07/29/fsc-bans-virtual-currency-purchases-with-credit-cards/ [S]; status in 2026: https://udn.com/news/story/7239/9834006 [S]
- Virtual Asset Service Act, text: https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0400163 and https://law.fsc.gov.tw/LawContent.aspx?id=GL004301 [P]; FSC press release, 30 June 2026: https://www.fsc.gov.tw/ch/home.jsp?id=96&parentpath=0&mcustomize=news_view.jsp&dataserno=202606300002&dtable=News [P]; timing: https://rti.org.tw/news?pid=217642&uid=3 [S]
- Visa authorisation time frames, April 2024: https://corporate.review.visa.com/content/dam/VCOM/regional/na/us/support-legal/documents/authorization-framework-will-be-updated-to-simplify-authorization-processing-time-frames.pdf [P]; https://origin-www.produswest2.braintreepayments.com/blog/visa-compliance-updates-new-authorization-expiration-time-frames/ [S]
- Crossmint, payments overview and FAQ: https://docs.crossmint.com/payments/introduction [P]
- Crossmint, card limit: https://help.crossmint.com/articles/5580997462-how-do-i-increase-my-credit-card-transaction-limit [P]
- Crossmint, collection review: https://help.crossmint.com/articles/6942079093-crossmint-nft-collection-review [P]
- Crossmint, physical products: https://crossmint-knowledge-base.help.usepylon.com/articles/9419434439-can-i-use-crossmint-checkout-for-physical-products-without-nfts [P]
- Crossmint, own contracts: https://docs.crossmint.com/payments/guides/register-collection and https://docs.crossmint.com/minting/advanced/bring-your-own-smart-contract [P]
- Crossmint, pricing: https://www.crossmint.com/pricing [P]; aggregator figure: https://apis.io/plans/crossmint/crossmint-plans-pricing/ [S]
- Crossmint, countries: https://docs.crossmint.com/onramp/introduction/restricted-countries [P]
- Transak, NFT Checkout: https://docs.transak.com/docs/nft-checkout and https://transak.com/nft-checkout [P]; MCC 5815 and refunds on failed mints: https://transak.com/blog/how-nft-checkout-helps-nft-marketplaces and https://docs.transak.com/docs/nft-marketplace [P]
- Transak, KYC levels: https://docs.transak.com/guides/transak-different-kyc-levels and https://transak.notion.site/KYC-limits-for-NFT-Checkout-Sky-Mavis-150dfbdeb5d180149587d7f1afc14cd5 [P]
- Transak, own contracts: https://docs.transak.com/guides/how-to-add-nft-smart-contract-and-create-a-contractid and https://docs.transak.com/docs/nft-marketplace [P]
- Transak, coverage: https://transak.com/global-coverage [P]; fees: https://docs.avax.network/integrations/transak [S]
- Transak, KYB and allow-listing through a partner: https://docs.sequence.xyz/solutions/payments/checkout-sdk.md [S]
