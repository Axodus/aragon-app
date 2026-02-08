'use client';

import { Network } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { useFormField } from '@/shared/hooks/useFormField';
import { evmAddressUtils } from '@/shared/utils/evmAddressUtils';
import { sanitizePlainText } from '@/shared/security';
import { AddressInput, InputText, type IAddressInputResolvedValue } from '@aragon/gov-ui-kit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { IHarmonyVotingSetupMembershipForm, IHarmonyVotingSetupMembershipProps } from './harmonyVotingSetupMembership.api';

const isEnsLike = (value: string): boolean => /^(?:[a-z0-9-]+\.)*[a-z0-9-]+\.eth$/i.test(value.trim());

export const HarmonyDelegationVotingSetupMembership = (props: IHarmonyVotingSetupMembershipProps) => {
    const { formPrefix } = props;
    const { t } = useTranslations();

    const [ensResolutionError, setEnsResolutionError] = useState<string | undefined>(undefined);

    const processKeyMaxLength = 5;
    const processKeyPattern = /^[A-Z]+$/;

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
                if (value == null || value.length === 0) return true;
                if (isEnsLike(value)) return true;
                const res = evmAddressUtils.validate(value);
                if (res.ok) return true;
                return `app.plugins.harmonyDelegationVoting.setupMembership.validatorAddress.error.${res.error}`;
            },
        },
        fieldPrefix: formPrefix,
        sanitizeOnBlur: false,
    });

    const [addressInput, setAddressInput] = useState<string | undefined>(validatorAddress ?? '');

    const {
        onChange: onProcessKeyChange,
        value: processKey,
        ...processKeyField
    } = useFormField<IHarmonyVotingSetupMembershipForm, 'processKey'>('processKey', {
        label: t('app.createDao.createProcessForm.metadata.processKey.label'),
        rules: {
            required: {
                value: true,
                message: 'app.shared.formField.error.required',
            },
            validate: (value?: string) => {
                const key = (value ?? '').trim();
                if (key.length === 0) return false;
                if (key.length > processKeyMaxLength) return false;
                if (!processKeyPattern.test(key)) return false;
                return true;
            },
        },
        fieldPrefix: formPrefix,
        sanitizeOnBlur: false,
    });

    const [processKeyTouched, setProcessKeyTouched] = useState<boolean>(false);

    const normalizedProcessKey = useMemo(() => {
        const key = String(processKey ?? '').trim();
        if (key.length === 0) return undefined;
        if (key.length > processKeyMaxLength) return undefined;
        if (!processKeyPattern.test(key)) return undefined;
        return key;
    }, [processKey]);

    useEffect(() => {
        setAddressInput(validatorAddress ?? '');
    }, [validatorAddress]);

    const handleAddressChange = useCallback((value?: string) => {
        // Keep a best-effort copy of what the user typed.
        setAddressInput(value ?? '');
        setEnsResolutionError(undefined);
    }, []);

    const handleAddressAccept = useCallback(
        (value?: IAddressInputResolvedValue) => {
            const resolvedAddress = value?.address;
            const resolvedName = value?.name;
            const currentInput = (addressInput ?? '').trim();

            // If the component already resolved to a 0x address, accept it.
            if (resolvedAddress) {
                const res = evmAddressUtils.validate(resolvedAddress);
                if (res.ok) {
                    onValidatorChange(res.address);
                    setAddressInput(resolvedName ?? res.address);
                    setEnsResolutionError(undefined);
                    return;
                }
            }

            // ENS-like input that could not be resolved by the component.
            if (currentInput.length > 0 && isEnsLike(currentInput)) {
                setEnsResolutionError(
                    t('app.plugins.harmonyDelegationVoting.setupMembership.validatorAddress.error.ensNotResolved'),
                );
                return;
            }

            // Fallback: validate as a raw 0x address.
            const res = evmAddressUtils.validate(currentInput);
            if (res.ok) {
                onValidatorChange(res.address);
                setAddressInput(res.address);
                setEnsResolutionError(undefined);
            }
        },
        [addressInput, onValidatorChange, t],
    );

    const handleProcessKeyChange = useCallback(
        (value: string) => {
            setProcessKeyTouched(true);
            onProcessKeyChange(sanitizePlainText(value).toUpperCase());
        },
        [onProcessKeyChange],
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
                value={addressInput}
                onChange={handleAddressChange}
                onAccept={handleAddressAccept}
                chainId={validatorInputChainId}
                variant={effectiveVariant}
                alert={effectiveAlert}
            />

            <InputText
                {...processKeyField}
                label={t('app.createDao.createProcessForm.metadata.processKey.label')}
                helpText={t('app.createDao.createProcessForm.metadata.processKey.helpText')}
                placeholder={t('app.createDao.createProcessForm.metadata.processKey.label')}
                maxLength={processKeyMaxLength}
                value={processKey ?? ''}
                onChange={(event) => handleProcessKeyChange(event.target.value)}
                onBlur={() => setProcessKeyTouched(true)}
                variant={processKeyTouched && normalizedProcessKey == null ? 'critical' : processKeyField.variant}
                alert={
                    processKeyTouched && normalizedProcessKey == null
                        ? {
                              variant: 'critical',
                              message: 'Process key must be 1-5 uppercase letters (A-Z).',
                          }
                        : processKeyField.alert
                }
            />
        </div>
    );
};
