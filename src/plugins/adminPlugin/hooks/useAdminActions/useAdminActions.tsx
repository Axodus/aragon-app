'use client';

import type { IDaoPlugin } from '@/shared/api/daoService';

export const useAdminActions = (plugin: IDaoPlugin) => {
    return {
        items: [],
        groups: [],
        components: {},
    };
};
