'use client';

import { Network } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { useFormField } from '@/shared/hooks/useFormField';
import { evmAddressUtils } from '@/shared/utils/evmAddressUtils';
import { AddressInput, type IAddressInputResolvedValue } from '@aragon/gov-ui-kit';
import { useCallback } from 'react';
import { useWatch } from 'react-hook-form';
import type { IHarmonyVotingSetupMembershipForm, IHarmonyVotingSetupMembershipProps } from './harmonyVotingSetupMembership.api';

export const HarmonyDelegationVotingSetupMembership = (props: IHarmonyVotingSetupMembershipProps) => {
    const { formPrefix } = props;
    const { t } = useTranslations();

    const network = useWatch<{ network?: Network }>({ name: 'network' });
    const chainId = network ? networkDefinitions[network as Network].id : undefined;

    const {
        onChange: onValidatorChange,
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

    const handleAddressChange = useCallback(
        (value?: string) => {
        // AddressInput may emit `undefined` for intermediate/invalid values.
        // Keep the input uncontrolled so typing doesn't get overwritten by form state.
        if (value === undefined) return;
        onValidatorChange(value);
        },
        [onValidatorChange],
    );

    const handleAddressAccept = useCallback(
        (value?: IAddressInputResolvedValue) => {
        const resolvedAddress = value?.address ?? '';
        const res = evmAddressUtils.validate(resolvedAddress);
        onValidatorChange(res.ok ? res.address : resolvedAddress);
        },
        [onValidatorChange],
    );

    return (
        <div className="flex w-full flex-col gap-3">
            <AddressInput
                {...validatorField}
                placeholder={t('app.plugins.harmonyDelegationVoting.setupMembership.validatorAddress.placeholder')}
                helpText={t('app.plugins.harmonyDelegationVoting.setupMembership.validatorAddress.helpText')}
                onChange={handleAddressChange}
                onAccept={handleAddressAccept}
                chainId={chainId}
            />
        </div>
    );
};
