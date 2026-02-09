"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  AuctionStatus,
  CreateAuctionForm,
  BidForm,
  SettleButton,
} from "@/components/features/auctions";

export default function AuctionsPage() {
  return (
    <main className="relative z-10 flex flex-col items-center py-12 px-4 sm:px-8 min-h-[calc(100vh-80px)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Image
            src="/veilbid.png"
            alt="VeilBid Logo"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <h1 className="text-4xl font-bold text-purple-200">VeilBid Auction</h1>
        </div>
        <p className="text-purple-300 max-w-lg mx-auto">
          Privacy-preserving sealed-bid auction powered by Starknet. 
          Bids are hidden until the reveal phase using commit-reveal cryptography.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="w-full max-w-4xl space-y-8">
        {/* Auction Status Card */}
        <AuctionStatus />

        {/* Action Forms */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          <CreateAuctionForm />
          <BidForm />
          <SettleButton />
        </div>
      </div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-16 w-full max-w-3xl"
      >
        <h2 className="text-xl font-semibold text-purple-200 mb-4 text-center">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-900/30 border border-purple-500/10 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">1️⃣</div>
            <h3 className="text-purple-200 font-medium mb-1">Commit Phase</h3>
            <p className="text-purple-400 text-sm">
              Submit a hidden bid commitment. Your bid amount stays secret.
            </p>
          </div>
          <div className="bg-gray-900/30 border border-purple-500/10 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">2️⃣</div>
            <h3 className="text-purple-200 font-medium mb-1">Reveal Phase</h3>
            <p className="text-purple-400 text-sm">
              Reveal your bid. The contract verifies it matches your commitment.
            </p>
          </div>
          <div className="bg-gray-900/30 border border-purple-500/10 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">3️⃣</div>
            <h3 className="text-purple-200 font-medium mb-1">Settlement</h3>
            <p className="text-purple-400 text-sm">
              Highest bidder wins. Fair, transparent, and privacy-preserving.
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
