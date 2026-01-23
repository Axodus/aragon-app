import {
    CountryRegistrarActionType,
    type ICountryCommitAction,
    type ICountryRegisterAction,
    type ICountryRenewAction,
    type ICountryTransferAction,
} from '../types';

export const defaultCountryCommitAction = (): ICountryCommitAction => ({
    type: CountryRegistrarActionType.COMMIT,
    from: '',
    to: '',
    data: '',
    value: '0',
    inputData: {
        function: 'commit',
        contract: 'RegistrarController',
        parameters: [
            {
                name: 'commitment',
                type: 'bytes32',
                value: '',
                notice: '',
            },
        ],
    },
});

export const defaultCountryRegisterAction = (): ICountryRegisterAction => ({
    type: CountryRegistrarActionType.REGISTER,
    from: '',
    to: '',
    data: '',
    value: '0',
    inputData: {
        function: 'register',
        contract: 'RegistrarController',
        parameters: [],
    },
});

export const defaultCountryRenewAction = (): ICountryRenewAction => ({
    type: CountryRegistrarActionType.RENEW,
    from: '',
    to: '',
    data: '',
    value: '0',
    inputData: {
        function: 'renew',
        contract: 'RegistrarController',
        parameters: [],
    },
});

export const defaultCountryTransferAction = (): ICountryTransferAction => ({
    type: CountryRegistrarActionType.TRANSFER,
    from: '',
    to: '',
    data: '',
    value: '0',
    inputData: {
        function: 'transferFrom',
        contract: 'BaseRegistrar',
        parameters: [],
    },
});
