"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, Loader2, CheckCircle } from "lucide-react";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import { useAuctionContract, useAuctionState, useUserCommitment } from "@/hooks/use-auction-contract";
import { computeBidCommitment, generateNonce } from "@/lib/crypto";

// Local storage key for saving bid data
const BID_STORAGE_KEY = "veilbid_pending_bid";

interface PendingBid {
  bidAmount: string;
  nonce: string;
  commitment: string;
}

function savePendingBid(bid: PendingBid) {
  if (typeof window !== "undefined") {
    localStorage.setItem(BID_STORAGE_KEY, JSON.stringify(bid));
  }
}

function loadPendingBid(): PendingBid | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(BID_STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
  }
  return null;
}

function clearPendingBid() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(BID_STORAGE_KEY);
  }
}

export function BidForm() {
  const { address, isConnected } = useAccount();
  const { contract } = useAuctionContract();
  const { phase, hasAuction } = useAuctionState();
  const { hasCommitted, isLoading: loadingCommitment } = useUserCommitment(address);
  const { sendAsync, isPending } = useSendTransaction({});

  const [bidAmount, setBidAmount] = useState("");
  const [pendingBid, setPendingBid] = useState<PendingBid | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load pending bid from localStorage on mount
  useEffect(() => {
    const saved = loadPendingBid();
    if (saved) {
      setPendingBid(saved);
      setBidAmount(saved.bidAmount);
    }
  }, []);

  const handleCommit = async () => {
    if (!contract || !isConnected || !bidAmount) return;
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

      // Save bid data locally for reveal phase
      const bid: PendingBid = {
        bidAmount: amount.toString(),
        nonce: nonce.toString(),
        commitment,
      };
      savePendingBid(bid);
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
      clearPendingBid();
      setPendingBid(null);
      setBidAmount("");
      setSuccess("Bid revealed successfully!");
    } catch (err) {
      console.error("Reveal bid error:", err);
      setError(err instanceof Error ? err.message : "Failed to reveal bid");
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center text-purple-300 py-4">
        Connect your wallet to place a bid
      </div>
    );
  }

  if (!hasAuction) {
    return null;
  }

  const isCommitPhase = phase === "commit";
  const isRevealPhase = phase === "reveal";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 space-y-4">
        {/* Commit Phase UI */}
        {isCommitPhase && (
          <>
            <div className="flex items-center gap-2 text-blue-400">
              <Lock className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Place Your Sealed Bid</h3>
            </div>

            {hasCommitted ? (
              <div className="flex items-center gap-2 text-green-400 bg-green-900/20 rounded-lg p-4">
                <CheckCircle className="w-5 h-5" />
                <span>You have already committed a bid. Wait for reveal phase.</span>
              </div>
            ) : (
              <>
                <p className="text-purple-300 text-sm">
                  Your bid is encrypted until the reveal phase. Enter your bid amount in satoshis (wBTC).
                </p>

                <div>
                  <label className="block text-sm text-purple-300 mb-1">
                    Bid Amount (satoshis)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="e.g., 100000"
                    className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <Button
                  onClick={handleCommit}
                  disabled={isPending || !bidAmount}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Committing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Commit Bid
                    </>
                  )}
                </Button>
              </>
            )}
          </>
        )}

        {/* Reveal Phase UI */}
        {isRevealPhase && (
          <>
            <div className="flex items-center gap-2 text-purple-400">
              <Eye className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Reveal Your Bid</h3>
            </div>

            {pendingBid ? (
              <>
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Your Bid</span>
                    <span className="text-white font-mono">{pendingBid.bidAmount} sats</span>
                  </div>
                </div>

                <Button
                  onClick={handleReveal}
                  disabled={isPending}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Revealing...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Reveal Bid
                    </>
                  )}
                </Button>
              </>
            ) : hasCommitted ? (
              <div className="text-yellow-400 bg-yellow-900/20 rounded-lg p-4">
                You committed a bid but the reveal data was not found locally.
                If you committed from this browser, try refreshing.
              </div>
            ) : (
              <div className="text-purple-300 text-center py-4">
                You did not commit a bid during the commit phase.
              </div>
            )}
          </>
        )}

        {/* Ended/Settled Phase */}
        {(phase === "ended" || phase === "settled") && (
          <div className="text-center text-purple-300 py-4">
            The auction has ended. Check the results above.
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-400 text-sm bg-green-900/20 rounded-lg p-3">
            {success}
          </div>
        )}
      </div>
    </motion.div>
  );
}
