"use client";

import { useState } from "react";
import { Trophy, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAccount, useSendTransaction, useTransactionReceipt } from "@starknet-react/core";
import { useAuctionContract, useAuctionState } from "@/hooks/use-auction-contract";
import { GlowButton } from "@/components/ui/glow-button";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";

export function SettleButton() {
  const { isConnected } = useAccount();
  const { contract } = useAuctionContract();
  const { phase, hasAuction } = useAuctionState();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { sendAsync, data: txData, isPending: isSigning } = useSendTransaction({});
  const { isLoading: isConfirming } = useTransactionReceipt({
    hash: txData?.transaction_hash,
    watch: true,
  });

  const isPending = isSigning || isConfirming;

  const handleSettle = async () => {
    if (!contract || !isConnected) return;
    setError(null);
    setSuccess(null);

    try {
      const call = contract.populate("settle", []);
      await sendAsync([call]);
      toast.info("Settlement transaction submitted", {
        description: "Finalizing auction on the blockchain...",
      });
    } catch (err) {
      console.error("Settle auction error:", err);
      setError(err instanceof Error ? err.message : "Failed to settle auction");
      toast.error("Settlement Failed", {
        description: err instanceof Error ? err.message : "An error occurred while settling.",
      });
    }
  };

  if (!isConnected || !hasAuction || phase !== "ended") {
    return null;
  }

  return (
    <GlassCard variant="glow" className="border-emerald-500/30">
      <GlassCardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-emerald-400" />
          <GlassCardTitle className="text-lg text-emerald-400">Ready to Settle</GlassCardTitle>
        </div>
        <GlassCardDescription>
          The reveal phase has ended. Any user can settle the auction to determine the official winner.
        </GlassCardDescription>
      </GlassCardHeader>
      <GlassCardContent className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {txData && !isConfirming && !error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-400">Auction settled successfully!</p>
          </div>
        )}

        <GlowButton
          onClick={handleSettle}
          loading={isPending}
          disabled={isPending || !!txData}
          className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 border-emerald-500/50"
          variant="glow"
        >
          <Trophy className="w-4 h-4" />
          {isPending ? "Settling..." : "Settle Auction Now"}
        </GlowButton>
      </GlassCardContent>
    </GlassCard>
  );
}
