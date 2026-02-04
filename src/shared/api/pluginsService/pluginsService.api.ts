import type { Network } from '../daoService';
import type { IRequestUrlParams } from '../httpService';

export interface IGetPluginsByDaoUrlParams {
    /**
     * Network of the DAO.
     */
    network: Network;
    /**
     * Address of the DAO.
     */
    address: string;
}

export interface IGetPluginsByDaoParams extends IRequestUrlParams<IGetPluginsByDaoUrlParams> {}

export interface IGetHarmonyValidatorConfigUrlParams {
    /**
     * Network of the DAO.
     */
    network: Network;
    /**
     * Address of the plugin.
     */
    pluginAddress: string;
}

export interface IHarmonyValidatorConfig {
    pluginAddress: string;
    network: string;
    validatorAddress: string | null;
    processKey: string | null;
    lastUpdateTxHash: string | null;
    lastUpdateBlock: number | null;
    updatedAt: string | null;
    createdAt: string | null;
}

export interface IGetHarmonyValidatorConfigParams extends IRequestUrlParams<IGetHarmonyValidatorConfigUrlParams> {}
