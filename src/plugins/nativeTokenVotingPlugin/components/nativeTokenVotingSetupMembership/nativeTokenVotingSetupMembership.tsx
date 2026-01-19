'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { Card } from '@aragon/gov-ui-kit';
import type { INativeTokenVotingSetupMembershipProps } from './nativeTokenVotingSetupMembership.api';

export const NativeTokenVotingSetupMembership: React.FC<INativeTokenVotingSetupMembershipProps> = () => {
    const { t } = useTranslations();

    return (
        <Card className="shadow-neutral-sm flex flex-col gap-2 border border-neutral-100 p-6">
            <p className="text-base leading-normal font-normal text-neutral-800">
                {t('app.plugins.nativeTokenVoting.setupMembership.title')}
            </p>
            <p className="text-sm leading-normal font-normal text-neutral-500">
                {t('app.plugins.nativeTokenVoting.setupMembership.description')}
            </p>
        </Card>
    );
};
