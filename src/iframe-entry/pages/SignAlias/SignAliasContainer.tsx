import { IAliasWithType } from '@waves/signer';
import React, { FC, useEffect } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { useTxUser } from '../../hooks/useTxUser';
import { analytics } from '../../utils/analytics';
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

    const { handleReject, handleConfirm } = useTxHandlers(
        tx,
        onCancel,
        onConfirm,
        {
            onRejectAnalyticsArgs: { name: 'Confirm_Alias_Tx_Reject' },
            onConfirmAnalyticsArgs: { name: 'Confirm_Alias_Tx_Confirm' },
        }
    );

    useEffect(
        () =>
            analytics.send({
                name: 'Confirm_Alias_Tx_Show',
            }),
        []
    );

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
