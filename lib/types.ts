/**
 * Shared domain types for VeilBid (auctions, bids, phases).
 * Align with Cairo contract and frontend usage.
 */

export type AuctionPhase = "commit" | "reveal" | "ended";

export interface Auction {
  id: string;
  creator: string;
  endTime: number; // unix
  phase: AuctionPhase;
  highestBid?: string;
  winner?: string;
  // extend as contract exposes more
}

export interface BidCommitment {
  auctionId: string;
  commitmentHash: string; // hash(bid_value, nonce)
}
