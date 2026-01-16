import type { IBuildPreparePluginInstallDataParams } from '@/modules/createDao/types';
import { PluginInterfaceType } from '@/shared/api/daoService';
import { pluginTransactionUtils } from '@/shared/utils/pluginTransactionUtils';
import { addressUtils } from '@aragon/gov-ui-kit';
import { encodeAbiParameters, type Hex } from 'viem';
import type { IPluginInfo } from '@/shared/types';
import type { IHarmonyVotingSetupGovernanceForm } from '../components/harmonyVotingSetupGovernance';
import type { IHarmonyVotingSetupMembershipForm } from '../components/harmonyVotingSetupMembership';

export type IPrepareHarmonyVotingInstallDataParams = IBuildPreparePluginInstallDataParams<
    IHarmonyVotingSetupGovernanceForm,
    never,
    IHarmonyVotingSetupMembershipForm
>;

export const buildPrepareHarmonyVotingInstallData = (plugin: IPluginInfo, params: IPrepareHarmonyVotingInstallDataParams): Hex => {
    const { dao, body } = params;

    const repositoryAddress = plugin.repositoryAddresses[dao.network];

    // Oracle is fixed per network (backend automation).
    const pluginSettingsData =
        plugin.id === PluginInterfaceType.HARMONY_DELEGATION_VOTING
            ? buildDelegationInstallData(body.membership?.validatorAddress)
            : ('0x' as Hex);

    return pluginTransactionUtils.buildPrepareInstallationData(
        repositoryAddress,
        plugin.installVersion,
        pluginSettingsData,
        dao.address as Hex,
    );
};

const buildDelegationInstallData = (validatorAddress?: string): Hex => {
    if (validatorAddress == null || validatorAddress.trim().length === 0) {
        throw new Error('Validator address is required for Harmony Delegation voting.');
    }

    if (!addressUtils.isAddress(validatorAddress)) {
        throw new Error('Validator address must be a valid address.');
    }

    return encodeAbiParameters([{ name: 'validatorAddress', type: 'address' }], [validatorAddress as Hex]);
};
