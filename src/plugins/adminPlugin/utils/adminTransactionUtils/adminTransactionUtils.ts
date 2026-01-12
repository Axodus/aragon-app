import type { IBuildCreateProposalDataParams } from '@/modules/governance/types';
import { createProposalUtils } from '@/modules/governance/utils/createProposalUtils';
import { encodeFunctionData, type Hex } from 'viem';
import { adminPluginAbi } from './adminPluginAbi';

class AdminTransactionUtils {
    buildCreateProposalData = (params: IBuildCreateProposalDataParams): Hex => {
        const { metadata, actions } = params;

        // Some deployments reject proposals with endDate == 0.
        // Default to a valid end date (now + 7 days) while keeping startDate == 0.
        const startDate = 0n;
        const endDate = BigInt(createProposalUtils.createDefaultEndDate());
        const functionArgs = [metadata, actions, startDate, endDate, '0x'];
        const data = encodeFunctionData({
            abi: adminPluginAbi,
            functionName: 'createProposal',
            args: functionArgs,
        });

        return data;
    };
}

export const adminTransactionUtils = new AdminTransactionUtils();
