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
import { namehash } from 'viem/ens';
import type { ICountryIntegrationAddresses } from '@/shared/constants/networkDefinitions';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { CountryRegistrarActionType } from '@/plugins/shared/countryRegistrar/types';

export interface ICountryRegisterActionProps<TPlugin = any> extends IProposalActionComponentProps<IProposalActionData<IProposalAction, TPlugin>> {}

interface ICountryRegisterFormData {
    name?: string;
    months?: string;
}

const registerAbi = {
    type: 'function',
    name: 'register',
    stateMutability: 'payable',
    inputs: [
        { name: 'name', internalType: 'string', type: 'string' },
        { name: 'owner', internalType: 'address', type: 'address' },
        { name: 'duration', internalType: 'uint256', type: 'uint256' },
        { name: 'secret', internalType: 'bytes32', type: 'bytes32' },
        { name: 'resolver', internalType: 'address', type: 'address' },
        { name: 'data', internalType: 'bytes[]', type: 'bytes[]' },
        { name: 'reverseRecord', internalType: 'bool', type: 'bool' },
        { name: 'fuses', internalType: 'uint32', type: 'uint32' },
        { name: 'wrapperExpiry', internalType: 'uint64', type: 'uint64' },
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

const setAddrAbi = {
    type: 'function',
    name: 'setAddr',
    stateMutability: 'nonpayable',
    inputs: [
        { name: 'node', internalType: 'bytes32', type: 'bytes32' },
        { name: 'a', internalType: 'address', type: 'address' },
    ],
    outputs: [],
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

const isBytes32Hex = (value: unknown): value is Hex => /^0x[0-9a-fA-F]{64}$/.test(String(value ?? ''));

const generateSecretBytes32 = (): Hex => {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return (`0x${Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')}`) as Hex;
};

const getCountryConfig = (network: Network): ICountryIntegrationAddresses | undefined => networkDefinitions[network].country;

const normalizeLabel = (value?: string) => (value ?? '').trim().replace(/\.$/, '').replace(/\.country$/i, '');

export const CountryRegisterAction: React.FC<ICountryRegisterActionProps> = (props) => {
    const { index, action } = props;

    const { t } = useTranslations();
    const { setValue, getValues } = useFormContext();

    const actionFieldName = `actions.[${index.toString()}]`;
    useFormField<Record<string, IProposalActionData>, typeof actionFieldName>(actionFieldName);

    const nameField = useFormField<ICountryRegisterFormData, 'name'>('name', {
        label: t('app.actions.countryRegistrar.register.name.label'),
        rules: { required: true },
        fieldPrefix: actionFieldName,
        trimOnBlur: true,
    });

    const monthsField = useFormField<ICountryRegisterFormData, 'months'>('months', {
        label: t('app.actions.countryRegistrar.register.duration.label'),
        rules: {
            required: true,
            validate: (value?: string) => {
                const months = parseMonths(value);
                return months >= 1 && months <= 12;
            },
        },
        fieldPrefix: actionFieldName,
        defaultValue: '1',
        trimOnBlur: true,
    });

    const { network, address: daoAddress } = daoUtils.parseDaoId(action.daoId);

    const config = useMemo(() => getCountryConfig(network), [network]);

    const [estimatedCostWei, setEstimatedCostWei] = useState<bigint | null>(null);

    const resolveSharedSecret = () => {
        const currentSecret = getValues(`${actionFieldName}.meta.secret`);
        if (isBytes32Hex(currentSecret)) {
            return currentSecret;
        }

        const allActions = (getValues('actions') ?? []) as Array<any>;
        const commitIndex = allActions.findIndex((a) => a?.type === CountryRegistrarActionType.COMMIT);
        const commitSecret = commitIndex >= 0 ? allActions[commitIndex]?.meta?.secret : undefined;

        if (isBytes32Hex(commitSecret)) {
            setValue(`${actionFieldName}.meta.secret`, commitSecret);
            return commitSecret;
        }

        const generated = generateSecretBytes32();
        setValue(`${actionFieldName}.meta.secret`, generated);

        if (commitIndex >= 0) {
            setValue(`actions.[${commitIndex.toString()}].meta.secret`, generated);
        }

        return generated;
    };

    useEffect(() => {
        const label = normalizeLabel(nameField.value);
        const months = parseMonths(monthsField.value);
        const duration = monthsToDurationSeconds(months);
        const secret = resolveSharedSecret();

        if (!config || !label || duration <= 0 || months < 1 || months > 12) {
            return;
        }

        const fqdn = `${label}.${config.tld}`;
        const node = namehash(fqdn);

        const resolverCall = encodeFunctionData({ abi: [setAddrAbi], args: [node, daoAddress as Hex] });

        const newData = encodeFunctionData({
            abi: [registerAbi],
            args: [
                label,
                daoAddress as Hex,
                BigInt(duration),
                secret,
                config.publicResolver,
                [resolverCall],
                false,
                0 as any,
                0 as any,
            ],
        });

        setValue(`${actionFieldName}.to`, config.registrarController);
        setValue(`${actionFieldName}.data`, newData);

        setValue(`${actionFieldName}.inputData.function`, 'register');
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
                // Não mexe no value se a leitura falhar (RPC instável)
            }
        };

        void updatePrice();
    }, [config, daoAddress, nameField.value, monthsField.value, network, setValue, actionFieldName]);

    if (!config) {
        return <p className="text-primary-400">{t('app.actions.countryRegistrar.unsupportedNetwork')}</p>;
    }

    return (
        <div className="flex w-full flex-col gap-6">
            <InputText
                placeholder={t('app.actions.countryRegistrar.register.name.placeholder')}
                maxLength={63}
                {...nameField}
            />
            <p className="text-primary-400">
                {t('app.actions.countryRegistrar.register.fqdnHint', { value: `${normalizeLabel(nameField.value)}.${config?.tld ?? 'country'}` })}
            </p>
            <InputNumber
                placeholder={t('app.actions.countryRegistrar.register.duration.placeholder')}
                min={1}
                max={12}
                step={1}
                {...monthsField}
            />
            {estimatedCostWei != null ? (
                <p className="text-primary-400">
                    {t('app.actions.countryRegistrar.register.estimatedCost', { value: formatEther(estimatedCostWei) })}
                </p>
            ) : null}
        </div>
    );
};
