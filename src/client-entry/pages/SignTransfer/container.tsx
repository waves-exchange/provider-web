import React, { FC, useCallback, MouseEventHandler } from 'react';
import { SignTransfer as SignTransferComponent } from './component';
import { ISignTxProps } from '../../../interface';
import { ITransferWithType, TLong } from '@waves/waves-js/dist/src/interface';
import { getIconType } from '../../components/IconTransfer/helpers';
import { BigNumber } from '@waves/bignumber';
import { libs } from '@waves/waves-transactions';
import compose from 'ramda/es/compose';
import { WAVES } from '../../../constants';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';

const getAssetName = (
    assets: Record<string, TAssetDetails<TLong>>,
    assetId: string | null
): string => (assetId ? assets[assetId].name : WAVES.name);

export const SignTransfer: FC<ISignTxProps<ITransferWithType>> = ({
    meta: txMeta,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const amountAsset = txMeta.assets[tx.assetId || ''] || WAVES;
    const feeAsset = txMeta.assets[tx.feeAssetId || ''] || WAVES;
    const userBalance = BigNumber.toBigNumber(user.balance)
        .div(Math.pow(10, WAVES.decimals))
        .toFixed();

    const amount = BigNumber.toBigNumber(tx.amount)
        .roundTo(amountAsset.decimals)
        .toFixed();

    const fee = BigNumber.toBigNumber(tx.fee)
        .div(Math.pow(10, feeAsset.decimals))
        .roundTo(feeAsset.decimals)
        .toFixed();

    const attachment = compose(
        libs.crypto.base58Encode,
        libs.crypto.blake2b,
        libs.crypto.base58Decode
    )(tx.attachment);

    const handleConfirm = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        onConfirm(tx);
    }, [tx, onConfirm]);

    return (
        <SignTransferComponent
            userAddress={user.address}
            userName={'userName'}
            userBalance={`${userBalance} Waves`}
            transferAmount={`${amount} ${getAssetName(
                txMeta.assets,
                tx.assetId
            )}`}
            transferFee={`${fee} ${getAssetName(txMeta.assets, tx.feeAssetId)}`}
            recipientAddress={txMeta.aliases[tx.recipient] || tx.recipient}
            attachement={attachment}
            onReject={onCancel}
            onConfirm={handleConfirm}
            iconType={getIconType(tx, user, Object.keys(txMeta.aliases))}
        />
    );
};
