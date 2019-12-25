import React, { FC, useEffect } from 'react';
import { SignTransfer as SignTransferComponent } from './SignTransferComponent';
import { ISignTxProps } from '../../../interface';
import { ITransferWithType, TLong } from '@waves/waves-js';
import { getIconType } from '../../components/IconTransfer/helpers';
import { BigNumber } from '@waves/bignumber';
import { libs } from '@waves/waves-transactions';
import { catchable } from '../../utils/catchable';
import compose from 'ramda/es/compose';
import { WAVES } from '../../../constants';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { analytics } from '../../utils/analytics';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { useTxUser } from '../../hooks/useTxUser';

const getAssetName = (
    assets: Record<string, TAssetDetails<TLong>>,
    assetId: string | null
): string => (assetId ? assets[assetId].name : WAVES.name);

export const SignTransfer: FC<ISignTxProps<ITransferWithType>> = ({
    meta: txMeta,
    networkByte,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const { userName, userBalance } = useTxUser(user, networkByte);
    const amountAsset = tx.assetId === null ? WAVES : txMeta.assets[tx.assetId];
    const feeAsset =
        tx.feeAssetId === null ? WAVES : txMeta.assets[tx.feeAssetId];

    if (!amountAsset || !feeAsset) {
        throw new Error('Amount of fee asstet not found'); // TODO ?
    }

    const amount = BigNumber.toBigNumber(tx.amount)
        .div(Math.pow(10, amountAsset.decimals))
        .roundTo(amountAsset.decimals)
        .toFixed();

    const fee = BigNumber.toBigNumber(tx.fee)
        .div(Math.pow(10, feeAsset.decimals))
        .roundTo(feeAsset.decimals)
        .toFixed();

    const attachment = catchable(
        compose(libs.crypto.bytesToString, libs.crypto.base58Decode)
    )(tx.attachment);

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

    return (
        <SignTransferComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} Waves`}
            transferAmount={`${amount} ${getAssetName(
                txMeta.assets,
                tx.assetId
            )}`}
            transferFee={`${fee} ${getAssetName(txMeta.assets, tx.feeAssetId)}`}
            recipientAddress={txMeta.aliases[tx.recipient] ?? tx.recipient}
            recipientName={
                txMeta.aliases[tx.recipient]
                    ? tx.recipient.replace(/alias:.:/, '')
                    : undefined
            }
            attachement={attachment.ok ? attachment.resolveData : ''}
            onReject={handleReject}
            onConfirm={handleConfirm}
            iconType={getIconType(tx, user, Object.keys(txMeta.aliases))}
        />
    );
};
