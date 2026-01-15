'use client';

import type { Network } from '@/shared/api/daoService';
import { useDialogContext } from '@/shared/components/dialogProvider';
import { useTranslations } from '@/shared/components/translationsProvider';
import { countryReservationUtils, type ICountryReservationData } from '@/shared/utils/countryReservationUtils';
import { getPublicClient } from '@/shared/utils/networkUtils/publicClient';
import { Button, InputText, Spinner } from '@aragon/gov-ui-kit';
import { useEffect, useState } from 'react';
import { formatEther, type Hex, type PublicClient } from 'viem';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { CountryReservationDialog } from '../../dialogs/countryReservationDialog';

export interface ICountryReservationFormProps {
    /** DAO address (for approval target) */
    daoAddress: Hex;
    /** Network to operate on */
    network: Network;
    /** Registrar controller address */
    registrarController: Hex;
    /** Public resolver address */
    publicResolver: Hex;
    /** Base registrar (ERC-721) address */
    baseRegistrar: Hex;
    /** TLD (e.g., 'country') */
    tld: string;
    /** Callback when reservation + approval complete */
    onReservationComplete: (data: ICountryReservationData) => void;
}

enum ReservationFlowStep {
    INPUT_NAME = 'INPUT_NAME',
    RESERVED = 'RESERVED',
    APPROVING = 'APPROVING',
    COMPLETE = 'COMPLETE',
}

const availableAbi = {
    type: 'function',
    name: 'available',
    stateMutability: 'view',
    inputs: [{ name: 'name', type: 'string' }],
    outputs: [{ name: '', type: 'bool' }],
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

const ownerOfAbi = {
    type: 'function',
    name: 'ownerOf',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
} as const;

export const CountryReservationForm: React.FC<ICountryReservationFormProps> = (props) => {
    const { daoAddress, network, registrarController, publicResolver, baseRegistrar, tld, onReservationComplete } =
        props;

    const { address } = useAccount();
    const publicClient = getPublicClient(network);
    const { open } = useDialogContext();
    const { t } = useTranslations();

    const [name, setName] = useState('');
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [estimatedCost, setEstimatedCost] = useState<bigint | null>(null);
    const [flowStep, setFlowStep] = useState<ReservationFlowStep>(ReservationFlowStep.INPUT_NAME);
    const [reservationData, setReservationData] = useState<ICountryReservationData | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const { sendTransaction: sendApprove, data: approveTxHash } = useSendTransaction();
    const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveTxHash });

    // Check if user already owns the name
    const [alreadyOwned, setAlreadyOwned] = useState(false);

    useEffect(() => {
        const checkOwnership = async () => {
            if (!name || !address) return;

            const validation = countryReservationUtils.validateNameFormat(name);
            if (!validation.valid) return;

            try {
                const tokenId = countryReservationUtils.calculateTokenId(name);
                const owner = (await publicClient.readContract({
                    abi: [ownerOfAbi],
                    address: baseRegistrar,
                    functionName: 'ownerOf',
                    args: [tokenId],
                })) as Hex;

                setAlreadyOwned(owner.toLowerCase() === address.toLowerCase());
            } catch {
                setAlreadyOwned(false);
            }
        };

        void checkOwnership();
    }, [name, address, publicClient, baseRegistrar]);

    const handleCheckAvailability = async () => {
        const validation = countryReservationUtils.validateNameFormat(name);
        if (!validation.valid) {
            setValidationError(validation.error ?? 'Invalid name');
            return;
        }

        setValidationError(null);
        setIsCheckingAvailability(true);

        try {
            const available = (await publicClient.readContract({
                abi: [availableAbi],
                address: registrarController,
                functionName: 'available',
                args: [name],
            })) as boolean;

            setIsAvailable(available);

            if (available) {
                const duration = BigInt(countryReservationUtils.getDefaultDuration());
                const priceData = (await publicClient.readContract({
                    abi: [rentPriceAbi],
                    address: registrarController,
                    functionName: 'rentPrice',
                    args: [name, duration],
                })) as { base: bigint; premium: bigint };

                const total = priceData.base + priceData.premium;
                setEstimatedCost(total);
            }
        } catch (err) {
            setValidationError((err as Error).message);
        } finally {
            setIsCheckingAvailability(false);
        }
    };

    const handleReserveClick = () => {
        open('countryReservation', {
            params: {
                name,
                network,
                registrarController,
                publicResolver,
                tld,
                onSuccess: (data: ICountryReservationData) => {
                    setReservationData(data);
                    setFlowStep(ReservationFlowStep.RESERVED);
                },
            },
        });
    };

    const handleApproveClick = () => {
        if (!reservationData) return;

        const approveTx = countryReservationUtils.buildApproveTransaction({
            baseRegistrar,
            daoAddress,
            tokenId: reservationData.tokenId,
        });

        sendApprove(
            { to: approveTx.to, data: approveTx.data, value: approveTx.value },
            {
                onSuccess: () => {
                    setFlowStep(ReservationFlowStep.APPROVING);
                },
            },
        );
    };

    const handleSkipToApprove = () => {
        if (!address || !name) return;

        const tokenId = countryReservationUtils.calculateTokenId(name);
        const expiresAt = 0; // Unknown for existing registrations

        const data: ICountryReservationData = {
            name,
            ownerAddress: address,
            tokenId,
            expiresAt,
            commitTxHash: '0x0' as Hex,
            registerTxHash: '0x0' as Hex,
        };

        setReservationData(data);
        setFlowStep(ReservationFlowStep.RESERVED);
    };

    useEffect(() => {
        if (isApproveSuccess && reservationData) {
            setFlowStep(ReservationFlowStep.COMPLETE);
            onReservationComplete(reservationData);
        }
    }, [isApproveSuccess, reservationData, onReservationComplete]);

    if (flowStep === ReservationFlowStep.COMPLETE) {
        return (
            <div className="flex flex-col gap-6 rounded-lg border border-success-200 bg-success-50 p-6">
                <div className="flex items-center gap-3">
                    <div className="text-3xl">✅</div>
                    <div>
                        <h3 className="text-lg font-bold text-success-700">
                            {t('app.governance.countryReservation.form.complete.title')}
                        </h3>
                        <p className="text-success-600">
                            {t('app.governance.countryReservation.form.complete.subtitle', {
                                name: `${name}.${tld}`,
                            })}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (flowStep === ReservationFlowStep.APPROVING) {
        return (
            <div className="flex flex-col items-center gap-4 p-6">
                <Spinner size="lg" />
                <p className="text-neutral-500">{t('app.governance.countryReservation.form.approving')}</p>
            </div>
        );
    }

    if (flowStep === ReservationFlowStep.RESERVED && reservationData) {
        return (
            <div className="flex flex-col gap-6 rounded-lg border border-primary-200 bg-primary-50 p-6">
                <div>
                    <h3 className="text-lg font-bold">{t('app.governance.countryReservation.form.reserved.title')}</h3>
                    <p className="text-neutral-600">
                        {t('app.governance.countryReservation.form.reserved.subtitle', { name: `${name}.${tld}` })}
                    </p>
                </div>
                <div className="rounded-lg bg-white p-4">
                    <p className="text-sm text-neutral-500">
                        {t('app.governance.countryReservation.form.reserved.expiresIn')}
                    </p>
                    <p className="text-lg font-semibold">
                        {new Date(reservationData.expiresAt * 1000).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-neutral-600">
                        {t('app.governance.countryReservation.form.reserved.approveHint')}
                    </p>
                    <Button onClick={handleApproveClick} size="lg" variant="primary">
                        {t('app.governance.countryReservation.form.reserved.approveButton')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 rounded-lg border border-neutral-200 bg-white p-6">
            <div>
                <h2 className="text-2xl font-bold">{t('app.governance.countryReservation.form.title')}</h2>
                <p className="text-neutral-600">{t('app.governance.countryReservation.form.subtitle')}</p>
            </div>

            <div className="flex flex-col gap-4">
                <InputText
                    label={t('app.governance.countryReservation.form.nameLabel')}
                    placeholder={t('app.governance.countryReservation.form.namePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value.toLowerCase())}
                    helpText={t('app.governance.countryReservation.form.nameHint', { tld })}
                />

                {validationError && <p className="text-sm text-critical-500">{validationError}</p>}

                {alreadyOwned && (
                    <div className="rounded-lg border border-info-200 bg-info-50 p-4">
                        <p className="text-sm text-info-700">
                            {t('app.governance.countryReservation.form.alreadyOwned')}
                        </p>
                        <Button onClick={handleSkipToApprove} size="sm" variant="secondary" className="mt-2">
                            {t('app.governance.countryReservation.form.skipToApprove')}
                        </Button>
                    </div>
                )}

                <Button
                    onClick={handleCheckAvailability}
                    disabled={!name || isCheckingAvailability || alreadyOwned}
                    variant="secondary"
                >
                    {isCheckingAvailability ? <Spinner /> : t('app.governance.countryReservation.form.checkButton')}
                </Button>

                {isAvailable === true && estimatedCost && (
                    <div className="rounded-lg border border-success-200 bg-success-50 p-4">
                        <p className="font-semibold text-success-700">
                            {t('app.governance.countryReservation.form.available')}
                        </p>
                        <p className="text-sm text-success-600">
                            {t('app.governance.countryReservation.form.cost', {
                                value: formatEther(estimatedCost),
                            })}
                        </p>
                        <Button onClick={handleReserveClick} size="lg" variant="primary" className="mt-4 w-full">
                            {t('app.governance.countryReservation.form.reserveButton')}
                        </Button>
                    </div>
                )}

                {isAvailable === false && (
                    <div className="rounded-lg border border-critical-200 bg-critical-50 p-4">
                        <p className="text-critical-700">{t('app.governance.countryReservation.form.unavailable')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
