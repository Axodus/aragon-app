'use client';

import type { IDaoPlugin } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { countryRegistrarActionUtils } from '@/plugins/shared/countryRegistrar';

export const useAdminActions = (plugin: IDaoPlugin) => {
    const { t } = useTranslations();

    return countryRegistrarActionUtils.getActions({ plugin, t });
};
