import { curry } from 'ramda';
import { TTransaction, IWithId } from '@waves/ts-types';
import { TLong } from '@waves/waves-js/dist/src/interface';
import { SPONSORED_TYPES } from '../../constants';
import { calculateFee } from '@waves/blockchain-api/dist/cjs/api-node/transactions';

const canBeSponsored = (tx: TTransaction<TLong> & IWithId): boolean =>
    SPONSORED_TYPES.includes(tx.type);

export const loadFeeByTransaction = curry(
    (
        base: string,
        tx: TTransaction<TLong> & IWithId
    ): Promise<TTransaction<TLong> & IWithId> =>
        canBeSponsored(tx)
            ? calculateFee(base, tx)
                  .then((info) => ({ ...tx, fee: info.feeAmount }))
                  .catch(() => ({ ...tx }))
            : Promise.resolve({ ...tx })
);
