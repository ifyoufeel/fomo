# Crossmint application draft

Payments · PAY-01 · 24 Oct 2026 · **draft, not sent**. The owner submits it.

First choice for card checkout abroad (`provider-comparison.md`, section 1). Rail: `card_checkout`.

## Before sending

- [ ] Planning has ruled on merchant of record (`provider-comparison.md`, section 6.1). Crossmint's documentation says Crossmint stays merchant of record for every transaction [P].
- [ ] The owner has filled every `[owner: …]` below.
- [ ] Smart contracts has seen the contract requirements below (a change request in `docs/handoffs/PAY-01.md`).
- [ ] Every [P] and [S] fact used here has been re-checked on Crossmint's live pages.

## What we apply for

- **Product:** Crossmint Checkout for card payments into our own ERC-721 sales contract on Ethereum mainnet. We'd like to test on Sepolia first.
- **Card limit:** a raise of the per-transaction limit from the US$1,500 default [P] to `[owner: e.g. US$25,000]`, because watches, bags and art usually cost more than the default.
- **Settlement:** in USDC, on-chain, to our sales contract.
- **Countries:** buyers outside Taiwan in markets where our launch policy allows card payments. We block the other markets ourselves before checkout starts.

## Business verification (KYB) [G, confirm with Crossmint]

- The company's registration documents, and an English translation of the registration record.
- Directors and beneficial owners, with ID for each.
- Proof of the company's address.
- A description of the business: the English product description.
- Our AML and sanctions controls, in summary: identity checks at T1 through Sumsub, sanctions screening, and wallet screening through TRM or Chainalysis.

## Project description (ready to paste)

Paste the English section of `product-description.md` (sections 1 to 10), then add:

> **How checkout fits.**
>
> - Each item is one ERC-721 token in our own sales contract on Ethereum mainnet.
> - A buyer outside Taiwan picks an item and pays by card through Crossmint. Your treasury calls our purchase function, and the token goes to the buyer's own wallet.
> - The buyer has already passed our identity check and sanctions screening. We also screen the receiving wallet before checkout starts.
> - The contract locks a card-funded token for a clearing period, so it can't be transferred, resold or redeemed until the payment clears.

## What our contract needs to meet Crossmint's requirements

For Smart contracts (SC-01). Crossmint's requirements [P]:

- an ERC-721 contract;
- a purchase function that sends the token to a `recipient` address that isn't the caller;
- Crossmint's treasury addresses able to call that function any number of times;
- review by Crossmint, which takes 1 to 2 business days;
- for USDC-priced functions, care in picking the recipient parameter, because a wrong pick sends tokens to the wrong address and they can't be recovered.

What we add on our side:

- The function takes the item's ID, so a buyer buys one specific item. It isn't a generic mint.
- The function records that the purchase is card-funded and starts the clearing lock (ERC-6982).
- The final mainnet address exists only after both audits close. Crossmint's production review waits for it.

## Message to Crossmint sales (ready to send once approved)

> Hello,
>
> We're `[owner: company]`, a Taiwan company launching `[Planning: brand]`. We sell our own stock of collectibles (graded cards, watches, luxury bags, sneakers and modern art), at fixed prices and in timed auctions. Each item is held in an insured vault and represented by one ERC-721 token on Ethereum mainnet, which the owner can redeem for delivery.
>
> We'd like to use Crossmint Checkout so that buyers outside Taiwan can pay by card, with the token delivered to their own wallet. Our average order is `[owner]` and our largest single orders reach `[owner]`, so we'd need a per-transaction limit above the default.
>
> Before we apply, could you answer the questions below? Thank you.
>
> `[owner: name, title, email]`

## Questions for Crossmint

1. **Merchant of record.** For NFT checkout, who is merchant of record for the card payment, and what does the buyer's card statement show? Who issues the buyer's receipt? Can the Taiwan company be named as the seller of the item on the receipt?
2. **Chargeback scope.** Do you carry all chargebacks, or fraud only? Which disputes come back to us: item not received, not as described, cancelled? Is there a cap, a reserve or a clawback?
3. **Refunds after delivery.** Can we refund a buyer to their original card after the token is delivered, for a cancellation within 7 days or an order we cancel? How is the token returned or burned in that case?
4. **Card limit.** What is the highest per-transaction limit you can approve for us, and on what conditions? Is there a monthly limit per buyer?
5. **Clearing lock.** Will you deliver a token that can't be transferred until the payment clears? Is there any rule against that?
6. **Fees.** What is the full fee for a card payment? Who pays it, the buyer or us? Is gas on Ethereum mainnet included? Is there a monthly minimum?
7. **Settlement.** Is settlement in USDC to our contract on Ethereum mainnet supported, or only ETH? How long after the payment does it arrive?
8. **Card country and screening.** Do we get the card's BIN country before the payment completes? Do you screen the receiving wallet and the cardholder against sanctions lists?
9. **3-D Secure.** Does it run on every payment, and who handles step-up?
10. **Testing.** Does your staging environment support Sepolia, with test cards?
11. **Physical items.** Our tokens represent vaulted physical items that the owner can redeem, and we don't use investment language. Does that pass your collection review? Is anything about it restricted under your payment processor's terms?
12. **Company eligibility.** Do you onboard Taiwan companies? Is there any country in our list where your card checkout isn't available?
13. **Reconciliation.** Do you provide webhooks for every payment, refund and dispute, and a daily report or API with your fee per transaction?

## What not to say or promise

- No investment language, and nothing about prices rising. Crossmint's collection review bars it [P].
- Don't promise mystery packs or buyback. Name them only as later, outside card checkout, as in the product description.
