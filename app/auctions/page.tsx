"use client";

import { motion } from "framer-motion";
import { Lock, Eye, Trophy, Info, Shield, Zap } from "lucide-react";
import {
  AuctionStatus,
  CreateAuctionForm,
  BidForm,
  SettleButton,
} from "@/components/features/auctions";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AuctionsPage() {
  return (
    <main className="relative min-h-screen pt-8 pb-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <StatusBadge variant="reveal" glow className="mb-4">
            <Zap className="w-4 h-4" />
            Live Auction
          </StatusBadge>
          <h1 className="text-3xl sm:text-4xl font-bold text-veil-text mb-4">
            VeilBid Auction Dashboard
          </h1>
          <p className="text-veil-text-muted max-w-xl mx-auto">
            Privacy-preserving sealed-bid auction powered by Starknet.
            Your bids remain hidden until the reveal phase.
          </p>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Auction Status */}
          <div className="lg:col-span-2 space-y-6">
            <AuctionStatus />

            {/* Action Cards */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-6"
            >
              <motion.div variants={fadeInUp}>
                <BidForm />
              </motion.div>
              <motion.div variants={fadeInUp} className="space-y-6">
                <CreateAuctionForm />
                <SettleButton />
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Info Panel */}
          <div className="space-y-6">
            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard variant="elevated">
                <GlassCardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-veil-purple-light" />
                    <GlassCardTitle className="text-lg">How It Works</GlassCardTitle>
                  </div>
                </GlassCardHeader>
                <GlassCardContent className="space-y-4">
                  {[
                    {
                      icon: Lock,
                      title: "1. Commit",
                      description: "Submit a hidden bid commitment",
                      color: "text-blue-400",
                      bg: "bg-blue-500/10",
                    },
                    {
                      icon: Eye,
                      title: "2. Reveal",
                      description: "Reveal your bid for verification",
                      color: "text-veil-purple-light",
                      bg: "bg-veil-purple/10",
                    },
                    {
                      icon: Trophy,
                      title: "3. Settle",
                      description: "Highest valid bid wins",
                      color: "text-emerald-400",
                      bg: "bg-emerald-500/10",
                    },
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-veil-surface/50 border border-veil-border/50"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${step.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <step.icon className={`w-4 h-4 ${step.color}`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-veil-text">
                          {step.title}
                        </div>
                        <div className="text-xs text-veil-text-dim">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </GlassCardContent>
              </GlassCard>
            </motion.div>

            {/* Privacy Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard variant="gradient">
                <GlassCardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-veil-purple-light" />
                    <GlassCardTitle className="text-lg">Privacy Guarantee</GlassCardTitle>
                  </div>
                </GlassCardHeader>
                <GlassCardContent>
                  <GlassCardDescription className="text-sm leading-relaxed">
                    Your bid amount is cryptographically hidden using a commit-reveal
                    scheme. No one can see your bid until the reveal phase begins.
                    This prevents front-running and ensures fair auctions.
                  </GlassCardDescription>
                  <div className="mt-4 p-3 rounded-lg bg-veil-surface/50 border border-veil-border/50">
                    <div className="text-xs text-veil-text-dim mb-1">
                      Commitment = Hash(bid + nonce)
                    </div>
                    <div className="font-mono text-xs text-veil-purple-light break-all">
                      Only you know the original values
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard>
                <GlassCardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-xl bg-veil-surface/50">
                      <div className="text-2xl font-bold text-veil-text">100%</div>
                      <div className="text-xs text-veil-text-dim">Private Bids</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-veil-surface/50">
                      <div className="text-2xl font-bold text-veil-text">Zero</div>
                      <div className="text-xs text-veil-text-dim">Front-running</div>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
