'use client';

import { useMutation } from '@tanstack/react-query';
import { daoAdminService, type ISetPrimaryNameParams } from '@/shared/api/daoService/daoAdminService';

export const useSetPrimaryName = () => {
    const mutation = useMutation({
        mutationFn: (params: ISetPrimaryNameParams) => daoAdminService.setPrimaryName(params),
    });

    return mutation;
};
