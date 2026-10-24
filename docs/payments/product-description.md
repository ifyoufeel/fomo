# Product description for payment providers

Payments · PAY-01 · 24 Oct 2026 · draft

Every application reuses this text, so all providers hear the same thing. The English and zh-TW versions match section by section. Change both together, and keep them in line with `docs/briefs/01-project-brief.md`.

**Writing rules for this text:**

- Describe what exists at Phase 1, and name the later features plainly as later. Providers dislike surprises more than any one product.
- No investment language: nothing about appreciation, returns, yield or "assets". Crossmint's review bars it [P], and every acquirer reads it as a risk.
- Don't claim legal conclusions we don't have yet, such as "we are not a virtual-asset service provider" (D3, CMP-02).
- In applications, the brand is `[Planning: lastfomo, the brand name the owner picked in DES-01, once it's recorded in the brief]`.

---

## English

### 1. Who we are

- `[owner: company legal name]`, a company incorporated in Taiwan (tax ID `[owner: 統一編號]`), is the seller of every item on the platform.
- Brand and website: `[Planning: brand]`, `[owner: domain]`.

### 2. What we sell

We run an online shop for collectibles. We sell only our own stock: no consignment and no matching of buyers with outside sellers. Categories at launch:

- graded trading cards, and sealed trading-card products;
- watches and luxury bags;
- sneakers, toys and figures;
- modern art and prints.

We don't take in ivory, rhino horn, tortoiseshell or antiquities.

### 3. How people buy

1. **Fixed price.** Items are listed at a set price and bought outright.
2. **Timed auctions.** Our own items are sold in timed auctions with a reserve price.
   - Bidders can set a maximum bid, and the system bids for them up to it.
   - A bid in the last few minutes extends the end time a little.
   - The winner pays the hammer price plus a 20% buyer's premium. The total, premium included, is shown before every bid.
   - Bidding is free: there are no bid fees.

### 4. The digital ownership record

- Each physical item has one digital ownership record: a non-fungible token (ERC-721) on Ethereum, one token per item.
- The record shows who owns that item and gives them the right to have it delivered.
- It can't be split, it pays no interest or yield, and it can't be lent. It isn't a currency and it isn't an investment product.
- Most buyers never see the token: it sits in a wallet created at sign-up, which they can export.
- We don't buy, sell or exchange virtual currencies for users, and we don't hold users' money, crypto or balances.

### 5. Storage and delivery

- Items stay in insured vaults: our intake hub in Taiwan, a third-party vault in Singapore and PSA Vault in the US. Storage is free.
- An owner can ask for delivery at any time and pays a delivery (redemption) fee. When the item is delivered, its record is retired.
- **Ownership passes at the moment of sale.** Storage is a free service, and shipping happens when the owner asks for it.

### 6. How people pay

- **TWD through this gateway:**
  - cards, and the wallets listed in the application, for purchases and winning bids;
  - ATM transfer and convenience-store payments only for fees, such as the delivery fee. Never for an item.
- **USDC:** buyers pay from their own wallet straight to our sales contract. It doesn't pass through any card gateway.
- **Cards abroad:** a card-checkout provider handles buyers outside Taiwan.
- **One price.** Prices are kept in US dollars. A TWD charge is quoted from that price at checkout, includes tax, and is fixed for that checkout.

### 7. Refunds and cancellations

- We follow Taiwan's rules for cancelling distance sales.
- A refund always goes back to the payment method that was used.
- Every refund voids the e-invoice or issues an allowance (折讓).

### 8. Fraud and risk controls

- **Identity checks.** Identity verification and sanctions screening before anyone buys or bids. Bid limits rise with the verification level.
- **Wallet screening** for wallets that pay in USDC or receive items.
- **3-D Secure** on card payments.
- **Clearing period.** An item bought by card can't be transferred, resold or delivered until the payment has cleared.
- **Auctions.** High-value lots need registration before bidding. A bidder who pays by card and leads in the final 7 days is backed by a card authorisation, which is captured if they win and released if they don't. This depends on the provider supporting holds.

### 9. Later, and outside this gateway

- **From Phase 2:**
  - owners may resell to each other for USDC, settled on-chain, with no card or TWD involved;
  - we may offer to buy back some liquid graded cards. How we pay sellers will be agreed with each provider first.
- **Mystery packs:** only after a written lawyer's opinion for each market. Sold for USDC only, never through a card gateway, with published odds and a value floor. No buyback in Taiwan.
- **Free promotional draws and a free prediction contest:** no purchase or stake, and no payment of any kind.

### 10. What we never do

Paid raffles, gambling or betting, bid fees, split or yield-bearing tokens, and stored value or user balances.

---

## 繁體中文

### 一、公司簡介

- ［待業主填寫：公司全名］（統一編號：［待業主填寫］），依中華民國法律設立，為平台上所有商品的賣方。
- 品牌與網站：［待 Planning 確認：品牌名稱］，［待業主填寫：網址］。

### 二、銷售商品

本公司經營線上收藏品零售平台，只銷售本公司自有庫存，不代售，也不媒合第三方賣家。上線時的商品類別：

- 鑑定評級卡牌及未拆封集換式卡牌商品；
- 手錶及精品包；
- 球鞋、玩具及公仔；
- 現代藝術品及版畫。

本公司不收受象牙、犀牛角、玳瑁製品或古物。

### 三、銷售方式

1. **定價銷售：** 商品以固定價格上架，買家直接購買。
2. **限時拍賣：** 本公司自有商品以限時拍賣出售，設有底價。
   - 出價者可設定最高出價，由系統在上限內代為出價。
   - 結束前數分鐘內有人出價，結束時間會小幅延長。
   - 得標者支付落槌價加 20% 買方佣金；每次出價前，畫面都會顯示含佣金的總金額。
   - 出價完全免費，不收任何出價手續費。

### 四、數位所有權憑證

- 每件實體商品對應一個數位所有權憑證：以太坊上的非同質化代幣（ERC-721），一物一證。
- 憑證表彰該件商品的所有權，以及申請實體交付的權利。
- 憑證不可分割、不生利息或收益、不可出借；不是貨幣，也不是投資商品。
- 多數買家不會直接接觸代幣：代幣存放在註冊時建立的錢包中，使用者可自行匯出。
- 本公司不為使用者買賣或兌換虛擬通貨，也不保管使用者的款項、虛擬通貨或任何餘額。

### 五、保管與交付

- 商品存放於投保的保管庫：台灣收貨中心、新加坡第三方保管庫及美國 PSA Vault。保管免費。
- 擁有者可隨時申請實體交付，並支付交付（提領）費用；商品交付後，該憑證即註銷。
- **商品所有權於成交時即移轉。** 保管為免費服務，實體寄送則依擁有者申請辦理。

### 六、付款方式

- **新台幣（透過貴公司）：**
  - 信用卡及申請書所列之行動支付，用於購買商品及支付得標款；
  - ATM 轉帳及超商代碼／條碼僅用於費用（例如交付運費），一律不用於購買商品。
- **USDC：** 買家由自己的錢包直接付款至本公司的銷售合約，不經任何信用卡收單服務。
- **海外信用卡：** 台灣以外的買家，由另一家海外信用卡結帳服務商處理。
- **單一價格：** 商品以美元定價；以新台幣付款時，於結帳當下依該價格報出含稅金額，並在該次結帳內固定不變。

### 七、退款與解除契約

- 依台灣通訊交易解除契約的相關規定辦理。
- 退款一律退回原付款方式。
- 每筆退款同步作廢發票或開立折讓。

### 八、風險控管

- **身分驗證：** 購買或出價前，須完成身分驗證及制裁名單篩檢；出價上限依驗證等級提高。
- **錢包篩檢：** 以 USDC 付款或接收商品的錢包須經篩檢。
- **3D 驗證：** 信用卡付款採 3D 驗證。
- **清算期：** 以信用卡購得的商品，在款項清算完成前，不得轉讓、轉售或申請交付。
- **拍賣：** 高額拍品須事先登記才能出價。以信用卡付款、且在最後 7 天內領先的出價者，以信用卡預先授權擔保：得標後請款，未得標即取消授權。此做法須貴公司支援預先授權。

### 九、日後規劃（不經貴公司服務）

- **第二階段起：**
  - 擁有者之間可用 USDC 互相轉售，於鏈上結算，不涉及信用卡或新台幣；
  - 本公司可能對部分流通性高的評級卡提出收購報價；如何付款給賣方，將事先與各服務商確認。
- **盲盒：** 須先取得各市場律師的書面意見才會開放；僅以 USDC 銷售，一律不經信用卡收單服務；公布機率並設有價值下限，台灣不提供回購。
- **免費促銷抽獎及免費預測活動：** 無需購買、無需下注，不收取任何費用。

### 十、本公司絕不從事的業務

付費抽獎、賭博或下注、出價手續費、可分割或生息的代幣，以及儲值或使用者餘額。
