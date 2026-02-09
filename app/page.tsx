"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  Trophy,
  Shield,
  Zap,
  Bitcoin,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { GlowButton } from "@/components/ui/glow-button";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
} from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Mock auction data for preview
const mockAuctions = [
  {
    id: 1,
    title: "Rare Ordinal #4521",
    phase: "commit" as const,
    bids: 12,
    timeLeft: "2h 34m",
    minBid: "0.05 BTC",
  },
  {
    id: 2,
    title: "Bitcoin Punk #892",
    phase: "reveal" as const,
    bids: 8,
    timeLeft: "45m",
    minBid: "0.12 BTC",
  },
  {
    id: 3,
    title: "Inscription Collection",
    phase: "commit" as const,
    bids: 23,
    timeLeft: "5h 12m",
    minBid: "0.08 BTC",
  },
];

export default function Home() {
  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-8 pt-24 pb-16">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-veil-purple/20 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-veil-purple-dark/30 rounded-full blur-[100px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 inline-block"
          >
            <div className="relative">
              <Image
                src="/veilbid.png"
                alt="VeilBid Logo"
                width={100}
                height={100}
                className="rounded-2xl"
                priority
              />
              <div className="absolute inset-0 rounded-2xl glow-purple animate-glow-pulse" />
            </div>
          </motion.div>

          {/* Tagline badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <StatusBadge variant="reveal" glow className="text-sm">
              <Shield className="w-4 h-4" />
              Privacy-First Auction Protocol
            </StatusBadge>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-veil-text mb-6 tracking-tight"
          >
            Private Bitcoin Auctions
            <br />
            <span className="text-transparent bg-clip-text bg-veil-gradient-purple text-glow-strong">
              on Starknet
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-veil-text-muted mb-10 leading-relaxed"
          >
            Sealed-bid auctions with cryptographic privacy. Your bids stay hidden
            until reveal, ensuring fair outcomes without front-running.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auctions">
              <GlowButton variant="glow" size="xl">
                <Zap className="w-5 h-5" />
                Explore Auctions
                <ArrowRight className="w-5 h-5" />
              </GlowButton>
            </Link>
            <GlowButton variant="secondary" size="xl">
              <Bitcoin className="w-5 h-5" />
              Connect Wallet
            </GlowButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: "100%", label: "Private Bids" },
              { value: "Zero", label: "Front-running" },
              { value: "Fair", label: "Settlement" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-veil-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-veil-text-dim">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-veil-text mb-4"
            >
              How VeilBid Works
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-veil-text-muted max-w-2xl mx-auto"
            >
              A simple three-phase process ensures complete privacy and fairness
              in every auction.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                step: 1,
                icon: Lock,
                title: "Commit Phase",
                description:
                  "Submit a cryptographic commitment of your bid. The actual amount stays completely hidden from everyone.",
                variant: "commit" as const,
                color: "text-blue-400",
                bgGlow: "bg-blue-500/10",
              },
              {
                step: 2,
                icon: Eye,
                title: "Reveal Phase",
                description:
                  "Reveal your bid by providing the original amount and nonce. The contract verifies it matches your commitment.",
                variant: "reveal" as const,
                color: "text-veil-purple-light",
                bgGlow: "bg-veil-purple/10",
              },
              {
                step: 3,
                icon: Trophy,
                title: "Settlement",
                description:
                  "The highest valid bid wins. Fair, transparent, and cryptographically guaranteed. No disputes possible.",
                variant: "settled" as const,
                color: "text-emerald-400",
                bgGlow: "bg-emerald-500/10",
              },
            ].map((phase, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <GlassCard
                  variant="elevated"
                  className="h-full group hover:border-veil-purple/40"
                >
                  <GlassCardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${phase.bgGlow} flex items-center justify-center border border-veil-border group-hover:glow-sm transition-all`}
                      >
                        <phase.icon className={`w-6 h-6 ${phase.color}`} />
                      </div>
                      <StatusBadge variant={phase.variant} size="sm">
                        Step {phase.step}
                      </StatusBadge>
                    </div>
                    <GlassCardTitle className="text-xl">
                      {phase.title}
                    </GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <GlassCardDescription className="text-base leading-relaxed">
                      {phase.description}
                    </GlassCardDescription>
                  </GlassCardContent>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Connection lines (desktop only) */}
          <div className="hidden md:flex justify-center mt-8">
            <div className="flex items-center gap-4 text-veil-text-dim">
              <div className="w-24 h-px bg-gradient-to-r from-blue-500/50 to-veil-purple/50" />
              <ChevronRight className="w-5 h-5" />
              <div className="w-24 h-px bg-gradient-to-r from-veil-purple/50 to-emerald-500/50" />
              <ChevronRight className="w-5 h-5" />
              <div className="w-24 h-px bg-emerald-500/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Highlight Section */}
      <section className="relative py-24 px-4 sm:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-veil-gradient-radial opacity-50" />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <StatusBadge variant="reveal" glow className="mb-6">
                <Shield className="w-4 h-4" />
                Privacy by Design
              </StatusBadge>

              <h2 className="text-3xl sm:text-4xl font-bold text-veil-text mb-6">
                Your Bids Are
                <br />
                <span className="text-transparent bg-clip-text bg-veil-gradient-purple">
                  Cryptographically Hidden
                </span>
              </h2>

              <p className="text-veil-text-muted text-lg mb-8 leading-relaxed">
                VeilBid uses commit-reveal cryptography to ensure no one can see
                your bid amount until the reveal phase. This prevents
                front-running, bid manipulation, and collusion.
              </p>

              <div className="space-y-4">
                {[
                  "Bids are hashed with a secret nonce before submission",
                  "No one can reverse-engineer your bid amount",
                  "Smart contract verifies commitment integrity",
                  "Powered by Starknet&apos;s scalable infrastructure",
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-veil-purple/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-veil-purple" />
                    </div>
                    <span className="text-veil-text-muted">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <GlassCard variant="glow" padding="lg" className="relative">
                {/* Mock bid commitment visualization */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-veil-text-muted">Your Bid</span>
                    <StatusBadge variant="commit" size="sm" icon>
                      Hidden
                    </StatusBadge>
                  </div>

                  <div className="bg-veil-surface rounded-xl p-4 border border-veil-border">
                    <div className="text-sm text-veil-text-dim mb-2">
                      Bid Amount
                    </div>
                    <div className="text-2xl font-mono text-veil-text flex items-center gap-2">
                      <Lock className="w-5 h-5 text-veil-purple" />
                      <span className="blur-sm select-none">0.15 BTC</span>
                    </div>
                  </div>

                  <div className="bg-veil-surface rounded-xl p-4 border border-veil-border">
                    <div className="text-sm text-veil-text-dim mb-2">
                      Commitment Hash
                    </div>
                    <div className="font-mono text-sm text-veil-purple-light break-all">
                      0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-veil-text-dim text-sm">
                    <Shield className="w-4 h-4" />
                    Only you know the actual bid amount
                  </div>
                </div>
              </GlassCard>

              {/* Floating decoration */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-veil-purple/20 rounded-full blur-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Auction Preview Section */}
      <section className="relative py-24 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-veil-text mb-4"
            >
              Active Auctions
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-veil-text-muted">
              Browse current auctions and place your sealed bids
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            {mockAuctions.map((auction, index) => (
              <motion.div key={auction.id} variants={fadeInUp}>
                <GlassCard
                  variant="interactive"
                  className="h-full"
                >
                  <GlassCardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <StatusBadge
                        variant={auction.phase}
                        size="sm"
                        icon
                        pulse={auction.phase === "commit"}
                      >
                        {auction.phase === "commit"
                          ? "Commit Phase"
                          : "Reveal Phase"}
                      </StatusBadge>
                      <span className="text-sm text-veil-text-dim font-mono">
                        {auction.timeLeft}
                      </span>
                    </div>
                    <GlassCardTitle>{auction.title}</GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-veil-text-dim">Min Bid</span>
                        <span className="text-veil-text font-mono">
                          {auction.minBid}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-veil-text-dim">Bids</span>
                        <span className="text-veil-text">{auction.bids}</span>
                      </div>
                    </div>
                  </GlassCardContent>
                  <div className="pt-4">
                    <GlowButton variant="outline" className="w-full" size="sm">
                      View Auction
                      <ExternalLink className="w-4 h-4" />
                    </GlowButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link href="/auctions">
              <GlowButton variant="secondary" size="lg">
                View All Auctions
                <ArrowRight className="w-5 h-5" />
              </GlowButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 sm:px-8 border-t border-veil-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/veilbid.png"
                  alt="VeilBid"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold text-veil-text">VeilBid</span>
              </div>
              <p className="text-veil-text-muted mb-4 max-w-sm">
                Privacy-preserving Bitcoin auctions powered by Starknet.
                Cryptographic fairness for the decentralized future.
              </p>
              <div className="flex items-center gap-2">
                <StatusBadge variant="success" size="sm">
                  <Bitcoin className="w-3 h-3" />
                  Bitcoin Native
                </StatusBadge>
                <StatusBadge variant="reveal" size="sm">
                  <Zap className="w-3 h-3" />
                  Starknet
                </StatusBadge>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-veil-text font-semibold mb-4">Protocol</h4>
              <ul className="space-y-2">
                {["Auctions", "How it Works", "Documentation", "FAQ"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-veil-text-muted hover:text-veil-text transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-veil-text font-semibold mb-4">Community</h4>
              <ul className="space-y-2">
                {["Twitter", "Discord", "GitHub", "Blog"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-veil-text-muted hover:text-veil-text transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-veil-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-veil-text-dim text-sm">
              &copy; {new Date().getFullYear()} VeilBid. Built on Starknet.
            </p>
            <div className="flex items-center gap-6 text-sm text-veil-text-dim">
              <a href="#" className="hover:text-veil-text transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-veil-text transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
