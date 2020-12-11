import { NAME_MAP } from '../constants';
import { isAddress } from './isAddress';
import { SignerTx } from '@waves/signer';
import { IMassTransferItem } from '@waves/ts-types/src/index';
import { TLong, TTransaction } from '@waves/ts-types';

export const getTxAliases = (tx: TTransaction): Array<string> => {
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
                    transfer: IMassTransferItem<TLong>
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
