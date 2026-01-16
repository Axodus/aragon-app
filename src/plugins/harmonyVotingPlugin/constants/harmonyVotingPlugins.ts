import { Network, PluginInterfaceType } from '@/shared/api/daoService';
import type { IPluginInfo } from '@/shared/types';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const harmonyHipVotingPlugin: IPluginInfo = {
    id: PluginInterfaceType.HARMONY_HIP_VOTING,
    subdomain: 'harmonyHipVoting',
    name: 'Harmony HIP Voting',
    installVersion: { release: 1, build: 1, releaseNotes: '', description: '' },
    repositoryAddresses: {
        [Network.ARBITRUM_MAINNET]: ZERO_ADDRESS,
        [Network.BASE_MAINNET]: ZERO_ADDRESS,
        [Network.ETHEREUM_MAINNET]: ZERO_ADDRESS,
        [Network.ETHEREUM_SEPOLIA]: ZERO_ADDRESS,
        [Network.POLYGON_MAINNET]: ZERO_ADDRESS,
        [Network.ZKSYNC_MAINNET]: ZERO_ADDRESS,
        [Network.ZKSYNC_SEPOLIA]: ZERO_ADDRESS,
        [Network.PEAQ_MAINNET]: ZERO_ADDRESS,
        [Network.OPTIMISM_MAINNET]: ZERO_ADDRESS,
        [Network.CHILIZ_MAINNET]: ZERO_ADDRESS,
        [Network.AVAX_MAINNET]: ZERO_ADDRESS,
        [Network.KATANA_MAINNET]: ZERO_ADDRESS,
        [Network.HARMONY_MAINNET]: '0xe6e54ac81efb41fdf0d559eeae51dbfb3c750088',
        [Network.HARMONY_TESTNET]: ZERO_ADDRESS,
    },
    setup: {
        nameKey: 'app.plugins.harmonyHipVoting.setup.name',
        descriptionKey: 'app.plugins.harmonyHipVoting.setup.description',
    },
    // HIP plugin requires allowlist authorization
    requiresAllowlist: true,
};

export const harmonyDelegationVotingPlugin: IPluginInfo = {
    id: PluginInterfaceType.HARMONY_DELEGATION_VOTING,
    subdomain: 'harmonyDelegationVoting',
    name: 'Harmony Delegation Voting',
    installVersion: { release: 1, build: 1, releaseNotes: '', description: '' },
    repositoryAddresses: {
        [Network.ARBITRUM_MAINNET]: ZERO_ADDRESS,
        [Network.BASE_MAINNET]: ZERO_ADDRESS,
        [Network.ETHEREUM_MAINNET]: ZERO_ADDRESS,
        [Network.ETHEREUM_SEPOLIA]: ZERO_ADDRESS,
        [Network.POLYGON_MAINNET]: ZERO_ADDRESS,
        [Network.ZKSYNC_MAINNET]: ZERO_ADDRESS,
        [Network.ZKSYNC_SEPOLIA]: ZERO_ADDRESS,
        [Network.PEAQ_MAINNET]: ZERO_ADDRESS,
        [Network.OPTIMISM_MAINNET]: ZERO_ADDRESS,
        [Network.CHILIZ_MAINNET]: ZERO_ADDRESS,
        [Network.AVAX_MAINNET]: ZERO_ADDRESS,
        [Network.KATANA_MAINNET]: ZERO_ADDRESS,
        [Network.HARMONY_MAINNET]: '0x4ac3dafd88defd9a000076365e28b3de3a862700',
        [Network.HARMONY_TESTNET]: ZERO_ADDRESS,
    },
    setup: {
        nameKey: 'app.plugins.harmonyDelegationVoting.setup.name',
        descriptionKey: 'app.plugins.harmonyDelegationVoting.setup.description',
    },
};
