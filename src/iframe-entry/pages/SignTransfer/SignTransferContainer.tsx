import React, { FC, useEffect, useState, useCallback } from 'react';
import { SignTransfer as SignTransferComponent } from './SignTransferComponent';
import { ISignTxProps } from '../../../interface';
import { ITransferWithType, TLong } from '@waves/signer';
import { getIconType } from '../../components/IconTransfer/helpers';
import { libs } from '@waves/waves-transactions';
import { catchable } from '../../utils/catchable';
import compose from 'ramda/es/compose';
import { WAVES } from '../../constants';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { analytics } from '../../utils/analytics';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { useTxUser } from '../../hooks/useTxUser';
import { isAlias } from '../../utils/isAlias';
import { getPrintableNumber } from '../../utils/math';
import { FeeOption } from '@waves.exchange/react-uikit';
import { BigNumber } from '@waves/bignumber';

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

    const amount = getPrintableNumber(tx.amount, amountAsset.decimals);

    const fee = getPrintableNumber(tx.fee, feeAsset.decimals);

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

    const recipientAddress = isAlias(tx.recipient)
        ? txMeta.aliases[tx.recipient]
        : tx.recipient;

    const feeList = [
        {
            id: WAVES.assetId,
            name: WAVES.name,
            ticker: WAVES.ticker,
            value: fee,
        },
    ].concat(
        txMeta.feeList.map((f) => ({
            name: txMeta.assets[f.feeAssetId as string].name,
            id: String(f.feeAssetId),
            ticker: '',
            value: String(f.feeAmount),
        }))
    );

    const [selectedFee, setSelectedFee] = useState<FeeOption>({
        id: WAVES.assetId,
        name: WAVES.name,
        ticker: WAVES.ticker,
        value: fee,
    });

    const handleFeeSelect = useCallback(
        (feeOption: FeeOption) => {
            setSelectedFee(feeOption);
            tx.feeAssetId = feeOption.id;
            tx.fee = BigNumber.toBigNumber(feeOption.value)
                .mul(Math.pow(10, txMeta.assets[feeOption.id].decimals))
                .toFixed();
        },
        [tx.fee, tx.feeAssetId, txMeta.assets]
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
            recipientAddress={recipientAddress}
            recipientName={tx.recipient}
            attachement={attachment.ok ? attachment.resolveData : ''}
            tx={tx}
            meta={txMeta}
            feeList={feeList}
            selectedFee={selectedFee}
            onFeeSelect={handleFeeSelect}
            onReject={handleReject}
            onConfirm={handleConfirm}
            iconType={getIconType(tx, user, Object.keys(txMeta.aliases))}
        />
    );
};
