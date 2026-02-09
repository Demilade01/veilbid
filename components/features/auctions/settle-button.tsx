"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, AlertCircle, CheckCircle } from "lucide-react";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import { useAuctionContract, useAuctionState } from "@/hooks/use-auction-contract";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { StatusBadge } from "@/components/ui/status-badge";

export function SettleButton() {
  const { isConnected } = useAccount();
  const { contract } = useAuctionContract();
  const { phase, hasAuction } = useAuctionState();
  const { sendAsync, isPending } = useSendTransaction({});

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSettle = async () => {
    if (!contract || !isConnected) return;
    setError(null);

    try {
      const call = contract.populate("settle", []);
      await sendAsync([call]);
      setSuccess(true);
    } catch (err) {
      console.error("Settle error:", err);
      setError(err instanceof Error ? err.message : "Failed to settle auction");
    }
  };

  // Only show when auction has ended but not settled
  if (!hasAuction || phase !== "ended") {
    return null;
  }

  return (
    <GlassCard variant="elevated" className="border-amber-500/20">
      <GlassCardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <GlassCardTitle className="text-lg">Settle Auction</GlassCardTitle>
          </div>
          <StatusBadge variant="ended" size="sm" icon pulse>
            Ready
          </StatusBadge>
        </div>
        <GlassCardDescription>
          Finalize the auction and declare the winner
        </GlassCardDescription>
      </GlassCardHeader>

      <GlassCardContent className="space-y-4">
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-amber-200">
            The reveal phase has ended. Anyone can settle the auction to
            finalize the winner and complete the auction.
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
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
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-400">
                Auction settled successfully!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <GlowButton
          onClick={handleSettle}
          loading={isPending}
          disabled={!isConnected || success}
          variant="btc"
          className="w-full"
        >
          <Trophy className="w-4 h-4" />
          {success ? "Settled" : "Settle Auction"}
        </GlowButton>
      </GlassCardContent>
    </GlassCard>
  );
}
