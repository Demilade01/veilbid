"use client";

import { motion } from "framer-motion";
import { Clock, Lock, Eye, Trophy, AlertCircle } from "lucide-react";
import { useAuctionState } from "@/hooks/use-auction-contract";

function formatTimeRemaining(endTimestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = endTimestamp - now;
  
  if (diff <= 0) return "Ended";
  
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

function formatTimestamp(timestamp: number): string {
  if (timestamp === 0) return "Not set";
  return new Date(timestamp * 1000).toLocaleString();
}

function truncateAddress(address: string | undefined): string {
  if (!address || address === "0x0") return "None";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const phaseConfig = {
  loading: { icon: Clock, color: "text-gray-400", bg: "bg-gray-800", label: "Loading..." },
  none: { icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-900/30", label: "No Active Auction" },
  commit: { icon: Lock, color: "text-blue-400", bg: "bg-blue-900/30", label: "Commit Phase" },
  reveal: { icon: Eye, color: "text-purple-400", bg: "bg-purple-900/30", label: "Reveal Phase" },
  ended: { icon: Clock, color: "text-orange-400", bg: "bg-orange-900/30", label: "Awaiting Settlement" },
  settled: { icon: Trophy, color: "text-green-400", bg: "bg-green-900/30", label: "Settled" },
};

export function AuctionStatus() {
  const {
    commitEnd,
    revealEnd,
    creator,
    highestBid,
    winner,
    settled,
    phase,
    isLoading,
    hasAuction,
  } = useAuctionState();

  const config = phaseConfig[phase as keyof typeof phaseConfig] || phaseConfig.loading;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 space-y-6">
        {/* Phase Badge */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bg}`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
            <span className={`font-semibold ${config.color}`}>{config.label}</span>
          </div>
          {isLoading && (
            <div className="animate-pulse text-purple-300 text-sm">Refreshing...</div>
          )}
        </div>

        {hasAuction ? (
          <>
            {/* Timing Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-purple-300 text-sm mb-1">Commit Ends</div>
                <div className="text-white font-mono text-lg">
                  {phase === "commit" ? formatTimeRemaining(commitEnd) : formatTimestamp(commitEnd)}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-purple-300 text-sm mb-1">Reveal Ends</div>
                <div className="text-white font-mono text-lg">
                  {phase === "reveal" ? formatTimeRemaining(revealEnd) : formatTimestamp(revealEnd)}
                </div>
              </div>
            </div>

            {/* Auction Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-purple-500/10">
                <span className="text-purple-300">Creator</span>
                <span className="text-white font-mono">{truncateAddress(creator)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-purple-500/10">
                <span className="text-purple-300">Highest Bid</span>
                <span className="text-white font-mono">
                  {highestBid > 0 ? `${highestBid.toString()} sats` : "No bids revealed"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-purple-300">Winner</span>
                <span className="text-white font-mono">{truncateAddress(winner)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-purple-200 mb-2">No auction has been created yet.</p>
            <p className="text-purple-400 text-sm">
              Connect your wallet and create an auction to get started.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
