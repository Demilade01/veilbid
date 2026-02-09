"use client";

import { useContract, useReadContract } from "@starknet-react/core";
import { useMemo } from "react";
import { VEILBID_AUCTION_ABI } from "@/lib/contracts";
import { getAuctionContractAddress, type HexString } from "@/lib/constants";

/**
 * Hook to get the auction contract instance
 */
export function useAuctionContract() {
  const address = getAuctionContractAddress();
  
  const { contract } = useContract({
    abi: VEILBID_AUCTION_ABI,
    address,
  });

  return { contract, address };
}

/**
 * Hook to read auction state from the contract
 */
export function useAuctionState() {
  const address: HexString | undefined = getAuctionContractAddress();

  const { data: commitEnd, isLoading: loadingCommitEnd, error: errorCommitEnd } = useReadContract({
    abi: VEILBID_AUCTION_ABI,
    address,
    functionName: "get_commit_end",
    args: [],
    watch: true,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const { data: revealEnd, isLoading: loadingRevealEnd, error: errorRevealEnd } = useReadContract({
    abi: VEILBID_AUCTION_ABI,
    address,
    functionName: "get_reveal_end",
    args: [],
    watch: true,
    refetchInterval: 10000,
  });

  const { data: creator, isLoading: loadingCreator, error: errorCreator } = useReadContract({
    abi: VEILBID_AUCTION_ABI,
    address,
    functionName: "get_creator",
    args: [],
    watch: true,
    refetchInterval: 10000,
  });

  const { data: highestBid, isLoading: loadingHighestBid, error: errorHighestBid } = useReadContract({
    abi: VEILBID_AUCTION_ABI,
    address,
    functionName: "get_highest_bid",
    args: [],
    watch: true,
    refetchInterval: 10000,
  });

  const { data: winner, isLoading: loadingWinner, error: errorWinner } = useReadContract({
    abi: VEILBID_AUCTION_ABI,
    address,
    functionName: "get_winner",
    args: [],
    watch: true,
    refetchInterval: 10000,
  });

  const { data: settled, isLoading: loadingSettled, error: errorSettled } = useReadContract({
    abi: VEILBID_AUCTION_ABI,
    address,
    functionName: "get_settled",
    args: [],
    watch: true,
    refetchInterval: 10000,
  });

  const isLoading =
    loadingCommitEnd ||
    loadingRevealEnd ||
    loadingCreator ||
    loadingHighestBid ||
    loadingWinner ||
    loadingSettled;

  const hasError =
    errorCommitEnd ||
    errorRevealEnd ||
    errorCreator ||
    errorHighestBid ||
    errorWinner ||
    errorSettled;

  // Log errors for debugging
  if (hasError) {
    console.error("Auction state fetch errors:", {
      errorCommitEnd,
      errorRevealEnd,
      errorCreator,
      errorHighestBid,
      errorWinner,
      errorSettled,
    });
  }

  // Determine current phase based on timestamps
  const phase = useMemo(() => {
    if (!commitEnd || !revealEnd) return "loading";
    
    const commitEndNum = Number(commitEnd);
    const revealEndNum = Number(revealEnd);
    
    // No auction created yet
    if (commitEndNum === 0) return "none";
    
    const now = Math.floor(Date.now() / 1000);
    
    if (now < commitEndNum) return "commit";
    if (now < revealEndNum) return "reveal";
    if (settled) return "settled";
    return "ended";
  }, [commitEnd, revealEnd, settled]);

  return {
    commitEnd: commitEnd ? Number(commitEnd) : 0,
    revealEnd: revealEnd ? Number(revealEnd) : 0,
    creator: creator as string | undefined,
    highestBid: highestBid ? BigInt(highestBid.toString()) : BigInt(0),
    winner: winner as string | undefined,
    settled: Boolean(settled),
    phase,
    isLoading,
    hasError: Boolean(hasError),
    hasAuction: phase !== "none" && phase !== "loading",
  };
}

/**
 * Hook to check if the current user has committed a bid
 */
export function useUserCommitment(userAddress: HexString | undefined) {
  const address: HexString | undefined = getAuctionContractAddress();

  const { data: commitment, isLoading } = useReadContract({
    abi: VEILBID_AUCTION_ABI,
    address,
    functionName: "get_commitment",
    args: userAddress ? [userAddress] : undefined,
    watch: true,
    enabled: Boolean(userAddress),
  });

  const hasCommitted = commitment && commitment !== BigInt(0);

  return {
    commitment: commitment?.toString(),
    hasCommitted,
    isLoading,
  };
}
