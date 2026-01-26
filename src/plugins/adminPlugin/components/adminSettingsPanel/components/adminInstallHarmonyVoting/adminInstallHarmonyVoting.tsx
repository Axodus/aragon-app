import { SettingsDialogId } from '@/modules/settings/constants/settingsDialogId';
import type { IInstallHarmonyVotingDialogParams } from '@/modules/settings/dialogs/installHarmonyVotingDialog';
import { Network, useDao, PluginInterfaceType } from '@/shared/api/daoService';
import { useDialogContext } from '@/shared/components/dialogProvider';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useDaoPlugins } from '@/shared/hooks/useDaoPlugins';
import { PluginType } from '@/shared/types';
import { Button } from '@aragon/gov-ui-kit';

export interface IAdminInstallHarmonyVotingProps {
    /**
     * ID of the DAO.
     */
    daoId: string;
}

export const AdminInstallHarmonyVoting: React.FC<IAdminInstallHarmonyVotingProps> = (props) => {
    const { daoId } = props;

    const { t } = useTranslations();
    const { open } = useDialogContext();

    const { data: dao } = useDao({ urlParams: { id: daoId } });

    const isHarmonyNetwork = dao?.network === Network.HARMONY_MAINNET || dao?.network === Network.HARMONY_TESTNET;

    const processPlugins = useDaoPlugins({ daoId, type: PluginType.PROCESS }) ?? [];

    const hasHarmonyVotingInstalled = processPlugins.some(
        (p) =>
            p.meta.interfaceType === PluginInterfaceType.HARMONY_HIP_VOTING ||
            p.meta.interfaceType === PluginInterfaceType.HARMONY_DELEGATION_VOTING,
    );

    if (!isHarmonyNetwork || hasHarmonyVotingInstalled) {
        return null;
    }

    const handleOpenDialog = () => {
        const params: IInstallHarmonyVotingDialogParams = { daoId };
        open(SettingsDialogId.INSTALL_HARMONY_VOTING, { params });
    };

    return (
        <Button size="md" variant="secondary" onClick={handleOpenDialog}>
            {t('app.plugins.admin.adminInstallHarmonyVoting.label')}
        </Button>
    );
};
