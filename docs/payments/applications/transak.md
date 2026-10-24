# Transak application draft

Payments · PAY-01 · 24 Oct 2026 · **draft, not sent**. The owner submits it.

Second application for card checkout abroad, filed in parallel with Crossmint. It becomes the first choice if Crossmint can't raise its card limit far enough (`provider-comparison.md`, section 1). Rail: `card_checkout`.

## Before sending

- [ ] Planning has ruled on merchant of record (`provider-comparison.md`, section 6.1).
- [ ] The owner has filled every `[owner: …]` below.
- [ ] Smart contracts has seen the contract requirements below.
- [ ] Every [P] and [S] fact used here has been re-checked on Transak's live pages.

## What we apply for

- **Product:** NFT Checkout for our own ERC-721 sales contract on Ethereum mainnet, with a test integration on Sepolia first.
- **Limits:** high-value purchases up to `[owner: e.g. US$50,000]` for buyers who pass Transak's enhanced KYC.
- **Settlement:** in USDC, on-chain, to our sales contract.
- **Countries:** buyers outside Taiwan in markets where our launch policy allows card payments. We block the other markets ourselves before checkout starts.

## Business verification (KYB) [G, confirm with Transak]

Same documents as the Crossmint draft. Transak may also review the contract and its audit [P]. Both audits are funded (D11), and the reports come before mainnet.

## Project description (ready to paste)

Paste the English section of `product-description.md` (sections 1 to 10), then add:

> **How checkout fits.**
>
> - Each item is one ERC-721 token in our own sales contract on Ethereum mainnet.
> - A buyer outside Taiwan picks an item and pays by card through Transak. Transak calls our purchase function with the calldata we supply, and the token goes to the buyer's own wallet.
> - The buyer has already passed our own identity check (Sumsub) and sanctions screening. We also screen the receiving wallet before checkout starts.
> - The contract locks a card-funded token for a clearing period, so it can't be transferred, resold or redeemed until the payment clears.

## What our contract needs

For Smart contracts (SC-01):

- **From Transak:** our purchase function must accept being called by Transak's executor and send the token to the buyer's wallet. It is allow-listed after Transak's review [P].
- **Shared with the Crossmint draft:** a recipient separate from the caller, the item ID, card-funded purchases recorded and locked (ERC-6982), and the final mainnet address only after the audits.

## Message to Transak sales (ready to send once approved)

> Hello,
>
> We're `[owner: company]`, a Taiwan company launching `[Planning: brand]`. We sell our own stock of collectibles (graded cards, watches, luxury bags, sneakers and modern art), at fixed prices and in timed auctions. Each item is held in an insured vault and represented by one ERC-721 token on Ethereum mainnet, which the owner can redeem for delivery.
>
> We'd like to use NFT Checkout so that buyers outside Taiwan can pay by card, with the token delivered to their own wallet. Many orders are high-value: our average is `[owner]` and our largest reach `[owner]`.
>
> Before we apply, could you answer the questions below? Thank you.
>
> `[owner: name, title, email]`

## Questions for Transak

1. **Physical items.** Our tokens represent vaulted physical items that can be redeemed for delivery. NFT Checkout runs under MCC 5815, a code for digital goods [P]. Can you support us under that code, or another one?
2. **Merchant of record.** Who is merchant of record for the card payment, and who issues the buyer's receipt? Can the Taiwan company be named as the seller of the item?
3. **Chargeback scope.** What does "100% chargeback protection" cover: fraud only, or disputes such as item not received or cancelled too? Is there a cap, a reserve or a clawback?
4. **Refunds after delivery.** Can we refund a buyer to their original card after the token is delivered? How is the token returned or burned?
5. **Limits and KYC.** What are the current per-transaction and monthly limits for each KYC tier, for NFT Checkout, on Ethereum mainnet?
6. **Reusing our KYC.** Our buyers already pass identity checks through Sumsub before checkout. Can your KYC rely on ours, or reuse a Sumsub check, so the buyer isn't verified twice?
7. **Clearing lock.** Will you deliver a token that can't be transferred until the payment clears?
8. **Fees.** What is the full fee for NFT Checkout? Who pays it? Is mainnet gas included?
9. **Settlement.** Is settlement in USDC to our contract supported, and how long after the payment does it arrive?
10. **Coverage.** Which countries and US states can use NFT Checkout by card? Do you onboard Taiwan companies?
11. **Card country and screening.** Do we get the card's BIN country before the payment completes? Do you screen the receiving wallet?
12. **Testing.** Can we test on Sepolia in your staging environment?
13. **Reconciliation.** Do you provide webhooks for every order, refund and dispute, and a daily report or API with your fee per order?

## What not to say or promise

Same as the Crossmint draft.
