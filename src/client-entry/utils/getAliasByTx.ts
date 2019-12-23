import { TTransaction, IWithId } from '@waves/ts-types';
import { TLong } from '@waves/waves-js';
import { NAME_MAP } from '../../constants';
import { isAddress } from './isAddress';

export const getAliasByTx = (
    tx: TTransaction<TLong> & IWithId
): Array<string> => {
    switch (tx.type) {
        case NAME_MAP.transfer:
        case NAME_MAP.lease:
            return isAddress(tx.recipient) ? [] : [tx.recipient];
        case NAME_MAP.massTransfer:
            return tx.transfers.reduce<Array<string>>((acc, transfer) => {
                if (!isAddress(transfer.recipient)) {
                    acc.push(transfer.recipient);
                }

                return acc;
            }, []);
        default:
            return [];
    }
};
