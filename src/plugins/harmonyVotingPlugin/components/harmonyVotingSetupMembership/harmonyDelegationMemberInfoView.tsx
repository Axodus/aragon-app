/* eslint-disable complexity */

'use client';

import type { Network } from '@/shared/api/daoService';
import { type IDaoPlugin, useDao } from '@/shared/api/daoService';
import { useHarmonyValidatorConfig } from '@/shared/api/pluginsService';
import * as GovUiKit from '@aragon/gov-ui-kit';

const DefinitionList = (GovUiKit as any).DefinitionList as any;
const addressUtils = (GovUiKit as any).addressUtils as any;

const getNetworkAndEnabled = (dao: { network?: Network } | null | undefined) => {
    if (dao == null || dao.network == null) {
        return { enabled: false, network: '' as Network };
    }
    return { enabled: true, network: dao.network as Network };
};

const resolveMemberInfo = (cfg: { validatorAddress?: string | null; processKey?: string | null } | null | undefined, plugin: IDaoPlugin) => {
    let validatorAddress: string | null = null;
    if (cfg != null) {
        if (cfg.validatorAddress != null) {
            validatorAddress = cfg.validatorAddress;
        }
    }

    let processKey: string | null = null;
    if (cfg != null) {
        if (cfg.processKey != null) {
            processKey = cfg.processKey;
        }
    }

    if (processKey == null && plugin.processKey != null) {
        processKey = plugin.processKey;
    }

    return { validatorAddress, processKey };
};

const formatValidatorAddress = (validatorAddress: string | null) => {
    if (validatorAddress == null) {
        return { copyValue: undefined, display: '—' };
    }

    const copyValue = validatorAddress;
    let display = validatorAddress;
    if (addressUtils != null && typeof addressUtils.truncateAddress === 'function') {
        display = addressUtils.truncateAddress(validatorAddress);
    }

    return { copyValue, display };
};

const formatProcessKey = (processKey: string | null) => {
    if (processKey == null) {
        return '—';
    }
    return processKey;
};

export interface IHarmonyDelegationMemberInfoProps {
    /**
     * ID of the DAO.
     */
    daoId: string;
    /**
     * DAO plugin to display the members info for.
     */
    plugin: IDaoPlugin;
}

export const HarmonyDelegationMemberInfo = (props: IHarmonyDelegationMemberInfoProps) => {
    const { daoId, plugin } = props;

    const { data: dao } = useDao({ urlParams: { id: daoId } });

    const { enabled, network } = getNetworkAndEnabled(dao);

    const { data: cfg } = useHarmonyValidatorConfig(
        {
            urlParams: {
                network,
                pluginAddress: plugin.address,
            },
        },
        { enabled },
    );

    const { validatorAddress, processKey } = resolveMemberInfo(cfg, plugin);
    const { copyValue: validatorCopyValue, display: validatorDisplay } = formatValidatorAddress(validatorAddress);
    const processKeyDisplay = formatProcessKey(processKey);

    return (
        <DefinitionList.Container>
            <DefinitionList.Item term="Eligible voters" description="Delegators of the configured validator" />

            <DefinitionList.Item term="Validator address" copyValue={validatorCopyValue}>
                {validatorDisplay}
            </DefinitionList.Item>

            <DefinitionList.Item term="Process key">{processKeyDisplay}</DefinitionList.Item>
        </DefinitionList.Container>
    );
};
