import { buildDelegationInstallData, buildPrepareHarmonyVotingInstallData } from '@/plugins/harmonyVotingPlugin/utils/harmonyVotingTransactionUtils';
import { PluginInterfaceType } from '@/shared/api/daoService';
import { pluginTransactionUtils } from '@/shared/utils/pluginTransactionUtils';

jest.mock('@/shared/utils/pluginTransactionUtils', () => ({
  pluginTransactionUtils: {
    buildPrepareInstallationData: jest.fn(() => '0xdeadbeef'),
  },
}));

describe('harmonyVotingTransactionUtils', () => {
  test('buildDelegationInstallData: validates and normalizes address', () => {
    // missing address -> throw
    expect(() => buildDelegationInstallData(undefined as any)).toThrow('Validator address is required');

    // mixed-case address should be accepted and produce a hex string
    const mixed = '0xAb5801a7D398351b8bE11C439e05C5B3259aec9B';
    const hex = buildDelegationInstallData(mixed);
    expect(typeof hex).toBe('string');
    expect(hex.startsWith('0x')).toBe(true);
    expect(hex.length).toBeGreaterThan(2);
  });

  test('buildPrepareHarmonyVotingInstallData: encodes validator address for delegation installs', () => {
    const plugin: any = {
      id: PluginInterfaceType.HARMONY_DELEGATION_VOTING,
      repositoryAddresses: { '1': '0xfeedfeed00000000000000000000000000000000' },
      installVersion: 5,
    };

    const params: any = {
      dao: { network: '1', address: '0xda0da0da0da0da0da0da0da0da0da0da0da0da0' },
      body: { membership: { validatorAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aec9B' } },
      metadata: '0xabc123',
      stageVotingPeriod: null, // processor install
    };

    const expectedInstallData = buildDelegationInstallData(params.body.membership.validatorAddress);

    // Call the function; the mocked pluginTransactionUtils should be used
    const result = buildPrepareHarmonyVotingInstallData(plugin, params);

    // Ensure the mocked buildPrepareInstallationData was called with validator address data
    expect(pluginTransactionUtils.buildPrepareInstallationData).toHaveBeenCalledWith(
      '0xfeedfeed00000000000000000000000000000000',
      5,
      expectedInstallData,
      '0xda0da0da0da0da0da0da0da0da0da0da0da0da0',
    );

    expect(result).toBe('0xdeadbeef');
  });
});
