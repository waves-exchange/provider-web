import { IDataWithType } from '@waves/signer';
import React, { FC, useEffect } from 'react';
import { WAVES } from '../../constants';
import { ISignTxProps } from '../../../interface';
import { SignDataComponent } from './SignDataComponent';
import { analytics } from '../../utils/analytics';
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

    const { handleReject, handleConfirm } = useTxHandlers(
        tx,
        onCancel,
        onConfirm,
        {
            onRejectAnalyticsArgs: { name: 'Confirm_Data_Tx_Reject' },
            onConfirmAnalyticsArgs: { name: 'Confirm_Data_Tx_Confirm' },
        }
    );

    useEffect(
        () =>
            analytics.send({
                name: 'Confirm_Data_Tx_Show',
            }),
        []
    );

    return (
        <SignDataComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} WAVES`}
            data={tx.data}
            fee={`${fee} WAVES`}
            onConfirm={handleConfirm}
            onReject={handleReject}
        />
    );
};
