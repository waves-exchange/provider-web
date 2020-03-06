import {
    IConnectOptions,
    ITypedData,
    IUserData,
    TLong,
    TTransactionParamWithType,
} from '@waves/signer';
import {
    IWithId,
    TTransactionMap,
    TTransactionWithProofs,
} from '@waves/ts-types';
import { IMeta } from './iframe-entry/services/transactionsService';
import { MouseEventHandler } from 'react';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TBusHandlers = {
    login: (data?: void) => Promise<IUserData>;

    'sign-custom-bytes': (data: string) => Promise<string>;
    'sign-message': (data: string | number) => Promise<string>;
    'sign-typed-data': (data: Array<ITypedData>) => Promise<string>;

    sign(
        list: Array<TTransactionParamWithType>
    ): Promise<Array<TTransactionWithProofs<TLong> & IWithId>>;
};

export interface IEncryptedUserData {
    publicKey: string;
    encrypted: string;
}

export interface IBusEvents {
    connect: IConnectOptions;
    close: void;
    ready: void;
}

export interface ISignTxProps<T extends TTransactionParamWithType> {
    networkByte: number;
    nodeUrl: string;
    user: Omit<IUserWithBalances, 'seed'> & { publicKey: string };
    meta: IMeta<T>;
    tx: TTransactionMap<TLong>[T['type']] & IWithId;
    onConfirm: MouseEventHandler;
    onCancel: MouseEventHandler;
}

export interface IUser {
    address: string;
    privateKey: string;
}

export interface IUserWithBalances extends IUser {
    aliases: Array<string>;
    balance: TLong;
    hasScript: boolean;
}

// eslint-disable-next-line prettier/prettier
export type TFunction<Params extends Array<unknown>, Return> = (
    ...args: Params
) => Return;

export interface IKeyPair {
    privateKey: string;
    publicKey: string;
}

export type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? RecursivePartial<U>[]
        : T[P] extends object
        ? RecursivePartial<T[P]>
        : T[P];
};
