import { IDataWithType } from '@waves/signer';
import React, { FC, useEffect } from 'react';
import { WAVES } from '../../constants';
import { ISignTxProps } from '../../../interface';
import { SignDataComponent } from './SignDataComponent';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { useTxUser } from '../../hooks/useTxUser';
import { getPrintableNumber } from '../../utils/math';

export const SignDataContainer: FC<ISignTxProps<IDataWithType>> = ({
    tx,
    user,
    networkByte,
    onConfirm,
    onCancel,
}) => {
    const { userName, userBalance } = useTxUser(user, networkByte);
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    const { handleReject, handleConfirm, handleShow } = useTxHandlers(
        tx,
        onCancel,
        onConfirm
    );

    useEffect(handleShow);

    return (
        <SignDataComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} WAVES`}
            tx={tx}
            fee={`${fee} WAVES`}
            onConfirm={handleConfirm}
            onReject={handleReject}
        />
    );
};
