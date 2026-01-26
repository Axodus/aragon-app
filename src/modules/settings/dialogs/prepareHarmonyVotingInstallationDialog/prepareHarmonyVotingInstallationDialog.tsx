import { GovernanceDialogId } from '@/modules/governance/constants/governanceDialogId';
import type { IPublishProposalDialogParams } from '@/modules/governance/dialogs/publishProposalDialog';
import { PluginInterfaceType, type IDaoPlugin, useDao } from '@/shared/api/daoService';
import { type IDialogComponentProps, useDialogContext } from '@/shared/components/dialogProvider';
import {
    type ITransactionDialogStepMeta,
    TransactionDialog,
    TransactionDialogStep,
} from '@/shared/components/transactionDialog';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useStepper } from '@/shared/hooks/useStepper';
import { pluginTransactionUtils } from '@/shared/utils/pluginTransactionUtils';
import { invariant } from '@aragon/gov-ui-kit';
import { useCallback, useMemo, useRef } from 'react';
import type { Hex, TransactionReceipt } from 'viem';
import { useAccount } from 'wagmi';
import { harmonyDelegationVotingPlugin, harmonyHipVotingPlugin } from '@/plugins/harmonyVotingPlugin/constants/harmonyVotingPlugins';
import { prepareHarmonyVotingInstallationDialogUtils } from './prepareHarmonyVotingInstallationDialogUtils';

export interface IPrepareHarmonyVotingInstallationDialogParams {
    daoId: string;
    proposalPlugin: IDaoPlugin;
    installType: PluginInterfaceType.HARMONY_HIP_VOTING | PluginInterfaceType.HARMONY_DELEGATION_VOTING;
    validatorAddress?: string;
}

export interface IPrepareHarmonyVotingInstallationDialogProps
    extends IDialogComponentProps<IPrepareHarmonyVotingInstallationDialogParams> {}

export const PrepareHarmonyVotingInstallationDialog: React.FC<IPrepareHarmonyVotingInstallationDialogProps> = (props) => {
    const { location } = props;

    invariant(location.params != null, 'PrepareHarmonyVotingInstallationDialog: required parameters must be set.');
    const { daoId, proposalPlugin, installType, validatorAddress } = location.params;

    const { address } = useAccount();
    invariant(address != null, 'PrepareHarmonyVotingInstallationDialog: user must be connected.');

    const { t } = useTranslations();
    const { open } = useDialogContext();
    const hasProposalDialogBeenOpened = useRef(false);

    const { data: dao } = useDao({ urlParams: { id: daoId } });

    const initialStep = TransactionDialogStep.PREPARE;
    const stepper = useStepper<ITransactionDialogStepMeta, TransactionDialogStep>({ initialActiveStep: initialStep });

    const installPlugin = useMemo(() => {
        return installType === PluginInterfaceType.HARMONY_DELEGATION_VOTING
            ? harmonyDelegationVotingPlugin
            : harmonyHipVotingPlugin;
    }, [installType]);

    const handlePrepareTransaction = async () => {
        invariant(dao != null, 'PrepareHarmonyVotingInstallationDialog: DAO not found.');

        const { tx } = await prepareHarmonyVotingInstallationDialogUtils.buildPrepareInstallationTransaction(
            dao,
            installPlugin,
            validatorAddress,
        );

        return tx;
    };

    const openProposalPublishDialog = useCallback(
        (setupData: ReturnType<typeof pluginTransactionUtils.getPluginInstallationSetupData>, pluginSetupProcessorAddress: Hex) => {
            invariant(dao != null, 'PrepareHarmonyVotingInstallationDialog: DAO not found.');

            const proposalActions = pluginTransactionUtils.buildApplyPluginsInstallationActions({
                dao,
                setupData,
                pluginSetupProcessorAddress,
            });

            const proposalMetadata = prepareHarmonyVotingInstallationDialogUtils.prepareApplyInstallationProposalMetadata(
                installType,
                proposalPlugin,
            );
            const translationNamespace = 'app.settings.prepareHarmonyVotingInstallationDialog.publishInstallProposal';

            const txInfo = { title: t(`${translationNamespace}.transactionInfoTitle`), current: 2, total: 2 };
            const params: IPublishProposalDialogParams = {
                proposal: { ...proposalMetadata, resources: [], actions: proposalActions },
                daoId,
                plugin: proposalPlugin,
                translationNamespace,
                transactionInfo: txInfo,
            };

            open(GovernanceDialogId.PUBLISH_PROPOSAL, { params });
            hasProposalDialogBeenOpened.current = true;
        },
        [dao, daoId, installType, open, proposalPlugin, t],
    );

    const handlePrepareInstallationSuccess = (txReceipt: TransactionReceipt) => {
        if (hasProposalDialogBeenOpened.current) {
            return;
        }

        invariant(txReceipt.to != null, 'PrepareHarmonyVotingInstallationDialog: PSP address not found on receipt.');

        const setupData = pluginTransactionUtils.getPluginInstallationSetupData(txReceipt);
        openProposalPublishDialog(setupData, txReceipt.to as Hex);
    };

    if (hasProposalDialogBeenOpened.current) {
        return null;
    }

    return (
        <TransactionDialog
            title={t('app.settings.prepareHarmonyVotingInstallationDialog.title')}
            description={t('app.settings.prepareHarmonyVotingInstallationDialog.description')}
            submitLabel={t('app.settings.prepareHarmonyVotingInstallationDialog.button.submit')}
            onSuccess={handlePrepareInstallationSuccess}
            transactionInfo={{
                title: t('app.settings.prepareHarmonyVotingInstallationDialog.transactionInfoTitle'),
                current: 1,
                total: 2,
            }}
            stepper={stepper}
            prepareTransaction={handlePrepareTransaction}
            network={dao?.network}
        />
    );
};
