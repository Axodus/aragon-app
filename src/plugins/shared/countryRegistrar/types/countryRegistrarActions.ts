import type { IProposalAction } from '@/modules/governance/api/governanceService';
import type { CountryRegistrarActionType } from './enum/countryRegistrarActionType';

export interface ICountryCommitAction extends Omit<IProposalAction, 'type'> {
    type: CountryRegistrarActionType.COMMIT;
}

export interface ICountryRegisterAction extends Omit<IProposalAction, 'type'> {
    type: CountryRegistrarActionType.REGISTER;
}

export interface ICountryTransferAction extends Omit<IProposalAction, 'type'> {
    type: CountryRegistrarActionType.TRANSFER;
}

export type ICountryRegistrarProposalAction = ICountryCommitAction | ICountryRegisterAction | ICountryTransferAction;
