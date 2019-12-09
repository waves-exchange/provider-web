import {
    IConnectOptions,
    ITypedData,
    IUserData,
    TLong,
    TTransactionParamWithType
} from '@waves/waves-js/dist/src/interface';
import { IWithId, TTransaction, TTransactionMap, TTransactionWithProofs } from '@waves/ts-types';
import { TFeeInfo } from '@waves/blockchain-api/dist/cjs/api-node/transactions';
import { TAssetDetails } from '@waves/blockchain-api/dist/cjs/api-node/assets';


export type TBusHandlers = {
    login: () => Promise<IUserData>;
    logout: () => void;

    'sign-custom-bytes': (data: string) => Promise<string>;
    'sign-message': (data: string | number) => Promise<string>;
    'sign-typed-data': (data: Array<ITypedData>) => Promise<string>;

    sign(list: Array<TTransactionParamWithType>): Promise<Array<TTransactionWithProofs<TLong> & IWithId>>;
}

export interface IBusEvents {
    'connect': IConnectOptions;
    'ready': void;
}

export interface ISignTxProps<T extends TTransactionParamWithType> {
    networkByte: number;
    assets: Record<string, TAssetDetails<TLong>>
    user: {
        address: string;
        publicKey: string;
    }
    tx: {
        origin: T,
        extended: TTransactionMap<TLong>[T['type']] & IWithId
    };
    availableFee: Array<TFeeInfo>;
    onConfirm: (tx: TTransaction<TLong>) => void;
    onCancel: () => void;
}

export interface IUser {
    address: string;
    seed: string;
}
