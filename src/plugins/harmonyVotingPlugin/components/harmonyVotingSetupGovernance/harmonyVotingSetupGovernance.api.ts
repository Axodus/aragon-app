import type { IPluginSetupGovernanceParams } from '@/modules/createDao/types';

export type IHarmonyVotingSetupGovernanceForm = Record<string, never>;

export interface IHarmonyVotingSetupGovernanceProps extends IPluginSetupGovernanceParams {
    daoId?: string;
}
