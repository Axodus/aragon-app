import type { IActionComposerPluginData } from '@/modules/governance/types';
import type { IDaoPlugin } from '@/shared/api/daoService';
import type { TranslationFunction } from '@/shared/components/translationsProvider';
import { addressUtils, IconType } from '@aragon/gov-ui-kit';
import { CountryCommitAction } from '../components/countryRegistrarActions/countryCommitAction';
import { CountryRegisterAction } from '../components/countryRegistrarActions/countryRegisterAction';
import { CountryTransferAction } from '../components/countryRegistrarActions/countryTransferAction';
import { CountryRegistrarActionType } from '../types';
import {
    defaultCountryCommitAction,
    defaultCountryRegisterAction,
    defaultCountryTransferAction,
} from './countryRegistrarActionDefinitions';

export interface IGetCountryRegistrarActionsProps {
    plugin: IDaoPlugin;
    t: TranslationFunction;
}

export type IGetCountryRegistrarActionsResult = IActionComposerPluginData<IDaoPlugin>;

class CountryRegistrarActionUtils {
    getActions = ({ plugin, t }: IGetCountryRegistrarActionsProps): IGetCountryRegistrarActionsResult => {
        const groupId = `${plugin.address}-country-registrar`;

        return {
            groups: [
                {
                    id: groupId,
                    name: t('app.actions.countryRegistrar.groupName'),
                    info: addressUtils.truncateAddress(plugin.address),
                    indexData: ['country', plugin.address],
                },
            ],
            items: [
                {
                    id: `${plugin.address}-${CountryRegistrarActionType.REGISTER}`,
                    name: t('app.actions.countryRegistrar.register.title'),
                    icon: IconType.SETTINGS,
                    groupId,
                    defaultValue: [defaultCountryCommitAction(), defaultCountryRegisterAction()],
                },
                {
                    id: `${plugin.address}-${CountryRegistrarActionType.TRANSFER}`,
                    name: t('app.actions.countryRegistrar.transfer.title'),
                    icon: IconType.SETTINGS,
                    groupId,
                    defaultValue: defaultCountryTransferAction(),
                },
            ],
            components: {
                [CountryRegistrarActionType.COMMIT]: CountryCommitAction,
                [CountryRegistrarActionType.REGISTER]: CountryRegisterAction,
                [CountryRegistrarActionType.TRANSFER]: CountryTransferAction,
            },
        };
    };
}

export const countryRegistrarActionUtils = new CountryRegistrarActionUtils();
