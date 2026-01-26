'use client';

import { Network } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { useFormField } from '@/shared/hooks/useFormField';
import { evmAddressUtils } from '@/shared/utils/evmAddressUtils';
import { AddressInput, type IAddressInputResolvedValue } from '@aragon/gov-ui-kit';
import { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import type { IHarmonyVotingSetupMembershipForm, IHarmonyVotingSetupMembershipProps } from './harmonyVotingSetupMembership.api';

export const HarmonyDelegationVotingSetupMembership = (props: IHarmonyVotingSetupMembershipProps) => {
    const { formPrefix } = props;
    const { t } = useTranslations();

    const network = useWatch<{ network?: Network }>({ name: 'network' });
    const chainId = network ? networkDefinitions[network as Network].id : undefined;

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

    const [addressInput, setAddressInput] = useState<string>(validatorAddress ?? '');

    useEffect(() => {
        setAddressInput(validatorAddress ?? '');
    }, [validatorAddress]);

    const handleAddressChange = (value?: string) => {
        // Some AddressInput implementations may emit `undefined` for intermediate/invalid values.
        // Ignore it so we don't clear the user's in-progress input.
        if (value === undefined) {
            return;
        }

        // Keep a local input state while user types. Commit to form state only on accept.
        setAddressInput(value);
    };

    const handleAddressAccept = (value?: IAddressInputResolvedValue) => {
        const resolvedAddress = value?.address ?? '';
        const res = evmAddressUtils.validate(resolvedAddress);
        onValidatorChange(res.ok ? res.address : resolvedAddress);
        setAddressInput(res.ok ? res.address : resolvedAddress);
    };

    return (
        <div className="flex w-full flex-col gap-3">
            <AddressInput
                {...validatorField}
                placeholder={t('app.plugins.harmonyDelegationVoting.setupMembership.validatorAddress.placeholder')}
                helpText={t('app.plugins.harmonyDelegationVoting.setupMembership.validatorAddress.helpText')}
                value={addressInput}
                onChange={handleAddressChange}
                onAccept={handleAddressAccept}
                chainId={chainId}
            />
        </div>
    );
};
