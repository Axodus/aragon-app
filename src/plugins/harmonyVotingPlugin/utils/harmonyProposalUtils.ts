import { proposalStatusUtils } from '@/shared/utils/proposalStatusUtils';
import type { ProposalStatus } from '@aragon/gov-ui-kit';
import type { IHarmonyProposal } from '../types/harmonyProposal';

class HarmonyProposalUtils {
    getProposalStatus = (proposal: IHarmonyProposal): ProposalStatus => {
        const { startDate, endDate, closed, passed } = proposal;

        // Harmony proposals have no executable actions in the app.
        // Status should follow the shared OSx proposal status engine.
        const status = proposalStatusUtils.getProposalStatus({
            isExecuted: closed,
            isVetoed: false,
            startDate,
            endDate,
            paramsMet: passed,
            hasActions: false,
            canExecuteEarly: false,
        });

        return status;
    };

    hasSucceeded = (proposal: IHarmonyProposal): boolean => {
        return Boolean(proposal.passed);
    };
}

export const harmonyProposalUtils = new HarmonyProposalUtils();
