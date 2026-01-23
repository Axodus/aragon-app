import {
    encodeAbiParameters,
    encodeFunctionData,
    keccak256,
    parseAbiParameters,
    toBytes,
    type Hex,
    type PublicClient,
} from 'viem';
import { namehash } from 'viem/ens';
import type {
    ICommitmentData,
    ICountryReservationParams,
    ITransactionRequest,
} from './countryReservationUtils.api';

/**
 * ABI definitions for .country registrar interactions
 */
const setAddrAbi = {
    type: 'function',
    name: 'setAddr',
    stateMutability: 'nonpayable',
    inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'a', type: 'address' },
    ],
    outputs: [],
} as const;

const commitAbi = {
    type: 'function',
    name: 'commit',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'commitment', type: 'bytes32' }],
    outputs: [],
} as const;

const registerAbi = {
    type: 'function',
    name: 'register',
    stateMutability: 'payable',
    inputs: [
        { name: 'name', type: 'string' },
        { name: 'owner', type: 'address' },
        { name: 'duration', type: 'uint256' },
        { name: 'secret', type: 'bytes32' },
        { name: 'resolver', type: 'address' },
        { name: 'data', type: 'bytes[]' },
        { name: 'reverseRecord', type: 'bool' },
        { name: 'fuses', type: 'uint32' },
        { name: 'wrapperExpiry', type: 'uint64' },
    ],
    outputs: [],
} as const;

const rentPriceAbi = {
    type: 'function',
    name: 'rentPrice',
    stateMutability: 'view',
    inputs: [
        { name: 'name', type: 'string' },
        { name: 'duration', type: 'uint256' },
    ],
    outputs: [
        {
            name: '',
            type: 'tuple',
            components: [
                { name: 'base', type: 'uint256' },
                { name: 'premium', type: 'uint256' },
            ],
        },
    ],
} as const;

const approveAbi = {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
        { name: 'to', type: 'address' },
        { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
} as const;

/**
 * Utility class for building .country reservation transactions
 */
class CountryReservationUtils {
    private readonly DEFAULT_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds

    /**
     * Generate a random secret for commit-reveal
     */
    generateSecret(): Hex {
        const randomBytes = new Uint8Array(32);
        crypto.getRandomValues(randomBytes);
        return `0x${Array.from(randomBytes)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')}` as Hex;
    }

    /**
     * Compute commitment hash for ENS commit-reveal pattern
     */
    computeCommitment(params: {
        label: string;
        owner: Hex;
        duration: number;
        secret: Hex;
        resolver: Hex;
        tld: string;
    }): ICommitmentData {
        const { label, owner, duration, secret, resolver, tld } = params;

        const fqdn = `${label}.${tld}`;
        const node = namehash(fqdn);

        // Encode resolver call to set address
        const resolverCall = encodeFunctionData({
            abi: [setAddrAbi],
            args: [node, owner],
        });

        // Compute commitment using ENS pattern
        const commitment = keccak256(
            encodeAbiParameters(
                parseAbiParameters(
                    'string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint32 fuses, uint64 wrapperExpiry',
                ),
                [label, owner, BigInt(duration), secret, resolver, [resolverCall] as readonly Hex[], false, 0, BigInt(0)],
            ),
        ) as Hex;

        return {
            commitment,
            secret,
            params: {
                label,
                owner,
                duration: BigInt(duration),
                resolver,
                resolverData: [resolverCall],
            },
        };
    }

    /**
     * Build commit transaction (step 1 of reservation)
     */
    buildCommitTransaction(params: {
        commitmentData: ICommitmentData;
        registrarController: Hex;
    }): ITransactionRequest {
        const { commitmentData, registrarController } = params;

        const data = encodeFunctionData({
            abi: [commitAbi],
            args: [commitmentData.commitment],
        });

        return {
            to: registrarController,
            data,
            value: BigInt(0),
        };
    }

    /**
     * Build register transaction (step 2 of reservation, after 60s)
     */
    async buildRegisterTransaction(params: {
        commitmentData: ICommitmentData;
        registrarController: Hex;
        publicClient: PublicClient;
    }): Promise<ITransactionRequest> {
        const { commitmentData, registrarController, publicClient } = params;
        const { label, owner, duration, resolver, resolverData } = commitmentData.params;

        // Get registration price
        const priceData = await publicClient.readContract({
            abi: [rentPriceAbi],
            address: registrarController,
            functionName: 'rentPrice',
            args: [label, duration],
        });

        const price = (priceData as { base: bigint; premium: bigint });
        const totalPrice = price.base + price.premium;

        const data = encodeFunctionData({
            abi: [registerAbi],
            args: [label, owner, duration, commitmentData.secret, resolver, resolverData, false, 0, BigInt(0)],
        });

        return {
            to: registrarController,
            data,
            value: totalPrice,
        };
    }

    /**
     * Build approve transaction for BaseRegistrar to allow DAO to transfer
     */
    buildApproveTransaction(params: { baseRegistrar: Hex; daoAddress: Hex; tokenId: bigint }): ITransactionRequest {
        const { baseRegistrar, daoAddress, tokenId } = params;

        const data = encodeFunctionData({
            abi: [approveAbi],
            args: [daoAddress, tokenId],
        });

        return {
            to: baseRegistrar,
            data,
            value: BigInt(0),
        };
    }

    /**
     * Calculate token ID for a given label (ENS pattern)
     */
    calculateTokenId(label: string): bigint {
        return BigInt(keccak256(toBytes(label)));
    }

    /**
     * Calculate expiration timestamp
     */
    calculateExpirationTimestamp(duration: number): number {
        return Math.floor(Date.now() / 1000) + duration;
    }

    /**
     * Get default reservation duration (30 days)
     */
    getDefaultDuration(): number {
        return this.DEFAULT_DURATION;
    }

    /**
     * Validate name format (label only, no .country suffix)
     */
    validateNameFormat(name: string): { valid: boolean; error?: string } {
        if (!name || name.trim().length === 0) {
            return { valid: false, error: 'Name cannot be empty' };
        }

        if (name.includes('.')) {
            return { valid: false, error: 'Enter label only (without .country)' };
        }

        if (name.length > 63) {
            return { valid: false, error: 'Name too long (max 63 characters)' };
        }

        if (!/^[a-z0-9-]+$/.test(name.toLowerCase())) {
            return { valid: false, error: 'Only lowercase letters, numbers, and hyphens allowed' };
        }

        return { valid: true };
    }
}

export const countryReservationUtils = new CountryReservationUtils();
