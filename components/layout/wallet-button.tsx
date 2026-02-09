"use client";

import { useConnect, useAccount, useDisconnect, useNetwork } from "@starknet-react/core";
import { ChevronDownIcon, LogOutIcon, Wallet, Copy, Check, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { GlowButton } from "@/components/ui/glow-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function truncateAddress(address: string, chars = 6): string {
  if (!address || address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

export function WalletButton() {
  const { address, isConnected, isConnecting } = useAccount();
  const { chain } = useNetwork();
  const { connectors, connect, isPending: isConnectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const pending = isConnecting || isConnectPending;

  // Close dropdown when connection is successful
  useEffect(() => {
    if (isConnected) {
      setIsOpen(false);
    }
  }, [isConnected]);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <GlowButton
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-sm">{truncateAddress(address)}</span>
            <ChevronDownIcon className="w-4 h-4 opacity-70" />
          </GlowButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-64 glass-strong border-veil-border rounded-xl p-2"
        >
          <DropdownMenuLabel className="px-2 py-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-veil-purple/20 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-veil-purple-light" />
              </div>
              <div>
                <div className="text-sm font-medium text-veil-text">
                  {chain?.name ?? "Starknet"}
                </div>
                <div className="text-xs text-veil-text-dim font-mono">
                  {truncateAddress(address, 4)}
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-veil-border my-2" />
          <DropdownMenuItem
            className="text-veil-text-muted hover:text-veil-text hover:bg-veil-purple/10 rounded-lg cursor-pointer px-3 py-2.5"
            onClick={copyAddress}
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? "Copied!" : "Copy Address"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-veil-text-muted hover:text-veil-text hover:bg-veil-purple/10 rounded-lg cursor-pointer px-3 py-2.5"
            asChild
          >
            <a
              href={`https://starkscan.co/contract/${address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on Explorer</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-veil-border my-2" />
          <DropdownMenuItem
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg cursor-pointer px-3 py-2.5"
            onClick={() => disconnect()}
          >
            <LogOutIcon className="w-4 h-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <GlowButton
          variant="default"
          size="sm"
          loading={pending}
        >
          <Wallet className="w-4 h-4" />
          {pending ? "Connecting…" : "Connect"}
        </GlowButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 glass-strong border-veil-border rounded-xl p-2"
      >
        <DropdownMenuLabel className="text-veil-text-dim text-xs px-3 py-2">
          Select a wallet
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-veil-border my-1" />
        {connectors.length > 0 ? (
          connectors.map((c) => (
            <DropdownMenuItem
              key={c.id}
              className="text-veil-text-muted hover:text-veil-text hover:bg-veil-purple/10 rounded-lg cursor-pointer px-3 py-2.5"
              onSelect={async (e) => {
                e.preventDefault();
                try {
                  await connect({ connector: c });
                } catch (error) {
                  console.error("Connection error:", error);
                  setIsOpen(false);
                }
              }}
            >
              <Wallet className="w-4 h-4" />
              <span>{c.name ?? c.id}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="px-3 py-4 text-center text-sm text-veil-text-muted">
            No wallets detected. Please install Argent X or Braavos.
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
