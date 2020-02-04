import { IBurnWithType } from '@waves/signer';
import React, { FC, useEffect } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { analytics } from '../../utils/analytics';
import { getPrintableNumber } from '../../utils/math';
import { SignBurn as SignBurnComponent } from './SignBurnComponent';
import { getUserName } from '../../services/userService';

export const SignBurnContainer: FC<ISignTxProps<IBurnWithType>> = ({
    meta: txMeta,
    networkByte,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const burnAsset = tx.assetId === null ? WAVES : txMeta.assets[tx.assetId];
    const feeAsset = WAVES;

    const burnAmount = getPrintableNumber(tx.quantity, burnAsset.decimals);

    const fee = getPrintableNumber(tx.fee, feeAsset.decimals);

    const { handleReject, handleConfirm } = useTxHandlers(
        tx,
        onCancel,
        onConfirm,
        {
            onRejectAnalyticsArgs: { name: 'Confirm_Burn_Tx_Reject' },
            onConfirmAnalyticsArgs: { name: 'Confirm_Burn_Tx_Confirm' },
        }
    );

    useEffect(
        () =>
            analytics.send({
                name: 'Confirm_Burn_Tx_Show',
            }),
        []
    );

    return (
        <SignBurnComponent
            key={tx.id}
            userAddress={user.address}
            userName={getUserName(networkByte, user.publicKey)}
            userBalance={`${getPrintableNumber(
                user.balance,
                WAVES.decimals
            )} Waves`}
            tx={tx}
            fee={`${fee} ${feeAsset.ticker}`}
            burnAmount={`-${burnAmount} ${burnAsset.name}`}
            assetId={burnAsset.assetId}
            assetName={burnAsset.name}
            isSmartAsset={burnAsset.scripted}
            onCancel={handleReject}
            onConfirm={handleConfirm}
        />
    );
};
