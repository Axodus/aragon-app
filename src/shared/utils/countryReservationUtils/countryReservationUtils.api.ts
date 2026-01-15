import type { Hex } from 'viem';

/**
 * Parameters needed for .country name reservation
 */
export interface ICountryReservationParams {
    /** The label (name without .country suffix) to reserve */
    name: string;
    /** The address that will own the name after registration */
    ownerAddress: Hex;
    /** Duration in seconds (default: 30 days) */
    duration?: number;
    /** The secret for commit-reveal (auto-generated if not provided) */
    secret?: Hex;
}

/**
 * Result of successful reservation including transaction details
 */
export interface ICountryReservationData {
    /** The reserved name (label without suffix) */
    name: string;
    /** Address of the owner (EOA who reserved) */
    ownerAddress: Hex;
    /** Token ID of the registered name */
    tokenId: bigint;
    /** Timestamp when registration expires */
    expiresAt: number;
    /** Transaction hash of the commit */
    commitTxHash: Hex;
    /** Transaction hash of the register */
    registerTxHash: Hex;
}

/**
 * Transaction request ready to be sent via wagmi
 */
export interface ITransactionRequest {
    /** Target contract address */
    to: Hex;
    /** Encoded calldata */
    data: Hex;
    /** ETH value to send (in wei) */
    value: bigint;
}

/**
 * Commitment data used in commit-reveal pattern
 */
export interface ICommitmentData {
    /** The computed commitment hash */
    commitment: Hex;
    /** The secret used */
    secret: Hex;
    /** Parameters used to generate commitment */
    params: {
        label: string;
        owner: Hex;
        duration: bigint;
        resolver: Hex;
        resolverData: readonly Hex[];
    };
}
