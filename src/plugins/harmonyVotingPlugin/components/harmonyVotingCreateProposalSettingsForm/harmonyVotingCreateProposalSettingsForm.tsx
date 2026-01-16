'use client';

import type { ICreateProposalEndDateForm } from '@/modules/governance/utils/createProposalUtils';
import { AdvancedDateInput } from '@/shared/components/forms/advancedDateInput';
import { useTranslations } from '@/shared/components/translationsProvider';
import { useFormField } from '@/shared/hooks/useFormField';
import { dateUtils } from '@/shared/utils/dateUtils';
import { InputContainer, InputNumber } from '@aragon/gov-ui-kit';
import { DateTime } from 'luxon';
import { useId } from 'react';
import { useWatch } from 'react-hook-form';

export interface IHarmonyVotingCreateProposalSettingsForm extends ICreateProposalEndDateForm {
    /**
     * Snapshot block used to compute validator/delegator weights.
     */
    snapshotBlock?: number;
}

export const HarmonyVotingCreateProposalSettingsForm: React.FC = () => {
    const { t } = useTranslations();
    const containerId = useId();
    const recommendedMinDays = 1;

    const startTimeFixed = useWatch<ICreateProposalEndDateForm, 'startTimeFixed'>({ name: 'startTimeFixed' });
    const minEndTime = startTimeFixed ? dateUtils.parseFixedDate(startTimeFixed) : DateTime.now();

    const {
        value: snapshotBlock,
        onChange: onSnapshotBlockChange,
        ...snapshotField
    } = useFormField<IHarmonyVotingCreateProposalSettingsForm, 'snapshotBlock'>('snapshotBlock', {
        label: t('app.plugins.harmonyVoting.createProposalSettingsForm.snapshotBlock.label'),
        rules: {
            required: true,
            min: 1,
            validate: (value?: number) => value != null && Number.isFinite(value) && value >= 1,
        },
    });

    return (
        <div className="flex flex-col gap-6 md:gap-12">
            <AdvancedDateInput
                label={t('app.plugins.harmonyVoting.createProposalSettingsForm.startTime.label')}
                helpText={t('app.plugins.harmonyVoting.createProposalSettingsForm.startTime.helpText')}
                field="startTime"
            />
            <AdvancedDateInput
                label={t('app.plugins.harmonyVoting.createProposalSettingsForm.endTime.label')}
                helpText={t('app.plugins.harmonyVoting.createProposalSettingsForm.endTime.helpText')}
                field="endTime"
                useDuration={true}
                minTime={minEndTime}
                minDuration={{ days: recommendedMinDays, hours: 0, minutes: 0 }}
            />
            <InputContainer
                id={containerId}
                label={t('app.plugins.harmonyVoting.createProposalSettingsForm.snapshotBlock.label')}
                helpText={t('app.plugins.harmonyVoting.createProposalSettingsForm.snapshotBlock.helpText')}
                useCustomWrapper={true}
            >
                <InputNumber
                    value={snapshotBlock}
                    min={1}
                    onChange={(value) => onSnapshotBlockChange(Number(value))}
                    {...snapshotField}
                />
            </InputContainer>
        </div>
    );
};
