'use client';

import type { IDaoPlugin } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { countryRegistrarActionUtils } from '@/plugins/shared/countryRegistrar';
import type { ILockToVotePluginSettings } from '../../types';
import { lockToVoteActionUtils } from '../../utils/lockToVoteActionUtils';

export const useLockToVoteActions = (plugin: IDaoPlugin<ILockToVotePluginSettings>) => {
    const { t } = useTranslations();

    const lockToVoteActions = lockToVoteActionUtils.getLockToVoteActions({ plugin, t });
    const countryActions = countryRegistrarActionUtils.getActions({ plugin, t });

    return {
        items: [...lockToVoteActions.items, ...countryActions.items],
        groups: [...lockToVoteActions.groups, ...countryActions.groups],
        components: { ...lockToVoteActions.components, ...countryActions.components },
    };
};
