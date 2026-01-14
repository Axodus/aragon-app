import type { IBuildPreparePluginInstallDataParams } from '@/modules/createDao/types';
import { Network } from '@/shared/api/daoService';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { dateUtils } from '@/shared/utils/dateUtils';
import { pluginTransactionUtils } from '@/shared/utils/pluginTransactionUtils';
import { encodeAbiParameters, parseUnits, type Hex } from 'viem';
import type { INativeTokenVotingSetupGovernanceForm } from '../../components/nativeTokenVotingSetupGovernance';
import type { INativeTokenVotingSetupMembershipForm } from '../../components/nativeTokenVotingSetupMembership';
import { nativeTokenVotingPlugin } from '../../constants/nativeTokenVotingPlugin';
import { tokenSettingsUtils } from '../../../tokenPlugin/utils/tokenSettingsUtils';

export interface IPrepareNativeTokenVotingInstallDataParams
    extends IBuildPreparePluginInstallDataParams<INativeTokenVotingSetupGovernanceForm, never, INativeTokenVotingSetupMembershipForm> {}

export const buildPrepareNativeTokenVotingInstallData = (params: IPrepareNativeTokenVotingInstallDataParams): Hex => {
    const { body, dao, stageVotingPeriod } = params;

    const repositoryAddress = nativeTokenVotingPlugin.repositoryAddresses[dao.network];

    // Only one published version for now (Harmony deployment)
    const versionTag = nativeTokenVotingPlugin.installVersion;

    const stageVotingPeriodSeconds = stageVotingPeriod ? dateUtils.durationToSeconds(stageVotingPeriod) : undefined;
    const minDurationSeconds = stageVotingPeriodSeconds ?? body.governance.minDuration;

    const nativeDecimals = networkDefinitions[dao.network].nativeCurrency.decimals;

    const minProposerVotingPower = parseUnits(body.governance.minProposerVotingPower ?? '0', nativeDecimals);

    const minParticipation = BigInt(tokenSettingsUtils.percentageToRatio(body.governance.minParticipation));
    const supportThreshold = BigInt(tokenSettingsUtils.percentageToRatio(body.governance.supportThreshold));

    const installationParams = encodeAbiParameters(
        [
            {
                name: 'params',
                type: 'tuple',
                components: [
                    { name: 'minProposerVotingPower', type: 'uint256' },
                    { name: 'minParticipation', type: 'uint64' },
                    { name: 'supportThreshold', type: 'uint64' },
                    { name: 'minDuration', type: 'uint64' },
                ],
            },
        ],
        [
            {
                minProposerVotingPower,
                minParticipation,
                supportThreshold,
                minDuration: BigInt(minDurationSeconds),
            },
        ],
    );

    // Keep the same Harmony version tag behavior as other plugins if needed later
    void Network;

    return pluginTransactionUtils.buildPrepareInstallationData(
        repositoryAddress,
        versionTag,
        installationParams,
        dao.address as Hex,
    );
};
