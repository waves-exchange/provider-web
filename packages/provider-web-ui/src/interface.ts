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
import { Bus } from '@waves/waves-browser-bus';
import { MouseEventHandler } from 'react';

export interface IState<USER = IUser | null> {
    user: USER;
    networkByte: number;
    nodeUrl: string;
    matcherUrl?: string | undefined;
}

export type TPrivateMultiaccountData = Record<string, TPrivateUserData>;

type TPrivateUserData =
    | IPrivateSeedUserData
    | IPrivateKeeperUserData
    | IPrivateLedgerUserData
    | IPrivateKeyUserData;

export interface IPrivateUserDataBase {
    networkByte: number;
    publicKey: string;
}

export interface IPrivateSeedUserData extends IPrivateUserDataBase {
    seed: string;
    userType: 'seed';
}

export interface IPrivateKeeperUserData extends IPrivateUserDataBase {
    userType: 'keeper';
}

export interface IPrivateLedgerUserData extends IPrivateUserDataBase {
    userType: 'ledger';
}

export interface IPrivateKeyUserData extends IPrivateUserDataBase {
    userType: 'privateKey';
    privateKey: string;
}

export interface IUserStorageInfo {
    lastLogin: number;
    name: string;
    settings?: Record<string, Partial<IUserSettings>>;
    matcherSign?: any;
}

export interface IUserSettings {
    hasBackup: boolean;
    pinnedAssetIdList: Array<string>;
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

export interface IBusEvents {
    connect: ConnectOptions;
    close: void;
    ready: void;
}

export type TBus = Bus<IBusEvents, TBusHandlers>;
