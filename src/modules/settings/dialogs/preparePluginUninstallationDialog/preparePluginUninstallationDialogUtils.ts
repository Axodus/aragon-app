import type { IDao, IDaoPlugin } from '@/shared/api/daoService';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { daoUtils } from '@/shared/utils/daoUtils';
import { getPublicClient } from '@/shared/utils/networkUtils/publicClient';
import { pluginRegistryUtils } from '@/shared/utils/pluginRegistryUtils';
import { pluginTransactionUtils } from '@/shared/utils/pluginTransactionUtils';
import type { ITransactionRequest } from '@/shared/utils/transactionUtils';
import type { Hash, Hex } from 'viem';
import { SettingsSlotId } from '../../constants/moduleSlots';
import type { IGetUninstallHelpersParams } from '../../types';

const daoFactoryAbi =
    [
        {
            type: 'function',
            name: 'pluginSetupProcessor',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ name: '', type: 'address' }],
        },
    ] as const;

class PreparePluginUninstallationDialogUtils {
    /**
     * Resolve o PSP correto para o DAO.
     *
     * Em DAOs antigos (ex.: Harmony), o PSP pode variar por deployment do DAOFactory.
     * Se conseguirmos recuperar o `to` da tx de criação do DAO (que tende a ser o DAOFactory),
     * lemos `pluginSetupProcessor()` direto do factory.
     */
    resolvePluginSetupProcessorAddress = async (dao: IDao): Promise<Hex> => {
        const fallback = networkDefinitions[dao.network].addresses.pluginSetupProcessor as Hex;

        const txHash = dao.transactionHash as Hash;
        if (!txHash?.startsWith('0x')) {
            return fallback;
        }

        try {
            const client = getPublicClient(dao.network);
            const tx = await client.getTransaction({ hash: txHash });

            const daoFactoryAddress = tx.to as Hex | null | undefined;
            if (!daoFactoryAddress) {
                return fallback;
            }

            const pspAddress = await client.readContract({
                address: daoFactoryAddress,
                abi: daoFactoryAbi,
                functionName: 'pluginSetupProcessor',
            });

            return (pspAddress as Hex) ?? fallback;
        } catch {
            return fallback;
        }
    };

    buildPrepareUninstallationTransaction = async (dao: IDao, plugin: IDaoPlugin): Promise<ITransactionRequest> => {
        const pluginSetupProcessor = await this.resolvePluginSetupProcessorAddress(dao);

        // Retrieve the helper addresses from the backend, which are stored from the InstallationPrepared event.
        // These helpers must exactly match the addresses used during plugin installation.
        const helpers = await this.fetchInstallationHelpers(dao, plugin);
        const prepareUninstallData = pluginTransactionUtils.buildPrepareUninstallData(dao, plugin, helpers, '0x');

        return { data: prepareUninstallData, value: BigInt(0), to: pluginSetupProcessor };
    };

    /**
     * Fetches the installation helpers for a plugin from the backend.
     * Falls back to plugin-specific helper functions if backend endpoint fails.
     */
    private fetchInstallationHelpers = async (dao: IDao, plugin: IDaoPlugin): Promise<Hex[]> => {
        try {
            const response = await fetch(
                `/api/v2/plugins/installation-helpers/${dao.network}/${plugin.address}`,
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch helpers: ${response.status}`);
            }

            const data = await response.json();
            const helpers = data.helpers as Hex[] | undefined;

            // If backend returns helpers, use them
            if (helpers && Array.isArray(helpers) && helpers.length > 0) {
                return helpers;
            }

            // Otherwise, fall back to plugin-specific hardcoded helpers
            return this.getFallbackHelpers(plugin);
        } catch (error) {
            console.error('Error fetching installation helpers from backend:', error);
            // Fall back to plugin-specific hardcoded helpers
            return this.getFallbackHelpers(plugin);
        }
    };

    /**
     * Fallback: retrieves hardcoded helpers from plugin registry.
     * Used when backend endpoint is unavailable or returns empty data.
     */
    private getFallbackHelpers = (plugin: IDaoPlugin): Hex[] => {
        const getHelpersFunction = pluginRegistryUtils.getSlotFunction<IGetUninstallHelpersParams, Hex[]>({
            slotId: SettingsSlotId.SETTINGS_GET_UNINSTALL_HELPERS,
            pluginId: plugin.interfaceType,
        });

        return getHelpersFunction?.({ plugin }) ?? [];
    };

    prepareApplyUninstallationProposalMetadata = (uninstallPlugin: IDaoPlugin, proposalPlugin: IDaoPlugin) => {
        const uninstallPluginInfo = `${daoUtils.getPluginName(uninstallPlugin)} (${uninstallPlugin.slug.toUpperCase()})`;
        const proposalPluginInfo = `${daoUtils.getPluginName(proposalPlugin)} (${proposalPlugin.slug.toUpperCase()})`;

        const title = `Uninstall ${uninstallPluginInfo} process`;
        const summary = [
            `If approved, this proposal will uninstall the ${uninstallPluginInfo} plugin. It will revoke the`,
            `plugin's permission to execute actions on the DAO's behalf. Vote in favor only if you're confident other`,
            `installed governance processes are enough for the DAO to function as intended. The current`,
            `${proposalPluginInfo} process will not be affected`,
        ].join(' ');

        return { title, summary };
    };
}

export const preparePluginUninstallationDialogUtils = new PreparePluginUninstallationDialogUtils();
