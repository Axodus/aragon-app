'use client';

import { Network } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { useFormField } from '@/shared/hooks/useFormField';
import { AddressInput, addressUtils, type IAddressInputResolvedValue } from '@aragon/gov-ui-kit';
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
            required: true,
            validate: (value?: string) => (value ? addressUtils.isAddress(value) : false),
        },
        fieldPrefix: formPrefix,
        sanitizeOnBlur: false,
    });

    const [addressInput, setAddressInput] = useState<string | undefined>(validatorAddress);

    useEffect(() => {
        setAddressInput(validatorAddress);
    }, [validatorAddress]);

    const handleAddressChange = (value?: string) => {
        setAddressInput(value);
        const nextValue = value ?? '';
        if (nextValue.trim().length === 0 || addressUtils.isAddress(nextValue)) {
            onValidatorChange(nextValue);
        }
    };

    const handleAddressAccept = (value?: IAddressInputResolvedValue) => {
        onValidatorChange(value?.address ?? '');
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
