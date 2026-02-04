import type { IGetHarmonyValidatorConfigParams, IGetPluginsByDaoParams } from './pluginsService.api';

export const pluginsServiceKeys = {
    allPlugins: ['plugins'] as const,
    pluginsByDao: (params: IGetPluginsByDaoParams) =>
        [...pluginsServiceKeys.allPlugins, 'pluginsByDao', params.urlParams] as const,
    harmonyValidatorConfig: (params: IGetHarmonyValidatorConfigParams) =>
        [...pluginsServiceKeys.allPlugins, 'harmonyValidatorConfig', params.urlParams] as const,
};
