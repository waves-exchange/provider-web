import { IBurnWithType } from '@waves/signer';
import React, { FC } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
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
            onCancel={onCancel}
            onConfirm={onConfirm}
        />
    );
};
