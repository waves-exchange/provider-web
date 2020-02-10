import { ITransferWithType, TLong, IMassTransferWithType } from '@waves/signer';
import React, { FC, useEffect } from 'react';
import { ISignTxProps } from '../../../interface';
import { getIconType } from '../../components/IconTransfer/helpers';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { analytics } from '../../utils/analytics';
import { SignTransfer as SignTransferComponent } from './SignTransferComponent';
import { getUserName } from '../../services/userService';
import { useHandleFeeSelect } from '../../hooks/useHandleFeeSelect';
import { getViewData, isTransferMeta } from './helpers';
import {
    ITransferTransactionWithId,
    IMassTransferTransactionWithId,
} from '@waves/ts-types';
import { IMeta } from '../../services/transactionsService';

export type TransferType = ITransferWithType | IMassTransferWithType;
export type TransferTx =
    | ITransferTransactionWithId<TLong>
    | IMassTransferTransactionWithId<TLong>;
export type TransferMeta = IMeta<TransferType>;

export const SignTransfer: FC<ISignTxProps<TransferType>> = ({
    meta: txMeta,
    networkByte,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const { handleReject, handleConfirm } = useTxHandlers(
        tx,
        onCancel,
        onConfirm,
        {
            onRejectAnalyticsArgs: { name: 'Confirm_Transfer_Tx_Reject' },
            onConfirmAnalyticsArgs: { name: 'Confirm_Transfer_Tx_Confirm' },
        }
    );

    useEffect(
        () =>
            analytics.send({
                name: 'Confirm_Transfer_Tx_Show',
            }),
        []
    );

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
            onReject={handleReject}
            onConfirm={handleConfirm}
            handleFeeSelect={handleFeeSelect}
            txJSON={txJSON}
            iconType={getIconType(tx, user, Object.keys(txMeta.aliases))}
            transferAmount={totalTransferAmount}
            isMassTransfer={isMassTransfer}
        />
    );
};
