import { CreateDaoSlotId } from '@/modules/createDao/constants/moduleSlots';
import { pluginRegistryUtils } from '@/shared/utils/pluginRegistryUtils';
import { NativeTokenVotingSetupGovernance } from './components/nativeTokenVotingSetupGovernance';
import { NativeTokenVotingSetupMembership } from './components/nativeTokenVotingSetupMembership';
import { nativeTokenVotingPlugin } from './constants/nativeTokenVotingPlugin';
import { buildPrepareNativeTokenVotingInstallData } from './utils/nativeTokenVotingTransactionUtils';

export const initialiseNativeTokenVotingPlugin = () => {
    pluginRegistryUtils
        // Plugin definition
        .registerPlugin(nativeTokenVotingPlugin)

        // Create DAO module slots
        .registerSlotFunction({
            slotId: CreateDaoSlotId.CREATE_DAO_BUILD_PREPARE_PLUGIN_INSTALL_DATA,
            pluginId: nativeTokenVotingPlugin.id,
            function: (params) => buildPrepareNativeTokenVotingInstallData(params),
        })
        .registerSlotComponent({
            slotId: CreateDaoSlotId.CREATE_DAO_SETUP_MEMBERSHIP,
            pluginId: nativeTokenVotingPlugin.id,
            component: NativeTokenVotingSetupMembership,
        })
        .registerSlotComponent({
            slotId: CreateDaoSlotId.CREATE_DAO_SETUP_GOVERNANCE,
            pluginId: nativeTokenVotingPlugin.id,
            component: NativeTokenVotingSetupGovernance,
        });
};
