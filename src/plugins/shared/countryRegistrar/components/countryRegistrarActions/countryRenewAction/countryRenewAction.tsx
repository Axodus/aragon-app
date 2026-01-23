'use client';

import type { IProposalAction } from '@/modules/governance/api/governanceService';
import type { IProposalActionData } from '@/modules/governance/components/createProposalForm';
import { Network } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { daoUtils } from '@/shared/utils/daoUtils';
import { getPublicClient } from '@/shared/utils/networkUtils/publicClient';
import type { IProposalActionComponentProps } from '@aragon/gov-ui-kit';
import { InputNumber, InputText } from '@aragon/gov-ui-kit';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { encodeFunctionData, formatEther, type Hex } from 'viem';
import type { ICountryIntegrationAddresses } from '@/shared/constants/networkDefinitions';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';

export interface ICountryRenewActionProps<TPlugin = any>
    extends IProposalActionComponentProps<IProposalActionData<IProposalAction, TPlugin>> {}

interface ICountryRenewFormData {
    name?: string;
    months?: string;
}

const renewAbi = {
    type: 'function',
    name: 'renew',
    stateMutability: 'payable',
    inputs: [
        { name: 'name', internalType: 'string', type: 'string' },
        { name: 'duration', internalType: 'uint256', type: 'uint256' },
    ],
    outputs: [],
} as const;

const rentPriceAbi = {
    type: 'function',
    name: 'rentPrice',
    stateMutability: 'view',
    inputs: [
        { name: 'name', internalType: 'string', type: 'string' },
        { name: 'duration', internalType: 'uint256', type: 'uint256' },
    ],
    outputs: [
        {
            name: 'price',
            internalType: 'struct IPriceOracle.Price',
            type: 'tuple',
            components: [
                { name: 'base', internalType: 'uint256', type: 'uint256' },
                { name: 'premium', internalType: 'uint256', type: 'uint256' },
            ],
        },
    ],
} as const;

const SECONDS_PER_MONTH = 30 * 24 * 60 * 60;

const parseMonths = (value?: string) => {
    const parsed = Number(value ?? '');
    if (!Number.isFinite(parsed)) {
        return 0;
    }
    return Math.floor(parsed);
};

const monthsToDurationSeconds = (months: number) => months * SECONDS_PER_MONTH;

const getCountryConfig = (network: Network): ICountryIntegrationAddresses | undefined =>
    networkDefinitions[network].country;

const normalizeLabel = (value?: string) => (value ?? '').trim().replace(/\.$/, '').replace(/\.country$/i, '');

export const CountryRenewAction: React.FC<ICountryRenewActionProps> = (props) => {
    const { index, action } = props;

    const { t } = useTranslations();
    const { setValue } = useFormContext();

    const actionFieldName = `actions.[${index.toString()}]`;
    useFormField<Record<string, IProposalActionData>, typeof actionFieldName>(actionFieldName);

    const nameField = useFormField<ICountryRenewFormData, 'name'>('name', {
        label: t('app.actions.countryRegistrar.renew.name.label'),
        rules: { required: true },
        fieldPrefix: actionFieldName,
        trimOnBlur: true,
    });

    const monthsField = useFormField<ICountryRenewFormData, 'months'>('months', {
        label: t('app.actions.countryRegistrar.renew.duration.label'),
        rules: {
            required: true,
            validate: (value?: string) => {
                const months = parseMonths(value);
                return months >= 1 && months <= 12;
            },
        },
        fieldPrefix: actionFieldName,
        defaultValue: '12',
        trimOnBlur: true,
    });

    const { network, address: daoAddress } = daoUtils.parseDaoId(action.daoId);

    const config = useMemo(() => getCountryConfig(network), [network]);

    const [estimatedCostWei, setEstimatedCostWei] = useState<bigint | null>(null);

    useEffect(() => {
        const label = normalizeLabel(nameField.value);
        const months = parseMonths(monthsField.value);
        const duration = monthsToDurationSeconds(months);

        if (!config || !label || duration <= 0 || months < 1 || months > 12) {
            return;
        }

        const newData = encodeFunctionData({
            abi: [renewAbi],
            args: [label, BigInt(duration)],
        });

        setValue(`${actionFieldName}.to`, config.registrarController);
        setValue(`${actionFieldName}.data`, newData);

        setValue(`${actionFieldName}.inputData.function`, 'renew');
        setValue(`${actionFieldName}.inputData.contract`, 'RegistrarController');

        const client = getPublicClient(network);
        const updatePrice = async () => {
            try {
                const price = (await client.readContract({
                    abi: [rentPriceAbi],
                    address: config.registrarController,
                    functionName: 'rentPrice',
                    args: [label, BigInt(duration)],
                })) as { base: bigint; premium: bigint };

                const total = (price.base ?? BigInt(0)) + (price.premium ?? BigInt(0));
                setEstimatedCostWei(total);
                setValue(`${actionFieldName}.value`, total.toString());
            } catch {
                setEstimatedCostWei(null);
            }
        };

        void updatePrice();
    }, [config, nameField.value, monthsField.value, network, setValue, actionFieldName]);

    if (!config) {
        return <p className="text-primary-400">{t('app.actions.countryRegistrar.unsupportedNetwork')}</p>;
    }

    return (
        <div className="flex w-full flex-col gap-6">
            <InputText
                placeholder={t('app.actions.countryRegistrar.renew.name.placeholder')}
                maxLength={63}
                {...nameField}
            />
            <p className="text-primary-400">
                {t('app.actions.countryRegistrar.renew.fqdnHint', {
                    value: `${normalizeLabel(nameField.value)}.${config?.tld ?? 'country'}`,
                })}
            </p>
            <InputNumber
                placeholder={t('app.actions.countryRegistrar.renew.duration.placeholder')}
                min={1}
                max={12}
                step={1}
                {...monthsField}
            />
            {estimatedCostWei != null && (
                <p className="text-primary-400">
                    {t('app.actions.countryRegistrar.renew.costHint', {
                        value: formatEther(estimatedCostWei),
                    })}
                </p>
            )}
        </div>
    );
};
