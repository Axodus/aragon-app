'use client';

import { Network } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { useFormField } from '@/shared/hooks/useFormField';
import { evmAddressUtils } from '@/shared/utils/evmAddressUtils';
import { AddressInput, type IAddressInputResolvedValue } from '@aragon/gov-ui-kit';
import { useCallback, useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import type { IHarmonyVotingSetupMembershipForm, IHarmonyVotingSetupMembershipProps } from './harmonyVotingSetupMembership.api';

export const HarmonyDelegationVotingSetupMembership = (props: IHarmonyVotingSetupMembershipProps) => {
    const { formPrefix } = props;
    const { t } = useTranslations();

    const [ensResolutionError, setEnsResolutionError] = useState<string | undefined>(undefined);

    const {
        onChange: onValidatorChange,
        value: validatorAddress,
        ...validatorField
    } = useFormField<IHarmonyVotingSetupMembershipForm, 'validatorAddress'>('validatorAddress', {
        label: t('app.plugins.harmonyDelegationVoting.setupMembership.validatorAddress.label'),
        rules: {
            required: {
                value: true,
                message: 'app.plugins.harmonyDelegationVoting.setupMembership.validatorAddress.error.required',
            },
            validate: (value?: string) => {
                const res = evmAddressUtils.validate(value);
                if (res.ok) return true;
                return `app.plugins.harmonyDelegationVoting.setupMembership.validatorAddress.error.${res.error}`;
            },
        },
        fieldPrefix: formPrefix,
        sanitizeOnBlur: false,
    });

    const [addressInput, setAddressInput] = useState<string | undefined>(validatorAddress ?? '');

    useEffect(() => {
        setAddressInput(validatorAddress ?? '');
    }, [validatorAddress]);

    const handleAddressChange = useCallback(
        (value?: string) => {
            // Keep a best-effort copy of what the user typed.
            // We intentionally do NOT control the AddressInput via `value`, because it may emit
            // `undefined` for intermediate/invalid values (e.g. while typing or when entering ENS).
            if (value != null) setAddressInput(value);
            setEnsResolutionError(undefined);
        },
        [],
    );

    const handleAddressAccept = useCallback(
        (value?: IAddressInputResolvedValue) => {
            const resolved = value as unknown as Record<string, unknown> | undefined;

            const resolvedAddress = typeof resolved?.address === 'string' ? (resolved.address as string) : undefined;

            const rawFromAccept =
                (typeof resolved?.value === 'string' ? (resolved.value as string) : undefined) ??
                (typeof resolved?.inputValue === 'string' ? (resolved.inputValue as string) : undefined) ??
                (typeof resolved?.name === 'string' ? (resolved.name as string) : undefined);

            const currentInput = ((rawFromAccept ?? addressInput) ?? '').trim();

            // If the component already resolved to a 0x address, accept it.
            if (resolvedAddress) {
                const res = evmAddressUtils.validate(resolvedAddress);
                if (res.ok) {
                    onValidatorChange(res.address);
                    setAddressInput(res.address);
                    setEnsResolutionError(undefined);
                    return;
                }
            }

            // Try resolving ENS-like names to 0x.
            if (/^(?:[a-z0-9-]+\.)*[a-z0-9-]+\.eth$/i.test(currentInput)) {
                void (async () => {
                    try {
                        const ethMainnet = networkDefinitions[Network.ETHEREUM_MAINNET];
                        const rpcUrl = ethMainnet.rpcUrls.default.http[0];
                        const publicClient = createPublicClient({ chain: ethMainnet, transport: http(rpcUrl) });
                        const ens = currentInput.toLowerCase();
                        const address = await publicClient.getEnsAddress({ name: ens });

                        const validated = evmAddressUtils.validate(address ?? undefined);
                        if (!validated.ok) {
                            setEnsResolutionError(
                                t('app.plugins.harmonyDelegationVoting.setupMembership.validatorAddress.error.ensNotResolved'),
                            );
                            return;
                        }

                        onValidatorChange(validated.address);
                        setAddressInput(validated.address);
                        setEnsResolutionError(undefined);
                    } catch {
                        setEnsResolutionError(
                            t('app.plugins.harmonyDelegationVoting.setupMembership.validatorAddress.error.ensNotResolved'),
                        );
                    }
                })();

                return;
            }

            // Fallback: validate as a raw 0x address.
            const res = evmAddressUtils.validate(currentInput);
            if (res.ok) {
                onValidatorChange(res.address);
                setAddressInput(res.address);
            }
        },
        [addressInput, onValidatorChange, t],
    );

    // Force mainnet for the input so ENS (*.eth) is supported even when installing on Harmony.
    const validatorInputChainId = networkDefinitions[Network.ETHEREUM_MAINNET].id;

    const { alert, variant, ...validatorFieldRest } = validatorField;
    const effectiveVariant = ensResolutionError ? 'critical' : variant;
    const effectiveAlert = ensResolutionError ? { message: ensResolutionError, variant: 'critical' as const } : alert;

    return (
        <div className="flex w-full flex-col gap-3">
            <AddressInput
                {...validatorFieldRest}
                placeholder={t('app.plugins.harmonyDelegationVoting.setupMembership.validatorAddress.placeholder')}
                helpText={t('app.plugins.harmonyDelegationVoting.setupMembership.validatorAddress.helpText')}
                onChange={handleAddressChange}
                onAccept={handleAddressAccept}
                chainId={validatorInputChainId}
                variant={effectiveVariant}
                alert={effectiveAlert}
            />
        </div>
    );
};
