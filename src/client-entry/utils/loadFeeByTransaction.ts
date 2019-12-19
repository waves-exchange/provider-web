import { curry } from 'ramda';
import { TTransaction, IWithId } from '@waves/ts-types';
import { TLong } from '@waves/waves-js/dist/src/interface';
import { SPONSORED_TYPES } from '../../constants';
import {
    fetchCalculateFee,
    TFeeInfo,
} from '@waves/node-api-js/es/api-node/transactions';

const canBeSponsored = (tx: TTransaction<TLong> & IWithId): boolean =>
    SPONSORED_TYPES.includes(tx.type);

export const loadFeeByTransaction = curry(
    (
        base: string,
        tx: TTransaction<TLong> & IWithId
    ): Promise<TTransaction<TLong> & IWithId> =>
        canBeSponsored(tx)
            ? fetchCalculateFee(base, tx)
                  .then((info: TFeeInfo) => ({ ...tx, fee: info.feeAmount }))
                  .catch(() => ({ ...tx }))
            : Promise.resolve({ ...tx })
);
