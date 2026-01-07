import { CountryRegistrarActionType, type ICountryCommitAction, type ICountryRegisterAction } from '../types';

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
