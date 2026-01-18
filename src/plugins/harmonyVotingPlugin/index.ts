import { CreateDaoSlotId } from '@/modules/createDao/constants/moduleSlots';
import { GovernanceSlotId } from '@/modules/governance/constants/moduleSlots';
import { pluginRegistryUtils } from '@/shared/utils/pluginRegistryUtils';
import { HarmonyVotingCreateProposalSettingsForm } from './components/harmonyVotingCreateProposalSettingsForm';
import { HarmonyVotingSetupGovernance } from './components/harmonyVotingSetupGovernance';
import { HarmonyDelegationVotingSetupMembership, HarmonyVotingSetupMembership } from './components/harmonyVotingSetupMembership';
import { harmonyDelegationVotingPlugin, harmonyHipVotingPlugin } from './constants/harmonyVotingPlugins';
import {
    buildCreateHarmonyVotingProposalData,
    buildHarmonyVotingVoteData,
    buildPrepareHarmonyVotingInstallData,
} from './utils/harmonyVotingTransactionUtils';

export const initialiseHarmonyVotingPlugin = () => {
    pluginRegistryUtils
        // Plugin definitions
        .registerPlugin(harmonyHipVotingPlugin)
        .registerPlugin(harmonyDelegationVotingPlugin)

        // Create DAO module slots
        .registerSlotFunction({
            slotId: CreateDaoSlotId.CREATE_DAO_BUILD_PREPARE_PLUGIN_INSTALL_DATA,
            pluginId: harmonyHipVotingPlugin.id,
            function: (params) => buildPrepareHarmonyVotingInstallData(harmonyHipVotingPlugin, params),
        })
        .registerSlotFunction({
            slotId: CreateDaoSlotId.CREATE_DAO_BUILD_PREPARE_PLUGIN_INSTALL_DATA,
            pluginId: harmonyDelegationVotingPlugin.id,
            function: (params) => buildPrepareHarmonyVotingInstallData(harmonyDelegationVotingPlugin, params),
        })
        .registerSlotComponent({
            slotId: CreateDaoSlotId.CREATE_DAO_SETUP_MEMBERSHIP,
            pluginId: harmonyHipVotingPlugin.id,
            component: HarmonyVotingSetupMembership,
        })
        .registerSlotComponent({
            slotId: CreateDaoSlotId.CREATE_DAO_SETUP_MEMBERSHIP,
            pluginId: harmonyDelegationVotingPlugin.id,
            component: HarmonyDelegationVotingSetupMembership,
        })
        .registerSlotComponent({
            slotId: CreateDaoSlotId.CREATE_DAO_SETUP_GOVERNANCE,
            pluginId: harmonyHipVotingPlugin.id,
            component: HarmonyVotingSetupGovernance,
        })
        .registerSlotComponent({
            slotId: CreateDaoSlotId.CREATE_DAO_SETUP_GOVERNANCE,
            pluginId: harmonyDelegationVotingPlugin.id,
            component: HarmonyVotingSetupGovernance,
        })
        // Governance proposal settings + data
        .registerSlotComponent({
            slotId: GovernanceSlotId.GOVERNANCE_CREATE_PROPOSAL_SETTINGS_FORM,
            pluginId: harmonyHipVotingPlugin.id,
            component: HarmonyVotingCreateProposalSettingsForm,
        })
        .registerSlotComponent({
            slotId: GovernanceSlotId.GOVERNANCE_CREATE_PROPOSAL_SETTINGS_FORM,
            pluginId: harmonyDelegationVotingPlugin.id,
            component: HarmonyVotingCreateProposalSettingsForm,
        })
        .registerSlotFunction({
            slotId: GovernanceSlotId.GOVERNANCE_BUILD_CREATE_PROPOSAL_DATA,
            pluginId: harmonyHipVotingPlugin.id,
            function: buildCreateHarmonyVotingProposalData,
        })
        .registerSlotFunction({
            slotId: GovernanceSlotId.GOVERNANCE_BUILD_CREATE_PROPOSAL_DATA,
            pluginId: harmonyDelegationVotingPlugin.id,
            function: buildCreateHarmonyVotingProposalData,
        })
        .registerSlotFunction({
            slotId: GovernanceSlotId.GOVERNANCE_BUILD_VOTE_DATA,
            pluginId: harmonyHipVotingPlugin.id,
            function: buildHarmonyVotingVoteData,
        })
        .registerSlotFunction({
            slotId: GovernanceSlotId.GOVERNANCE_BUILD_VOTE_DATA,
            pluginId: harmonyDelegationVotingPlugin.id,
            function: buildHarmonyVotingVoteData,
        });
};
