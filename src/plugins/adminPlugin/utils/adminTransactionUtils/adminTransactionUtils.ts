import type { IBuildCreateProposalDataParams } from '@/modules/governance/types';
import { createProposalUtils } from '@/modules/governance/utils/createProposalUtils';
import { encodeAbiParameters, encodeFunctionData, type Hex } from 'viem';
import { adminPluginAbi } from './adminPluginAbi';

class AdminTransactionUtils {
    buildCreateProposalData = (params: IBuildCreateProposalDataParams): Hex => {
        const { metadata, actions } = params;

        // Some deployments reject proposals with endDate == 0.
        // Default to a valid end date (now + 7 days) while keeping startDate == 0.
        const startDate = BigInt(0);
        const endDate = BigInt(createProposalUtils.createDefaultEndDate());

        // Some proposal plugins expect custom parameters in `_data`.
        // On Harmony, this Admin-like plugin advertises `(uint256 allowFailureMap)`.
        const customParams = encodeAbiParameters([{ type: 'uint256' }], [BigInt(0)]);

        const functionArgs = [metadata, actions, startDate, endDate, customParams];
        const data = encodeFunctionData({
            abi: adminPluginAbi,
            functionName: 'createProposal',
            args: functionArgs,
        });

        return data;
    };
}

export const adminTransactionUtils = new AdminTransactionUtils();
