/**
 * VeilBid Auction Contract ABI
 * Generated from contracts/src/lib.cairo interface
 */

export const VEILBID_AUCTION_ABI = [
  {
    type: "impl",
    name: "VeilBidAuctionImpl",
    interface_name: "veilbid_auction::IVeilBidAuction",
  },
  {
    type: "interface",
    name: "veilbid_auction::IVeilBidAuction",
    items: [
      {
        type: "function",
        name: "create_auction",
        inputs: [
          { name: "commit_end", type: "core::integer::u64" },
          { name: "reveal_end", type: "core::integer::u64" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "commit_bid",
        inputs: [{ name: "commitment", type: "core::felt252" }],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "reveal_bid",
        inputs: [
          { name: "bid_amount", type: "core::integer::u128" },
          { name: "nonce", type: "core::felt252" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "settle",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_commit_end",
        inputs: [],
        outputs: [{ type: "core::integer::u64" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_reveal_end",
        inputs: [],
        outputs: [{ type: "core::integer::u64" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_creator",
        inputs: [],
        outputs: [{ type: "core::starknet::contract_address::ContractAddress" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_highest_bid",
        inputs: [],
        outputs: [{ type: "core::integer::u128" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_winner",
        inputs: [],
        outputs: [{ type: "core::starknet::contract_address::ContractAddress" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_settled",
        inputs: [],
        outputs: [{ type: "core::bool" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_commitment",
        inputs: [
          { name: "bidder", type: "core::starknet::contract_address::ContractAddress" },
        ],
        outputs: [{ type: "core::felt252" }],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [],
  },
  {
    type: "event",
    name: "veilbid_auction::VeilBidAuction::AuctionCreated",
    kind: "struct",
    members: [
      { name: "creator", type: "core::starknet::contract_address::ContractAddress", kind: "key" },
      { name: "commit_end", type: "core::integer::u64", kind: "data" },
      { name: "reveal_end", type: "core::integer::u64", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "veilbid_auction::VeilBidAuction::BidCommitted",
    kind: "struct",
    members: [
      { name: "bidder", type: "core::starknet::contract_address::ContractAddress", kind: "key" },
    ],
  },
  {
    type: "event",
    name: "veilbid_auction::VeilBidAuction::BidRevealed",
    kind: "struct",
    members: [
      { name: "bidder", type: "core::starknet::contract_address::ContractAddress", kind: "key" },
      { name: "amount", type: "core::integer::u128", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "veilbid_auction::VeilBidAuction::AuctionSettled",
    kind: "struct",
    members: [
      { name: "winner", type: "core::starknet::contract_address::ContractAddress", kind: "key" },
      { name: "amount", type: "core::integer::u128", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "veilbid_auction::VeilBidAuction::Event",
    kind: "enum",
    variants: [
      { name: "AuctionCreated", type: "veilbid_auction::VeilBidAuction::AuctionCreated", kind: "nested" },
      { name: "BidCommitted", type: "veilbid_auction::VeilBidAuction::BidCommitted", kind: "nested" },
      { name: "BidRevealed", type: "veilbid_auction::VeilBidAuction::BidRevealed", kind: "nested" },
      { name: "AuctionSettled", type: "veilbid_auction::VeilBidAuction::AuctionSettled", kind: "nested" },
    ],
  },
] as const;
