"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative z-10 flex flex-col items-center justify-center py-32 px-4 sm:px-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <Image
            src="/veilbid.png"
            alt="VeilBid Logo"
            width={120}
            height={120}
            className="rounded-2xl shadow-2xl shadow-purple-500/30"
            priority
          />
        </motion.div>
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
          <Link href="/auctions">
            <Button size="lg" variant="secondary" className="bg-gradient-to-r from-purple-600 to-purple-900 text-white shadow-lg hover:from-purple-500 hover:to-purple-800">
              Enter Auction
            </Button>
          </Link>
        </motion.div>
    </main>
  );
}
