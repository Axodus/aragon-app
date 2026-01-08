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
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { encodeFunctionData, zeroAddress, type Hex } from 'viem';
import { namehash } from 'viem/ens';
import type { ICountryIntegrationAddresses } from '@/shared/constants/networkDefinitions';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';

export interface ICountryCommitActionProps extends IProposalActionComponentProps<IProposalActionData<IProposalAction>> {}

interface ICountryCommitFormData {
    name?: string;
    secret?: string;
    duration?: string;
}

const commitAbi = {
    type: 'function',
    name: 'commit',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'commitment', internalType: 'bytes32', type: 'bytes32' }],
    outputs: [],
} as const;

const makeCommitmentAbi = {
    type: 'function',
    name: 'makeCommitment',
    stateMutability: 'pure',
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
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
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

const parseDurationSeconds = (value?: string) => {
    const parsed = Number(value ?? '');
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return 0;
    }
    return Math.floor(parsed);
};

const getCountryConfig = (network: Network): ICountryIntegrationAddresses | undefined => networkDefinitions[network].country;

const normalizeLabel = (value?: string) => (value ?? '').trim().replace(/\.$/, '').replace(/\.country$/i, '');

export const CountryCommitAction: React.FC<ICountryCommitActionProps> = (props) => {
    const { index, action } = props;

    const { t } = useTranslations();
    const { setValue } = useFormContext();

    const actionFieldName = `actions.[${index.toString()}]`;
    useFormField<Record<string, IProposalActionData>, typeof actionFieldName>(actionFieldName);

    const nameField = useFormField<ICountryCommitFormData, 'name'>('name', {
        label: t('app.actions.countryRegistrar.commit.name.label'),
        rules: { required: true },
        fieldPrefix: actionFieldName,
        trimOnBlur: true,
    });

    const secretField = useFormField<ICountryCommitFormData, 'secret'>('secret', {
        label: t('app.actions.countryRegistrar.commit.secret.label'),
        rules: {
            required: true,
            validate: (value) => /^0x[0-9a-fA-F]{64}$/.test(value ?? ''),
        },
        fieldPrefix: actionFieldName,
        trimOnBlur: true,
    });

    const durationField = useFormField<ICountryCommitFormData, 'duration'>('duration', {
        label: t('app.actions.countryRegistrar.commit.duration.label'),
        rules: {
            required: true,
            validate: (value) => parseDurationSeconds(value) > 0,
        },
        fieldPrefix: actionFieldName,
        defaultValue: '31536000',
        trimOnBlur: true,
    });

    const { network, address: daoAddress } = daoUtils.parseDaoId(action.daoId);

    const config = useMemo(() => getCountryConfig(network), [network]);

    useEffect(() => {
        const label = normalizeLabel(nameField.value);
        const duration = parseDurationSeconds(durationField.value);
        const secret = secretField.value as Hex | undefined;

        if (!config || !label || !secret || duration <= 0) {
            return;
        }

        const fqdn = `${label}.${config.tld}`;
        const node = namehash(fqdn);

        const resolverCall = encodeFunctionData({ abi: [setAddrAbi], args: [node, daoAddress as Hex] });

        const client = getPublicClient(network);

        const update = async () => {
            const commitment = (await client.readContract({
                abi: [makeCommitmentAbi],
                address: config.registrarController,
                functionName: 'makeCommitment',
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
            })) as Hex;

            const newData = encodeFunctionData({ abi: [commitAbi], args: [commitment] });

            setValue(`${actionFieldName}.to`, config.registrarController);
            setValue(`${actionFieldName}.value`, '0');
            setValue(`${actionFieldName}.data`, newData);

            setValue(`${actionFieldName}.inputData.function`, 'commit');
            setValue(`${actionFieldName}.inputData.contract`, 'RegistrarController');
            setValue(`${actionFieldName}.inputData.parameters[0].name`, 'commitment');
            setValue(`${actionFieldName}.inputData.parameters[0].type`, 'bytes32');
            setValue(`${actionFieldName}.inputData.parameters[0].value`, commitment);
        };

        void update();
    }, [config, daoAddress, nameField.value, durationField.value, secretField.value, network, setValue, actionFieldName]);

    if (!config) {
        return <p className="text-primary-400">{t('app.actions.countryRegistrar.unsupportedNetwork')}</p>;
    }

    return (
        <div className="flex w-full flex-col gap-6">
            <InputText
                placeholder={t('app.actions.countryRegistrar.commit.name.placeholder')}
                maxLength={63}
                {...nameField}
            />
            <InputText
                placeholder={t('app.actions.countryRegistrar.commit.secret.placeholder')}
                {...secretField}
            />
            <InputNumber placeholder={t('app.actions.countryRegistrar.commit.duration.placeholder')} min={1} {...durationField} />
        </div>
    );
};
