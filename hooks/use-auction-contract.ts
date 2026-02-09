"use client";

import { useContract, useReadContract, useSendTransaction } from "@starknet-react/core";
import { useMemo } from "react";
import { VEILBID_AUCTION_ABI } from "@/lib/contracts";
import { getAuctionContractAddress } from "@/lib/constants";

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
  const address = getAuctionContractAddress();

  const { data: commitEnd, isLoading: loadingCommitEnd } = useReadContract({
    abi: VEILBID_AUCTION_ABI,
    address,
    functionName: "get_commit_end",
    args: [],
    watch: true,
  });

  const { data: revealEnd, isLoading: loadingRevealEnd } = useReadContract({
    abi: VEILBID_AUCTION_ABI,
    address,
    functionName: "get_reveal_end",
    args: [],
    watch: true,
  });

  const { data: creator, isLoading: loadingCreator } = useReadContract({
    abi: VEILBID_AUCTION_ABI,
    address,
    functionName: "get_creator",
    args: [],
    watch: true,
  });

  const { data: highestBid, isLoading: loadingHighestBid } = useReadContract({
    abi: VEILBID_AUCTION_ABI,
    address,
    functionName: "get_highest_bid",
    args: [],
    watch: true,
  });

  const { data: winner, isLoading: loadingWinner } = useReadContract({
    abi: VEILBID_AUCTION_ABI,
    address,
    functionName: "get_winner",
    args: [],
    watch: true,
  });

  const { data: settled, isLoading: loadingSettled } = useReadContract({
    abi: VEILBID_AUCTION_ABI,
    address,
    functionName: "get_settled",
    args: [],
    watch: true,
  });

  const isLoading =
    loadingCommitEnd ||
    loadingRevealEnd ||
    loadingCreator ||
    loadingHighestBid ||
    loadingWinner ||
    loadingSettled;

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
    hasAuction: phase !== "none" && phase !== "loading",
  };
}

/**
 * Hook to check if the current user has committed a bid
 */
export function useUserCommitment(userAddress: string | undefined) {
  const address = getAuctionContractAddress();

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
