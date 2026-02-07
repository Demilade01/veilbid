import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StarknetProvider } from "@/components/providers/starknet-provider";
import { Header } from "@/components/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VeilBid",
  description: "VeilBid – Privacy-Preserving Bitcoin Auctions on Starknet. Sealed-bid auctions with hidden bids, powered by Cairo and Starknet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StarknetProvider>
          <div className="min-h-screen w-full bg-black font-sans relative overflow-hidden">
            <div className="absolute inset-0 z-0" style={{ pointerEvents: "none" }}>
              <div className="w-full h-full bg-gradient-to-br from-purple-700 via-black to-purple-900 opacity-60" />
            </div>
            <div className="relative z-10 pt-4">
              <Header />
            </div>
            {children}
          </div>
        </StarknetProvider>
      </body>
    </html>
  );
}
