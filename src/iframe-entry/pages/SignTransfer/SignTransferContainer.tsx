import { FeeOption } from '@waves.exchange/react-uikit';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { ITransferWithType, TLong } from '@waves/signer';
import { libs } from '@waves/waves-transactions';
import compose from 'ramda/es/compose';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { ISignTxProps } from '../../../interface';
import { getIconType } from '../../components/IconTransfer/helpers';
import { WAVES } from '../../constants';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { useTxUser } from '../../hooks/useTxUser';
import { analytics } from '../../utils/analytics';
import { catchable } from '../../utils/catchable';
import { isAlias } from '../../utils/isAlias';
import { getCoins, getPrintableNumber } from '../../utils/math';
import { SignTransfer as SignTransferComponent } from './SignTransferComponent';

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

    const defaultFee: FeeOption = {
        id: WAVES.assetId,
        name: WAVES.name,
        ticker: WAVES.ticker,
        value: fee,
    };

    const feeList = [defaultFee].concat(
        txMeta.feeList.map((f) => ({
            name: txMeta.assets[f.feeAssetId as string].name,
            id: String(f.feeAssetId),
            ticker: '',
            value: String(f.feeAmount),
        }))
    );

    const [selectedFee, setSelectedFee] = useState<FeeOption>(defaultFee);

    const handleFeeSelect = useCallback(
        (feeOption: FeeOption) => {
            setSelectedFee(feeOption);
            tx.feeAssetId = feeOption.id;
            tx.fee = getCoins(
                feeOption.value,
                txMeta.assets[feeOption.id].decimals
            );
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
