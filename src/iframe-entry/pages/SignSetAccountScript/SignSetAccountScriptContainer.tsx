import { ISetScriptWithType } from '@waves/signer';
import React, { FC, useEffect } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { getUserName } from '../../services/userService';
import { getPrintableNumber } from '../../utils/math';
import { SignSetAccountScriptComponent } from './SignSetAccountScriptComponent';

export const SignSetAccountScript: FC<ISignTxProps<ISetScriptWithType>> = ({
    networkByte,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    const { handleReject, handleConfirm, handleShow } = useTxHandlers(
        tx,
        onCancel,
        onConfirm
    );

    useEffect(handleShow);

    return (
        <SignSetAccountScriptComponent
            key={tx.id}
            userAddress={user.address}
            userName={getUserName(networkByte, user.publicKey)}
            userBalance={`${getPrintableNumber(user.balance, WAVES.decimals)} ${
                WAVES.name
            }`}
            userHasScript={user.hasScript}
            tx={tx}
            fee={`${fee} ${WAVES.name}`}
            accountScript={tx.script}
            onCancel={handleReject}
            onConfirm={handleConfirm}
        />
    );
};
