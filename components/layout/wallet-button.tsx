"use client";

import { useConnect, useAccount, useDisconnect, useNetwork } from "@starknet-react/core";
import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const pending = isConnecting || isConnectPending;

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-600 text-purple-200 hover:bg-purple-900/40 hover:text-purple-100 gap-1.5"
          >
            <span className="font-mono">{truncateAddress(address)}</span>
            <ChevronDownIcon className="size-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-purple-900/50 bg-black/95">
          <DropdownMenuLabel className="text-purple-200 font-normal">
            {chain?.name ?? "Starknet"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-purple-800/50" />
          <DropdownMenuItem
            className="text-purple-200 focus:bg-purple-900/40 focus:text-purple-100 cursor-pointer"
            onClick={() => disconnect()}
          >
            <LogOutIcon className="size-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-md"
          disabled={pending}
        >
          {pending ? "Connecting…" : "Connect Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 border-purple-900/50 bg-black/95">
        <DropdownMenuLabel className="text-purple-300 text-xs font-normal">
          Connect with
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-purple-800/50" />
        {connectors.map((c) => (
          <DropdownMenuItem
            key={c.id}
            className="text-purple-200 focus:bg-purple-900/40 focus:text-purple-100 cursor-pointer"
            onSelect={() => connect({ connector: c })}
          >
            {c.name ?? c.id}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
