"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { WalletButton } from "@/components/layout/wallet-button";

export function Header() {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative z-10 flex items-center justify-between px-8 py-6 mx-auto w-[90%] bg-black/40 backdrop-blur-lg rounded-b-3xl border-b border-purple-700 shadow-lg"
      style={{ boxShadow: "0 8px 32px 0 rgba(128,0,128,0.25)" }}
    >
      <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-purple-400 tracking-tight hover:text-purple-300">
        <Image
          src="/veilbid.png"
          alt="VeilBid Logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <span>VeilBid</span>
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="/"
          className="text-base font-medium text-purple-200 hover:text-purple-400 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/auctions"
          className="text-base font-medium text-purple-200 hover:text-purple-400 transition-colors"
        >
          Auctions
        </Link>
        <WalletButton />
      </nav>
    </motion.header>
  );
}
