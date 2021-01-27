import { NAME_MAP } from '../constants';
import { isAddress } from './isAddress';
import { MassTransferItem } from '@waves/ts-types/src/index';
import { Long, Transaction } from '@waves/ts-types';

export const getTxAliases = (tx: Transaction): Array<string> => {
    switch (tx.type) {
        case NAME_MAP.invoke:
            return isAddress(tx.dApp) ? [] : [tx.dApp];
        case NAME_MAP.transfer:
        case NAME_MAP.lease:
            return isAddress(tx.recipient) ? [] : [tx.recipient];
        case NAME_MAP.massTransfer:
            return tx.transfers.reduce<Array<string>>(
                (
                    acc: Array<string>,
                    transfer: MassTransferItem<Long>
                ): Array<string> => {
                    if (!isAddress(transfer.recipient)) {
                        acc.push(transfer.recipient);
                    }

                    return acc;
                },
                []
            );
        default:
            return [];
    }
};
