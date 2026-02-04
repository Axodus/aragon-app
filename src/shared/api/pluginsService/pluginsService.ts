import { AragonBackendService } from '../aragonBackendService';
import type { IDaoPlugin } from '../daoService';
import type { IGetHarmonyValidatorConfigParams, IHarmonyValidatorConfig, IGetPluginsByDaoParams } from './pluginsService.api';

class PluginsService extends AragonBackendService {
    private urls = {
        pluginsByDao: '/v2/plugins/by-dao/:network/:address',
        harmonyValidatorConfig: '/v2/plugins/harmony-config/:network/:pluginAddress',
    };

    getPluginsByDao = async (params: IGetPluginsByDaoParams): Promise<IDaoPlugin[]> => {
        const result = await this.request<IDaoPlugin[]>(this.urls.pluginsByDao, params);

        return result;
    };

    getHarmonyValidatorConfig = async (params: IGetHarmonyValidatorConfigParams): Promise<IHarmonyValidatorConfig> => {
        const result = await this.request<IHarmonyValidatorConfig>(this.urls.harmonyValidatorConfig, params);
        return result;
    };
}

export const pluginsService = new PluginsService();
