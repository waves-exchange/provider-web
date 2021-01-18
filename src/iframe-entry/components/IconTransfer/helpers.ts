import { cleanAddress } from '../../utils/cleanAlias';
import { isAlias } from '../../utils/isAlias';
import { IconTransferType } from './IconTransfer';
import { TransferType } from '../../pages/SignTransfer/SignTransferContainer';

const getAlias = (address: string): string => {
    return isAlias(address) ? cleanAddress(address) : '';
};

type GetIcon = (
    tx: TransferType,
    user: { address: string; publicKey: string },
    userAliases: string[]
) => IconTransferType;

export const getIconType: GetIcon = (tx, user, userAliases) => {
    if (tx.type === 11) return 'mass';

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
