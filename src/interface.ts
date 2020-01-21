import {
    IConnectOptions,
    ITypedData,
    IUserData,
    TLong,
    TTransactionParamWithType,
} from '@waves/signer';
import {
    IWithId,
    TTransaction,
    TTransactionMap,
    TTransactionWithProofs,
} from '@waves/ts-types';
import { IMeta } from './iframe-entry/services/transactionsService';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TBusHandlers = {
    login: (data?: void) => Promise<IUserData>;
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
    user: Omit<IUserWithBalances, 'seed'> & { publicKey: string };
    meta: IMeta<T>;
    tx: TTransactionMap<TLong>[T['type']] & IWithId;
    onConfirm: (tx: TTransaction<TLong>) => void;
    onCancel: () => void;
}

export interface IUser {
    address: string;
    privateKey: string;
}

export interface IUserWithBalances extends IUser {
    aliases: Array<string>;
    balance: TLong;
}

// eslint-disable-next-line prettier/prettier
export type TFunction<Params extends Array<unknown>, Return> = (
    ...args: Params
) => Return;
