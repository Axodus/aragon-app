'use client';

import type { IProposalAction } from '@/modules/governance/api/governanceService';
import type { IProposalActionData } from '@/modules/governance/components/createProposalForm';
import { Network } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { daoUtils } from '@/shared/utils/daoUtils';
import type { IProposalActionComponentProps } from '@aragon/gov-ui-kit';
import { InputText } from '@aragon/gov-ui-kit';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { encodeFunctionData, isAddress, keccak256, toBytes, type Hex } from 'viem';
import type { ICountryIntegrationAddresses } from '@/shared/constants/networkDefinitions';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';

export interface ICountryTransferActionProps<TPlugin = any>
    extends IProposalActionComponentProps<IProposalActionData<IProposalAction, TPlugin>> {}

interface ICountryTransferFormData {
    name?: string;
    from?: string;
}

const transferFromAbi = {
    type: 'function',
    name: 'transferFrom',
    stateMutability: 'nonpayable',
    inputs: [
        { name: 'from', internalType: 'address', type: 'address' },
        { name: 'to', internalType: 'address', type: 'address' },
        { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    outputs: [],
} as const;

const getCountryConfig = (network: Network): ICountryIntegrationAddresses | undefined => networkDefinitions[network].country;

const normalizeLabel = (value?: string) => (value ?? '').trim().replace(/\.$/, '').replace(/\.country$/i, '');

const labelhashToTokenId = (label: string): bigint => {
    const labelHash = keccak256(toBytes(label));
    return BigInt(labelHash);
};

export const CountryTransferAction: React.FC<ICountryTransferActionProps> = (props) => {
    const { index, action } = props;

    const { t } = useTranslations();
    const { setValue } = useFormContext();

    const actionFieldName = `actions.[${index.toString()}]`;
    useFormField<Record<string, IProposalActionData>, typeof actionFieldName>(actionFieldName);

    const nameField = useFormField<ICountryTransferFormData, 'name'>('name', {
        label: t('app.actions.countryRegistrar.transfer.name.label'),
        rules: { required: true },
        fieldPrefix: actionFieldName,
        trimOnBlur: true,
    });

    const fromField = useFormField<ICountryTransferFormData, 'from'>('from', {
        label: t('app.actions.countryRegistrar.transfer.from.label'),
        rules: {
            required: true,
            validate: (value?: string) => isAddress((value ?? '') as Hex),
        },
        fieldPrefix: actionFieldName,
        trimOnBlur: true,
    });

    const { network, address: daoAddress } = daoUtils.parseDaoId(action.daoId);

    const config = useMemo(() => getCountryConfig(network), [network]);

    useEffect(() => {
        const label = normalizeLabel(nameField.value);
        const from = (fromField.value ?? '').trim();

        if (!config?.baseRegistrar || !label || !isAddress(from as Hex)) {
            return;
        }

        const tokenId = labelhashToTokenId(label);

        const data = encodeFunctionData({
            abi: [transferFromAbi],
            functionName: 'transferFrom',
            args: [from as Hex, daoAddress as Hex, tokenId],
        });

        setValue(`${actionFieldName}.to`, config.baseRegistrar);
        setValue(`${actionFieldName}.value`, '0');
        setValue(`${actionFieldName}.data`, data);

        setValue(`${actionFieldName}.inputData.function`, 'transferFrom');
        setValue(`${actionFieldName}.inputData.contract`, 'BaseRegistrar');
    }, [actionFieldName, config, daoAddress, fromField.value, nameField.value, setValue]);

    if (!config?.baseRegistrar) {
        return <p className="text-primary-400">{t('app.actions.countryRegistrar.unsupportedNetwork')}</p>;
    }

    return (
        <div className="flex w-full flex-col gap-6">
            <InputText
                placeholder={t('app.actions.countryRegistrar.transfer.name.placeholder')}
                maxLength={63}
                {...nameField}
            />
            <p className="text-primary-400">
                {t('app.actions.countryRegistrar.transfer.fqdnHint', {
                    value: `${normalizeLabel(nameField.value)}.${config.tld}`,
                })}
            </p>
            <InputText placeholder={t('app.actions.countryRegistrar.transfer.from.placeholder')} {...fromField} />
            <p className="text-primary-400">{t('app.actions.countryRegistrar.transfer.approvalHint')}</p>
        </div>
    );
};
