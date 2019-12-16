import {
    TTransactionParamWithType,
    TLong,
} from '@waves/waves-js/dist/src/interface';
import { TTransaction, IWithId } from '@waves/ts-types';
import { IState } from '../interface';
import { fixRecipient } from './fixRecipient';
import { NAME_MAP } from '../../constants';
import { makeTx, libs } from '@waves/waves-transactions';
import { IUser } from '../../interface';
import curry from 'ramda/es/curry';

const fixParams = (
    networkByte: number,
    tx: TTransactionParamWithType
): TTransactionParamWithType => {
    const updateRecipent: <T extends { recipient: string }>(
        data: T
    ) => T = fixRecipient(networkByte);

    switch (tx.type) {
        case NAME_MAP.transfer:
            return updateRecipent(tx);
        case NAME_MAP.massTransfer:
            return { ...tx, transfers: tx.transfers.map(updateRecipent) };
        case NAME_MAP.lease:
            return updateRecipent(tx);
        default:
            return tx;
    }
};

export const getTransactionFromParams = curry(
    (
        { networkByte, seed }: { networkByte: number; seed: string },
        tx: TTransactionParamWithType
    ): TTransaction<TLong> & IWithId => {
        return makeTx({
            chainId: networkByte,
            senderPublicKey: libs.crypto.publicKey(seed),
            ...fixParams(networkByte, tx),
        } as any) as any;
    }
);
