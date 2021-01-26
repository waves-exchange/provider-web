import { MassTransferTransaction, TransferTransaction } from '@waves/ts-types';
import React, { FC } from 'react';
import { IMeta, ISignTxProps } from '../../interface';
import { getIconType } from '../../components/IconTransfer/helpers';
import { useHandleFeeSelect } from '../../hooks/useHandleFeeSelect';
import { getUserName } from '../../services/userService';
import { getViewData, isTransferMeta } from './helpers';
import { SignTransfer as SignTransferComponent } from './SignTransferComponent';

export type TransferType = TransferTransaction | MassTransferTransaction;
export type TransferMeta = IMeta<TransferType>;

export const SignTransfer: FC<ISignTxProps<TransferType>> = ({
    meta: txMeta,
    networkByte,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const [handleFeeSelect, txJSON] = useHandleFeeSelect(tx);

    const { totalTransferAmount, transferList, fee, attachment } = getViewData(
        tx,
        txMeta
    );

    const isMassTransfer = tx.type === 11;

    return (
        <SignTransferComponent
            userAddress={user.address}
            userName={getUserName(networkByte, user.publicKey)}
            userBalance={user.balance}
            transferList={transferList}
            transferFee={fee}
            attachment={attachment}
            tx={tx}
            meta={isTransferMeta(txMeta) ? txMeta : undefined}
            onReject={onCancel}
            onConfirm={onConfirm}
            handleFeeSelect={handleFeeSelect}
            txJSON={txJSON}
            iconType={getIconType(tx, user, Object.keys(txMeta.aliases))}
            transferAmount={`-${totalTransferAmount}`}
            isMassTransfer={isMassTransfer}
        />
    );
};
