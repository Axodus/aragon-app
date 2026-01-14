import { Network, PluginInterfaceType } from '@/shared/api/daoService';
import type { IPluginInfo } from '@/shared/types';

export const nativeTokenVotingPlugin: IPluginInfo = {
    id: PluginInterfaceType.NATIVE_TOKEN_VOTING,
    subdomain: 'native-token-voting',
    name: 'NativeTokenVoting',
    installVersion: {
        release: 1,
        build: 1,
        releaseNotes: 'https://github.com/Axodus/AragonOSX',
        description: 'Initial NativeTokenVoting deployment on Harmony.',
    },
    repositoryAddresses: {
        [Network.HARMONY_MAINNET]: '0xF6E6cDe03ed3a7D5A87453e899CEb4D1F4e49C9B',
        [Network.HARMONY_TESTNET]: '0x0000000000000000000000000000000000000000',
    },
    setup: {
        nameKey: 'app.plugins.nativeTokenVoting.meta.setup.name',
        descriptionKey: 'app.plugins.nativeTokenVoting.meta.setup.description',
    },
};
