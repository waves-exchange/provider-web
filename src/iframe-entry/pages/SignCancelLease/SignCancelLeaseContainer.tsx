import { TLong } from '@waves/signer';
import { ICancelLeaseTransactionWithId } from '@waves/ts-types';
import React, { FC, useEffect } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { useTxUser } from '../../hooks/useTxUser';
import { getPrintableNumber } from '../../utils/math';
import { SignCancelLeaseComponent } from './SignCancelLeaseComponent';

export const SignCancelLease: FC<ISignTxProps<
    ICancelLeaseTransactionWithId<TLong>
>> = ({ networkByte, tx, meta, user, onConfirm, onCancel }) => {
    const { userName, userBalance } = useTxUser(user, networkByte);
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);
    const amount = getPrintableNumber(meta.info.amount, WAVES.decimals);

    const { handleReject, handleConfirm, handleShow } = useTxHandlers(
        tx,
        onCancel,
        onConfirm
    );

    useEffect(handleShow);

    return (
        <SignCancelLeaseComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} ${WAVES.name}`}
            tx={tx}
            amount={`${amount} ${WAVES.name}`}
            fee={`${fee} ${WAVES.ticker}`}
            onReject={handleReject}
            onConfirm={handleConfirm}
        />
    );
};
