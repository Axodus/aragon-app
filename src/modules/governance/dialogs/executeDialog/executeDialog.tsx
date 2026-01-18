import { Network, useDao } from '@/shared/api/daoService';
import { TransactionType } from '@/shared/api/transactionService';
import type { IDialogComponentProps } from '@/shared/components/dialogProvider';
import {
    type ITransactionDialogStepMeta,
    TransactionDialog,
    TransactionDialogStep,
} from '@/shared/components/transactionDialog';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useStepper } from '@/shared/hooks/useStepper';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { permissionManagerAbi } from '@/shared/utils/permissionTransactionUtils/abi/permissionManagerAbi';
import { permissionTransactionUtils } from '@/shared/utils/permissionTransactionUtils';
import { daoUtils } from '@/shared/utils/daoUtils';
import { DataList, invariant, ProposalDataListItem, type ProposalStatus } from '@aragon/gov-ui-kit';
import { useRouter } from 'next/navigation';
import { useAccount, useReadContract, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { decodeFunctionData, keccak256, toBytes, type Hex } from 'viem';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { IProposal } from '../../api/governanceService';
import { useProposalActions } from '../../api/governanceService';
import { proposalUtils } from '../../utils/proposalUtils';
import { executeDialogUtils } from './executeDialogUtils';

export enum ExecuteDialogStep {
    GRANT_EXECUTOR_ROOT_FOR_PSP = 'GRANT_EXECUTOR_ROOT_FOR_PSP',
}

export interface IExecuteDialogParams {
    /**
     * The ID of the DAO.
     */
    daoId: string;
    /**
     * The proposal to be executed.
     */
    proposal: IProposal;
    /**
     * The status of the proposal.
     */
    status: ProposalStatus;
}

export interface IExecuteDialogProps extends IDialogComponentProps<IExecuteDialogParams> {}

export const ExecuteDialog: React.FC<IExecuteDialogProps> = (props) => {
    const { location } = props;

    const router = useRouter();

    invariant(location.params != null, 'ExecuteDialog: required parameters must be set.');

    const { address } = useAccount();
    invariant(address != null, 'ExecuteDialog: user must be connected.');

    const { t } = useTranslations();

    const { proposal, status, daoId } = location.params;
    const { title, summary, creator, proposalIndex, pluginAddress, network } = proposal;

    const { data: dao } = useDao({ urlParams: { id: daoId } });

    const isHarmony = network === Network.HARMONY_MAINNET;
    const proposalId = proposal.id;

    const { data: proposalActionsResult } = useProposalActions(
        { urlParams: { id: proposalId } },
        { enabled: isHarmony && proposal.hasActions },
    );

    const rootPermissionId = useMemo(
        () => keccak256(toBytes(permissionTransactionUtils.permissionIds.rootPermission)),
        [],
    );

    const proposalNeedsPspRootGrant = useMemo(() => {
        if (!isHarmony || dao == null) {
            return false;
        }

        const daoAddress = dao.address as Hex;
        const actions = proposalActionsResult?.rawActions ?? proposalActionsResult?.actions ?? [];

        // Check if the proposal contains an action that grants ROOT permission to the plugin executor
        // (not to the PSP - PSP grants are temporary and managed automatically by the prepareInstallation flow)
        return actions.some((action) => {
            try {
                const decoded = decodeFunctionData({ abi: permissionManagerAbi, data: action.data as Hex });
                if (decoded.functionName !== 'grant') {
                    return false;
                }

                const [where, who, permissionId] = decoded.args as readonly [Hex, Hex, Hex];
                return (
                    where.toLowerCase() === daoAddress.toLowerCase() &&
                    who.toLowerCase() === pluginAddress.toLowerCase() &&
                    permissionId.toLowerCase() === rootPermissionId.toLowerCase()
                );
            } catch {
                return false;
            }
        });
    }, [dao, isHarmony, proposalActionsResult, rootPermissionId, pluginAddress]);

    const shouldGrantExecutorRoot = isHarmony && proposalNeedsPspRootGrant;

    const { data: isExecutorRootGranted } = useReadContract({
        address: dao?.address as Hex,
        abi: permissionManagerAbi,
        functionName: 'isGranted',
        args: [dao?.address as Hex, pluginAddress as Hex, rootPermissionId, '0x'],
        query: { enabled: shouldGrantExecutorRoot && dao?.address?.startsWith('0x') },
    });

    const [grantRootTxHash, setGrantRootTxHash] = useState<Hex | undefined>(undefined);
    const { sendTransaction, status: grantRootSendStatus } = useSendTransaction({
        mutation: { onSuccess: (hash) => setGrantRootTxHash(hash) },
    });
    const { status: grantRootWaitStatus, error: grantRootWaitError } = useWaitForTransactionReceipt({
        hash: grantRootTxHash,
    });

    const stepper = useStepper<ITransactionDialogStepMeta, ExecuteDialogStep | TransactionDialogStep>({
        initialActiveStep: shouldGrantExecutorRoot ? ExecuteDialogStep.GRANT_EXECUTOR_ROOT_FOR_PSP : TransactionDialogStep.PREPARE,
    });

    const handlePrepareTransaction = () => executeDialogUtils.buildTransaction({ pluginAddress, proposalIndex });

    const slug = proposalUtils.getProposalSlug(proposal, dao);

    const handleGrantExecutorRoot = useCallback(() => {
        invariant(dao != null, 'ExecuteDialog: DAO must be loaded.');

        if (!shouldGrantExecutorRoot || isExecutorRootGranted === true) {
            stepper.nextStep();
            return;
        }

        const tx = permissionTransactionUtils.buildGrantPermissionTransaction({
            where: dao.address as Hex,
            who: pluginAddress as Hex,
            what: permissionTransactionUtils.permissionIds.rootPermission,
            to: dao.address as Hex,
        });

        sendTransaction(tx);
    }, [dao, shouldGrantExecutorRoot, isExecutorRootGranted, stepper, pluginAddress, sendTransaction]);

    useEffect(() => {
        if (!shouldGrantExecutorRoot) {
            return;
        }

        if (grantRootWaitError) {
            return;
        }

        if (grantRootWaitStatus === 'success') {
            stepper.nextStep();
        }
    }, [shouldGrantExecutorRoot, grantRootWaitStatus, grantRootWaitError, stepper]);

    const grantRootStepState = useMemo(() => {
        if (!shouldGrantExecutorRoot) {
            return 'success' as const;
        }

        if (isExecutorRootGranted === true) {
            return 'success' as const;
        }

        if (grantRootSendStatus === 'error' || grantRootWaitStatus === 'error') {
            return 'error' as const;
        }

        if (grantRootSendStatus === 'pending' || grantRootWaitStatus === 'pending') {
            return 'pending' as const;
        }

        return 'idle' as const;
    }, [shouldGrantExecutorRoot, isExecutorRootGranted, grantRootSendStatus, grantRootWaitStatus]);

    const customSteps = useMemo(
        () =>
            shouldGrantExecutorRoot
                ? [
                      {
                          id: ExecuteDialogStep.GRANT_EXECUTOR_ROOT_FOR_PSP,
                          order: 0,
                          meta: {
                              label: t(
                                  `app.governance.executeDialog.step.${ExecuteDialogStep.GRANT_EXECUTOR_ROOT_FOR_PSP}.label`,
                              ),
                              errorLabel: t(
                                  `app.governance.executeDialog.step.${ExecuteDialogStep.GRANT_EXECUTOR_ROOT_FOR_PSP}.errorLabel`,
                              ),
                              state: grantRootStepState,
                              action: handleGrantExecutorRoot,
                              auto: true,
                          },
                      },
                  ]
                : [],
        [shouldGrantExecutorRoot, t, grantRootStepState, handleGrantExecutorRoot],
    );

    return (
        <TransactionDialog
            title={t('app.governance.executeDialog.title')}
            description={t('app.governance.executeDialog.description')}
            submitLabel={t('app.governance.executeDialog.buttons.submit')}
            successLink={{
                label: t('app.governance.executeDialog.buttons.success'),
                onClick: () => router.refresh(),
            }}
            stepper={stepper}
            customSteps={customSteps}
            prepareTransaction={handlePrepareTransaction}
            network={network}
            transactionType={TransactionType.PROPOSAL_EXECUTE}
            indexingFallbackUrl={daoUtils.getDaoUrl(dao, `proposals/${slug}`)}
        >
            <DataList.Root entityLabel="">
                <ProposalDataListItem.Structure
                    title={title}
                    summary={summary}
                    publisher={{ address: creator.address }}
                    status={status}
                    id={slug}
                />
            </DataList.Root>
        </TransactionDialog>
    );
};
