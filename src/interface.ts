import {
    IConnectOptions,
    ITypedData,
    IUserData,
    TLong,
    TTransactionParamWithType,
} from '@waves/waves-js/dist/src/interface';
import {
    IWithId,
    TTransaction,
    TTransactionMap,
    TTransactionWithProofs,
} from '@waves/ts-types';
import { TMeta } from './client-entry/services/transactionsService';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TBusHandlers = {
    login: () => Promise<IUserData>;
    logout: () => void;

    'sign-custom-bytes': (data: string) => Promise<string>;
    'sign-message': (data: string | number) => Promise<string>;
    'sign-typed-data': (data: Array<ITypedData>) => Promise<string>;

    sign(
        list: Array<TTransactionParamWithType>
    ): Promise<Array<TTransactionWithProofs<TLong> & IWithId>>;
};

export interface IBusEvents {
    connect: IConnectOptions;
    ready: void;
}

export interface ISignTxProps<T extends TTransactionParamWithType> {
    networkByte: number;
    user: {
        address: string;
        publicKey: string;
    };
    txInfo: {
        meta: TMeta;
        prams: T;
        tx: TTransactionMap<TLong>[T['type']] & IWithId;
    };
    onConfirm: (tx: TTransaction<TLong>) => void;
    onCancel: () => void;
}

export interface IUser {
    address: string;
    seed: string;
}

// eslint-disable-next-line prettier/prettier
export type TFunction<Params extends Array<unknown>, Return> = (
    ...args: Params
) => Return;
