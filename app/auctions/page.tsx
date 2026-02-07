"use client";

import { motion } from "framer-motion";

export default function AuctionsPage() {
  return (
    <main className="relative z-10 flex flex-col items-center justify-center py-16 px-4 sm:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl text-center"
      >
        <h1 className="text-3xl font-bold text-purple-300 mb-4">Auctions</h1>
        <p className="text-purple-200">
          Active auctions will appear here once the auction contract is deployed. Connect your wallet to participate.
        </p>
      </motion.div>
    </main>
  );
}
