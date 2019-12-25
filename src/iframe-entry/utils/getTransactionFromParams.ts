import { TTransactionParamWithType, TLong } from '@waves/signer';
import { TTransaction, IWithId } from '@waves/ts-types';
import { fixRecipient } from './fixRecipient';
import { NAME_MAP } from '../../constants';
import { makeTx, libs } from '@waves/waves-transactions';
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

type GetTransactionFromParams = (
    options: { networkByte: number; privateKey: string },
    tx: TTransactionParamWithType
) => TTransaction<TLong> & IWithId;

export const getTransactionFromParams = curry<GetTransactionFromParams>(
    ({ networkByte, privateKey }, tx): TTransaction<TLong> & IWithId => {
        return makeTx({
            chainId: networkByte,
            senderPublicKey: libs.crypto.publicKey({ privateKey }),
            ...fixParams(networkByte, tx),
        } as any) as any;
    }
);
