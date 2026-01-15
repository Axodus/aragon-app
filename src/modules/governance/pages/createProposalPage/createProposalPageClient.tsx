'use client';

import { useDialogContext } from '@/shared/components/dialogProvider';
import { Page } from '@/shared/components/page';
import { useTranslations } from '@/shared/components/translationsProvider';
import { WizardPage } from '@/shared/components/wizards/wizardPage';
import { useDaoPlugins } from '@/shared/hooks/useDaoPlugins';
import { useCallback, useMemo, useState } from 'react';
import { useDao } from '@/shared/api/daoService';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import type { ICountryReservationData } from '@/shared/utils/countryReservationUtils';
import type { Hex } from 'viem';
import { CountryReservationForm } from '../../components/countryReservationForm';
import {
    defaultCountryRenewAction,
    defaultCountryTransferAction,
} from '@/plugins/shared/countryRegistrar/utils/countryRegistrarActionDefinitions';
import type { ICountryRenewAction, ICountryTransferAction } from '@/plugins/shared/countryRegistrar/types';
import { CreateProposalForm, type ICreateProposalFormData, type IProposalActionData } from '../../components/createProposalForm';
import { GovernanceDialogId } from '../../constants/governanceDialogId';
import type {
    IPublishProposalDialogParams,
    PrepareProposalActionFunction,
    PrepareProposalActionMap,
} from '../../dialogs/publishProposalDialog';
import { useProposalPermissionCheckGuard } from '../../hooks/useProposalPermissionCheckGuard';
import { CreateProposalPageClientSteps } from './createProposalPageClientSteps';
import { createProposalWizardId, createProposalWizardSteps } from './createProposalPageDefinitions';

export interface ICreateProposalPageClientProps {
    /**
     * ID of the DAO to create a proposal for.
     */
    daoId: string;
    /**
     * Address of the plugin to create the proposal for.
     */
    pluginAddress: string;
}

export const CreateProposalPageClient: React.FC<ICreateProposalPageClientProps> = (props) => {
    const { daoId, pluginAddress } = props;

    const { t } = useTranslations();
    const { open } = useDialogContext();

    const { meta: plugin } = useDaoPlugins({ daoId, pluginAddress })![0];
    const { data: dao } = useDao({ urlParams: { id: daoId } });

    useProposalPermissionCheckGuard({ daoId, pluginAddress, redirectTab: 'proposals' });

    const [prepareActions, setPrepareActions] = useState<PrepareProposalActionMap>({});
    const [reservationData, setReservationData] = useState<ICountryReservationData | null>(null);

    // Check if DAO network has .country integration
    const countryConfig = dao ? networkDefinitions[dao.network]?.country : null;
    const hasCountryIntegration = countryConfig != null;

    // If needs reservation and not yet reserved, show reservation form
    const needsReservation = hasCountryIntegration && reservationData === null;

    const addPrepareAction = useCallback(
        (type: string, prepareAction: PrepareProposalActionFunction) =>
            setPrepareActions((current) => ({ ...current, [type]: prepareAction })),
        [],
    );

    const contextValues = useMemo(() => ({ prepareActions, addPrepareAction }), [prepareActions, addPrepareAction]);

    const handleReservationComplete = (data: ICountryReservationData) => {
        setReservationData(data);
    };

    const handleFormSubmit = (values: ICreateProposalFormData) => {
        // Inject Transfer + Renew actions if reservation was made
        let finalActions = values.addActions ? values.actions : [];

        if (reservationData && dao && countryConfig) {
            const transferAction = defaultCountryTransferAction();
            transferAction.inputData = {
                function: 'transferFrom',
                contract: 'BaseRegistrar',
                parameters: [
                    { name: 'from', type: 'address', value: reservationData.ownerAddress },
                    { name: 'to', type: 'address', value: dao.address },
                    { name: 'tokenId', type: 'uint256', value: reservationData.tokenId.toString() },
                ],
            };

            const renewAction = defaultCountryRenewAction();
            renewAction.inputData = {
                function: 'renew',
                contract: 'RegistrarController',
                parameters: [
                    { name: 'name', type: 'string', value: reservationData.name },
                    { name: 'duration', type: 'uint256', value: (12 * 30 * 24 * 60 * 60).toString() }, // 12 months
                ],
            };

            // Wrap actions with required metadata
            const transferActionData: IProposalActionData<ICountryTransferAction> = {
                ...transferAction,
                daoId: dao.id,
                meta: undefined,
            };

            const renewActionData: IProposalActionData<ICountryRenewAction> = {
                ...renewAction,
                daoId: dao.id,
                meta: undefined,
            };

            // Insert at beginning
            finalActions = [transferActionData, renewActionData, ...finalActions];
        }

        const proposal = { ...values, actions: finalActions };
        const params: IPublishProposalDialogParams = { proposal, daoId, plugin, prepareActions };
        open(GovernanceDialogId.PUBLISH_PROPOSAL, { params });
    };

    const processedSteps = useMemo(
        () =>
            createProposalWizardSteps.map((step) => ({
                ...step,
                meta: { ...step.meta, name: t(step.meta.name) },
            })),
        [t],
    );

    // Show reservation form if needed and not yet complete
    if (needsReservation && dao && countryConfig) {
        return (
            <Page.Main fullWidth={true}>
                <div className="mx-auto max-w-3xl py-8">
                    <CountryReservationForm
                        daoAddress={dao.address as Hex}
                        network={dao.network}
                        registrarController={countryConfig.registrarController}
                        publicResolver={countryConfig.publicResolver}
                        baseRegistrar={countryConfig.baseRegistrar!}
                        tld={countryConfig.tld}
                        onReservationComplete={handleReservationComplete}
                    />
                </div>
            </Page.Main>
        );
    }

    return (
        <Page.Main fullWidth={true}>
            <WizardPage.Container
                finalStep={t('app.governance.createProposalPage.finalStep')}
                submitLabel={t('app.governance.createProposalPage.submitLabel')}
                initialSteps={processedSteps}
                onSubmit={handleFormSubmit}
                defaultValues={{ actions: [] }}
                id={createProposalWizardId}
            >
                <CreateProposalForm.Provider value={contextValues}>
                    <CreateProposalPageClientSteps steps={processedSteps} daoId={daoId} pluginAddress={pluginAddress} />
                </CreateProposalForm.Provider>
            </WizardPage.Container>
        </Page.Main>
    );
};
