import { IAliasWithType } from '@waves/signer';
import React, { FC, useEffect } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { useTxUser } from '../../hooks/useTxUser';
import { getPrintableNumber } from '../../utils/math';
import { SignAliasComponent } from './SignAliasComponent';

export const SignAliasContainer: FC<ISignTxProps<IAliasWithType>> = ({
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
        <SignAliasComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} WAVES`}
            userHasScript={user.hasScript}
            tx={tx}
            fee={`${fee} WAVES`}
            onConfirm={handleConfirm}
            onReject={handleReject}
        />
    );
};
