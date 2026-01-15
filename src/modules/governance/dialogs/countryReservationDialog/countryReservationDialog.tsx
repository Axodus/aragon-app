'use client';

import type { Network } from '@/shared/api/daoService';
import type { IDialogComponentProps } from '@/shared/components/dialogProvider';
import { useDialogContext } from '@/shared/components/dialogProvider';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useStepper } from '@/shared/hooks/useStepper';
import { invariant, Spinner } from '@aragon/gov-ui-kit';
import { countryReservationUtils, type ICountryReservationData } from '@/shared/utils/countryReservationUtils';
import { getPublicClient } from '@/shared/utils/networkUtils/publicClient';
import { useEffect, useState } from 'react';
import { type Hex, type PublicClient } from 'viem';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';

export enum CountryReservationStep {
    COMMIT_PREPARE = 'COMMIT_PREPARE',
    COMMIT_APPROVE = 'COMMIT_APPROVE',
    COMMIT_CONFIRM = 'COMMIT_CONFIRM',
    WAITING_REVEAL = 'WAITING_REVEAL',
    REGISTER_PREPARE = 'REGISTER_PREPARE',
    REGISTER_APPROVE = 'REGISTER_APPROVE',
    REGISTER_CONFIRM = 'REGISTER_CONFIRM',
    SUCCESS = 'SUCCESS',
}

export interface ICountryReservationDialogParams {
    /** Name to reserve (label without .country) */
    name: string;
    /** Network where reservation happens */
    network: Network;
    /** Registrar controller address */
    registrarController: Hex;
    /** Public resolver address */
    publicResolver: Hex;
    /** TLD (e.g., 'country') */
    tld: string;
    /** Callback when reservation succeeds */
    onSuccess?: (data: ICountryReservationData) => void;
}

export interface ICountryReservationDialogProps extends IDialogComponentProps<ICountryReservationDialogParams> {}

interface ICommitmentState {
    commitment: Hex;
    secret: Hex;
    commitTxHash?: Hex;
    registerTxHash?: Hex;
}

export const CountryReservationDialog: React.FC<ICountryReservationDialogProps> = (props) => {
    const { location } = props;
    invariant(location.params != null, 'CountryReservationDialog: required parameters must be set.');

    const { name, network, registrarController, publicResolver, tld, onSuccess } = location.params;

    const { address } = useAccount();
    invariant(address != null, 'CountryReservationDialog: user must be connected.');

    const publicClient = getPublicClient(network);
    const { t } = useTranslations();
    const { close } = useDialogContext();

    const [commitmentState, setCommitmentState] = useState<ICommitmentState | null>(null);
    const [countdown, setCountdown] = useState<number>(60);
    const [error, setError] = useState<string | null>(null);

    const stepper = useStepper<unknown, CountryReservationStep>({
        initialActiveStep: CountryReservationStep.COMMIT_PREPARE,
    });

    const { sendTransaction: sendCommit, data: commitTxHash, isPending: isCommitPending } = useSendTransaction();
    const { sendTransaction: sendRegister, data: registerTxHash, isPending: isRegisterPending } = useSendTransaction();

    const { isLoading: isCommitConfirming, isSuccess: isCommitSuccess } = useWaitForTransactionReceipt({
        hash: commitTxHash,
    });

    const { isLoading: isRegisterConfirming, isSuccess: isRegisterSuccess } = useWaitForTransactionReceipt({
        hash: registerTxHash,
    });

    // Generate commitment on mount
    useEffect(() => {
        if (!commitmentState) {
            const secret = countryReservationUtils.generateSecret();
            const duration = countryReservationUtils.getDefaultDuration();

            const commitmentData = countryReservationUtils.computeCommitment({
                label: name,
                owner: address,
                duration,
                secret,
                resolver: publicResolver,
                tld,
            });

            setCommitmentState({
                commitment: commitmentData.commitment,
                secret,
            });
        }
    }, [commitmentState, name, address, publicResolver, tld]);

    // Handle commit transaction
    const handleCommit = () => {
        if (!commitmentState) return;

        try {
            const commitTx = countryReservationUtils.buildCommitTransaction({
                commitmentData: {
                    commitment: commitmentState.commitment,
                    secret: commitmentState.secret,
                    params: {
                        label: name,
                        owner: address,
                        duration: BigInt(countryReservationUtils.getDefaultDuration()),
                        resolver: publicResolver,
                        resolverData: [],
                    },
                },
                registrarController,
            });

            sendCommit(
                { to: commitTx.to, data: commitTx.data, value: commitTx.value },
                {
                    onSuccess: () => {
                        stepper.updateActiveStep(CountryReservationStep.COMMIT_CONFIRM);
                    },
                    onError: (err) => {
                        setError(err.message);
                    },
                },
            );

            stepper.updateActiveStep(CountryReservationStep.COMMIT_APPROVE);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    // When commit is confirmed, start countdown
    useEffect(() => {
        if (isCommitSuccess && commitTxHash) {
            setCommitmentState((prev) => (prev ? { ...prev, commitTxHash } : null));
            stepper.updateActiveStep(CountryReservationStep.WAITING_REVEAL);
            setCountdown(60);
        }
    }, [isCommitSuccess, commitTxHash, stepper]);

    // Countdown timer
    useEffect(() => {
        if (stepper.activeStep === CountryReservationStep.WAITING_REVEAL && countdown > 0) {
            const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            stepper.updateActiveStep(CountryReservationStep.REGISTER_PREPARE);
        }
    }, [stepper.activeStep, countdown, stepper]);

    // Handle register transaction
    const handleRegister = async () => {
        if (!commitmentState) return;

        try {
            const duration = countryReservationUtils.getDefaultDuration();
            const commitmentData = countryReservationUtils.computeCommitment({
                label: name,
                owner: address,
                duration,
                secret: commitmentState.secret,
                resolver: publicResolver,
                tld,
            });

            const registerTx = await countryReservationUtils.buildRegisterTransaction({
                commitmentData,
                registrarController,
                publicClient: publicClient as PublicClient,
            });

            sendRegister(
                { to: registerTx.to, data: registerTx.data, value: registerTx.value },
                {
                    onSuccess: () => {
                        stepper.updateActiveStep(CountryReservationStep.REGISTER_CONFIRM);
                    },
                    onError: (err) => {
                        setError(err.message);
                    },
                },
            );

            stepper.updateActiveStep(CountryReservationStep.REGISTER_APPROVE);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    // When register is confirmed, call success
    useEffect(() => {
        if (isRegisterSuccess && registerTxHash && commitmentState?.commitTxHash) {
            const tokenId = countryReservationUtils.calculateTokenId(name);
            const expiresAt = countryReservationUtils.calculateExpirationTimestamp(
                countryReservationUtils.getDefaultDuration(),
            );

            const data: ICountryReservationData = {
                name,
                ownerAddress: address,
                tokenId,
                expiresAt,
                commitTxHash: commitmentState.commitTxHash,
                registerTxHash,
            };

            stepper.updateActiveStep(CountryReservationStep.SUCCESS);
            onSuccess?.(data);
        }
    }, [isRegisterSuccess, registerTxHash, commitmentState, name, address, onSuccess, stepper]);

    const renderStepContent = () => {
        switch (stepper.activeStep) {
            case CountryReservationStep.COMMIT_PREPARE:
                return (
                    <div className="flex flex-col gap-4">
                        <p className="text-neutral-500">
                            {t('app.governance.countryReservation.dialog.commit.description', { name: `${name}.${tld}` })}
                        </p>
                        <button
                            onClick={handleCommit}
                            className="rounded-lg bg-primary-500 px-6 py-3 text-white hover:bg-primary-600"
                        >
                            {t('app.governance.countryReservation.dialog.commit.button')}
                        </button>
                        {error && <p className="text-critical-500">{error}</p>}
                    </div>
                );

            case CountryReservationStep.COMMIT_APPROVE:
                return (
                    <div className="flex flex-col items-center gap-4">
                        <Spinner size="lg" />
                        <p className="text-neutral-500">{t('app.governance.countryReservation.dialog.commit.approving')}</p>
                    </div>
                );

            case CountryReservationStep.COMMIT_CONFIRM:
                return (
                    <div className="flex flex-col items-center gap-4">
                        <Spinner size="lg" />
                        <p className="text-neutral-500">{t('app.governance.countryReservation.dialog.commit.confirming')}</p>
                    </div>
                );

            case CountryReservationStep.WAITING_REVEAL:
                return (
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-6xl font-bold text-primary-500">{countdown}</div>
                        <p className="text-neutral-500">{t('app.governance.countryReservation.dialog.waiting.description')}</p>
                        <p className="text-sm text-neutral-400">
                            {t('app.governance.countryReservation.dialog.waiting.hint')}
                        </p>
                    </div>
                );

            case CountryReservationStep.REGISTER_PREPARE:
                return (
                    <div className="flex flex-col gap-4">
                        <p className="text-neutral-500">
                            {t('app.governance.countryReservation.dialog.register.description')}
                        </p>
                        <button
                            onClick={handleRegister}
                            className="rounded-lg bg-primary-500 px-6 py-3 text-white hover:bg-primary-600"
                        >
                            {t('app.governance.countryReservation.dialog.register.button')}
                        </button>
                        {error && <p className="text-critical-500">{error}</p>}
                    </div>
                );

            case CountryReservationStep.REGISTER_APPROVE:
                return (
                    <div className="flex flex-col items-center gap-4">
                        <Spinner size="lg" />
                        <p className="text-neutral-500">
                            {t('app.governance.countryReservation.dialog.register.approving')}
                        </p>
                    </div>
                );

            case CountryReservationStep.REGISTER_CONFIRM:
                return (
                    <div className="flex flex-col items-center gap-4">
                        <Spinner size="lg" />
                        <p className="text-neutral-500">
                            {t('app.governance.countryReservation.dialog.register.confirming')}
                        </p>
                    </div>
                );

            case CountryReservationStep.SUCCESS:
                return (
                    <div className="flex flex-col gap-4">
                        <p className="text-success-500">
                            {t('app.governance.countryReservation.dialog.success.message', { name: `${name}.${tld}` })}
                        </p>
                        <p className="text-neutral-500">{t('app.governance.countryReservation.dialog.success.next')}</p>
                        <button
                            onClick={close}
                            className="rounded-lg bg-primary-500 px-6 py-3 text-white hover:bg-primary-600"
                        >
                            {t('app.governance.countryReservation.dialog.success.button')}
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-[400px] flex-col gap-6 p-6">
            <div>
                <h2 className="text-2xl font-bold">{t('app.governance.countryReservation.dialog.title')}</h2>
                <p className="text-neutral-500">{t('app.governance.countryReservation.dialog.subtitle')}</p>
            </div>
            {renderStepContent()}
        </div>
    );
};
