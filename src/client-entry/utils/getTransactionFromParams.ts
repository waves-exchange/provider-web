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
    state: IState<unknown>,
    tx: TTransactionParamWithType
): TTransactionParamWithType => {
    const updateRecipent = fixRecipient(state);

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
        state: IState<IUser>,
        tx: TTransactionParamWithType
    ): TTransaction<TLong> & IWithId => {
        return makeTx({
            chainId: state.networkByte,
            senderPublicKey: libs.crypto.publicKey(state.user.seed),
            ...fixParams(state, tx),
        } as any) as any;
    }
);
