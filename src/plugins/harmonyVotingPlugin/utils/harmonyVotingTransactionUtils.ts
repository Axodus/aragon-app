import type { IBuildPreparePluginInstallDataParams } from '@/modules/createDao/types';
import { PluginInterfaceType } from '@/shared/api/daoService';
import { pluginTransactionUtils } from '@/shared/utils/pluginTransactionUtils';
import { addressUtils, type ICompositeAddress } from '@aragon/gov-ui-kit';
import { encodeAbiParameters, encodeFunctionData, keccak256, type Hex } from 'viem';
import type { IPluginInfo } from '@/shared/types';
import type { IHarmonyVotingSetupGovernanceForm } from '../components/harmonyVotingSetupGovernance';
import type { IHarmonyVotingSetupMembershipForm } from '../components/harmonyVotingSetupMembership';
import type { IProposalCreate } from '@/modules/governance/dialogs/publishProposalDialog';
import type { IBuildCreateProposalDataParams, IBuildVoteDataParams } from '@/modules/governance/types';
import { createProposalUtils, type ICreateProposalEndDateForm } from '@/modules/governance/utils/createProposalUtils';

export interface ICreateHarmonyVotingProposalFormData extends IProposalCreate, Partial<ICreateProposalEndDateForm> {
    /**
     * Snapshot block used to compute validator/delegator weights.
     */
    snapshotBlock?: number;
}

export type IPrepareHarmonyVotingInstallDataParams = IBuildPreparePluginInstallDataParams<
    IHarmonyVotingSetupGovernanceForm,
    ICompositeAddress,
    IHarmonyVotingSetupMembershipForm
>;

const harmonyVotingAbi = [
    {
        type: 'function',
        name: 'createProposal',
        stateMutability: 'nonpayable',
        inputs: [
            { name: '_metadata', type: 'bytes32' },
            { name: '_startDate', type: 'uint64' },
            { name: '_endDate', type: 'uint64' },
            { name: '_snapshotBlock', type: 'uint64' },
        ],
        outputs: [{ name: 'proposalId', type: 'uint256' }],
    },
    {
        type: 'function',
        name: 'castVote',
        stateMutability: 'nonpayable',
        inputs: [
            { name: '_proposalId', type: 'uint256' },
            { name: '_option', type: 'uint8' },
        ],
        outputs: [],
    },
] as const;

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

export const buildCreateHarmonyVotingProposalData = (
    params: IBuildCreateProposalDataParams<ICreateHarmonyVotingProposalFormData>,
): Hex => {
    const { metadata, proposal, actions } = params;

    if (actions.length > 0) {
        throw new Error('Harmony voting proposals do not support onchain actions. Remove all actions and try again.');
    }

    const startDate = createProposalUtils.parseStartDate(proposal);
    let endDate = createProposalUtils.parseEndDate(proposal);

    if (endDate === 0) {
        endDate = createProposalUtils.createDefaultEndDate();
    }

    if (startDate >= endDate) {
        throw new Error('End date must be later than the start date for Harmony voting proposals.');
    }

    const snapshotBlock = proposal.snapshotBlock;
    if (snapshotBlock == null || !Number.isFinite(snapshotBlock) || snapshotBlock < 1) {
        throw new Error('Snapshot block is required for Harmony voting proposals.');
    }

    const metadataHash = keccak256(metadata);

    return encodeFunctionData({
        abi: harmonyVotingAbi,
        functionName: 'createProposal',
        args: [metadataHash, BigInt(startDate), BigInt(endDate), BigInt(snapshotBlock)],
    });
};

export const buildHarmonyVotingVoteData = (params: IBuildVoteDataParams): Hex => {
    const { proposalIndex, vote } = params;

    return encodeFunctionData({
        abi: harmonyVotingAbi,
        functionName: 'castVote',
        args: [BigInt(proposalIndex), vote.value],
    });
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
