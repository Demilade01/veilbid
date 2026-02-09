"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import { useAuctionContract, useAuctionState } from "@/hooks/use-auction-contract";

export function CreateAuctionForm() {
  const { address, isConnected } = useAccount();
  const { contract } = useAuctionContract();
  const { hasAuction, isLoading: loadingState } = useAuctionState();
  const { sendAsync, isPending } = useSendTransaction({});

  const [commitMinutes, setCommitMinutes] = useState(5);
  const [revealMinutes, setRevealMinutes] = useState(5);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!contract || !isConnected) return;
    setError(null);

    try {
      const now = Math.floor(Date.now() / 1000);
      const commitEnd = now + commitMinutes * 60;
      const revealEnd = commitEnd + revealMinutes * 60;

      const call = contract.populate("create_auction", [commitEnd, revealEnd]);
      await sendAsync([call]);
    } catch (err) {
      console.error("Create auction error:", err);
      setError(err instanceof Error ? err.message : "Failed to create auction");
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center text-purple-300 py-4">
        Connect your wallet to create an auction
      </div>
    );
  }

  if (loadingState) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
      </div>
    );
  }

  if (hasAuction) {
    return null; // Don't show form if auction exists
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-purple-200">Create New Auction</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-purple-300 mb-1">
              Commit Phase Duration (minutes)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={commitMinutes}
              onChange={(e) => setCommitMinutes(Number(e.target.value))}
              className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm text-purple-300 mb-1">
              Reveal Phase Duration (minutes)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={revealMinutes}
              onChange={(e) => setRevealMinutes(Number(e.target.value))}
              className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">
            {error}
          </div>
        )}

        <Button
          onClick={handleCreate}
          disabled={isPending}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Auction
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
