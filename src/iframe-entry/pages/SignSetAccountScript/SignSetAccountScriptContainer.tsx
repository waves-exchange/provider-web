import { ISetScriptWithType } from '@waves/signer';
import React, { FC, useEffect } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { getUserName } from '../../services/userService';
import { analytics } from '../../utils/analytics';
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

    const { handleReject, handleConfirm } = useTxHandlers(
        tx,
        onCancel,
        onConfirm,
        {
            onRejectAnalyticsArgs: { name: 'Confirm_Script_Tx_Reject' },
            onConfirmAnalyticsArgs: { name: 'Confirm_Script_Tx_Confirm' },
        }
    );

    useEffect(
        () =>
            analytics.send({
                name: 'Confirm_Script_Tx_Show',
            }),
        []
    );

    return (
        <SignSetAccountScriptComponent
            key={tx.id}
            userAddress={user.address}
            userName={getUserName(networkByte, user.publicKey)}
            userBalance={`${getPrintableNumber(
                user.balance,
                WAVES.decimals
            )} Waves`}
            tx={tx}
            fee={`${fee} ${WAVES.name}`}
            accountScript={tx.script}
            onCancel={handleReject}
            onConfirm={handleConfirm}
        />
    );
};
