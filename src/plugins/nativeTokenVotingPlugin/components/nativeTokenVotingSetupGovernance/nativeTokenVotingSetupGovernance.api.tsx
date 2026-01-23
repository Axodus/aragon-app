import type { IPluginSetupGovernanceParams } from '@/modules/createDao/types';

export interface INativeTokenVotingSetupGovernanceForm {
    supportThreshold: number;
    minParticipation: number;
    minDuration: number;
    minProposerVotingPower: string;
}

export interface INativeTokenVotingSetupGovernanceProps extends Omit<IPluginSetupGovernanceParams, 'membershipSettings'> {
    membershipSettings: Record<string, unknown>;
}
