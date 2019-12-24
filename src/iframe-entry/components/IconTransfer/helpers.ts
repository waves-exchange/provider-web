import { ITransferTransaction } from '@waves/ts-types';
import { WithId } from '@waves/waves-transactions';
import { TLong } from '@waves/waves-js';

const MAX_ALIAS_LENGTH = 30; // TODO

const isAlias = (nodeAlias: string): boolean => {
    return nodeAlias.replace(/alias:.:/, '').length <= MAX_ALIAS_LENGTH;
};

const getAlias = (nodeAlias: string): string | null => {
    return isAlias(nodeAlias) ? nodeAlias.replace(/alias:.:/, '') : null;
}; // TODO убрать дублирование

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
            ? userAliases.includes(getAlias(tx.recipient)!)
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
