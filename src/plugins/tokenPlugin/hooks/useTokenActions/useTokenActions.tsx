'use client';

import type { IDaoPlugin } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { countryRegistrarActionUtils } from '@/plugins/shared/countryRegistrar';
import type { ITokenPluginSettings } from '../../types';
import { tokenActionUtils } from '../../utils/tokenActionUtils';

export const useTokenActions = (plugin: IDaoPlugin<ITokenPluginSettings>) => {
    const { t } = useTranslations();

    const tokenActions = tokenActionUtils.getTokenActions({ plugin, t });
    const countryActions = countryRegistrarActionUtils.getActions({ plugin, t });

    return {
        items: [...tokenActions.items, ...countryActions.items],
        groups: [...tokenActions.groups, ...countryActions.groups],
        components: { ...tokenActions.components, ...countryActions.components },
    };
};
