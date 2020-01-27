import { ITransferTransaction } from '@waves/ts-types';
import { WithId } from '@waves/waves-transactions';
import { TLong } from '@waves/signer';
import { cleanAddress } from '../../utils/cleanAlias';
import { isAlias } from '../../utils/isAlias';

const getAlias = (address: string): string => {
    return isAlias(address) ? cleanAddress(address) : '';
};

export type IconTransferType = 'send' | 'receive' | 'circular';

type GetIcon = (
    tx: ITransferTransaction<TLong> & WithId,
    user: { address: string; publicKey: string },
    userAliases: string[]
) => IconTransferType;

export const getIconType: GetIcon = (tx, user, userAliases) => {
    const isSenderMe =
        tx.senderPublicKey == null || tx.senderPublicKey === user.publicKey;

    if (isAlias(tx.recipient)) {
        return isSenderMe
            ? userAliases.includes(getAlias(tx.recipient))
                ? 'circular'
                : 'send'
            : 'receive';
    } else {
        return isSenderMe
            ? tx.recipient === user.address
                ? 'circular'
                : 'send'
            : 'receive';
    }
};
