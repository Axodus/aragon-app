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
        const result = await this.service.post<ISetPrimaryNameResponse, ISetPrimaryNameParams>({
            url: '/dao/set-primary-name',
            body: params,
        });

        return result;
    };
}

export const daoAdminService = new DaoAdminService();
