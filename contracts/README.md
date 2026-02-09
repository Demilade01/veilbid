# VeilBid Auction Contract

Sealed-bid (commit-reveal) auction contract for Starknet. Bids are hidden until the reveal phase.

## Requirements

- [Scarb](https://docs.swmansion.com/scarb/) (Cairo package manager)

## Build

```bash
scarb build
```

Artifacts (Sierra, CASM) are in `target/dev/`.

## Design

- **create_auction(commit_end, reveal_end)** – Creator sets phase end timestamps (use block timestamp from chain).
- **commit_bid(commitment)** – During commit phase, bidders submit `commitment = poseidon_hash(bid_amount, nonce)`.
- **reveal_bid(bid_amount, nonce)** – During reveal phase, bidders reveal; contract checks hash and updates winner if bid is highest.
- **settle()** – After reveal end, marks auction settled (winner and amount in events).

Frontend must compute the same commitment off-chain (e.g. with starknet.js poseidon) before calling `commit_bid`, and pass the same `(bid_amount, nonce)` in `reveal_bid`.

## Deploy (Starknet Sepolia)

See **[DEPLOY.md](DEPLOY.md)** for step-by-step instructions using **sncast** (Starknet Foundry) or **starkli**. After deployment, set `NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS` in the frontend `.env.local`.

## Tests

To add unit tests with Starknet Foundry:

```bash
scarb add snforge_std
```

Then add a `#[cfg(test)] mod tests;` in `src/lib.cairo` and implement tests in `src/tests.cairo` (see [Starknet Foundry](https://foundry-rs.github.io/starknet-foundry/) docs).

## wBTC

This version does not hold or transfer tokens; it only determines the winner. To add wBTC payouts, extend the contract to accept a token address and call transfer on settle.
