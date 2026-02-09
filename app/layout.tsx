import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { StarknetProvider } from "@/components/providers/starknet-provider";
import { Header } from "@/components/layout/header";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VeilBid | Private Bitcoin Auctions on Starknet",
  description: "VeilBid – Privacy-Preserving Bitcoin Auctions on Starknet. Sealed-bid auctions with hidden bids, powered by Cairo and Starknet.",
  icons: {
    icon: "/veilbid.png",
    apple: "/veilbid.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <StarknetProvider>
          <div className="min-h-screen w-full bg-veil-bg font-sans relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <div className="absolute inset-0 animated-gradient-bg" />
              <div className="absolute inset-0 bg-veil-gradient-radial" />
              {/* Subtle grid pattern */}
              <div 
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
                  backgroundSize: '50px 50px'
                }}
              />
            </div>
            
            {/* Main content */}
            <div className="relative z-10">
              <Header />
              {children}
            </div>
          </div>
        </StarknetProvider>
      </body>
    </html>
  );
}
