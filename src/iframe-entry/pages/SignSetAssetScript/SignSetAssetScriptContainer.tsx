import { ISetAssetScriptWithType } from '@waves/signer';
import React, { FC, useEffect } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { getPrintableNumber } from '../../utils/math';
import { SignSetAssetScript as SignSetAssetScriptComponent } from './SignSetAssetScriptComponent';
import { getUserName } from '../../services/userService';

export const SignSetAssetScriptContainer: FC<ISignTxProps<
    ISetAssetScriptWithType
>> = ({ meta: txMeta, networkByte, tx, user, onConfirm, onCancel }) => {
    const asset = txMeta.assets[tx.assetId];

    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    const { handleReject, handleConfirm, handleShow } = useTxHandlers(
        tx,
        onCancel,
        onConfirm
    );

    useEffect(handleShow);

    return (
        <SignSetAssetScriptComponent
            key={tx.id}
            userAddress={user.address}
            userName={getUserName(networkByte, user.publicKey)}
            userBalance={`${getPrintableNumber(
                user.balance,
                WAVES.decimals
            )} Waves`}
            tx={tx}
            fee={`${fee} WAVES`}
            assetId={asset.assetId}
            assetName={asset.name}
            assetScript={tx.script}
            onCancel={handleReject}
            onConfirm={handleConfirm}
        />
    );
};
