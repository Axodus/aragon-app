import type { IPluginSetupGovernanceParams } from '@/modules/createDao/types';

export interface IHarmonyVotingSetupGovernanceForm {
}

export interface IHarmonyVotingSetupGovernanceProps extends IPluginSetupGovernanceParams {
    daoId?: string;
}
