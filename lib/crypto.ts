/**
 * Cryptographic utilities for VeilBid
 * Uses starknet.js Poseidon hash to match Cairo contract
 */

import { hash } from "starknet";

/**
 * Compute Poseidon hash of (bid_amount, nonce) for commit-reveal scheme.
 * Must match the Cairo contract's poseidon_hash_bid_nonce function.
 */
export function computeBidCommitment(bidAmount: bigint, nonce: bigint): string {
  // Poseidon hash of [bid_amount, nonce]
  return hash.computePoseidonHash(bidAmount.toString(), nonce.toString());
}

/**
 * Generate a random nonce for bid commitment.
 * Returns a bigint suitable for felt252.
 */
export function generateNonce(): bigint {
  // Generate 31 random bytes (felt252 max is ~252 bits)
  const bytes = new Uint8Array(31);
  crypto.getRandomValues(bytes);
  let nonce = BigInt(0);
  for (const byte of bytes) {
    nonce = (nonce << BigInt(8)) | BigInt(byte);
  }
  return nonce;
}
