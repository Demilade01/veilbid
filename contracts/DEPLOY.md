# Deploying the VeilBid Auction Contract

Two ways to deploy: **Starknet Foundry (sncast)** or **starkli**. Use Sepolia for testing.

---

## Prerequisites

1. **Built contract**  
   From `contracts/`: `scarb build`  
   Artifact: `target/dev/veilbid_auction_VeilBidAuction.contract_class.json`

2. **Funded account on Starknet Sepolia**  
   - Create an account (e.g. [Braavos](https://braavos.app/), [Argent](https://www.argent.xyz/)) and get Sepolia ETH/STRK from a faucet.  
   - You will use this account to declare and deploy.

3. **Deploy tool**  
   - **Option A:** [Starknet Foundry](https://foundry-rs.github.io/starknet-foundry/) (includes `sncast`)  
   - **Option B:** [starkli](https://book.starkli.rs/)

---

## Option A: Deploy with sncast (Starknet Foundry)

### 1. Install Starknet Foundry

```bash
# Windows (PowerShell)
curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.ps1 | powershell -ExecutionPolicy Bypass

# Or with starkup (if you use it for Scarb)
starkup install snforge
```

Ensure `sncast` is on your PATH.

### 2. Configure account (snfoundry.toml)

In `contracts/` create (or edit) `snfoundry.toml`:

```toml
[account.my_account]
address = "0x_YOUR_ACCOUNT_ADDRESS"
private_key = "0x_YOUR_PRIVATE_KEY"

# Or use keystore (safer):
# [account.my_account]
# address = "0x_YOUR_ACCOUNT_ADDRESS"
# keystore = "path/to/keystore.json"
```

For Sepolia, add:

```toml
[sncast]
network = "sepolia"
account = "my_account"
```

Alternatively you can pass `--network sepolia` and `--account my_account` on each command.

### 3. Declare the contract

From the **contracts** directory:

```bash
sncast --account my_account --network sepolia declare --contract-name VeilBidAuction --wait
```

> **Note:** Common flags (`--account`, `--network`) go **before** the subcommand (`declare`).

sncast automatically finds the contract class in `target/dev/` based on the contract name. Copy the printed **class hash** (e.g. `0x...`).

### 4. Deploy

Our constructor has no arguments, so no calldata:

```bash
sncast --account my_account --network sepolia deploy --class-hash <CLASS_HASH_FROM_STEP_3> --wait
```

Copy the **contract address** from the output.

### 5. Use the address in the frontend

In the project root `.env.local`:

```
NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS=0x_contract_address_from_step_4
```

---

## Option B: Deploy with starkli

### 1. Install starkli

See [starkli installation](https://book.starkli.rs/installation).

### 2. Declare

```bash
cd contracts
starkli declare target/dev/veilbid_auction_VeilBidAuction.contract_class.json --rpc https://starknet-sepolia.public.blastapi.io --account ~/.starknet_accounts/account.json --keystore ~/.starknet_accounts/keystore.json
```

Use your own RPC URL and account paths. Note the **class hash**.

### 3. Deploy (UDC)

```bash
starkli deploy <CLASS_HASH> --rpc ... --account ... --keystore ...
```

Use the same RPC and account. Copy the deployed **contract address** and set `NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS` in the frontend.

---

## After deployment

- Add the **contract address** to the repo README (and optionally to `lib/contracts/addresses.ts`).  
- Run the frontend with `NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS` set so the app can call the contract.

## Troubleshooting

- **Declaration fails:** Ensure the account has enough STRK/ETH for fees on Sepolia.  
- **Wrong network:** Double-check `--network sepolia` (or equivalent in config).  
- **Blake hash:** If sncast reports hash issues, see [Blake Hash Support](https://foundry-rs.github.io/starknet-foundry/getting-started/blake-hash-support.html).
