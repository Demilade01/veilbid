# VeilBid Codebase Structure

Best-practice layout for Next.js (App Router) + Starknet + Cairo contracts in one repo.

---

## Top-level layout

```
veilbid/
├── app/                    # Next.js App Router (routes only)
├── components/             # React components
├── contracts/              # Cairo / Scarb project (Starknet contracts)
├── lib/                    # Shared logic, config, types, contract bindings
├── hooks/                  # Custom React hooks (Starknet, auctions)
├── config/                 # Env, chain config, constants (optional; can live in lib)
├── public/
├── docs/                   # This file, ADRs, etc.
└── ...
```

---

## 1. `app/` — Routes and pages only

- **Convention:** One folder = one route segment. Keep page components thin; delegate to `components/` and `hooks/`.
- **Use:** `layout.tsx` for shared UI (e.g. provider, nav), `page.tsx` for the route screen, `loading.tsx` / `error.tsx` where useful.

```
app/
├── layout.tsx              # Root layout, StarknetProvider, fonts
├── page.tsx                # Home
├── globals.css
├── auctions/
│   ├── page.tsx            # List auctions
│   └── [id]/
│       └── page.tsx        # Auction detail (commit/reveal UI)
└── ...
```

---

## 2. `components/` — By type and feature

- **`components/ui/`** — Shadcn primitives (Button, Card, Input, Form, etc.). Add via Shadcn CLI; avoid business logic here.
- **`components/layout/`** — Shell: Header, Nav, Footer, WalletButton. Reused across pages.
- **`components/providers/`** — React context providers (e.g. Starknet). One file per provider.
- **`components/features/`** — Feature-specific UI (auctions, bidding). Co-locate with the domain.

```
components/
├── ui/                     # Shadcn (button, card, form, input, label, sonner, …)
├── layout/
│   ├── header.tsx
│   ├── nav.tsx
│   └── wallet-button.tsx   # Connect / Disconnect, address, chain
├── providers/
│   └── starknet-provider.tsx
└── features/
    └── auctions/
        ├── auction-card.tsx
        ├── auction-detail-view.tsx
        ├── commit-bid-form.tsx
        └── reveal-bid-form.tsx
```

---

## 3. `contracts/` — Cairo (Scarb) project

- **One Scarb project** for all Starknet contracts. Build and deploy from here; frontend reads ABI and address from `lib/contracts/`.
- **Naming:** Clear entrypoints (e.g. `veilbid_auction` or `auction`) and consistent with frontend calls.

```
contracts/
├── Scarb.toml              # Scarb manifest, dependencies
├── lib.cairo               # Or src/ with modules
├── src/
│   ├── lib.cairo
│   ├── auction.cairo       # Auction logic (create, commit, reveal, settle)
│   └── ...
└── tests/                  # Starknet Foundry tests (if used)
```

---

## 4. `lib/` — Shared code and contract integration

- **`lib/utils.ts`** — Generic helpers (e.g. `cn`). Keep as-is.
- **`lib/contracts/`** — Contract addresses, ABIs, and (optionally) typed call builders. Single source of truth for “which contract on which chain.”
- **`lib/constants.ts`** — Chain IDs, app name, etc.
- **`lib/types.ts`** — Shared TS types (Auction, Bid, Phase, etc.).

```
lib/
├── utils.ts
├── constants.ts            # Chain IDs, CONTRACT_ADDRESS (or from env)
├── types.ts                # Auction, Bid, Phase, …
└── contracts/
    ├── addresses.ts        # Per-chain contract address(es)
    ├── auction-abi.json    # Generated or copied from contracts/
    └── index.ts            # Re-export addresses + ABI for frontend
```

---

## 5. `hooks/` — Custom React hooks

- **Starknet:** Wrappers around `@starknet-react/core` if you need a consistent API (e.g. “current account or throw”).
- **Auctions:** Data and actions that touch the contract (read auctions, commit bid, reveal, settle). Keeps pages simple and testable.

```
hooks/
├── use-auctions.ts          # List auctions (from contract/indexer)
├── use-auction.ts           # Single auction by id
├── use-commit-bid.ts        # commit_bid tx
├── use-reveal-bid.ts        # reveal_bid tx
└── use-settle.ts            # settle tx (optional)
```

---

## 6. Config and env

- **`.env.local`** (gitignored): `NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS`, `NEXT_PUBLIC_CHAIN_ID` or similar.
- **Constants:** In `lib/constants.ts` (and optionally `lib/contracts/addresses.ts`) read from `process.env.NEXT_PUBLIC_*` so the rest of the app does not touch `process.env` directly.

---

## Data flow (high level)

```
User action (e.g. "Place bid")
  → Page (app/auctions/[id]/page.tsx)
  → Feature component (components/features/auctions/commit-bid-form.tsx)
  → Hook (hooks/use-commit-bid.ts)
  → @starknet-react/core (useSendTransaction) + lib/contracts (address, ABI)
  → Starknet network
```

---

## Summary

| Area           | Purpose |
|----------------|--------|
| `app/`         | Routes and page composition only |
| `components/ui/`| Shadcn primitives |
| `components/layout/` | Header, nav, wallet button |
| `components/providers/` | Starknet provider |
| `components/features/auctions/` | Auction list/detail, commit/reveal forms |
| `contracts/`   | Cairo/Scarb Starknet contracts |
| `lib/`         | Utils, constants, types, contract addresses + ABI |
| `hooks/`       | useAuctions, useCommitBid, useRevealBid, etc. |

This keeps routes thin, contracts in one place, and contract integration (addresses, ABI, hooks) centralized and easy to change when you deploy or add wBTC support.
