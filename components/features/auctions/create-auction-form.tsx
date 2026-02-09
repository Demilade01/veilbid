"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Clock, AlertCircle, Loader2, Wallet } from "lucide-react";
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
import { GlowInput } from "@/components/ui/glow-input";

export function CreateAuctionForm() {
  const { isConnected } = useAccount();
  const { contract } = useAuctionContract();
  const { hasAuction, isLoading: loadingState } = useAuctionState();
  const { sendAsync, isPending } = useSendTransaction({});

  const [commitMinutes, setCommitMinutes] = useState("5");
  const [revealMinutes, setRevealMinutes] = useState("5");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!contract || !isConnected) return;
    setError(null);

    try {
      const now = Math.floor(Date.now() / 1000);
      const commitEnd = now + Number(commitMinutes) * 60;
      const revealEnd = commitEnd + Number(revealMinutes) * 60;

      const call = contract.populate("create_auction", [commitEnd, revealEnd]);
      await sendAsync([call]);
    } catch (err) {
      console.error("Create auction error:", err);
      setError(err instanceof Error ? err.message : "Failed to create auction");
    }
  };

  if (!isConnected) {
    return (
      <GlassCard>
        <GlassCardContent className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-veil-purple/10 flex items-center justify-center mb-3">
            <Wallet className="w-6 h-6 text-veil-purple-light" />
          </div>
          <p className="text-veil-text-muted text-sm">
            Connect wallet to create auction
          </p>
        </GlassCardContent>
      </GlassCard>
    );
  }

  if (loadingState) {
    return (
      <GlassCard>
        <GlassCardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-veil-purple-light" />
        </GlassCardContent>
      </GlassCard>
    );
  }

  if (hasAuction) {
    return null;
  }

  return (
    <GlassCard variant="elevated">
      <GlassCardHeader>
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-veil-purple-light" />
          <GlassCardTitle className="text-lg">Create Auction</GlassCardTitle>
        </div>
        <GlassCardDescription>
          Set up a new sealed-bid auction
        </GlassCardDescription>
      </GlassCardHeader>

      <GlassCardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <GlowInput
            type="number"
            min={1}
            max={60}
            value={commitMinutes}
            onChange={(e) => setCommitMinutes(e.target.value)}
            label="Commit Phase"
            suffix="min"
            leftIcon={<Clock className="w-4 h-4" />}
            inputSize="sm"
          />

          <GlowInput
            type="number"
            min={1}
            max={60}
            value={revealMinutes}
            onChange={(e) => setRevealMinutes(e.target.value)}
            label="Reveal Phase"
            suffix="min"
            leftIcon={<Clock className="w-4 h-4" />}
            inputSize="sm"
          />
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
        </AnimatePresence>

        <GlowButton
          onClick={handleCreate}
          loading={isPending}
          className="w-full"
        >
          <Plus className="w-4 h-4" />
          Create Auction
        </GlowButton>
      </GlassCardContent>
    </GlassCard>
  );
}
