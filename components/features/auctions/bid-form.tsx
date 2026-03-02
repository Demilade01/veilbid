"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, CheckCircle, AlertCircle, Bitcoin, Shield, Wallet } from "lucide-react";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import { useAuctionContract, useAuctionState, useUserCommitment } from "@/hooks/use-auction-contract";
import { computeBidCommitment, generateNonce } from "@/lib/crypto";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { GlowInput } from "@/components/ui/glow-input";
import { StatusBadge } from "@/components/ui/status-badge";

// Local storage keys for saving bid data
const BID_STORAGE_KEY = "veilbid_pending_bid";
const CONTRACT_ADDRESS_KEY = "veilbid_contract_address";

interface PendingBid {
  bidAmount: string;
  nonce: string;
  commitment: string;
  contractAddress: string;
  userAddress: string;
  auctionCommitEnd: number;
}

async function savePendingBid(bid: PendingBid) {
  try {
    await fetch("/api/bids", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bid),
    });
  } catch (error) {
    console.error("Failed to save pending bid to DB:", error);
  }
}

async function loadPendingBid(currentContractAddress: string, currentUserAddress: string, auctionCommitEnd: number): Promise<PendingBid | null> {
  try {
    const res = await fetch(`/api/bids?user=${currentUserAddress}&contract=${currentContractAddress}&auctionCommitEnd=${auctionCommitEnd}`);
    if (res.ok) {
      const bid = await res.json();
      if (bid && bid.id) {
        return bid as PendingBid;
      }
    }
  } catch (error) {
    console.error("Failed to load pending bid from DB:", error);
  }
  return null;
}

async function clearPendingBid(currentContractAddress: string, currentUserAddress: string, auctionCommitEnd: number) {
  try {
    await fetch(`/api/bids?user=${currentUserAddress}&contract=${currentContractAddress}&auctionCommitEnd=${auctionCommitEnd}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Failed to clear pending bid from DB:", error);
  }
}

export function BidForm() {
  const { address, isConnected } = useAccount();
  const { contract, address: contractAddress } = useAuctionContract();
  const { phase, hasAuction, commitEnd } = useAuctionState();
  const { hasCommitted } = useUserCommitment(address);
  const { sendAsync, isPending } = useSendTransaction({});

  const [bidAmount, setBidAmount] = useState("");
  const [pendingBid, setPendingBid] = useState<PendingBid | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load pending bid from DB on mount and when contract/auction/address changes
  useEffect(() => {
    // Immediately clear state to prevent flashing previous user's bid data
    setPendingBid(null);
    setBidAmount("");

    async function fetchBid() {
      if (contractAddress && address && commitEnd > 0) {
        const saved = await loadPendingBid(contractAddress, address, commitEnd);
        if (saved) {
          setPendingBid(saved);
          setBidAmount(saved.bidAmount);
        }
      }
    }

    fetchBid();
  }, [contractAddress, address, commitEnd]);

  const handleCommit = async () => {
    if (!contract || !isConnected || !bidAmount || !contractAddress || !address) return;
    setError(null);
    setSuccess(null);

    try {
      const amount = BigInt(bidAmount);
      if (amount <= 0) {
        setError("Bid amount must be positive");
        return;
      }

      const nonce = generateNonce();
      const commitment = computeBidCommitment(amount, nonce);

      // Save bid data locally for reveal phase with contract address and auction identifier
      const bid: PendingBid = {
        bidAmount: amount.toString(),
        nonce: nonce.toString(),
        commitment,
        contractAddress,
        userAddress: address,
        auctionCommitEnd: commitEnd,
      };
      await savePendingBid(bid);
      setPendingBid(bid);

      const call = contract.populate("commit_bid", [commitment]);
      await sendAsync([call]);
      setSuccess("Bid committed! Save your bid details for the reveal phase.");
    } catch (err) {
      console.error("Commit bid error:", err);
      setError(err instanceof Error ? err.message : "Failed to commit bid");
    }
  };

  const handleReveal = async () => {
    if (!contract || !isConnected || !pendingBid) return;
    setError(null);
    setSuccess(null);

    try {
      const call = contract.populate("reveal_bid", [
        BigInt(pendingBid.bidAmount),
        pendingBid.nonce,
      ]);
      await sendAsync([call]);
      // We no longer clear the bid from DB here.
      // It stays as local receipt so the user sees "Bid revealed successfully"
      // instead of "Reveal Data Not Found" when the on-chain commitment clears.
      setSuccess("Reveal transaction submitted!");
    } catch (err) {
      console.error("Reveal bid error:", err);
      setError(err instanceof Error ? err.message : "Failed to reveal bid");
    }
  };

  if (!isConnected) {
    return (
      <GlassCard variant="elevated" className="h-full">
        <GlassCardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-veil-purple/10 flex items-center justify-center mb-4">
            <Wallet className="w-7 h-7 text-veil-purple-light" />
          </div>
          <h3 className="text-lg font-medium text-veil-text mb-2">
            Connect Wallet
          </h3>
          <p className="text-veil-text-muted text-sm">
            Connect your wallet to place a bid
          </p>
        </GlassCardContent>
      </GlassCard>
    );
  }

  if (!hasAuction) {
    return (
      <GlassCard variant="elevated" className="h-full">
        <GlassCardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7 text-amber-400" />
          </div>
          <h3 className="text-lg font-medium text-veil-text mb-2">
            No Active Auction
          </h3>
          <p className="text-veil-text-muted text-sm">
            Create an auction first to start bidding
          </p>
        </GlassCardContent>
      </GlassCard>
    );
  }

  const isCommitPhase = phase === "commit";
  const isRevealPhase = phase === "reveal";

  // Only consider user as having committed if:
  // 1. They have an on-chain commitment (hasCommitted)
  // 2. They have pending bid data for THIS specific auction
  const hasCommittedForThisAuction = hasCommitted && pendingBid !== null && pendingBid.auctionCommitEnd === commitEnd;

  // They no longer have an on-chain commitment but we have their local data for THIS auction
  const alreadyRevealed = !hasCommitted && pendingBid !== null && pendingBid.auctionCommitEnd === commitEnd;

  return (
    <GlassCard variant="elevated" className="h-full">
      <GlassCardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCommitPhase ? (
              <Lock className="w-5 h-5 text-blue-400" />
            ) : isRevealPhase ? (
              <Eye className="w-5 h-5 text-veil-purple-light" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            )}
            <GlassCardTitle className="text-lg">
              {isCommitPhase
                ? "Place Sealed Bid"
                : isRevealPhase
                  ? "Reveal Your Bid"
                  : "Auction Ended"}
            </GlassCardTitle>
          </div>
          {isCommitPhase && (
            <StatusBadge variant="commit" size="sm" icon>
              Private
            </StatusBadge>
          )}
        </div>
        <GlassCardDescription>
          {isCommitPhase
            ? "Your bid stays hidden until reveal phase"
            : isRevealPhase
              ? "Reveal your bid for verification"
              : "Check the results above"}
        </GlassCardDescription>
      </GlassCardHeader>

      <GlassCardContent className="space-y-4">
        {/* Commit Phase UI */}
        <AnimatePresence mode="wait">
          {isCommitPhase && (
            <motion.div
              key="commit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {hasCommittedForThisAuction ? (
                <div className="space-y-4">
                  {/* Success Message */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-emerald-400 mb-1">
                        Bid Committed Successfully! ✓
                      </div>
                      <div className="text-xs text-emerald-400/70">
                        Your sealed bid has been submitted to the blockchain.
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <Lock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-400 mb-2">
                        What happens next?
                      </div>
                      <ul className="text-xs text-blue-400/80 space-y-1.5">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>Your bid amount is cryptographically hidden</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>Wait for the commit phase to end</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>Return during reveal phase to reveal your bid</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span className="font-medium">You cannot change or submit another bid</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Disabled Button */}
                  <GlowButton
                    disabled
                    className="w-full opacity-60 cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Bid Already Committed
                  </GlowButton>
                </div>
              ) : (
                <>
                  <GlowInput
                    type="number"
                    min={1}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="100000"
                    label="Bid Amount"
                    suffix="sats"
                    leftIcon={<Bitcoin className="w-4 h-4 text-[#F7931A]" />}
                    hint="Enter your bid in satoshis"
                    variant="glow"
                  />

                  <div className="flex items-start gap-2 p-3 rounded-lg bg-veil-surface/50 border border-veil-border/50">
                    <Shield className="w-4 h-4 text-veil-purple-light shrink-0 mt-0.5" />
                    <p className="text-xs text-veil-text-dim">
                      Your bid is cryptographically hidden. Only you know the
                      amount until the reveal phase.
                    </p>
                  </div>

                  <GlowButton
                    onClick={handleCommit}
                    loading={isPending}
                    disabled={!bidAmount}
                    className="w-full"
                  >
                    <Lock className="w-4 h-4" />
                    Commit Sealed Bid
                  </GlowButton>
                </>
              )}
            </motion.div>
          )}

          {/* Reveal Phase UI */}
          {isRevealPhase && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {alreadyRevealed ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-veil-surface border border-veil-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-veil-text-muted">
                        Revealed Bid
                      </span>
                      <StatusBadge variant="ended" size="sm">
                        Revealed
                      </StatusBadge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bitcoin className="w-5 h-5 text-[#F7931A]" />
                      <span className="text-2xl font-bold font-mono text-veil-text">
                        {pendingBid.bidAmount}
                      </span>
                      <span className="text-veil-text-muted">sats</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-emerald-400">
                        Bid Revealed Successfully!
                      </div>
                      <div className="text-xs text-emerald-400/70 mt-1">
                        Your bid has been successfully revealed on-chain. Wait for the auction to end.
                      </div>
                    </div>
                  </div>
                </div>
              ) : hasCommittedForThisAuction ? (
                <>
                  <div className="p-4 rounded-xl bg-veil-surface border border-veil-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-veil-text-muted">
                        Your Committed Bid
                      </span>
                      <StatusBadge variant="reveal" size="sm">
                        Ready to Reveal
                      </StatusBadge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bitcoin className="w-5 h-5 text-[#F7931A]" />
                      <span className="text-2xl font-bold font-mono text-veil-text">
                        {pendingBid.bidAmount}
                      </span>
                      <span className="text-veil-text-muted">sats</span>
                    </div>
                  </div>

                  <GlowButton
                    onClick={handleReveal}
                    loading={isPending}
                    disabled={!!success}
                    variant="glow"
                    className="w-full"
                  >
                    <Eye className="w-4 h-4" />
                    {success ? "Transaction Submitted" : "Reveal Bid"}
                  </GlowButton>
                </>
              ) : hasCommitted ? (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-amber-400">
                      Reveal Data Not Found
                    </div>
                    <div className="text-xs text-amber-400/70 mt-1">
                      You committed a bid but the reveal data was not found
                      locally. Try refreshing if you committed from this browser.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-veil-surface flex items-center justify-center">
                    <Lock className="w-6 h-6 text-veil-text-dim" />
                  </div>
                  <p className="text-veil-text-muted text-sm">
                    You did not commit a bid during the commit phase.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Ended/Settled Phase */}
          {(phase === "ended" || phase === "settled") && (
            <motion.div
              key="ended"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-8"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-veil-text-muted text-sm">
                The auction has ended. Check the results above.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-400">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCardContent>
    </GlassCard>
  );
}
