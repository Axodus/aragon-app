import { AragonAdminBackendService } from '@/shared/api/aragonAdminBackendService/aragonAdminBackendService';
import type { Network } from './domain';

export interface ISetPrimaryNameParams {
    address: string;
    network: Network;
    primaryName?: string | null;
}

export interface ISetPrimaryNameResponse {
    primaryName: string | null;
}

class DaoAdminService {
    private service = new AragonAdminBackendService();

    setPrimaryName = async (params: ISetPrimaryNameParams): Promise<ISetPrimaryNameResponse> => {
        const result = await this.service.request<ISetPrimaryNameResponse, unknown, unknown, ISetPrimaryNameParams>(
            '/dao/set-primary-name',
            { body: params },
            { method: 'POST' },
        );

        return result;
    };
}

export const daoAdminService = new DaoAdminService();
