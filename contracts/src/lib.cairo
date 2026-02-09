// VeilBid sealed-bid auction contract (commit-reveal)
// Privacy-preserving: bids are hidden until reveal phase.

use starknet::{ContractAddress, get_caller_address};

#[starknet::interface]
trait IVeilBidAuction<TContractState> {
    /// Create a new auction. commit_end and reveal_end are block timestamps (e.g. from get_block_timestamp).
    fn create_auction(ref self: TContractState, commit_end: u64, reveal_end: u64);
    /// Commit phase: submit commitment = poseidon_hash(bid_amount, nonce). Only callable before commit_end.
    fn commit_bid(ref self: TContractState, commitment: felt252);
    /// Reveal phase: submit (bid_amount, nonce). Contract checks poseidon_hash(bid_amount, nonce) == commitment. Only callable between commit_end and reveal_end.
    fn reveal_bid(ref self: TContractState, bid_amount: u128, nonce: felt252);
    /// After reveal_end: mark auction as settled. Winner can be read via get_winner.
    fn settle(ref self: TContractState);
    /// View: current auction's commit end timestamp.
    fn get_commit_end(self: @TContractState) -> u64;
    /// View: current auction's reveal end timestamp.
    fn get_reveal_end(self: @TContractState) -> u64;
    /// View: current auction's creator.
    fn get_creator(self: @TContractState) -> ContractAddress;
    /// View: current auction's highest bid amount.
    fn get_highest_bid(self: @TContractState) -> u128;
    /// View: current auction's winner (zero address if none or not yet revealed).
    fn get_winner(self: @TContractState) -> ContractAddress;
    /// View: whether the auction is settled.
    fn get_settled(self: @TContractState) -> bool;
    /// View: commitment hash for a bidder (0 if not committed).
    fn get_commitment(self: @TContractState, bidder: ContractAddress) -> felt252;
}

#[starknet::contract]
mod VeilBidAuction {
    use super::{ContractAddress, get_caller_address, IVeilBidAuction};
    use core::hash::HashStateTrait;
    use core::poseidon::PoseidonTrait;
    use starknet::storage::{Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::SyscallResultTrait;
    use starknet::syscalls::get_execution_info_syscall;

    #[storage]
    struct Storage {
        // Single auction for MVP (one active at a time)
        creator: ContractAddress,
        commit_end: u64,
        reveal_end: u64,
        commitments: Map<ContractAddress, felt252>,
        highest_bid: u128,
        winner: ContractAddress,
        settled: bool,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        AuctionCreated: AuctionCreated,
        BidCommitted: BidCommitted,
        BidRevealed: BidRevealed,
        AuctionSettled: AuctionSettled,
    }

    #[derive(Drop, starknet::Event)]
    struct AuctionCreated {
        #[key]
        creator: ContractAddress,
        commit_end: u64,
        reveal_end: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct BidCommitted {
        #[key]
        bidder: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct BidRevealed {
        #[key]
        bidder: ContractAddress,
        amount: u128,
    }

    #[derive(Drop, starknet::Event)]
    struct AuctionSettled {
        #[key]
        winner: ContractAddress,
        amount: u128,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        // Storage defaults to zero; first create_auction initializes.
    }

    #[abi(embed_v0)]
    impl VeilBidAuctionImpl of IVeilBidAuction<ContractState> {
        fn create_auction(ref self: ContractState, commit_end: u64, reveal_end: u64) {
            let caller = get_caller_address();
            assert(self.commit_end.read() == 0, 'Auction already exists');
            assert(commit_end < reveal_end, 'Invalid phase times');
            self.creator.write(caller);
            self.commit_end.write(commit_end);
            self.reveal_end.write(reveal_end);
            self.settled.write(false);
            self.highest_bid.write(0);
            // winner stays default (zero address)
            self.emit(AuctionCreated { creator: caller, commit_end, reveal_end });
        }

        fn commit_bid(ref self: ContractState, commitment: felt252) {
            assert(commitment != 0, 'Invalid commitment');
            let now = get_block_timestamp();
            assert(now < self.commit_end.read(), 'Commit phase ended');
            let caller = get_caller_address();
            let existing = self.commitments.entry(caller).read();
            assert(existing == 0, 'Already committed');
            self.commitments.entry(caller).write(commitment);
            self.emit(BidCommitted { bidder: caller });
        }

        fn reveal_bid(ref self: ContractState, bid_amount: u128, nonce: felt252) {
            let now = get_block_timestamp();
            let commit_end = self.commit_end.read();
            let reveal_end = self.reveal_end.read();
            assert(now >= commit_end, 'Reveal phase not started');
            assert(now <= reveal_end, 'Reveal phase ended');
            let caller = get_caller_address();
            let expected_commitment = self.commitments.entry(caller).read();
            assert(expected_commitment != 0, 'No commitment');
            let computed = poseidon_hash_bid_nonce(bid_amount, nonce);
            assert(computed == expected_commitment, 'Invalid reveal');
            let current_best = self.highest_bid.read();
            if bid_amount > current_best {
                self.highest_bid.write(bid_amount);
                self.winner.write(caller);
            }
            self.emit(BidRevealed { bidder: caller, amount: bid_amount });
        }

        fn settle(ref self: ContractState) {
            let now = get_block_timestamp();
            assert(now > self.reveal_end.read(), 'Reveal phase not ended');
            assert(!self.settled.read(), 'Already settled');
            self.settled.write(true);
            let winner = self.winner.read();
            let amount = self.highest_bid.read();
            self.emit(AuctionSettled { winner, amount });
            
            // Reset auction state to allow creating a new auction
            self.commit_end.write(0);
            self.reveal_end.write(0);
            self.highest_bid.write(0);
            // Note: We keep winner and settled for historical record
            // Creator and commitments map persist but will be overwritten in next auction
        }

        fn get_commit_end(self: @ContractState) -> u64 {
            self.commit_end.read()
        }

        fn get_reveal_end(self: @ContractState) -> u64 {
            self.reveal_end.read()
        }

        fn get_creator(self: @ContractState) -> ContractAddress {
            self.creator.read()
        }

        fn get_highest_bid(self: @ContractState) -> u128 {
            self.highest_bid.read()
        }

        fn get_winner(self: @ContractState) -> ContractAddress {
            self.winner.read()
        }

        fn get_settled(self: @ContractState) -> bool {
            self.settled.read()
        }

        fn get_commitment(self: @ContractState, bidder: ContractAddress) -> felt252 {
            self.commitments.entry(bidder).read()
        }
    }

    fn get_block_timestamp() -> u64 {
        let info = get_execution_info_syscall().unwrap_syscall().unbox();
        info.block_info.unbox().block_timestamp
    }

    /// Computes poseidon_hash(bid_amount, nonce) for commit-reveal verification.
    fn poseidon_hash_bid_nonce(bid_amount: u128, nonce: felt252) -> felt252 {
        let mut state = PoseidonTrait::new();
        let bid_felt: felt252 = bid_amount.into();
        state = state.update(bid_felt);
        state = state.update(nonce);
        state.finalize()
    }
}
