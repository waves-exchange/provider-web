import { TLong } from '@waves/signer';
import { ILeaseTransactionWithId } from '@waves/ts-types';
import React, { FC, useEffect } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { useTxUser } from '../../hooks/useTxUser';
import { analytics } from '../../utils/analytics';
import { cleanAddress } from '../../utils/cleanAlias';
import { isAlias } from '../../utils/isAlias';
import { getPrintableNumber } from '../../utils/math';
import { SignLeaseComponent } from './SignLeaseComponent';

export const SignLease: FC<ISignTxProps<ILeaseTransactionWithId<TLong>>> = ({
    networkByte,
    tx,
    meta,
    user,
    onConfirm,
    onCancel,
}) => {
    const { userName, userBalance } = useTxUser(user, networkByte);
    const amount = getPrintableNumber(tx.amount, WAVES.decimals);
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    const { handleReject, handleConfirm } = useTxHandlers(
        tx,
        onCancel,
        onConfirm,
        {
            onRejectAnalyticsArgs: { name: 'Confirm_Lease_Tx_Reject' },
            onConfirmAnalyticsArgs: { name: 'Confirm_Lease_Tx_Confirm' },
        }
    );

    useEffect(
        () =>
            analytics.send({
                name: 'Confirm_Lease_Tx_Show',
            }),
        []
    );

    const recipientAddress = isAlias(tx.recipient)
        ? meta.aliases[tx.recipient]
        : tx.recipient;

    return (
        <SignLeaseComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} Waves`}
            recipientAddress={recipientAddress}
            recipientName={cleanAddress(tx.recipient)}
            tx={tx}
            meta={meta}
            amount={amount}
            fee={fee}
            onReject={handleReject}
            onConfirm={handleConfirm}
        />
    );
};
