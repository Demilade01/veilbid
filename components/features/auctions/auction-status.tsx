"use client";

import { motion } from "framer-motion";
import { Clock, Lock, Eye, Trophy, AlertCircle, User, Bitcoin, Loader2 } from "lucide-react";
import { useAuctionState } from "@/hooks/use-auction-contract";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardContent,
} from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { CountdownTimer } from "@/components/ui/countdown-timer";

function formatTimestamp(timestamp: number): string {
  if (timestamp === 0) return "Not set";
  return new Date(timestamp * 1000).toLocaleString();
}

function truncateAddress(address: string | undefined): string {
  if (!address) return "None";
  
  // Convert to string if it's not already
  const addressStr = typeof address === 'string' ? address : String(address);
  
  // Check for zero address
  if (addressStr === "0x0" || addressStr === "0x00" || !addressStr.startsWith("0x")) {
    return "None";
  }
  
  return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
}

const phaseConfig = {
  loading: {
    variant: "loading" as const,
    icon: Loader2,
    label: "Loading...",
    description: "Fetching auction data",
  },
  none: {
    variant: "warning" as const,
    icon: AlertCircle,
    label: "No Active Auction",
    description: "Create an auction to get started",
  },
  commit: {
    variant: "commit" as const,
    icon: Lock,
    label: "Commit Phase",
    description: "Submit your sealed bid",
  },
  reveal: {
    variant: "reveal" as const,
    icon: Eye,
    label: "Reveal Phase",
    description: "Reveal your bid for verification",
  },
  ended: {
    variant: "ended" as const,
    icon: Clock,
    label: "Awaiting Settlement",
    description: "Auction ended, pending settlement",
  },
  settled: {
    variant: "settled" as const,
    icon: Trophy,
    label: "Settled",
    description: "Auction complete",
  },
};

export function AuctionStatus() {
  const {
    commitEnd,
    revealEnd,
    creator,
    highestBid,
    winner,
    phase,
    isLoading,
    hasAuction,
  } = useAuctionState();

  const config = phaseConfig[phase as keyof typeof phaseConfig] || phaseConfig.loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <GlassCard variant="glow" padding="lg">
        {/* Header with Phase Badge */}
        <GlassCardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <StatusBadge
                variant={config.variant}
                size="lg"
                icon
                glow
                pulse={phase === "commit" || phase === "reveal"}
              >
                {config.label}
              </StatusBadge>
            </div>
            {isLoading && (
              <div className="flex items-center gap-2 text-veil-text-dim text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Refreshing...
              </div>
            )}
          </div>
          <p className="text-veil-text-muted text-sm mt-2">{config.description}</p>
        </GlassCardHeader>

        <GlassCardContent>
          {hasAuction ? (
            <div className="space-y-6">
              {/* Countdown Timers */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-veil-surface border border-veil-border">
                  <div className="flex items-center gap-2 text-veil-text-muted text-sm mb-3">
                    <Lock className="w-4 h-4 text-blue-400" />
                    Commit Phase {phase === "commit" ? "Ends In" : "Ended"}
                  </div>
                  {phase === "commit" ? (
                    <CountdownTimer
                      endTimestamp={commitEnd}
                      variant="default"
                      showLabels={false}
                    />
                  ) : (
                    <div className="text-veil-text font-mono text-sm">
                      {formatTimestamp(commitEnd)}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-veil-surface border border-veil-border">
                  <div className="flex items-center gap-2 text-veil-text-muted text-sm mb-3">
                    <Eye className="w-4 h-4 text-veil-purple-light" />
                    Reveal Phase {phase === "reveal" ? "Ends In" : phase === "commit" ? "Starts After Commit" : "Ended"}
                  </div>
                  {phase === "reveal" ? (
                    <CountdownTimer
                      endTimestamp={revealEnd}
                      variant="default"
                      showLabels={false}
                    />
                  ) : (
                    <div className="text-veil-text font-mono text-sm">
                      {formatTimestamp(revealEnd)}
                    </div>
                  )}
                </div>
              </div>

              {/* Auction Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 px-4 rounded-xl bg-veil-surface/50 border border-veil-border/50">
                  <div className="flex items-center gap-2 text-veil-text-muted">
                    <User className="w-4 h-4" />
                    <span>Creator</span>
                  </div>
                  <span className="text-veil-text font-mono text-sm">
                    {truncateAddress(creator)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 px-4 rounded-xl bg-veil-surface/50 border border-veil-border/50">
                  <div className="flex items-center gap-2 text-veil-text-muted">
                    <Bitcoin className="w-4 h-4 text-[#F7931A]" />
                    <span>Highest Bid</span>
                  </div>
                  <span className="text-veil-text font-mono text-sm">
                    {highestBid > 0 ? (
                      <span className="text-emerald-400">{highestBid.toString()} sats</span>
                    ) : (
                      <span className="text-veil-text-dim">No bids revealed</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 px-4 rounded-xl bg-veil-surface/50 border border-veil-border/50">
                  <div className="flex items-center gap-2 text-veil-text-muted">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Winner</span>
                  </div>
                  <span className="text-veil-text font-mono text-sm">
                    {winner && winner !== "0x0" ? (
                      <span className="text-emerald-400">{truncateAddress(winner)}</span>
                    ) : (
                      <span className="text-veil-text-dim">TBD</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-veil-purple/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-veil-purple-light" />
              </div>
              <h3 className="text-lg font-medium text-veil-text mb-2">
                No Active Auction
              </h3>
              <p className="text-veil-text-muted text-sm max-w-sm mx-auto">
                Connect your wallet and create an auction to get started with
                privacy-preserving bidding.
              </p>
            </div>
          )}
        </GlassCardContent>
      </GlassCard>
    </motion.div>
  );
}
