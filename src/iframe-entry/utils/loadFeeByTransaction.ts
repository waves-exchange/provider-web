import { curry } from 'ramda';
import { TTransactionWithId } from '@waves/ts-types';
import { TLong } from '@waves/signer';
import {
    fetchCalculateFee,
    TFeeInfo,
} from '@waves/node-api-js/es/api-node/transactions';

export const loadFeeByTransaction = curry(
    (
        base: string,
        tx: TTransactionWithId<TLong>
    ): Promise<TTransactionWithId<TLong>> =>
        fetchCalculateFee(base, tx)
            .then((info: TFeeInfo) => ({ ...tx, fee: info.feeAmount }))
            .catch(() => ({ ...tx }))
);
