import {
    ConnectOptions,
    TypedData,
    UserData,
    SignerTx,
    SignedTx,
} from '@waves/signer';
import { IMeta } from './iframe-entry/services/transactionsService';
import { MouseEventHandler } from 'react';
import { Long, Transaction, TransactionMap, WithId } from '@waves/ts-types';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TBusHandlers = {
    login: (data?: void) => Promise<UserData>;

    'sign-custom-bytes': (data: string) => Promise<string>;
    'sign-message': (data: string | number) => Promise<string>;
    'sign-typed-data': (data: Array<TypedData>) => Promise<string>;

    sign<T extends Array<SignerTx>>(
        list: T
    ): Promise<{ [Key in keyof T]: SignedTx<T[Key]> }>;
};

export interface IEncryptedUserData {
    publicKey: string;
    encrypted: string;
}

export interface IBusEvents {
    connect: ConnectOptions;
    close: void;
    ready: void;
}

export interface ISignTxProps<T extends Transaction> {
    networkByte: number;
    nodeUrl: string;
    user: Omit<IUserWithBalances, 'seed'> & { publicKey: string };
    meta: IMeta<T>;
    tx: TransactionMap<Long>[T['type']] & WithId;
    onConfirm: MouseEventHandler;
    onCancel: MouseEventHandler;
}

export interface IUser {
    address: string;
    privateKey: string;
}

export interface IUserWithBalances extends IUser {
    aliases: Array<string>;
    balance: Long;
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
