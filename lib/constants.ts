/**
 * App and chain constants. Contract addresses should be read from env in production.
 */

export const APP_NAME = "VeilBid";

export const CHAIN_IDS = {
  mainnet: "0x534e5f4d41494e" as const,   // SN_MAIN
  sepolia: "0x534e5f5345504f4c4941" as const, // SN_SEPOLIA
};

export function getAuctionContractAddress(): string | undefined {
  return process.env.NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS;
}
