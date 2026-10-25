# Auction events and realtime channels (C3 additions)

Marketplace · MKT-01 · 25 Oct 2026 · Version 0.1, **a proposal for C3 v0**

Backend core maintains contract C3 (events) and Marketplace adds the auction channels (brief, "Contracts between chats"). This file is what Marketplace asks BE-04 to include. Planning approves it as part of C3. Source markers are as in `sale-rules.md`.

## 1. Principles

- **Postgres is the truth.** Every event is written to the outbox in the same transaction as the change it describes. Realtime messages are a copy that can be late, repeated or lost. A client that misses one resyncs (section 6).
- **One sequence per lot.** Each lot has a counter, `seq`, that rises by one with every *Lot* event in section 2, and with nothing else.
  - `auction.opened` is 1.
  - After that, `seq` covers bids that change something public, a lowered reserve, voids and removals, pauses, the close, a withdrawal and settlement. An extension travels inside the event that caused it.
  - A leader's quiet raise gets a bid number (`sale-rules.md`, 4.4) but no `seq`. So the channel never has a gap that a client can't fill.
  - Clients use `seq` to spot gaps and drop repeats.
- **Deterministic message IDs.**
  - A public lot message has the ID `{lotId}:{seq}`. Any other message uses its outbox row's ID.
  - Ably drops a repeated publish with the same ID within about 2 minutes [P], so outbox retries don't show twice.
  - Clients still dedupe by `seq`, which covers retries after that window.
- **The publisher keeps order.** The outbox worker publishes one lot's events in `seq` order, one lot at a time. Different lots run in parallel.
- **Amounts** are integers in the ledger's minor unit (C1). **Times** are the database's UTC times, in ISO 8601 with milliseconds.
- **No personal data in public events.** Bidders appear by their per-lot code (`settlement.md`, 3.1).

## 2. Event catalogue

**Visibility:** *Lot* goes to the live lot channel and the snapshot. *User* goes to that user's private channel. *Ops* goes to the operator channel. Every event also feeds notifications and the audit log.

| Event | Visibility | Payload, beyond the lot ID, `seq` and time | Written by |
|---|---|---|---|
| `auction.scheduled` | Ops | Sale, start, scheduled end, latest close, opening bid, estimate | `auction.schedule` |
| `auction.opened` | Lot | Opening bid, reserve status, reserve commitment, end, latest close | `auction.open`: a system job at the start time |
| `auction.bid_accepted` | Lot | Price, leader code, bid count (accepted bids that changed something public), reserve status, end, `extended` flag, next minimum bid | `auction.place_bid`, when anything public changes |
| `auction.reserve_lowered` | Lot | Reserve status (never the amount); price, leader, next minimum, end and `extended` flag, since a lowered reserve can lift the price | `auction.lower_reserve` |
| `auction.bid_voided` | Lot | Bidder code; the new price, leader, reserve status, next minimum, end and `extended` flag | `auction.void_bid`, `auction.remove_bidder` |
| `auction.paused`, `auction.resumed` | Lot | Time left when paused; the new end and latest close on resume | `auction.pause_sale`, `auction.resume_sale` |
| `auction.closed` | Lot | Sold or unsold, winner code, winning bid, premium, total, bid log URL and hash | `auction.close` |
| `auction.settled` | Lot | Sale kind only. The Ops copy adds the transaction reference | `auction.settle` |
| `auction.withdrawn` | Lot | None: the reason stays internal | `auction.withdraw` |
| `auction.paid`, `auction.returned` | Ops | Lot, sale kind, total; for a return, the refund reference | `auction.record_payment`, `sale.cancel_within_right` |
| `auction.offer_accepted`, `auction.offer_lapsed` | Ops | Lot, offer kind, bidder code, total | `auction.accept_offer`, the offer-expiry job |
| `bidder.max_set` | User | Your maximum, whether you lead, the price, your all-in at your maximum | `auction.place_bid`, also when nothing public changed |
| `bidder.outbid` | User | Lot, price, next minimum; whether the USDC you set aside can come back | `auction.place_bid` (someone else's bid) |
| `bidder.leading_again` | User | Lot, price. If your backing was released, a note that a win would be paid within 48 hours (`sale-rules.md`, 4.8) | `auction.void_bid`, `auction.remove_bidder` |
| `bidder.payment_received` | User | Lot, total | `auction.record_payment` |
| `bidder.won` | User | Lot, winning bid, premium, total; the payment deadline, if any | `auction.close` |
| `bidder.payment_due_reminder` | User | Lot, total, deadline | Deadline job |
| `bidder.defaulted` | User, Ops | Lot; the strike count | `auction.mark_defaulted` |
| `bidder.offer` | User | Lot, the offer kind (second chance or post-auction), price, premium, total, expiry | `auction.offer_second_chance`, `auction.offer_post_auction` |
| `bidder.registration_decided` | User | Lot, approved or not, the lot limit | `auction.register` or an operator's review |
| `sale.listed`, `sale.price_changed`, `sale.withdrawn` | Ops, plus the snapshot | Listing, price, units available | `sale.list`, `sale.change_price`, `sale.withdraw` |
| `sale.availability_changed` | Snapshot | Units available; sold out | `sale.reserve`, `sale.release_reservation`, `sale.complete` |
| `buyer.reservation` | User | Listing, unit, the reservation's end | `sale.reserve` |
| `buyer.purchase_completed` | User | Listing, item, total | `sale.complete` |
| `buyer.refund_issued` | User | Order, amount, payment method | `sale.cancel_within_right` |

**Not sent:** the reserve amount, any maximum other than your own, the reason for a removal, and anything about wallets or transactions.

## 3. Channels

| Channel (Ably) | Who may subscribe | What it carries |
|---|---|---|
| `auction:{lotId}` | **Active bidders only:** users with a maximum on that lot, and users registered for it | *Lot* events |
| `user:{userId}` | That user | *User* events |
| `ops:auctions` | Operators | *Ops* events, plus a copy of every *Lot* event |

- **Access is by token.** Our API issues Ably tokens with exactly these subscribe capabilities. Only the server publishes.
- **Upgrading a watcher.** A watcher who places a first bid gets a new token with the lot channel and switches from the snapshot to the live channel.

## 4. Why watchers don't get the live channel

- **The cost of a live watcher channel.** 10,000 watchers getting one message a second is 10,000 messages a second for a single lot. The brief notes that would use Ably Pro's whole limit.
- **Active bidders are a small group.** A hot lot might have a few hundred. Their messages scale with bids, not with viewers.
- **The rest see a snapshot** served from the edge cache (section 5). Each extra watcher costs one cached request, not one Ably message.

## 5. The watcher snapshot

- **Endpoint:** `GET /v1/auctions/{lotId}/snapshot`, public, with `Cache-Control: public, s-maxage=1, stale-while-revalidate=1`. The origin builds at most about one snapshot a second per lot per edge region.
- **Content:**
  - the public state (price, leader code, bid count, reserve status, end, latest close, next minimum);
  - `seq`;
  - the database time it was built, which lets the client correct its clock for the countdown.
- **Refresh, set in MKT-05:** every 5 seconds; every 2 seconds in the last 10 minutes and during a soft close; never while the tab is hidden.
- **Cost.** At those rates, 10,000 watchers make about 2,000–5,000 edge requests a second. MKT-05's load test measures it against Vercel's request pricing [G].
- **Bidders' own state:** `GET /v1/auctions/{lotId}/me`, private and not cached. It returns your maximum, whether you lead, your backing and `seq`.
- **Fixed-price listings** use the same snapshot pattern for units available. They have no live channel.

## 6. Resync

The client keeps the last `seq` it applied for each lot.

1. **Gaps.** A message with `seq` at or below that is a repeat and is dropped. A jump of more than one is a gap.
2. **Resync.** On a gap, a reconnect or the tab becoming visible, the client fetches `/me` (bidders) or the snapshot (watchers). It applies that state, then applies queued messages with a higher `seq`.
3. **The countdown** always runs from the server's end time and the server-time offset, never from the device clock alone.

## 7. Rate limits and bot protection (numbers set in MKT-05)

| Limit | Starting value |
|---|---|
| Bids by one user on one lot | 5 in 10 seconds |
| Bids by one user, all lots | 60 a minute |
| Bid requests from one IP address | 120 a minute |
| Checkout reservations by one user | 10 a minute |

- **Bid and checkout routes need** a signed-in user, the policy check (T1 for bidding) and an idempotency key. A repeated key returns the first result and is never a second bid.
- **Bot protection** on bid and checkout routes, for example Vercel BotID or a firewall challenge [G]. It must not slow a bid in the last 2 minutes: challenge when the session starts, not on each bid.
- **The terms of sale** forbid bidding software other than our own maximum bids. With the soft close, sniping tools gain nothing anyway.
- **Over a limit:** `rate_limited`, with a retry time. Being refused never extends a lot.

## 8. What MKT-05's load test must show

- **The scenario:**
  - one hot lot with 300 active bidders on the live channel;
  - 10,000 watchers on the snapshot;
  - 2 bids a second for the last 10 minutes, with extensions.
- **What passes:**
  - Ably's messages and connections stay inside the plan's limits;
  - the snapshot origin stays near one build a second per region;
  - no client shows a `seq` out of order after resync.
