import { curry } from 'ramda';
import { TTransaction, IWithId } from '@waves/ts-types';
import { TLong } from '@waves/signer';
import {
    fetchCalculateFee,
    TFeeInfo,
} from '@waves/node-api-js/es/api-node/transactions';

export const loadFeeByTransaction = curry(
    (
        base: string,
        tx: TTransaction<TLong> & IWithId
    ): Promise<TTransaction<TLong> & IWithId> =>
        fetchCalculateFee(base, tx)
            .then((info: TFeeInfo) => ({ ...tx, fee: info.feeAmount }))
            .catch(() => ({ ...tx }))
);
