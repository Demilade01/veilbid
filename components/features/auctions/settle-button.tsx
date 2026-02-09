"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Loader2 } from "lucide-react";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import { useAuctionContract, useAuctionState } from "@/hooks/use-auction-contract";

export function SettleButton() {
  const { isConnected } = useAccount();
  const { contract } = useAuctionContract();
  const { phase, hasAuction } = useAuctionState();
  const { sendAsync, isPending } = useSendTransaction({});

  const [error, setError] = useState<string | null>(null);

  const handleSettle = async () => {
    if (!contract || !isConnected) return;
    setError(null);

    try {
      const call = contract.populate("settle", []);
      await sendAsync([call]);
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gray-900/50 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-orange-400">
          <Trophy className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Settle Auction</h3>
        </div>

        <p className="text-purple-300 text-sm">
          The reveal phase has ended. Anyone can settle the auction to finalize the winner.
        </p>

        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">
            {error}
          </div>
        )}

        <Button
          onClick={handleSettle}
          disabled={isPending || !isConnected}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Settling...
            </>
          ) : (
            <>
              <Trophy className="w-4 h-4 mr-2" />
              Settle Auction
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
