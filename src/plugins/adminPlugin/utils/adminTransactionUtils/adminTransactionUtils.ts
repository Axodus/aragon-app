import type { IBuildCreateProposalDataParams } from '@/modules/governance/types';
import { encodeFunctionData, type Hex } from 'viem';
import { adminPluginAbi } from './adminPluginAbi';

class AdminTransactionUtils {
    buildCreateProposalData = (params: IBuildCreateProposalDataParams): Hex => {
        const { metadata, actions } = params;

        // Admin is a direct execution tool: executeProposal creates+executes in a single tx.
        // Using executeProposal also keeps compatibility with older deployments that may not implement createProposal.
        const functionArgs = [metadata, actions, BigInt(0)];
        const data = encodeFunctionData({
            abi: adminPluginAbi,
            functionName: 'executeProposal',
            args: functionArgs,
        });

        return data;
    };
}

export const adminTransactionUtils = new AdminTransactionUtils();
