import type { Hex } from 'viem';
import type { IBuildPreparePluginInstallDataParams } from '@/modules/createDao/types';
import { Network } from '@/shared/api/daoService';
import { pluginTransactionUtils } from '@/shared/utils/pluginTransactionUtils';
import { adminPlugin } from '../../constants/adminPlugin';
import { buildAdminInstallData } from './buildInstallData';

/**
 * Builds the transaction data for PluginSetupProcessor.prepareInstallation for the Admin plugin.
 */
export function buildAdminPrepareInstallTransaction(
  params: IBuildPreparePluginInstallDataParams
): Hex {
  const { dao, stageVotingPeriod, body } = params;

  const repo = adminPlugin.repositoryAddresses[dao.network];
  // Use the published version on Harmony (release 1, build 1), otherwise the plugin default
  const versionTag =
    dao.network === Network.HARMONY_MAINNET
      ? { release: 1, build: 1 }
      : adminPlugin.installVersion;

  const isAdvanced = stageVotingPeriod != null;
  const { target, operation } = pluginTransactionUtils.getPluginTargetConfig(dao, isAdvanced);

  // Admin plugin delegates proposal execution to addresses with EXECUTE_PROPOSAL permission.
  // During initial installation we want (at least) the configured first member to be able to execute proposals.
  const configuredAdmin = body?.membership?.members?.[0]?.address as Hex | undefined;
  const adminAddress = configuredAdmin ?? (dao.address as Hex);
  const data = buildAdminInstallData({ admin: adminAddress, target, operation: operation as 0 | 1 });

  return pluginTransactionUtils.buildPrepareInstallationData(repo as Hex, versionTag, data, dao.address as Hex);
}
