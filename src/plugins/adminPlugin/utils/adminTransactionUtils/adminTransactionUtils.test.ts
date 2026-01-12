import { generateProposalCreate } from '@/modules/governance/testUtils';
import { createProposalUtils } from '@/modules/governance/utils/createProposalUtils';
import { PluginInterfaceType } from '@/shared/api/daoService';
import { generateDaoPlugin, generatePluginSettings } from '@/shared/testUtils';
import type { ITransactionRequest } from '@/shared/utils/transactionUtils';
import * as Viem from 'viem';
import { adminPluginAbi } from './adminPluginAbi';
import { adminTransactionUtils } from './adminTransactionUtils';

describe('adminTransaction utils', () => {
    const encodeFunctionDataSpy = jest.spyOn(Viem, 'encodeFunctionData');
    const createDefaultEndDateSpy = jest.spyOn(createProposalUtils, 'createDefaultEndDate');

    afterEach(() => {
        encodeFunctionDataSpy.mockReset();
        createDefaultEndDateSpy.mockReset();
    });

    describe('buildCreateProposalData', () => {
        it('correctly encodes the create-proposal data from the given parameters', () => {
            const metadata = '0xmeta';
            const actions: ITransactionRequest[] = [{ to: '0x123', data: '0x000', value: BigInt(0) }];
            const proposal = generateProposalCreate();
            const transactionData = '0xdata';
            const endDate = 1728660603;
            const plugin = generateDaoPlugin({
                address: '0x123',
                interfaceType: PluginInterfaceType.ADMIN,
                settings: generatePluginSettings(),
            });
            createDefaultEndDateSpy.mockReturnValueOnce(endDate);
            encodeFunctionDataSpy.mockReturnValueOnce(transactionData);

            const result = adminTransactionUtils.buildCreateProposalData({ metadata, actions, proposal, plugin });
            expect(encodeFunctionDataSpy).toHaveBeenCalledWith({
                abi: adminPluginAbi,
                functionName: 'createProposal',
                args: [metadata, actions, 0n, BigInt(endDate), '0x'],
            });
            expect(result).toEqual(transactionData);
        });
    });
});
