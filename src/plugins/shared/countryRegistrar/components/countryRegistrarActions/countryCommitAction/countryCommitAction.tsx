'use client';

import type { IProposalAction } from '@/modules/governance/api/governanceService';
import type { IProposalActionData } from '@/modules/governance/components/createProposalForm';
import { Network } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { daoUtils } from '@/shared/utils/daoUtils';
import type { IProposalActionComponentProps } from '@aragon/gov-ui-kit';
import { InputNumber, InputText } from '@aragon/gov-ui-kit';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { encodeAbiParameters, encodeFunctionData, keccak256, parseAbiParameters, type Hex } from 'viem';
import { namehash } from 'viem/ens';
import type { ICountryIntegrationAddresses } from '@/shared/constants/networkDefinitions';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { CountryRegistrarActionType } from '@/plugins/shared/countryRegistrar/types';

export interface ICountryCommitActionProps<TPlugin = any> extends IProposalActionComponentProps<IProposalActionData<IProposalAction, TPlugin>> {}

interface ICountryCommitFormData {
    name?: string;
    months?: string;
}

const commitAbi = {
    type: 'function',
    name: 'commit',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'commitment', internalType: 'bytes32', type: 'bytes32' }],
    outputs: [],
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

export const CountryCommitAction: React.FC<ICountryCommitActionProps> = (props) => {
    const { index, action } = props;

    const { t } = useTranslations();
    const { setValue, getValues } = useFormContext();

    const actionFieldName = `actions.[${index.toString()}]`;
    useFormField<Record<string, IProposalActionData>, typeof actionFieldName>(actionFieldName);

    const getRegisterPairValues = () => {
        const allActions = (getValues('actions') ?? []) as Array<any>;
        const registerIndex = allActions.findIndex((a) => a?.type === CountryRegistrarActionType.REGISTER);

        const name = registerIndex >= 0 ? allActions[registerIndex]?.name : undefined;
        const months = registerIndex >= 0 ? allActions[registerIndex]?.months : undefined;

        return { registerIndex, name, months };
    };

    const { registerIndex: pairedRegisterIndex } = getRegisterPairValues();
    const hasRegisterPair = pairedRegisterIndex >= 0;

    const nameField = useFormField<ICountryCommitFormData, 'name'>('name', {
        label: t('app.actions.countryRegistrar.commit.name.label'),
        rules: { required: !hasRegisterPair },
        fieldPrefix: actionFieldName,
        trimOnBlur: true,
    });

    const monthsField = useFormField<ICountryCommitFormData, 'months'>('months', {
        label: t('app.actions.countryRegistrar.commit.duration.label'),
        rules: {
            required: !hasRegisterPair,
            validate: (value?: string) => {
                if (hasRegisterPair) return true;
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

    const resolveSharedSecret = () => {
        const currentSecret = getValues(`${actionFieldName}.meta.secret`);
        if (isBytes32Hex(currentSecret)) {
            return currentSecret;
        }

        const { registerIndex } = getRegisterPairValues();
        const registerSecret = registerIndex >= 0 ? getValues(`actions.[${registerIndex.toString()}].meta.secret`) : undefined;

        if (isBytes32Hex(registerSecret)) {
            setValue(`${actionFieldName}.meta.secret`, registerSecret);
            return registerSecret;
        }

        const generated = generateSecretBytes32();
        setValue(`${actionFieldName}.meta.secret`, generated);

        if (registerIndex >= 0) {
            setValue(`actions.[${registerIndex.toString()}].meta.secret`, generated);
        }

        return generated;
    };

    useEffect(() => {
        const { registerIndex, name: pairedName, months: pairedMonths } = getRegisterPairValues();

        // If there's a Register action in the proposal, mirror its inputs to avoid commitment/register mismatch.
        if (registerIndex >= 0) {
            if (pairedName != null && pairedName !== nameField.value) {
                setValue(`${actionFieldName}.name`, pairedName);
            }
            if (pairedMonths != null && pairedMonths !== monthsField.value) {
                setValue(`${actionFieldName}.months`, pairedMonths);
            }
        }

        const label = normalizeLabel(pairedName ?? nameField.value);
        const months = parseMonths(pairedMonths ?? monthsField.value);
        const duration = monthsToDurationSeconds(months);
        const secret = resolveSharedSecret();

        if (!config || !label || duration <= 0 || months < 1 || months > 12) {
            return;
        }

        const fqdn = `${label}.${config.tld}`;
        const node = namehash(fqdn);

        const resolverCall = encodeFunctionData({ abi: [setAddrAbi], args: [node, daoAddress as Hex] });

        // `makeCommitment` is `pure`, so we compute it locally to avoid RPC instability.
        const commitment = keccak256(
            encodeAbiParameters(
                parseAbiParameters(
                    'string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint32 fuses, uint64 wrapperExpiry',
                ),
                [
                    label,
                    daoAddress as Hex,
                    BigInt(duration),
                    secret,
                    config.publicResolver,
                    [resolverCall] as readonly Hex[],
                    false,
                    0,
                    BigInt(0),
                ],
            ),
        ) as Hex;

        const newData = encodeFunctionData({ abi: [commitAbi], args: [commitment] });

        setValue(`${actionFieldName}.to`, config.registrarController);
        setValue(`${actionFieldName}.value`, '0');
        setValue(`${actionFieldName}.data`, newData);

        setValue(`${actionFieldName}.inputData.function`, 'commit');
        setValue(`${actionFieldName}.inputData.contract`, 'RegistrarController');
        setValue(`${actionFieldName}.inputData.parameters[0].name`, 'commitment');
        setValue(`${actionFieldName}.inputData.parameters[0].type`, 'bytes32');
        setValue(`${actionFieldName}.inputData.parameters[0].value`, commitment);
    }, [config, daoAddress, nameField.value, monthsField.value, network, setValue, actionFieldName]);

    if (!config) {
        return <p className="text-primary-400">{t('app.actions.countryRegistrar.unsupportedNetwork')}</p>;
    }

    const { registerIndex } = getRegisterPairValues();
    const hasRegisterAction = registerIndex >= 0;

    return (
        <div className="flex w-full flex-col gap-6">
            {hasRegisterAction ? (
                <p className="text-primary-400">{t('app.actions.countryRegistrar.commit.autoHint')}</p>
            ) : (
                <>
                    <InputText
                        placeholder={t('app.actions.countryRegistrar.commit.name.placeholder')}
                        maxLength={63}
                        {...nameField}
                    />
                    <p className="text-primary-400">
                        {t('app.actions.countryRegistrar.commit.fqdnHint', {
                            value: `${normalizeLabel(nameField.value)}.${config?.tld ?? 'country'}`,
                        })}
                    </p>
                    <InputNumber
                        placeholder={t('app.actions.countryRegistrar.commit.duration.placeholder')}
                        min={1}
                        max={12}
                        step={1}
                        {...monthsField}
                    />
                </>
            )}
        </div>
    );
};
