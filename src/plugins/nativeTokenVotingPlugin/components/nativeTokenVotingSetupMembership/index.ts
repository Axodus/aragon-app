import dynamic from 'next/dynamic';

export const NativeTokenVotingSetupMembership = dynamic(() =>
    import('./nativeTokenVotingSetupMembership').then((mod) => mod.NativeTokenVotingSetupMembership),
);

export type {
    INativeTokenVotingSetupMembershipForm,
    INativeTokenVotingSetupMembershipProps,
} from './nativeTokenVotingSetupMembership.api';
