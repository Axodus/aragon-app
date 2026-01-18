import type { IDao } from '@/shared/api/daoService';
import { daoUtils } from '@/shared/utils/daoUtils';
import { invariant } from '@aragon/gov-ui-kit';
import type { IProposal } from '../../api/governanceService';

class ProposalUtils {
    getProposalSlug = (proposal: Pick<IProposal, 'incrementalId' | 'pluginAddress'>, dao?: IDao): string => {
        const { incrementalId, pluginAddress } = proposal;
        const plugin = daoUtils.getDaoPlugins(dao, { pluginAddress, includeSubPlugins: true })?.[0];

        invariant(plugin != null, 'getProposalSlug: proposal plugin not found');

        const prefix = plugin.processKey && plugin.processKey.trim() !== '' ? plugin.processKey : plugin.slug;

        return `${prefix}-${incrementalId.toString()}`.toUpperCase();
    };
}

export const proposalUtils = new ProposalUtils();
