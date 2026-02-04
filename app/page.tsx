"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);


  return (
    <div className="min-h-screen w-full bg-black font-sans relative overflow-hidden">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }}>
        <div className="w-full h-full bg-gradient-to-br from-purple-700 via-black to-purple-900 opacity-60" />
      </div>
      {/* Curved, transparent navbar with motion */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex items-center justify-between px-8 py-6 mx-auto w-[90%] bg-black/40 backdrop-blur-lg rounded-b-3xl border-b border-purple-700 shadow-lg"
        style={{ boxShadow: "0 8px 32px 0 rgba(128,0,128,0.25)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-purple-400 tracking-tight">VeilBid</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-base font-medium text-purple-200 hover:text-purple-400 transition-colors">Home</a>
          <a href="#" className="text-base font-medium text-purple-200 hover:text-purple-400 transition-colors">Auctions</a>
          <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
            {walletConnected ? "Wallet Connected" : "Connect Wallet"}
          </Button>
        </div>
      </motion.nav>
      {/* Hero Section with motion */}
      <main className="relative z-10 flex flex-col items-center justify-center py-32 px-4 sm:px-16">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl sm:text-5xl font-extrabold text-center text-purple-300 mb-6 drop-shadow-lg"
        >
          Privacy-Preserving Bitcoin Auctions on Starknet
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="max-w-2xl text-lg text-center text-purple-100 mb-8"
        >
          VeilBid is a sealed-bid auction protocol enabling Bitcoin-denominated auctions with full privacy. Bids are hidden during the auction and revealed only at the end, ensuring fairness and preventing front-running or collusion.
        </motion.p>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <Button size="lg" variant="secondary" className="bg-gradient-to-r from-purple-600 to-purple-900 text-white shadow-lg">
            Learn More
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
