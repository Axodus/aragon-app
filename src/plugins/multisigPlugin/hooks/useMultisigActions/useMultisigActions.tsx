'use client';

import type { IDaoPlugin } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { countryRegistrarActionUtils } from '@/plugins/shared/countryRegistrar';
import type { IMultisigPluginSettings } from '../../types';
import { multisigActionUtils } from '../../utils/multisigActionUtils';

export const useMultisigActions = (plugin: IDaoPlugin<IMultisigPluginSettings>) => {
    const { t } = useTranslations();

    const multisigActions = multisigActionUtils.getMultisigActions({ plugin, t });
    const countryActions = countryRegistrarActionUtils.getActions({ plugin, t });

    return {
        items: [...multisigActions.items, ...countryActions.items],
        groups: [...multisigActions.groups, ...countryActions.groups],
        components: { ...multisigActions.components, ...countryActions.components },
    };
};
