import { TLong } from '@waves/signer';
import { ICancelLeaseTransactionWithId } from '@waves/ts-types';
import React, { FC } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
import { useTxUser } from '../../hooks/useTxUser';
import { getPrintableNumber } from '../../utils/math';
import { SignCancelLeaseComponent } from './SignCancelLeaseComponent';

export const SignCancelLease: FC<ISignTxProps<
    ICancelLeaseTransactionWithId<TLong>
>> = ({ networkByte, tx, meta, user, onConfirm, onCancel }) => {
    const { userName, userBalance } = useTxUser(user, networkByte);
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);
    const amount = getPrintableNumber(meta.info.amount, WAVES.decimals);

    return (
        <SignCancelLeaseComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} ${WAVES.name}`}
            tx={tx}
            amount={`${amount} ${WAVES.name}`}
            fee={`${fee} ${WAVES.ticker}`}
            onReject={onCancel}
            onConfirm={onConfirm}
        />
    );
};
