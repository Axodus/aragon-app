import { type IDaoPlugin } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { countryRegistrarActionUtils } from '@/plugins/shared/countryRegistrar';
import { type ISppPluginSettings } from '../../types';
import { sppActionUtils } from '../../utils/sppActionUtils';

export const useSppActions = (plugin: IDaoPlugin<ISppPluginSettings>) => {
    const { t } = useTranslations();

    const sppActions = sppActionUtils.getSppActions({ plugin, t });
    const countryActions = countryRegistrarActionUtils.getActions({ plugin, t });

    return {
        items: [...sppActions.items, ...countryActions.items],
        groups: [...sppActions.groups, ...countryActions.groups],
        components: { ...sppActions.components, ...countryActions.components },
    };
};
