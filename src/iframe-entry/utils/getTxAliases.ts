import { TTransactionWithId } from '@waves/ts-types';
import { TLong } from '@waves/signer';
import { NAME_MAP } from '../constants';
import { isAddress } from './isAddress';

export const getTxAliases = (tx: TTransactionWithId<TLong>): Array<string> => {
    switch (tx.type) {
        case NAME_MAP.invoke:
            return isAddress(tx.dApp) ? [] : [tx.dApp];
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
