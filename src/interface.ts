import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { TFeeInfo } from '@waves/node-api-js/es/api-node/transactions';
import { NAME_MAP } from '@waves/node-api-js/es/constants';
import {
    ConnectOptions,
    SignedTx,
    SignerLeaseTx,
    SignerTx,
    TypedData,
    UserData,
} from '@waves/signer';
import {
    Long,
    Transaction,
    TransactionMap,
    WithApiMixin,
    WithId,
} from '@waves/ts-types';
import { MouseEventHandler } from 'react';

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

export type DetailsWithLogo = TAssetDetails<Long> & {
    logo?: string;
};

export type InfoMap = {
    1: void;
    2: void;
    [NAME_MAP.issue]: void;
    [NAME_MAP.transfer]: void;
    [NAME_MAP.reissue]: void;
    [NAME_MAP.burn]: void;
    [NAME_MAP.exchange]: void;
    [NAME_MAP.lease]: void;
    [NAME_MAP.cancelLease]: SignerLeaseTx & WithApiMixin;
    [NAME_MAP.alias]: void;
    [NAME_MAP.massTransfer]: void;
    [NAME_MAP.data]: void;
    [NAME_MAP.setScript]: void;
    [NAME_MAP.sponsorship]: void;
    [NAME_MAP.setAssetScript]: void;
    [NAME_MAP.invoke]: void;
    17: void;
};

export interface IMeta<T extends Transaction> {
    feeList: Array<TFeeInfo>;
    aliases: Record<string, string>;
    assets: Record<string, DetailsWithLogo>;
    params: T;
    info: InfoMap[T['type']];
}

export interface ITransactionInfo<T extends Transaction> {
    meta: IMeta<T>;
    tx: TransactionMap<Long>[T['type']] & WithId;
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

export type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? RecursivePartial<U>[]
        : T[P] extends Record<string, unknown>
        ? RecursivePartial<T[P]>
        : T[P];
};
