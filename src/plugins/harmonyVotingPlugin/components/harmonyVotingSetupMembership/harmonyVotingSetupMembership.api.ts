import type { ISetupBodyFormMembership } from '@/modules/createDao/dialogs/setupBodyDialog';
import type { IPluginSetupMembershipParams } from '@/modules/createDao/types';

export interface IHarmonyVotingSetupMembershipForm extends ISetupBodyFormMembership {
    /**
     * Validator address required for Harmony Delegation voting.
     */
    validatorAddress?: string;
}

export interface IHarmonyVotingSetupMembershipProps extends IPluginSetupMembershipParams {
    daoId?: string;
}
