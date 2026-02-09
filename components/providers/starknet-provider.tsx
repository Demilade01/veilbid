"use client";
import React from "react";

import { sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
  jsonRpcProvider,
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "always",
    order: "alphabetical",
  });

  // Use custom RPC if available, otherwise fall back to public provider
  const rpcUrl = process.env.NEXT_PUBLIC_STARKNET_RPC_URL;
  const provider = rpcUrl 
    ? jsonRpcProvider({ 
        rpc: () => ({ nodeUrl: rpcUrl }) 
      })
    : publicProvider();

  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}
