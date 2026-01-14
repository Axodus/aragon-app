import dynamic from 'next/dynamic';

export const NativeTokenVotingSetupGovernance = dynamic(() =>
    import('./nativeTokenVotingSetupGovernance').then((mod) => mod.NativeTokenVotingSetupGovernance),
);

export type {
    INativeTokenVotingSetupGovernanceForm,
    INativeTokenVotingSetupGovernanceProps,
} from './nativeTokenVotingSetupGovernance.api';
